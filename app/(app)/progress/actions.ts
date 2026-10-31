"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Marks the current student's milestones earned up to `upTo` (when the notice was rendered) as seen, which hides the
 * dashboard notice; one earned since, e.g. in another tab, still gets shown.
 */
export async function dismissMilestones(input: { upTo: string }): Promise<Result> {
    const user = await assertUser();
    const parsed = z.object({ upTo: z.iso.datetime() }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Couldn't dismiss that. Refresh and try again." };
    try {
        await db.userMilestone.updateMany({
            where: { userId: user.id, seenAt: null, earnedAt: { lte: new Date(parsed.data.upTo) } },
            data: { seenAt: new Date() },
        });
    } catch (e) {
        console.error("[milestones] dismiss failed", e);
        return { ok: false, error: "Couldn't dismiss that. Please try again." };
    }
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    return { ok: true };
}
