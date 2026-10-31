"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { MAX_MINUTES_PER_DAY, PlannerError } from "@/lib/planner";
import { cloneExamDates } from "@/lib/community-plans";
import { assertAdmin, assertUser } from "@/lib/session";
import { localDay } from "@/lib/time";
import { createPlanForUser, reschedulePlanForUser } from "./service";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const isoDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")
    .transform((s) => new Date(`${s}T00:00:00Z`))
    .refine((d) => !Number.isNaN(d.getTime()), "Use a valid date");

const createSchema = z.object({
    title: z.string().trim().min(1, "Give your plan a name").max(80, "Keep the name under 80 characters"),
    units: z
        .array(z.object({ unitId: z.string().min(1), examDate: isoDate }))
        .min(1, "Choose at least one unit")
        .max(12),
    startDate: isoDate,
    minutesPerDay: z.number().int().min(30).max(Math.min(240, MAX_MINUTES_PER_DAY)),
    studyDays: z.array(z.number().int().min(0).max(6)).min(1, "Pick at least one study day"),
});

export type CreatePlanFormInput = z.input<typeof createSchema>;

function revalidatePlans(planId?: string) {
    revalidatePath("/plans", "layout");
    if (planId) revalidatePath(`/plans/${planId}`);
    revalidatePath("/dashboard");
}

const firstIssue = (e: z.ZodError) => e.issues[0]?.message ?? "Check the form and try again.";

export async function createPlan(input: CreatePlanFormInput): Promise<Result<{ planId: string; aiUsed: boolean }>> {
    const user = await assertUser();
    const parsed = createSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    if (new Set(parsed.data.units.map((u) => u.unitId)).size !== parsed.data.units.length)
        return { ok: false, error: "Each unit can only be added once." };

    try {
        const res = await createPlanForUser(user.id, parsed.data);
        revalidatePlans(res.planId);
        return { ok: true, planId: res.planId, aiUsed: res.aiUsed };
    } catch (e) {
        if (e instanceof PlannerError) return { ok: false, error: e.message };
        console.error("[plans] createPlan failed", e);
        return { ok: false, error: "Something went wrong creating your plan. Please try again." };
    }
}

const statusSchema = z.object({ taskId: z.string().min(1), status: z.enum(["PENDING", "DONE", "SKIPPED"]) });

export async function setTaskStatus(taskId: string, status: "PENDING" | "DONE" | "SKIPPED"): Promise<Result> {
    const user = await assertUser();
    const parsed = statusSchema.safeParse({ taskId, status });
    if (!parsed.success) return { ok: false, error: "Invalid task update." };

    const task = await db.studyPlanTask.findFirst({
        where: { id: parsed.data.taskId, plan: { userId: user.id } },
        select: { id: true, planId: true },
    });
    if (!task) return { ok: false, error: "Task not found." };

    await db.studyPlanTask.update({
        where: { id: task.id },
        data: { status: parsed.data.status, completedAt: parsed.data.status === "DONE" ? new Date() : null },
    });
    revalidatePlans(task.planId);
    return { ok: true };
}

async function ownPlan(userId: string, planId: unknown) {
    if (typeof planId !== "string" || !planId) return null;
    return db.studyPlan.findFirst({ where: { id: planId, userId }, select: { id: true } });
}

export async function renamePlan(planId: string, title: string): Promise<Result> {
    const user = await assertUser();
    const parsed = createSchema.shape.title.safeParse(title);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    if (!(await ownPlan(user.id, planId))) return { ok: false, error: "Plan not found." };
    await db.studyPlan.update({ where: { id: planId }, data: { title: parsed.data } });
    revalidatePlans(planId);
    return { ok: true };
}

export async function setPlanArchived(planId: string, archived: boolean): Promise<Result> {
    const user = await assertUser();
    if (!(await ownPlan(user.id, planId))) return { ok: false, error: "Plan not found." };
    // Archiving also takes the plan out of the community library.
    await db.studyPlan.update({
        where: { id: planId },
        data: archived ? { status: "ARCHIVED", isPublic: false, sharedAt: null } : { status: "ACTIVE" },
    });
    revalidatePlans(planId);
    return { ok: true };
}

/** Deletes the plan and redirects to /plans (only returns on failure). */
export async function deletePlan(planId: string): Promise<Result> {
    const user = await assertUser();
    if (!(await ownPlan(user.id, planId))) return { ok: false, error: "Plan not found." };
    await db.studyPlan.delete({ where: { id: planId } });
    revalidatePlans();
    redirect("/plans");
}

export async function rescheduleMissed(planId: string): Promise<Result<{ created: number; removed: number }>> {
    const user = await assertUser();
    if (!(await ownPlan(user.id, planId))) return { ok: false, error: "Plan not found." };
    try {
        const res = await reschedulePlanForUser(user.id, planId);
        revalidatePlans(planId);
        return { ok: true, ...res };
    } catch (e) {
        if (e instanceof PlannerError) return { ok: false, error: e.message };
        console.error("[plans] reschedule failed", e);
        return { ok: false, error: "Couldn't reschedule this plan. Please try again." };
    }
}

