"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { MAX_MINUTES_PER_DAY, PlannerError } from "@/lib/planner";
import { assertUser } from "@/lib/session";
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
    revalidatePath("/plans");
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
    await db.studyPlan.update({ where: { id: planId }, data: { status: archived ? "ARCHIVED" : "ACTIVE" } });
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
