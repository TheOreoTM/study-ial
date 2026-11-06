"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { canViewSittingContent } from "@/lib/papers/permissions";
import { assertUser } from "@/lib/session";

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const sittingInput = z.object({ sittingId: z.string().min(1).max(64) });

export async function addToMyPapers(input: { sittingId: string }): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = sittingInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };

    const sitting = await db.paperSitting.findUnique({
        where: { id: parsed.data.sittingId },
        select: { id: true, ownerId: true, _count: { select: { papers: true } } },
    });
    if (!sitting || !canViewSittingContent(user, sitting) || sitting._count.papers === 0) {
        return { ok: false, error: "That paper isn't available." };
    }
    // The question paper and its mark scheme / examiner report come together: they share the sitting.
    await db.userPaper.upsert({
        where: { userId_sittingId: { userId: user.id, sittingId: sitting.id } },
        create: { userId: user.id, sittingId: sitting.id },
        update: {},
    });
    revalidatePath("/papers");
    revalidatePath("/past-papers", "layout");
    return { ok: true };
}

export async function removeFromMyPapers(input: { sittingId: string }): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = sittingInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };
    const sitting = await db.paperSitting.findUnique({ where: { id: parsed.data.sittingId }, select: { ownerId: true } });
    if (sitting?.ownerId === user.id) {
        return { ok: false, error: "This is your own upload. Delete it from the paper page instead." };
    }
    await db.userPaper.deleteMany({ where: { userId: user.id, sittingId: parsed.data.sittingId } });
    revalidatePath("/papers");
    revalidatePath("/past-papers", "layout");
    return { ok: true };
}