// ─── Community plans ─────────────────────────────────────────────────────────

const planId = z.string().min(1).max(64);
const MAX_SHARED_PLANS = 5;

/** Shares a plan to the community library as a template, or stops sharing it. */
export async function setPlanShared(id: string, shared: boolean): Promise<Result> {
    const user = await assertUser();
    const parsed = z.object({ id: planId, shared: z.boolean() }).safeParse({ id, shared });
    if (!parsed.success) return { ok: false, error: "Invalid plan." };
    const plan = await db.studyPlan.findFirst({
        where: { id: parsed.data.id, userId: user.id },
        select: { id: true, status: true },
    });
    if (!plan) return { ok: false, error: "Plan not found." };
    if (parsed.data.shared) {
        if (!user.emailVerified) return { ok: false, error: "Verify your email address before sharing plans." };
        if (plan.status !== "ACTIVE") return { ok: false, error: "Unarchive this plan before sharing it." };
        const shared = await db.studyPlan.count({ where: { userId: user.id, isPublic: true, id: { not: plan.id } } });
        if (shared >= MAX_SHARED_PLANS)
            return { ok: false, error: `You can share up to ${MAX_SHARED_PLANS} plans. Stop sharing one first.` };
    }
    await db.studyPlan.update({
        where: { id: plan.id },
        data: { isPublic: parsed.data.shared, sharedAt: parsed.data.shared ? new Date() : null },
    });
    revalidatePlans(parsed.data.id);
    return { ok: true };
}

/**
 * Starts a new plan from a shared one: same units, daily minutes and study days, but built by the planner from the
 * student's own mastery and exam dates. Units the student doesn't study yet are added to their list.
 * Redirects to the new plan (only returns on failure).
 */
export async function clonePlan(id: string): Promise<Result> {
    const user = await assertUser();
    const parsed = planId.safeParse(id);
    if (!parsed.success) return { ok: false, error: "Plan not found." };

    const source = await db.studyPlan.findFirst({
        where: { id: parsed.data, OR: [{ isPublic: true }, { userId: user.id }] },
        select: {
            id: true,
            userId: true,
            title: true,
            startDate: true,
            minutesPerDay: true,
            studyDays: true,
            units: { select: { unitId: true, examDate: true } },
        },
    });
    if (!source || source.units.length === 0) return { ok: false, error: "That plan isn't shared any more." };

    const today = localDay();
    const mine = await db.userUnit.findMany({
        where: { userId: user.id, unitId: { in: source.units.map((u) => u.unitId) } },
        select: { unitId: true, examDate: true },
    });
    const units = cloneExamDates(source, new Map(mine.map((u) => [u.unitId, u.examDate])), today);
    const have = new Set(mine.map((u) => u.unitId));
    const missing = units.filter((u) => !have.has(u.unitId));
    if (missing.length) {
        await db.userUnit.createMany({
            data: missing.map((u) => ({ userId: user.id, unitId: u.unitId, examDate: u.examDate })),
            skipDuplicates: true,
        });
    }

    let newId: string;
    try {
        const res = await createPlanForUser(
            user.id,
            {
                title: source.title,
                units,
                startDate: today,
                minutesPerDay: source.minutesPerDay,
                studyDays: source.studyDays,
            },
            // Clone dates may be estimates, so they never overwrite the student's own exam dates; cloning your own
            // plan doesn't count as a use.
            { syncUnitDates: false, clonedFromId: source.userId === user.id ? null : source.id },
        );
        newId = res.planId;
    } catch (e) {
        // Don't leave units on the student's list for a plan that was never made.
        if (missing.length)
            await db.userUnit
                .deleteMany({ where: { userId: user.id, unitId: { in: missing.map((u) => u.unitId) } } })
                .catch(() => {});
        if (e instanceof PlannerError) return { ok: false, error: e.message };
        console.error("[plans] clonePlan failed", e);
        return { ok: false, error: "Couldn't start that plan. Please try again." };
    }
    revalidatePlans(newId);
    revalidatePath("/settings");
    revalidatePath("/progress");
    redirect(`/plans/${newId}`);
}

/** Admins can take any plan out of the community library (e.g. an inappropriate title). */
export async function adminUnsharePlan(id: string): Promise<Result> {
    await assertAdmin();
    const parsed = planId.safeParse(id);
    if (!parsed.success) return { ok: false, error: "Invalid plan." };
    const res = await db.studyPlan.updateMany({
        where: { id: parsed.data },
        data: { isPublic: false, sharedAt: null },
    });
    if (res.count === 0) return { ok: false, error: "Plan not found." };
    revalidatePlans(parsed.data);
    return { ok: true };
}
