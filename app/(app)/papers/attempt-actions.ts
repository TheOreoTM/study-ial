"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { aiEnabled, AiQuotaError, remainingAiQuota } from "@/lib/ai";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { contextImages, markContextFor, loadPaperParts } from "@/lib/papers/context";
import { explainFallback, explainPaperQuestion, gradeFromScore, markPaperAnswer, selfMarkPoints, type ExplainMode } from "@/lib/papers/mark";
import { isOwnAttemptKey } from "@/lib/papers/keys";
import { assertUser } from "@/lib/session";
import { scheduleCard } from "@/lib/srs";
import { localDayKey } from "@/lib/time";
import { storage } from "@/lib/storage";

export type PointView = { code: string; point: string; awarded: boolean; comment: string };
export type MarkView =
    | {
          ok: true;
          attemptId: string;
          marksAwarded: number;
          maxMarks: number;
          method: "SELF" | "AI" | "AI_ESTIMATED";
          points: PointView[];
          justification: string;
          feedback: string;
          remaining: number | null;
      }
    | { ok: false; error: string };

const id = z.string().min(1).max(64);
const answer = z.string().trim().max(6000, "That answer is too long (6,000 characters max).");
const imageKeys = z.array(z.string().max(200)).max(3);

/** Loads the part (and checks the viewer may see it). */
async function partFor(userId: string, role: "STUDENT" | "ADMIN", questionId: string) {
    const q = await db.paperQuestion.findUnique({
        where: { id: questionId },
        select: { id: true, paper: { select: { id: true, type: true, sittingId: true } } },
    });
    if (!q || q.paper.type !== "QP") return null;
    const loaded = await loadPaperParts(q.paper.sittingId, { id: userId, role });
    if (!loaded) return null;
    const leaf = loaded.parts.find((p) => p.id === questionId);
    if (!leaf) return null;
    return { ...loaded, leaf, ctx: markContextFor(loaded.rows, leaf) };
}

async function sessionFor(userId: string, sessionId: string | null | undefined, sittingId: string) {
    if (!sessionId) return null;
    const s = await db.paperExamSession.findFirst({ where: { id: sessionId, userId, sittingId, submittedAt: null }, select: { id: true } });
    return s?.id ?? null;
}

/** Wrong (or partly wrong) answers go into the student's review queue; once mastered they space out. */
async function scheduleReview(userId: string, questionId: string, marks: number, max: number) {
    const grade = gradeFromScore(marks, max);
    const prev = await db.paperQuestionReview.findUnique({ where: { userId_questionId: { userId, questionId } } });
    if (!prev && grade === "easy") return;
    const today = localDayKey();
    const next = scheduleCard(
        prev ? { intervalDays: prev.intervalDays, ease: prev.ease, reps: prev.reps, lapses: prev.lapses, dueDay: prev.dueDay.toISOString().slice(0, 10) } : null,
        grade,
        today,
    );
    // "again" keeps a card due today; for papers, bring it back tomorrow instead
    const due = grade === "again" ? new Date(Date.parse(`${today}T00:00:00Z`) + 86_400_000) : new Date(`${next.dueDay}T00:00:00Z`);
    const data = { dueDay: due, intervalDays: next.intervalDays, ease: next.ease, reps: next.reps, lapses: next.lapses, lastReviewedAt: new Date() };
    await db.paperQuestionReview.upsert({ where: { userId_questionId: { userId, questionId } }, create: { userId, questionId, ...data }, update: data });
}

function ownKeys(userId: string, keys: string[]) {
    return keys.every((k) => isOwnAttemptKey(userId, k));
}

function revalidateAfter(sittingId: string) {
    revalidatePath(`/papers/${sittingId}`, "layout");
    revalidatePath("/progress");
    revalidatePath("/dashboard");
}

export async function selfMarkPart(input: {
    questionId: string;
    answer: string;
    imageKeys: string[];
    ticked?: number[];
    marks?: number;
    sessionId?: string | null;
}): Promise<MarkView> {
    const user = await assertUser();
    const parsed = z
        .object({ questionId: id, answer, imageKeys, ticked: z.array(z.number().int().min(0).max(60)).max(60).optional(), marks: z.number().int().min(0).max(100).optional(), sessionId: id.nullish() })
        .safeParse(input);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    const d = parsed.data;
    if (!ownKeys(user.id, d.imageKeys)) return { ok: false, error: "Invalid photo." };
    const part = await partFor(user.id, user.role, d.questionId);
    if (!part) return { ok: false, error: "Question not found." };
    const max = part.ctx.maxMarks;
    const marksAwarded = d.ticked && part.ctx.points.length ? selfMarkPoints(part.ctx.points, d.ticked, max) : Math.min(max, d.marks ?? 0);
    const points = part.ctx.points.map((p, i) => ({ code: p.code, point: p.code, awarded: !!d.ticked?.includes(i), comment: "" }));
    const attempt = await db.paperAttempt.create({
        data: {
            userId: user.id,
            questionId: d.questionId,
            sessionId: await sessionFor(user.id, d.sessionId, part.sitting.id),
            answer: d.answer || null,
            imageKeys: d.imageKeys,
            marksAwarded,
            maxMarks: max,
            method: "SELF",
            feedback: { points } as Prisma.InputJsonValue,
        },
    });
    await scheduleReview(user.id, d.questionId, marksAwarded, max);
    revalidateAfter(part.sitting.id);
    return { ok: true, attemptId: attempt.id, marksAwarded, maxMarks: max, method: "SELF", points, justification: "", feedback: "", remaining: null };
}

