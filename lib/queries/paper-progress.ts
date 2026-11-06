import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { localDay } from "@/lib/time";

export type PartRow = {
    id: string;
    number: string;
    marks: number;
    sittingId: string;
    unitCode: string;
    year: number | null;
    series: string | null;
    title: string | null;
    ownerId: string | null;
};

/** Latest score per paper question for a student (marked attempts only). */
export const latestPaperScores = cache(async (userId: string) => {
    const rows = await db.paperAttempt.findMany({
        where: { userId, marksAwarded: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { questionId: true, marksAwarded: true, maxMarks: true, createdAt: true },
    });
    const latest = new Map<string, { marks: number; max: number; at: Date }>();
    for (const r of rows) if (!latest.has(r.questionId)) latest.set(r.questionId, { marks: r.marksAwarded!, max: r.maxMarks, at: r.createdAt });
    return latest;
});

export const dueReviewCount = cache(async (userId: string) =>
    db.paperQuestionReview.count({ where: { userId, dueDay: { lte: localDay() } } }),
);

/** Paper practice summary for the progress page. */
export const paperProgress = cache(async (userId: string) => {
    const since = new Date(new Date().getTime() - 30 * 86_400_000);
    const [attempts, exams, byTopic] = await Promise.all([
        db.paperAttempt.findMany({
            where: { userId, marksAwarded: { not: null }, createdAt: { gte: since } },
            select: { marksAwarded: true, maxMarks: true, createdAt: true, question: { select: { paper: { select: { sitting: { select: { unitCode: true } } } } } } },
        }),
        db.paperExamSession.findMany({
            where: { userId, submittedAt: { not: null } },
            orderBy: { startedAt: "desc" },
            take: 5,
            select: { id: true, sittingId: true, totalMarks: true, maxMarks: true, grade: true, startedAt: true, sitting: { select: { unitCode: true, year: true, series: true } } },
        }),
        db.$queryRaw<{ topicId: string; name: string; unitCode: string; attempts: bigint; marks: bigint; max: bigint }[]>`
            SELECT q."topicId", t.name, u.code AS "unitCode", count(*) AS attempts, sum(a."marksAwarded") AS marks, sum(a."maxMarks") AS max
            FROM "PaperAttempt" a
            JOIN "PaperQuestion" q ON q.id = a."questionId"
            JOIN "Topic" t ON t.id = q."topicId"
            JOIN "Unit" u ON u.id = t."unitId"
            WHERE a."userId" = ${userId} AND a."marksAwarded" IS NOT NULL
            GROUP BY q."topicId", t.name, u.code
            HAVING count(*) >= 2`,
    ]);
    const units = new Map<string, { marks: number; max: number; parts: number }>();
    for (const a of attempts) {
        const code = a.question.paper.sitting.unitCode;
        const u = units.get(code) ?? { marks: 0, max: 0, parts: 0 };
        u.marks += a.marksAwarded!;
        u.max += a.maxMarks;
        u.parts++;
        units.set(code, u);
    }
    const weakest = byTopic
        .map((t) => ({ topicId: t.topicId, name: t.name, unitCode: t.unitCode, attempts: Number(t.attempts), share: Number(t.max) ? Number(t.marks) / Number(t.max) : 0 }))
        .sort((a, b) => a.share - b.share)
        .slice(0, 5);
    const days = new Set(attempts.map((a) => a.createdAt.toISOString().slice(0, 10)));
    return {
        parts: attempts.length,
        marks: attempts.reduce((n, a) => n + a.marksAwarded!, 0),
        max: attempts.reduce((n, a) => n + a.maxMarks, 0),
        activeDays: days.size,
        units: [...units.entries()].map(([code, u]) => ({ code, ...u })).sort((a, b) => a.code.localeCompare(b.code)),
        exams,
        weakest,
    };
});
