"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cardFromQuestion } from "@/lib/card-from-question";
import { db } from "@/lib/db";
import { getLockedQuestionIds, LOCKED_MESSAGE } from "@/lib/queries/mock-exams";
import { assertUser } from "@/lib/session";

type Result = { ok: true; topicId: string } | { ok: false; error: string };

/** Same cap as cards written by hand (app/(app)/flashcards/actions.ts). */
const MAX_OWN_CARDS = 2000;

/**
 * Makes one of the student's own flashcards from a question they've answered: the stem on the front, the right answer
 * (or mark-scheme points) and the explanation on the back. Only for questions they've attempted, so it can't be used
 * to read answers early.
 */
export async function cardFromMistake(input: { questionId: string }): Promise<Result> {
    const user = await assertUser();
    const parsed = z.object({ questionId: z.string().min(1).max(64) }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Question not found." };

    const q = await db.question.findFirst({
        where: { id: parsed.data.questionId, status: "PUBLISHED", attempts: { some: { userId: user.id } } },
        select: {
            id: true,
            topicId: true,
            type: true,
            stem: true,
            markScheme: true,
            explanation: true,
            options: { select: { label: true, text: true, isCorrect: true }, orderBy: { label: "asc" } },
        },
    });
    if (!q) return { ok: false, error: "Question not found." };
    if ((await getLockedQuestionIds(user.id)).has(q.id)) return { ok: false, error: LOCKED_MESSAGE };

    const card = cardFromQuestion(q);
    const [mine, duplicate] = await Promise.all([
        db.flashcard.count({ where: { userId: user.id } }),
        db.flashcard.findFirst({ where: { userId: user.id, topicId: q.topicId, front: card.front }, select: { id: true } }),
    ]);
    if (duplicate) return { ok: false, error: "That question is already in your deck." };
    if (mine >= MAX_OWN_CARDS) return { ok: false, error: "You've reached the limit of 2,000 cards of your own." };

    await db.flashcard.create({
        // Own cards are private, so they're usable straight away (no review).
        data: { topicId: q.topicId, userId: user.id, front: card.front, back: card.back, status: "PUBLISHED" },
    });
    revalidatePath("/flashcards", "layout");
    revalidatePath("/dashboard");
    return { ok: true, topicId: q.topicId };
}
