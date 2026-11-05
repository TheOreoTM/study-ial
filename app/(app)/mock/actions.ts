"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { markMcq, parseMarkScheme, selfMarkScore } from "@/lib/marking";
import {
    assemblePaper,
    durationFor,
    isPastDeadline,
    lengthAvailable,
    MOCK_TARGET,
    type MockLength,
} from "@/lib/mock-exam";
import { assertUser } from "@/lib/session";
import { localDayStart } from "@/lib/time";
import { answersSchema, cleanAnswers, readAnswers, type MockAnswers } from "./answers";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const id = z.string().min(1).max(64);
/** New papers a student can start in one (Maldives) day, so a stuck button can't fill the table. */
const MAX_MOCKS_PER_DAY = 12;

function firstIssue(error: z.ZodError) {
    return error.issues[0]?.message ?? "Invalid input.";
}

function revalidateAfterMarking(mockId: string) {
    revalidatePath("/mock");
    revalidatePath(`/mock/${mockId}`);
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/mistakes");
    revalidatePath("/subjects", "layout");
}

/** Starts a paper for one of the student's units, or resumes the one already running for it. */
export async function startMock(input: { unitId: string; length: MockLength }): Promise<Result<{ id: string }>> {
    const user = await assertUser();
    const parsed = z.object({ unitId: id, length: z.enum(["short", "half", "full"]) }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const { unitId, length } = parsed.data;

    const unit = await db.unit.findFirst({
        where: { id: unitId, students: { some: { userId: user.id } } },
        include: { subject: { select: { slug: true } } },
    });
    if (!unit) return { ok: false, error: "Add this unit in Settings to sit a mock paper for it." };

    const running = await db.mockExam.findFirst({
        where: { userId: user.id, unitId, status: "IN_PROGRESS" },
        orderBy: { startedAt: "desc" },
    });
    if (running && !isPastDeadline(running.startedAt, running.durationMinutes, new Date())) {
        return { ok: true, id: running.id };
    }

    const today = await db.mockExam.count({ where: { userId: user.id, startedAt: { gte: localDayStart() } } });
    if (today >= MAX_MOCKS_PER_DAY) return { ok: false, error: "That's a lot of papers for one day. Try again tomorrow." };

    const questions = await db.question.findMany({
        where: { unitId, status: "PUBLISHED" },
        select: { id: true, topicId: true, marks: true, type: true, topic: { select: { order: true } } },
    });
    const available = questions.reduce((n, q) => n + q.marks, 0);
    if (!lengthAvailable(length, available)) {
        return { ok: false, error: "There aren't enough questions in this unit for that length yet." };
    }

    const latest = await db.attempt.findMany({
        where: { userId: user.id, questionId: { in: questions.map((q) => q.id) } },
        select: { questionId: true, marksAwarded: true, maxMarks: true },
        orderBy: { createdAt: "desc" },
    });
    const seen = new Map<string, number>();
    for (const a of latest) {
        if (!seen.has(a.questionId)) seen.set(a.questionId, a.maxMarks > 0 ? a.marksAwarded / a.maxMarks : 0);
    }

    const paper = assemblePaper(
        questions.map((q) => ({
            id: q.id,
            topicId: q.topicId,
            topicOrder: q.topic.order,
            marks: q.marks,
            isMcq: q.type === "MCQ",
        })),
        MOCK_TARGET[length],
        { seen },
    );
    if (paper.length === 0) return { ok: false, error: "There are no questions in this unit yet." };
    const totalMarks = paper.reduce((n, q) => n + q.marks, 0);

    const mock = await db.mockExam.create({
        data: {
            userId: user.id,
            unitId,
            length,
            questionIds: paper.map((q) => q.id),
            totalMarks,
            durationMinutes: durationFor(totalMarks, unit.subject.slug),
        },
    });
    revalidatePath("/mock");
    return { ok: true, id: mock.id };
}

/** Autosave while sitting. Ignored once time is up, so the clock means something. */
export async function saveMockAnswers(input: { id: string; answers: MockAnswers }): Promise<Result> {
    const user = await assertUser();
    const parsed = z.object({ id, answers: answersSchema }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const mock = await db.mockExam.findFirst({ where: { id: parsed.data.id, userId: user.id } });
    if (!mock) return { ok: false, error: "Paper not found." };
    if (mock.status !== "IN_PROGRESS") return { ok: false, error: "This paper has already been handed in." };
    if (isPastDeadline(mock.startedAt, mock.durationMinutes, new Date())) return { ok: false, error: "Time's up." };

    await db.mockExam.updateMany({
        where: { id: mock.id, userId: user.id, status: "IN_PROGRESS" },
        data: { answers: cleanAnswers(parsed.data.answers, mock.questionIds) },
    });
    return { ok: true };
}

/**
 * Hands the paper in. Multiple-choice answers are marked straight away; if there are written answers the paper
 * moves to MARKING for self-marking, otherwise it's finished. After the deadline only the last autosave counts.
 * Unanswered questions score 0 on the paper but record no attempt, so they don't change mastery.
 */
export async function submitMock(input: { id: string; answers?: MockAnswers }): Promise<Result<{ status: string }>> {
    const user = await assertUser();
    const parsed = z.object({ id, answers: answersSchema.optional() }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const mock = await db.mockExam.findFirst({ where: { id: parsed.data.id, userId: user.id } });
    if (!mock) return { ok: false, error: "Paper not found." };
    if (mock.status !== "IN_PROGRESS") return { ok: true, status: mock.status };

    const late = isPastDeadline(mock.startedAt, mock.durationMinutes, new Date());
    const answers = cleanAnswers(
        late || !parsed.data.answers ? readAnswers(mock.answers) : parsed.data.answers,
        mock.questionIds,
    );

    const questions = await db.question.findMany({
        where: { id: { in: mock.questionIds } },
        select: { id: true, type: true, marks: true, options: { select: { id: true, isCorrect: true } } },
    });
    const writtenAnswered = questions.some((q) => q.type !== "MCQ" && answers[q.id]?.answer);
    const now = new Date();

    const result = await db.$transaction(async (tx) => {
        // Claim the paper first, so a double click or two tabs can't mark it twice.
        const claimed = await tx.mockExam.updateMany({
            where: { id: mock.id, userId: user.id, status: "IN_PROGRESS" },
            data: {
                status: writtenAnswered ? "MARKING" : "FINISHED",
                answers,
                submittedAt: now,
                ...(writtenAnswered ? {} : { finishedAt: now }),
            },
        });
        if (claimed.count === 0) return null;

        let mcqMarks = 0;
        for (const q of questions) {
            const optionId = answers[q.id]?.optionId;
            if (q.type !== "MCQ" || !optionId) continue;
            const marked = markMcq(q.options, optionId, q.marks);
            if (!marked) continue;
            mcqMarks += marked.marksAwarded;
            await tx.attempt.create({
                data: {
                    userId: user.id,
                    questionId: q.id,
                    selectedOptionId: optionId,
                    marksAwarded: marked.marksAwarded,
                    maxMarks: q.marks,
                    method: "AUTO",
                    mockExamId: mock.id,
                    createdAt: now,
                },
            });
        }
        if (!writtenAnswered) await tx.mockExam.update({ where: { id: mock.id }, data: { marksAwarded: mcqMarks } });
        return writtenAnswered ? "MARKING" : "FINISHED";
    });

    revalidateAfterMarking(mock.id);
    return { ok: true, status: result ?? "FINISHED" };
}

/** Self-marking: `ticks` maps each answered written question to the mark-scheme points the student ticked. */
export async function markMock(input: { id: string; ticks: Record<string, number[]> }): Promise<Result> {
    const user = await assertUser();
    const parsed = z
        .object({
            id,
            ticks: z
                .record(id, z.array(z.number().int().min(0).max(100)).max(100))
                .refine((r) => Object.keys(r).length <= 80, "Too many questions."),
        })
        .safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const mock = await db.mockExam.findFirst({ where: { id: parsed.data.id, userId: user.id } });
    if (!mock) return { ok: false, error: "Paper not found." };
    if (mock.status !== "MARKING") return { ok: false, error: "This paper isn't waiting to be marked." };

    const answers = readAnswers(mock.answers);
    const questions = await db.question.findMany({
        where: { id: { in: mock.questionIds }, type: { not: "MCQ" } },
        select: { id: true, marks: true, markScheme: true },
    });
    const now = new Date();

    await db.$transaction(async (tx) => {
        const claimed = await tx.mockExam.updateMany({
            where: { id: mock.id, userId: user.id, status: "MARKING" },
            data: { status: "FINISHED", finishedAt: now },
        });
        if (claimed.count === 0) return;

        for (const q of questions) {
            const answer = answers[q.id]?.answer;
            if (!answer) continue;
            const { points } = parseMarkScheme(q.markScheme);
            await tx.attempt.create({
                data: {
                    userId: user.id,
                    questionId: q.id,
                    answer,
                    marksAwarded: selfMarkScore(points, parsed.data.ticks[q.id] ?? [], q.marks),
                    maxMarks: q.marks,
                    method: "SELF",
                    mockExamId: mock.id,
                    createdAt: now,
                },
            });
        }
        const total = await tx.attempt.aggregate({ where: { mockExamId: mock.id }, _sum: { marksAwarded: true } });
        await tx.mockExam.update({ where: { id: mock.id }, data: { marksAwarded: total._sum.marksAwarded ?? 0 } });
    });

    revalidateAfterMarking(mock.id);
    return { ok: true };
}

/** Throws away a paper that hasn't been handed in. Nothing was recorded for it yet. */
export async function abandonMock(input: { id: string }): Promise<Result> {
    const user = await assertUser();
    const parsed = z.object({ id }).safeParse(input);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const { count } = await db.mockExam.deleteMany({
        where: { id: parsed.data.id, userId: user.id, status: "IN_PROGRESS" },
    });
    if (count === 0) return { ok: false, error: "Only a paper you're still sitting can be abandoned." };
    revalidatePath("/mock");
    return { ok: true };
}
