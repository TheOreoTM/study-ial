import "server-only";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { openMistakes, pickRedo, type Mistake, type QuestionHistory } from "@/lib/mistakes";

export type MistakeScope = { unitId?: string; topicId?: string };

/** One aggregated row per published question the student has attempted, optionally within a unit or topic. */
export async function getQuestionHistory(userId: string, scope: MistakeScope = {}): Promise<QuestionHistory[]> {
    const unitFilter = scope.unitId ? Prisma.sql`AND q."unitId" = ${scope.unitId}` : Prisma.empty;
    const topicFilter = scope.topicId ? Prisma.sql`AND q."topicId" = ${scope.topicId}` : Prisma.empty;
    const rows = await db.$queryRaw<
        {
            questionId: string;
            topicId: string;
            lastMarks: number;
            lastMax: number;
            lastAt: Date;
            attempts: bigint;
            misses: bigint;
        }[]
    >`
        SELECT a."questionId", q."topicId",
               (array_agg(a."marksAwarded" ORDER BY a."createdAt" DESC))[1] AS "lastMarks",
               (array_agg(a."maxMarks" ORDER BY a."createdAt" DESC))[1] AS "lastMax",
               MAX(a."createdAt") AS "lastAt",
               COUNT(*) AS attempts,
               COUNT(*) FILTER (WHERE a."marksAwarded" < a."maxMarks") AS misses
          FROM "Attempt" a
          JOIN "Question" q ON q.id = a."questionId"
         WHERE a."userId" = ${userId} AND q.status = 'PUBLISHED' ${unitFilter} ${topicFilter}
         GROUP BY a."questionId", q."topicId"`;
    return rows.map((r) => ({ ...r, attempts: Number(r.attempts), misses: Number(r.misses) }));
}

/** How many open mistakes the student has (for the dashboard and nav entry points). */
export async function countOpenMistakes(userId: string, scope: MistakeScope = {}) {
    return openMistakes(await getQuestionHistory(userId, scope)).length;
}

/** Question ids for a redo session, oldest mistakes first. */
export async function getRedoQuestionIds(userId: string, count: number, scope: MistakeScope = {}) {
    return pickRedo(await getQuestionHistory(userId, scope), count).map((m) => m.questionId);
}

/** The notebook page: the newest `limit` open mistakes with everything needed to review them. */
export async function getMistakeNotebook(userId: string, { limit = 60, ...scope }: MistakeScope & { limit?: number } = {}) {
    const all = openMistakes(await getQuestionHistory(userId, scope));
    const shown = all.slice(0, limit);
    const ids = shown.map((m) => m.questionId);
    // The filter chips always list every unit with mistakes, whatever the current filter.
    const unitsFrom = scope.unitId || scope.topicId ? undefined : all;
    if (ids.length === 0) return { total: all.length, entries: [], units: await mistakeUnits(userId, unitsFrom) };

    const [questions, latest, units] = await Promise.all([
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
        mistakeUnits(userId, unitsFrom),
    ]);

    const byId = new Map(questions.map((q) => [q.id, q]));
    const lastById = new Map(latest.map((a) => [a.questionId, a]));
    const entries = shown
        .filter((m) => byId.has(m.questionId))
        .map((m) => ({ ...m, question: byId.get(m.questionId)!, last: lastById.get(m.questionId) ?? null }));
    return { total: all.length, entries, units };
}

export type MistakeEntry = Awaited<ReturnType<typeof getMistakeNotebook>>["entries"][number];

/** Units that have open mistakes, with counts, for the filter chips. Pass `mistakes` to avoid re-reading. */
async function mistakeUnits(userId: string, mistakes?: Mistake[]) {
    const list = mistakes ?? openMistakes(await getQuestionHistory(userId));
    if (list.length === 0) return [];
    const topics = await db.topic.findMany({
        where: { id: { in: [...new Set(list.map((m) => m.topicId))] } },
        select: { id: true, unit: { select: { id: true, code: true, name: true, order: true, subject: { select: { order: true } } } } },
    });
    const unitOf = new Map(topics.map((t) => [t.id, t.unit]));
    const counts = new Map<string, { id: string; code: string; name: string; order: number; count: number }>();
    for (const m of list) {
        const u = unitOf.get(m.topicId);
        if (!u) continue;
        const entry = counts.get(u.id) ?? { id: u.id, code: u.code, name: u.name, order: u.subject.order * 100 + u.order, count: 0 };
        entry.count++;
        counts.set(u.id, entry);
    }
    return [...counts.values()].sort((a, b) => a.order - b.order);
}
