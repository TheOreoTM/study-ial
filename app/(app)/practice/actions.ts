"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { aiEnabled, AiQuotaError, remainingAiQuota } from "@/lib/ai";
import { formatAiFeedback, markMcq, markWithAi as aiMark, parseMarkScheme, selfMarkScore } from "@/lib/marking";
import { getTopicMastery } from "@/lib/queries/mastery";
import { assertUser } from "@/lib/session";
import type { AiMarkView, MarkSchemeView, McqResult, RevealResult, SelfMarkResult } from "./types";

const id = z.string().min(1).max(64);
const answer = z
    .string()
    .trim()
    .min(1, "Write an answer first.")
    .max(5000, "That answer is too long (5,000 characters max).");

function firstIssue(error: z.ZodError) {
    return error.issues[0]?.message ?? "Invalid input.";
}

// Pages whose numbers change after an attempt. The practice page itself is deliberately not revalidated:
// the session lives in client state.
function revalidateAfterAttempt() {
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/subjects", "layout");
}

async function masteryFor(userId: string, topicId: string) {
    const m = await getTopicMastery(userId, [topicId]);
    return { topicId, mastery: m.get(topicId)! };
}

function publishedQuestion(questionId: string) {
    return db.question.findFirst({
        where: { id: questionId, status: "PUBLISHED" },
        include: { options: { select: { id: true, isCorrect: true } } },
    });
}

function markSchemeView(q: { markScheme: string; explanation: string | null }): MarkSchemeView {
    const { points, notes } = parseMarkScheme(q.markScheme);
    return { points, notes, explanation: q.explanation };
}

export async function submitMcq(input: { questionId: string; optionId: string }): Promise<McqResult> {
    const user = await assertUser();
    const parsed = z.object({ questionId: id, optionId: id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const q = await publishedQuestion(parsed.data.questionId);
    if (!q || q.type !== "MCQ") return { ok: false, error: "Question not found." };

    const result = markMcq(q.options, parsed.data.optionId, q.marks);
    if (!result) return { ok: false, error: "That option doesn't belong to this question." };

    await db.attempt.create({
        data: {
            userId: user.id,
            questionId: q.id,
            selectedOptionId: parsed.data.optionId,
            marksAwarded: result.marksAwarded,
            maxMarks: q.marks,
            method: "AUTO",
        },
    });
    revalidateAfterAttempt();

    return { ok: true, ...result, explanation: q.explanation, ...(await masteryFor(user.id, q.topicId)) };
}

/**
 * Shows the mark scheme for a written question so the student can self-mark.
 * Nothing is saved until they submit their ticks with `submitSelfMark`.
 */
export async function revealMarkScheme(input: { questionId: string }): Promise<RevealResult> {
    await assertUser();
    const parsed = z.object({ questionId: id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const q = await publishedQuestion(parsed.data.questionId);
    if (!q || q.type === "MCQ") return { ok: false, error: "Question not found." };
    return { ok: true, ...markSchemeView(q) };
}

export async function submitSelfMark(input: {
    questionId: string;
    answer: string;
    ticked: number[];
}): Promise<SelfMarkResult> {
    const user = await assertUser();
    const parsed = z
        .object({ questionId: id, answer, ticked: z.array(z.number().int().min(0).max(100)).max(100) })
        .safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const q = await publishedQuestion(parsed.data.questionId);
    if (!q || q.type === "MCQ") return { ok: false, error: "Question not found." };

    const { points } = parseMarkScheme(q.markScheme);
    const marksAwarded = selfMarkScore(points, parsed.data.ticked, q.marks);

    await db.attempt.create({
        data: {
            userId: user.id,
            questionId: q.id,
            answer: parsed.data.answer,
            marksAwarded,
            maxMarks: q.marks,
            method: "SELF",
        },
    });
    revalidateAfterAttempt();

    return { ok: true, marksAwarded, ...(await masteryFor(user.id, q.topicId)) };
}

export async function markWithAi(input: { questionId: string; answer: string }): Promise<AiMarkView> {
    const user = await assertUser();
    if (!aiEnabled) return { ok: false, error: "AI marking isn't available right now. Mark it yourself instead." };

    const parsed = z.object({ questionId: id, answer }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const q = await publishedQuestion(parsed.data.questionId);
    if (!q || q.type === "MCQ") return { ok: false, error: "Question not found." };

    let result;
    try {
        result = await aiMark(user.id, {
            stem: q.stem,
            markScheme: q.markScheme,
            maxMarks: q.marks,
            answer: parsed.data.answer,
        });
    } catch (err) {
        if (err instanceof AiQuotaError) return { ok: false, error: err.message };
        console.error("AI marking failed", err);
        return { ok: false, error: "The AI marker couldn't mark this one. Try again, or mark it yourself." };
    }

    await db.attempt.create({
        data: {
            userId: user.id,
            questionId: q.id,
            answer: parsed.data.answer,
            marksAwarded: result.marksAwarded,
            maxMarks: q.marks,
            method: "AI",
            feedback: formatAiFeedback(result),
        },
    });
    revalidateAfterAttempt();

    const [mastery, remaining] = await Promise.all([
        masteryFor(user.id, q.topicId),
        remainingAiQuota(user.id, "marking"),
    ]);
    return { ok: true, ...result, markScheme: markSchemeView(q), remaining, ...mastery };
}
