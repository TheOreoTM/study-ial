"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser } from "@/lib/session";

const logSchema = z.object({
    minutes: z.number().int().min(1).max(240),
    startedAt: z.iso.datetime(),
    taskId: z.string().min(1).max(64).nullish(),
    topicId: z.string().min(1).max(64).nullish(),
});

type Result = { ok: true } | { ok: false; error: string };

/** Log a completed (or ended-early) focus period. */
export async function logFocusSession(input: z.input<typeof logSchema>): Promise<Result> {
    const user = await assertUser();
    const parsed = logSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid focus session." };
    const { minutes, taskId, topicId } = parsed.data;

    const now = Date.now();
    const startedAt = new Date(parsed.data.startedAt);
    // Allow a little clock skew, and pauses (a period can span longer than its focused minutes), but not nonsense.
    if (startedAt.getTime() > now + 5 * 60_000 || startedAt.getTime() < now - 24 * 3_600_000) {
        return { ok: false, error: "Invalid start time." };
    }
    // Can't have focused for longer than the period has existed (1 min of grace for rounding/skew).
    const elapsedMinutes = Math.ceil((now - startedAt.getTime()) / 60_000) + 1;
    if (minutes > elapsedMinutes) return { ok: false, error: "That session is longer than the time that has passed." };

    let resolvedTopicId = topicId ?? null;
    if (taskId) {
        const task = await db.studyPlanTask.findFirst({
            where: { id: taskId, plan: { userId: user.id } },
            select: { id: true, topicId: true },
        });
        if (!task) return { ok: false, error: "Task not found." };
        resolvedTopicId ??= task.topicId;
    }
    if (resolvedTopicId) {
        const topic = await db.topic.findUnique({ where: { id: resolvedTopicId }, select: { id: true } });
        if (!topic) resolvedTopicId = null;
    }

    await db.focusSession.create({
        data: {
            userId: user.id,
            minutes,
            startedAt,
            endedAt: new Date(now),
            taskId: taskId ?? null,
            topicId: resolvedTopicId,
        },
    });
    revalidatePath("/focus");
    revalidatePath("/dashboard");
    return { ok: true };
}

/** Mark a study-plan task done (from the focus page, after a linked session). */
export async function markFocusTaskDone(taskId: string): Promise<Result> {
    const user = await assertUser();
    const id = z.string().min(1).max(64).safeParse(taskId);
    if (!id.success) return { ok: false, error: "Invalid task." };
    const res = await db.studyPlanTask.updateMany({
        where: { id: id.data, plan: { userId: user.id } },
        data: { status: "DONE", completedAt: new Date() },
    });
    if (res.count === 0) return { ok: false, error: "Task not found." };
    revalidatePath("/focus");
    revalidatePath("/dashboard");
    revalidatePath("/plans", "layout");
    return { ok: true };
}
