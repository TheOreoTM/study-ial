"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { assertUser } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };

/** Marks the current student's earned milestones as seen, which hides the dashboard notice. Takes no input. */
export async function dismissMilestones(): Promise<Result> {
    const user = await assertUser();
    await db.userMilestone.updateMany({ where: { userId: user.id, seenAt: null }, data: { seenAt: new Date() } });
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    return { ok: true };
}
