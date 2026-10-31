import "server-only";
import { generateText, Output } from "ai";
import { z } from "zod";
import { aiEnabled, consumeAiQuota, fastModel, refundAiQuota } from "@/lib/ai";
import { db } from "@/lib/db";
import { masteryLabel, revisionPriority } from "@/lib/mastery";
import {
    buildPlan,
    dayKey,
    fromDayNumber,
    PlannerError,
    toDayNumber,
    type CompletedWork,
    type PlannedTask,
    type PlannerUnit,
} from "@/lib/planner";
import { getTopicMastery } from "@/lib/queries/mastery";
import { localDay } from "@/lib/time";

// DB-facing plan logic shared by the server actions (and exercised directly by scripts/tests).

export type CreatePlanInput = {
    title: string;
    units: { unitId: string; examDate: Date }[];
    startDate: Date;
    minutesPerDay: number;
    studyDays: number[];
};

/** Loads the units (must be ones the student studies) with topics and current mastery. */
async function loadPlannerUnits(userId: string, units: { unitId: string; examDate: Date }[]): Promise<PlannerUnit[]> {
    const rows = await db.unit.findMany({
        where: { id: { in: units.map((u) => u.unitId) }, students: { some: { userId } } },
        select: {
            id: true,
            code: true,
            topics: { select: { id: true, name: true, order: true }, orderBy: { order: "asc" } },
        },
    });
    if (rows.length !== units.length) throw new PlannerError("Some of those units aren't on your list any more.");
    const mastery = await getTopicMastery(
        userId,
        rows.flatMap((r) => r.topics.map((t) => t.id)),
    );
    return units.map(({ unitId, examDate }) => {
        const r = rows.find((x) => x.id === unitId)!;
        return {
            id: r.id,
            code: r.code,
            examDate,
            topics: r.topics.map((t) => ({ ...t, mastery: mastery.get(t.id)! })),
        };
    });
}

const toRows = (
    planId: string,
    tasks: PlannedTask[],
    notes: Map<number, string> = new Map(),
    orderOffset = new Map<string, number>(),
) =>
    tasks.map((t, i) => ({
        planId,
        date: t.date,
        order: t.order + (orderOffset.get(dayKey(t.date)) ?? 0),
        type: t.type,
        topicId: t.topicId,
        title: t.title,
        minutes: t.minutes,
        notes: notes.get(i) ?? null,
    }));

/** Builds and saves a new plan. Throws PlannerError for input the planner can't satisfy. */
export async function createPlanForUser(
    userId: string,
    input: CreatePlanInput,
    {
        now = localDay(),
        useAi = true,
        syncUnitDates = true,
        clonedFromId = null,
    }: {
        now?: Date;
        useAi?: boolean;
        /** Save the plan's exam dates to the student's units (off for clones, whose dates may be estimates) */
        syncUnitDates?: boolean;
        /** The community plan this one was started from */
        clonedFromId?: string | null;
    } = {},
) {
    const units = await loadPlannerUnits(userId, input.units);
    const tasks = buildPlan({
        startDate: input.startDate,
        today: now,
        units,
        minutesPerDay: input.minutesPerDay,
        studyDays: input.studyDays,
    });
    if (tasks.length === 0) throw new PlannerError("There's nothing to schedule in that window. Try more study days.");

    const garnish = useAi ? await planGarnish(userId, units, tasks, input, now) : null;
    const examDate = fromDayNumber(Math.max(...units.map((u) => toDayNumber(u.examDate))));
    const startDate = fromDayNumber(Math.max(toDayNumber(input.startDate), toDayNumber(now)));

    const plan = await db.$transaction(async (tx) => {
        const plan = await tx.studyPlan.create({
            data: {
                userId,
                title: input.title,
                startDate,
                examDate,
                minutesPerDay: input.minutesPerDay,
                studyDays: [...new Set(input.studyDays)].sort(),
                summary: garnish?.summary ?? null,
                clonedFromId,
                units: { create: input.units.map((u) => ({ unitId: u.unitId, examDate: u.examDate })) },
            },
        });
        await tx.studyPlanTask.createMany({ data: toRows(plan.id, tasks, garnish?.notes) });
        // Keep the student's unit exam dates in sync with what they entered here.
        for (const u of syncUnitDates ? input.units : []) {
            await tx.userUnit.update({
                where: { userId_unitId: { userId, unitId: u.unitId } },
                data: { examDate: u.examDate },
            });
        }
        return plan;
    });
    return { planId: plan.id, taskCount: tasks.length, aiUsed: Boolean(garnish) };
}

/**
 * Re-plans the remaining work from today: DONE tasks are kept (and count as covered), PENDING tasks and
 * future SKIPPED tasks are replaced by a fresh schedule. Past SKIPPED tasks stay as history.
 */