export async function aiMarkPart(input: { questionId: string; answer: string; imageKeys: string[]; sessionId?: string | null }): Promise<MarkView> {
    const user = await assertUser();
    if (!aiEnabled) return { ok: false, error: "AI marking isn't available right now. Mark it yourself instead." };
    const parsed = z.object({ questionId: id, answer, imageKeys, sessionId: id.nullish() }).safeParse(input);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    const d = parsed.data;
    if (!d.answer && d.imageKeys.length === 0) return { ok: false, error: "Write an answer or add a photo of your working first." };
    if (!ownKeys(user.id, d.imageKeys)) return { ok: false, error: "Invalid photo." };
    const part = await partFor(user.id, user.role, d.questionId);
    if (!part) return { ok: false, error: "Question not found." };
    if (part.ctx.maxMarks === 0) return { ok: false, error: "This part has no marks of its own to award." };

    let result;
    try {
        const images = await contextImages(part.qp.id, part.rows, part.leaf, part.ctx.msPaperId, part.ctx.entries);
        const photos = (await Promise.all(d.imageKeys.map((k) => storage().get(k)))).filter((b): b is Uint8Array => !!b);
        result = await markPaperAnswer(user.id, part.ctx, d.answer, { ...images, photos });
    } catch (err) {
        if (err instanceof AiQuotaError) return { ok: false, error: err.message };
        console.error("paper AI marking failed", err);
        return { ok: false, error: "The AI marker couldn't mark this one. Try again, or mark it yourself." };
    }
    const method = result.estimated ? "AI_ESTIMATED" : "AI";
    const attempt = await db.paperAttempt.create({
        data: {
            userId: user.id,
            questionId: d.questionId,
            sessionId: await sessionFor(user.id, d.sessionId, part.sitting.id),
            answer: d.answer || null,
            imageKeys: d.imageKeys,
            marksAwarded: result.marksAwarded,
            maxMarks: part.ctx.maxMarks,
            method,
            feedback: { points: result.points, justification: result.justification, feedback: result.feedback } as Prisma.InputJsonValue,
        },
    });
    await scheduleReview(user.id, d.questionId, result.marksAwarded, part.ctx.maxMarks);
    revalidateAfter(part.sitting.id);
    return {
        ok: true,
        attemptId: attempt.id,
        marksAwarded: result.marksAwarded,
        maxMarks: part.ctx.maxMarks,
        method,
        points: result.points,
        justification: result.justification,
        feedback: result.feedback,
        remaining: await remainingAiQuota(user.id, "marking"),
    };
}

export type ExplainView = { ok: true; markdown: string; ai: boolean } | { ok: false; error: string };

export async function explainPart(input: { questionId: string; mode: ExplainMode; attemptId?: string | null }): Promise<ExplainView> {
    const user = await assertUser();
    const parsed = z.object({ questionId: id, mode: z.enum(["explain", "hints", "similar"]), attemptId: id.nullish() }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid request." };
    const d = parsed.data;
    const part = await partFor(user.id, user.role, d.questionId);
    if (!part) return { ok: false, error: "Question not found." };
    const attempt = d.attemptId
        ? await db.paperAttempt.findFirst({ where: { id: d.attemptId, userId: user.id, questionId: d.questionId }, select: { answer: true } })
        : null;

    if (!aiEnabled) {
        if (d.mode === "similar") return { ok: false, error: "Similar questions need AI, which isn't available right now." };
        return { ok: true, markdown: explainFallback(d.mode, part.ctx, part.ctx.examinerNotes), ai: false };
    }
    try {
        const images = await contextImages(part.qp.id, part.rows, part.leaf, part.ctx.msPaperId, part.ctx.entries);
        const markdown = await explainPaperQuestion(user.id, d.mode, part.ctx, attempt?.answer ?? null, images);
        return { ok: true, markdown, ai: true };
    } catch (err) {
        if (err instanceof AiQuotaError) return { ok: false, error: err.message };
        console.error("paper explain failed", err);
        return { ok: true, markdown: explainFallback(d.mode, part.ctx, part.ctx.examinerNotes), ai: false };
    }
}
