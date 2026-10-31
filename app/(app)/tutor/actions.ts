"use server";

import { z } from "zod";
import { aiEnabled, AiQuotaError, fastModelId, remainingAiQuota } from "@/lib/ai";
import { db } from "@/lib/db";
import { assertUser } from "@/lib/session";
import {
    buildQuestionPrompt,
    buildTopicPrompt,
    explainWithAi,
    MAX_SPEC_POINTS,
    questionFallback,
    topicFallback,
    TUTOR_CACHE_DAYS,
} from "@/lib/tutor";

export type TutorResult =
    | { ok: true; source: "ai" | "cache"; content: string; remaining: number | null }
    | { ok: true; source: "fallback"; reason: "off" | "quota" | "error"; content: string }
    | { ok: false; error: string };

const id = z.string().min(1).max(64);
const DAY = 86_400_000;

// Explanations are shared across students (they depend only on curriculum content), so nothing student-facing
// changes when one is generated and there is no route to revalidate.

async function cached(kind: "topic" | "question", refId: string, point: number) {
    return db.tutorExplanation.findFirst({
        where: { kind, refId, point, createdAt: { gte: new Date(Date.now() - TUTOR_CACHE_DAYS * DAY) } },
        select: { content: true },
    });
}

/** Cache hit → no quota; otherwise the model (with quota), falling back to bank content when AI isn't available. */
async function explain(
    userId: string,
    key: { kind: "topic" | "question"; refId: string; point: number },
    prompt: () => string,
    fallback: () => string | Promise<string>,
): Promise<TutorResult> {
    const hit = await cached(key.kind, key.refId, key.point);
    if (hit) return { ok: true, source: "cache", content: hit.content, remaining: null };
    if (!aiEnabled) return { ok: true, source: "fallback", reason: "off", content: await fallback() };

    let content: string;
    try {
        content = await explainWithAi(userId, prompt());
    } catch (e) {
        if (e instanceof AiQuotaError)
            return { ok: true, source: "fallback", reason: "quota", content: await fallback() };
        console.error("[tutor] explanation failed", e);
        return { ok: true, source: "fallback", reason: "error", content: await fallback() };
    }
    // The student has their explanation either way; a failed cache write only means the next student pays for one.
    try {
        const model = fastModelId();
        await db.tutorExplanation.upsert({
            where: { kind_refId_point: key },
            create: { ...key, content, model },
            update: { content, model, createdAt: new Date() },
        });
    } catch (e) {
        console.error("[tutor] couldn't cache explanation", e);
    }
    return { ok: true, source: "ai", content, remaining: await remainingAiQuota(userId, "tutor") };
}

export async function explainTopic(input: { topicId: string; point: number }): Promise<TutorResult> {
    const user = await assertUser();
    const parsed = z
        .object({
            topicId: id,
            point: z
                .number()
                .int()
                .min(-1)
                .max(MAX_SPEC_POINTS - 1),
        })
        .safeParse(input);
    if (!parsed.success) return { ok: false, error: "Pick a specification point." };

    const topic = await db.topic.findUnique({
        where: { id: parsed.data.topicId },
        select: {
            id: true,
            code: true,
            name: true,
            summary: true,
            specPoints: true,
            unit: { select: { code: true, name: true, subject: { select: { name: true } } } },
            questions: {
                where: { status: "PUBLISHED" },
                orderBy: { createdAt: "asc" },
                take: 6,
                select: { id: true, stem: true, markScheme: true, explanation: true },
            },
        },
    });
    if (!topic) return { ok: false, error: "Topic not found." };
    const point = parsed.data.point;
    if (point >= topic.specPoints.length) return { ok: false, error: "Pick a specification point." };

    const ctx = {
        subject: topic.unit.subject.name,
        unitCode: topic.unit.code,
        unitName: topic.unit.name,
        topicCode: topic.code,
        topicName: topic.name,
        summary: topic.summary,
        specPoints: topic.specPoints,
        point,
        examples: topic.questions.slice(0, 4).map((q) => ({ stem: q.stem, markScheme: q.markScheme })),
    };
    return explain(
        user.id,
        { kind: "topic", refId: topic.id, point },
        () => buildTopicPrompt(ctx),
        async () => {
            // Worked explanations give answers away, so the fallback only uses questions this student has answered.
            const answered = await db.attempt.findMany({
                where: { userId: user.id, questionId: { in: topic.questions.map((q) => q.id) } },
                select: { questionId: true },
                distinct: ["questionId"],
            });
            const ids = new Set(answered.map((a) => a.questionId));
            return topicFallback(
                ctx,
                topic.questions.filter((q) => ids.has(q.id)),
            );
        },
    );
}

export async function explainQuestion(input: { questionId: string }): Promise<TutorResult> {
    const user = await assertUser();
    const parsed = z.object({ questionId: id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Question not found." };

    const q = await db.question.findFirst({
        where: { id: parsed.data.questionId, status: "PUBLISHED" },
        select: {
            id: true,
            stem: true,
            marks: true,
            markScheme: true,
            explanation: true,
            options: { orderBy: { label: "asc" }, select: { label: true, text: true, isCorrect: true } },
            topic: { select: { name: true, unit: { select: { code: true, subject: { select: { name: true } } } } } },
        },
    });
    if (!q) return { ok: false, error: "Question not found." };
    // The walkthrough gives the answer away, so it's only for questions the student has already answered.
    const answered = await db.attempt.findFirst({ where: { userId: user.id, questionId: q.id }, select: { id: true } });
    if (!answered) return { ok: false, error: "Answer the question first, then ask for an explanation." };

    const ctx = {
        subject: q.topic.unit.subject.name,
        unitCode: q.topic.unit.code,
        topicName: q.topic.name,
        stem: q.stem,
        marks: q.marks,
        options: q.options,
        markScheme: q.markScheme,
        explanation: q.explanation,
    };
    return explain(
        user.id,
        { kind: "question", refId: q.id, point: -1 },
        () => buildQuestionPrompt(ctx),
        () => questionFallback(ctx),
    );
}