export async function reschedulePlanForUser(userId: string, planId: string, { now = localDay() } = {}) {
    const plan = await db.studyPlan.findFirst({
        where: { id: planId, userId },
        include: {
            tasks: true,
            units: { include: { unit: { select: { students: { where: { userId }, select: { examDate: true } } } } } },
        },
    });
    if (!plan) throw new PlannerError("Plan not found.");
    const todayDay = toDayNumber(now);

    // Units the student still studies; prefer their current exam date (they may have changed it in settings).
    const units = plan.units.filter((pu) => pu.unit.students.length > 0);
    const withDates = units
        .map((pu) => ({ unitId: pu.unitId, examDate: pu.unit.students[0].examDate ?? pu.examDate }))
        .filter((u) => toDayNumber(u.examDate) > todayDay);
    if (withDates.length === 0)
        throw new PlannerError(
            units.length === 0
                ? "This plan's units are no longer on your list."
                : "All the exams in this plan have passed, so there's nothing left to reschedule.",
        );

    const kept = plan.tasks.filter(
        (t) => t.status === "DONE" || (t.status === "SKIPPED" && toDayNumber(t.date) < todayDay),
    );
    const removeIds = plan.tasks.filter((t) => !kept.includes(t)).map((t) => t.id);

    const completed: CompletedWork[] = kept
        .filter((t) => t.status === "DONE" && t.topicId)
        .map((t) => ({ topicId: t.topicId!, type: t.type, date: t.date }));
    const usedMinutes: Record<string, number> = {};
    const orderOffset = new Map<string, number>();
    for (const t of kept) {
        if (toDayNumber(t.date) < todayDay) continue;
        const k = dayKey(t.date);
        if (t.status === "DONE") usedMinutes[k] = (usedMinutes[k] ?? 0) + t.minutes;
        orderOffset.set(k, Math.max(orderOffset.get(k) ?? 0, t.order + 1));
    }

    const plannerUnits = await loadPlannerUnits(userId, withDates);
    const tasks = buildPlan({
        startDate: now,
        today: now,
        units: plannerUnits,
        minutesPerDay: plan.minutesPerDay,
        studyDays: plan.studyDays,
        completed,
        usedMinutes,
    });
    const examDate = fromDayNumber(Math.max(...withDates.map((u) => toDayNumber(u.examDate))));

    await db.$transaction(async (tx) => {
        // Optimistic lock: claim the plan only if nobody rescheduled it since we read it (double click,
        // two tabs). Postgres serialises the two updates; the loser matches 0 rows and aborts.
        const claimed = await tx.studyPlan.updateMany({
            where: { id: planId, userId, updatedAt: plan.updatedAt },
            data: { examDate },
        });
        if (claimed.count === 0) throw new PlannerError("This plan was just updated. Refresh and try again.");
        // Never delete a task that was ticked off while we were planning.
        await tx.studyPlanTask.deleteMany({ where: { id: { in: removeIds }, planId, status: { not: "DONE" } } });
        await tx.studyPlanTask.createMany({ data: toRows(planId, tasks, undefined, orderOffset) });
        for (const u of withDates)
            await tx.studyPlanUnit.update({
                where: { planId_unitId: { planId, unitId: u.unitId } },
                data: { examDate: u.examDate },
            });
    });
    return { removed: removeIds.length, created: tasks.length };
}

// ─── AI garnish (optional) ──────────────────────────────────────────────────

const garnishSchema = z.object({
    summary: z.string().describe("2–4 encouraging sentences about this plan, addressed to the student as 'you'."),
    notes: z
        .array(z.object({ index: z.number().int(), note: z.string() }))
        .describe("Optional one-line tip (max ~120 chars) for some of the listed tasks, by index."),
});

/** A short AI summary + task tips. Returns null (never throws) when AI is off, over quota, or fails. */
async function planGarnish(
    userId: string,
    units: PlannerUnit[],
    tasks: PlannedTask[],
    input: CreatePlanInput,
    now: Date,
): Promise<{ summary: string; notes: Map<number, string> } | null> {
    if (!aiEnabled) return null;
    try {
        await consumeAiQuota(userId, "plan");
    } catch {
        return null;
    }
    try {
        // Only curriculum + aggregate data — nothing identifying the student.
        const unitLines = units.map((u) => {
            const weakest = [...u.topics]
                .sort((a, b) => revisionPriority(b.mastery, now) - revisionPriority(a.mastery, now))
                .slice(0, 5)
                .map((t) => `${t.name} (${masteryLabel[t.mastery.level]})`);
            const days = toDayNumber(u.examDate) - toDayNumber(now);
            return `- ${u.code}: exam in ${days} days; ${u.topics.length} topics; weakest: ${weakest.join(", ") || "n/a"}`;
        });
        const first = tasks
            .slice(0, 10)
            .map((t, i) => `${i}. ${dayKey(t.date)} ${t.type} ${t.minutes} min — ${t.title}`);
        const { output } = await generateText({
            model: fastModel(),
            abortSignal: AbortSignal.timeout(20_000),
            output: Output.object({ schema: garnishSchema }),
            system:
                "You are a calm, encouraging study coach for Pearson Edexcel International A Level students. " +
                "Be specific and brief. No emojis, no headings, no markdown.",
            prompt: [
                `A student has a new revision plan: ${input.minutesPerDay} minutes a day, ${new Set(input.studyDays).size} days a week, ${tasks.length} sessions in total.`,
                "Units:",
                ...unitLines,
                "First sessions:",
                ...first,
                "Write a 2–4 sentence motivating summary that names their weakest topics and how the plan tackles them " +
                    "(weakest first, spaced reviews, timed past papers in the final weeks). Then give short practical " +
                    "notes (one line each) for up to 10 of the first sessions listed, by index.",
            ].join("\n"),
        });
        const notes = new Map<number, string>();
        for (const n of output.notes)
            if (n.index >= 0 && n.index < Math.min(10, tasks.length) && n.note.trim())
                notes.set(n.index, n.note.trim().slice(0, 200));
        const summary = output.summary.trim().slice(0, 800);
        return summary ? { summary, notes } : null;
    } catch (e) {
        console.error("[plans] AI garnish failed", e);
        await refundAiQuota(userId, "plan");
        return null;
    }
}
