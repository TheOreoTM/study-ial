"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertAdmin } from "@/lib/session";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const id = z.string().min(1).max(64);
const status = z.enum(["DRAFT", "PUBLISHED"]);

function revalidateDecks() {
    revalidatePath("/admin/flashcards");
    revalidatePath("/flashcards", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/subjects", "layout");
}

/** Publishes or unpublishes shared cards. Students' own cards (userId set) are never touched. */
export async function setFlashcardStatus(input: { ids: string[]; status: string }): Promise<Result<{ count: number }>> {
    await assertAdmin();
    const parsed = z.object({ ids: z.array(id).min(1).max(500), status }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid selection." };
    const res = await db.flashcard.updateMany({
        where: { id: { in: parsed.data.ids }, userId: null },
        data: { status: parsed.data.status },
    });
    revalidateDecks();
    return { ok: true, count: res.count };
}

/** Publishes every draft shared card in a topic. */
export async function publishTopicFlashcards(input: { topicId: string }): Promise<Result<{ count: number }>> {
    await assertAdmin();
    const parsed = z.object({ topicId: id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid topic." };
    const res = await db.flashcard.updateMany({
        where: { topicId: parsed.data.topicId, userId: null, status: "DRAFT" },
        data: { status: "PUBLISHED" },
    });
    revalidateDecks();
    return { ok: true, count: res.count };
}

export async function deleteSharedFlashcard(input: { id: string }): Promise<Result> {
    await assertAdmin();
    const parsed = z.object({ id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid card." };
    const card = await db.flashcard.findFirst({ where: { id: parsed.data.id, userId: null }, select: { id: true, seedKey: true } });
    if (!card) return { ok: false, error: "Card not found." };
    await db.$transaction([
        // Remember deleted seed content so the next `pnpm db:seed` doesn't recreate it.
        ...(card.seedKey
            ? [db.seedTombstone.upsert({ where: { seedKey: card.seedKey }, create: { seedKey: card.seedKey }, update: {} })]
            : []),
        db.flashcard.delete({ where: { id: card.id } }),
    ]);
    revalidateDecks();
    return { ok: true };
}
