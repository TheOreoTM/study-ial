import "server-only";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { openMistakes, pickRedo, type QuestionHistory } from "@/lib/mistakes";
import { getLockedQuestionIds } from "@/lib/queries/mock-exams";

export type MistakeScope = { unitId?: string; topicId?: string };

type HistoryRow = QuestionHistory & { unitId: string };

function scopeSql(scope: MistakeScope) {
    return Prisma.sql`${scope.unitId ? Prisma.sql`AND q."unitId" = ${scope.unitId}` : Prisma.empty} ${
        scope.topicId ? Prisma.sql`AND q."topicId" = ${scope.topicId}` : Prisma.empty
    }`;
}

/**
 * One row per published question the student has attempted: the latest attempt (DISTINCT ON, newest first) plus
 * how many attempts there were and how many lost marks. Optionally within a unit or topic.
 */
export async function getQuestionHistory(userId: string, scope: MistakeScope = {}): Promise<HistoryRow[]> {
    const rows = await db.$queryRaw<
        {
            questionId: string;
            topicId: string;
            unitId: string;
            lastMarks: number;
            lastMax: number;
            lastAt: Date;
            attempts: bigint;
            misses: bigint;
        }[]
    >`
        SELECT DISTINCT ON (a."questionId")
               a."questionId", q."topicId", q."unitId",
               a."marksAwarded" AS "lastMarks", a."maxMarks" AS "lastMax", a."createdAt" AS "lastAt",
               COUNT(*) OVER (PARTITION BY a."questionId") AS attempts,
               COUNT(*) FILTER (WHERE a."marksAwarded" < a."maxMarks") OVER (PARTITION BY a."questionId") AS misses
          FROM "Attempt" a
          JOIN "Question" q ON q.id = a."questionId"
         WHERE a."userId" = ${userId} AND q.status = 'PUBLISHED' ${scopeSql(scope)}
         ORDER BY a."questionId", a."createdAt" DESC`;
    return rows.map((r) => ({ ...r, attempts: Number(r.attempts), misses: Number(r.misses) }));
}

/** How many open mistakes the student has (dashboard, topic page), counted in the database. */
export async function countOpenMistakes(userId: string, scope: MistakeScope = {}) {
    // Mistakes on a paper being sat are hidden from the notebook, so they don't count here either.
    const locked = [...(await getLockedQuestionIds(userId))];
    const notLocked = locked.length ? Prisma.sql`AND NOT (a."questionId" = ANY(${locked}))` : Prisma.empty;
    const [row] = await db.$queryRaw<{ n: bigint }[]>`
        SELECT COUNT(*) AS n FROM (
            SELECT DISTINCT ON (a."questionId") a."marksAwarded", a."maxMarks"
              FROM "Attempt" a
              JOIN "Question" q ON q.id = a."questionId"
             WHERE a."userId" = ${userId} AND q.status = 'PUBLISHED' ${scopeSql(scope)} ${notLocked}
             ORDER BY a."questionId", a."createdAt" DESC
        ) latest
        WHERE "maxMarks" > 0 AND "marksAwarded" < "maxMarks"`;
    return Number(row?.n ?? 0);
}

/** Question ids for a redo session, oldest mistakes first. */
export async function getRedoQuestionIds(userId: string, count: number, scope: MistakeScope = {}) {
    return pickRedo(await getQuestionHistory(userId, scope), count).map((m) => m.questionId);
}

/**
 * The notebook page: the newest `limit` open mistakes (in `unitId` if it's one of the units with mistakes) with
 * everything needed to review them, plus every unit with mistakes for the filter. Questions on a paper the student
 * is sitting are held back until it's handed in. Reads the history once.
 */
export async function getMistakeNotebook(userId: string, { unitId, limit = 60 }: { unitId?: string; limit?: number } = {}) {
    const [history, locked] = await Promise.all([getQuestionHistory(userId), getLockedQuestionIds(userId)]);
    const unitOf = new Map(history.map((h) => [h.questionId, h.unitId]));
    const open = openMistakes(history);
    const all = open.filter((m) => !locked.has(m.questionId));
    const held = open.length - all.length;

    const counts = new Map<string, number>();
    for (const m of all) counts.set(unitOf.get(m.questionId)!, (counts.get(unitOf.get(m.questionId)!) ?? 0) + 1);
    const unitRows = counts.size
        ? await db.unit.findMany({
              where: { id: { in: [...counts.keys()] } },
              select: { id: true, code: true, name: true, order: true, subject: { select: { order: true } } },
          })
        : [];
    const units = unitRows
        .map((u) => ({ id: u.id, code: u.code, name: u.name, order: u.subject.order * 100 + u.order, count: counts.get(u.id)! }))
        .sort((a, b) => a.order - b.order);

    // An unknown or stale unit filter falls back to everything rather than an empty page.
    const unit = units.find((u) => u.id === unitId) ?? null;
    const scoped = unit ? all.filter((m) => unitOf.get(m.questionId) === unit.id) : all;
    const shown = scoped.slice(0, limit);
    const ids = shown.map((m) => m.questionId);
    if (ids.length === 0) return { total: scoped.length, entries: [], units, unit, held };

    const [questions, latest] = await Promise.all([
        db.question.findMany({
            where: { id: { in: ids } },
            select: {
                id: true,
                type: true,
                marks: true,
                stem: true,
                stemEn: true,
                markScheme: true,
                markSchemeEn: true,
                explanation: true,
                options: { select: { id: true, label: true, text: true, isCorrect: true }, orderBy: { label: "asc" } },
                topic: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        slug: true,
                        order: true,
                        unit: { select: { id: true, code: true, order: true, subject: { select: { slug: true } } } },
                    },
                },
            },
        }),
        db.attempt.findMany({
            where: { userId, questionId: { in: ids } },
            orderBy: { createdAt: "desc" },
            distinct: ["questionId"],
            select: { questionId: true, answer: true, selectedOptionId: true, feedback: true, method: true },
        }),
    ]);

    const byId = new Map(questions.map((q) => [q.id, q]));
    const lastById = new Map(latest.map((a) => [a.questionId, a]));
    const entries = shown
        .filter((m) => byId.has(m.questionId))
        .map((m) => ({ ...m, question: byId.get(m.questionId)!, last: lastById.get(m.questionId) ?? null }));
    return { total: scoped.length, entries, units, unit, held };
}

export type MistakeEntry = Awaited<ReturnType<typeof getMistakeNotebook>>["entries"][number];
