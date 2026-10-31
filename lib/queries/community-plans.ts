import "server-only";
import { db } from "@/lib/db";
import { planTemplate, planWeeks } from "@/lib/community-plans";

/** Distinct students (other than the author) who started a plan from each of these. */
async function countUses(plans: { id: string; userId: string }[]) {
    const uses = new Map<string, number>();
    if (plans.length === 0) return uses;
    const owner = new Map(plans.map((p) => [p.id, p.userId]));
    const rows = await db.studyPlan.groupBy({
        by: ["clonedFromId", "userId"],
        where: { clonedFromId: { in: plans.map((p) => p.id) } },
    });
    for (const r of rows) {
        if (!r.clonedFromId || r.userId === owner.get(r.clonedFromId)) continue;
        uses.set(r.clonedFromId, (uses.get(r.clonedFromId) ?? 0) + 1);
    }
    return uses;
}

/**
 * Shared plans, newest first. By default only plans that cover at least one of the student's units. Nothing about
 * the author is selected, only whether it's the viewer's own.
 */
export async function listCommunityPlans(userId: string, { all = false }: { all?: boolean } = {}) {
    const plans = await db.studyPlan.findMany({
        where: {
            isPublic: true,
            status: "ACTIVE",
            ...(all ? {} : { units: { some: { unit: { students: { some: { userId } } } } } }),
        },
        orderBy: { sharedAt: "desc" },
        take: 50,
        select: {
            id: true,
            userId: true,
            title: true,
            minutesPerDay: true,
            studyDays: true,
            startDate: true,
            examDate: true,
            units: { select: { unit: { select: { code: true } } }, orderBy: { unit: { order: "asc" } } },
            _count: { select: { tasks: true } },
        },
    });
    const uses = await countUses(plans);
    return plans.map(({ userId: owner, units, _count, startDate, examDate, ...p }) => ({
        ...p,
        mine: owner === userId,
        unitCodes: units.map((u) => u.unit.code).sort(),
        weeks: planWeeks(startDate, examDate),
        taskCount: _count.tasks,
        uses: uses.get(p.id) ?? 0,
    }));
}

export type CommunityPlanListItem = Awaited<ReturnType<typeof listCommunityPlans>>[number];

/** One shared plan as a template (or the viewer's own plan, shared or not). */
export async function getCommunityPlan(userId: string, id: string) {
    const plan = await db.studyPlan.findFirst({
        where: { id, OR: [{ isPublic: true }, { userId }] },
        select: {
            id: true,
            userId: true,
            isPublic: true,
            title: true,
            minutesPerDay: true,
            studyDays: true,
            startDate: true,
            examDate: true,
            units: {
                select: { unit: { select: { id: true, code: true, name: true } } },
                orderBy: { unit: { order: "asc" } },
            },
            tasks: {
                select: {
                    date: true,
                    type: true,
                    minutes: true,
                    topic: { select: { unit: { select: { code: true } } } },
                },
            },
        },
    });
    if (!plan) return null;
    const uses = await countUses([plan]);
    const studied = await db.userUnit.findMany({
        where: { userId, unitId: { in: plan.units.map((u) => u.unit.id) } },
        select: { unitId: true },
    });
    const have = new Set(studied.map((u) => u.unitId));
    return {
        id: plan.id,
        mine: plan.userId === userId,
        isPublic: plan.isPublic,
        title: plan.title,
        minutesPerDay: plan.minutesPerDay,
        studyDays: plan.studyDays,
        units: plan.units.map((u) => ({ ...u.unit, studied: have.has(u.unit.id) })),
        uses: uses.get(plan.id) ?? 0,
        template: planTemplate({
            startDate: plan.startDate,
            examDate: plan.examDate,
            tasks: plan.tasks.map((t) => ({
                date: t.date,
                type: t.type,
                minutes: t.minutes,
                unitCode: t.topic?.unit.code ?? null,
            })),
        }),
    };
}
