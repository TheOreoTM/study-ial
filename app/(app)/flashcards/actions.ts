"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { visibleCards } from "@/lib/queries/flashcards";
import { assertUser } from "@/lib/session";
import { GRADES, scheduleCard } from "@/lib/srs";
import { localDay, localDayKey } from "@/lib/time";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const id = z.string().min(1).max(64);
const side = (label: string, max: number) =>
    z
        .string()
        .trim()
        .min(1, `Write the ${label} of the card.`)
        .max(max, `Keep the ${label} under ${max.toLocaleString("en-GB")} characters.`);
const cardSchema = z.object({ front: side("front", 300), back: side("back", 600) });

const firstIssue = (e: z.ZodError) => e.issues[0]?.message ?? "Invalid input.";

function revalidateFlashcards(topicId?: string) {
    revalidatePath("/flashcards", "layout");
    revalidatePath("/dashboard");
    if (topicId) revalidatePath("/subjects", "layout");
}

/** Records a review and schedules the card's next due day. */
export async function gradeCard(input: { cardId: string; grade: string }): Promise<Result<{ dueDay: string }>> {
    const user = await assertUser();
    const parsed = z.object({ cardId: id, grade: z.enum(GRADES) }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const card = await db.flashcard.findFirst({
        where: { AND: [{ id: parsed.data.cardId }, visibleCards(user.id)] },
        select: { id: true, reviews: { where: { userId: user.id } } },
    });
    if (!card) return { ok: false, error: "Card not found." };

    const now = new Date();
    const todayKey = localDayKey(now);
    const prev = card.reviews[0];
    const next = scheduleCard(
        prev
            ? {
                  intervalDays: prev.intervalDays,
                  ease: prev.ease,
                  reps: prev.reps,
                  lapses: prev.lapses,
                  dueDay: prev.dueDay.toISOString().slice(0, 10),
              }
            : null,
        parsed.data.grade,
        todayKey,
    );
    const data = {
        dueDay: new Date(`${next.dueDay}T00:00:00Z`),
        intervalDays: next.intervalDays,
        ease: next.ease,
        reps: next.reps,
        lapses: next.lapses,
        lastReviewedAt: now,
    };
    await db.flashcardReview.upsert({
        where: { userId_flashcardId: { userId: user.id, flashcardId: card.id } },
        create: { userId: user.id, flashcardId: card.id, introducedDay: localDay(now), ...data },
        update: data,
    });
    // The review session keeps its own client state; refresh the summaries it links back to.
    revalidatePath("/dashboard");
    revalidatePath("/flashcards");
    return { ok: true, dueDay: next.dueDay };
}

export async function createCard(input: { topicId: string; front: string; back: string }): Promise<Result> {
    const user = await assertUser();
    const parsed = cardSchema.extend({ topicId: id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const topic = await db.topic.findUnique({ where: { id: parsed.data.topicId }, select: { id: true } });
    if (!topic) return { ok: false, error: "Topic not found." };
    const mine = await db.flashcard.count({ where: { userId: user.id } });
    if (mine >= 2000) return { ok: false, error: "You've reached the limit of 2,000 cards of your own." };

    await db.flashcard.create({
        data: {
            topicId: topic.id,
            userId: user.id,
            front: parsed.data.front,
            back: parsed.data.back,
            // A student's own cards are private to them, so there's nothing to review before they can use them.
            status: "PUBLISHED",
        },
    });
    revalidateFlashcards(topic.id);
    return { ok: true };
}

export async function updateCard(input: { cardId: string; front: string; back: string }): Promise<Result> {
    const user = await assertUser();
    const parsed = cardSchema.extend({ cardId: id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const card = await db.flashcard.findFirst({
        where: { id: parsed.data.cardId, userId: user.id },
        select: { id: true, topicId: true },
    });
    if (!card) return { ok: false, error: "Card not found." };
    await db.flashcard.update({
        where: { id: card.id },
        data: { front: parsed.data.front, back: parsed.data.back },
    });
    revalidateFlashcards(card.topicId);
    return { ok: true };
}

export async function deleteCard(input: { cardId: string }): Promise<Result> {
    const user = await assertUser();
    const parsed = z.object({ cardId: id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const card = await db.flashcard.findFirst({
        where: { id: parsed.data.cardId, userId: user.id },
        select: { id: true, topicId: true },
    });
    if (!card) return { ok: false, error: "Card not found." };
    await db.flashcard.delete({ where: { id: card.id } });
    revalidateFlashcards(card.topicId);
    return { ok: true };
}
