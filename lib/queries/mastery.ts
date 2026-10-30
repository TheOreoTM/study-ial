import "server-only";
import { db } from "@/lib/db";
import { computeMastery, MASTERY_WINDOW, type Mastery } from "@/lib/mastery";

/**
 * Mastery for each requested topic (topics without attempts get level "new").
 * Fetches at most MASTERY_WINDOW recent attempts per topic (plus a total count), so cost stays flat
 * however much a student practises.
 */
export async function getTopicMastery(userId: string, topicIds: string[]): Promise<Map<string, Mastery>> {
    if (topicIds.length === 0) return new Map();
    const rows = await db.$queryRaw<
        { topicId: string; marksAwarded: number; maxMarks: number; createdAt: Date; total: bigint }[]
    >`
        SELECT "topicId", "marksAwarded", "maxMarks", "createdAt", total
          FROM (
                SELECT q."topicId", a."marksAwarded", a."maxMarks", a."createdAt",
                       ROW_NUMBER() OVER (PARTITION BY q."topicId" ORDER BY a."createdAt" DESC) AS rn,
                       COUNT(*) OVER (PARTITION BY q."topicId") AS total
                  FROM "Attempt" a
                  JOIN "Question" q ON q.id = a."questionId"
                 WHERE a."userId" = ${userId} AND q."topicId" = ANY(${topicIds})
               ) ranked
         WHERE rn <= ${MASTERY_WINDOW}`;

    const byTopic = new Map<string, { marksAwarded: number; maxMarks: number; createdAt: Date }[]>();
    const totals = new Map<string, number>();
    for (const r of rows) {
        totals.set(r.topicId, Number(r.total));
        const list = byTopic.get(r.topicId) ?? [];
        list.push(r);
        byTopic.set(r.topicId, list);
    }

    return new Map(
        topicIds.map((id) => {
            const m = computeMastery(byTopic.get(id) ?? []);
            return [id, { ...m, attempts: totals.get(id) ?? 0 }];
        }),
    );
}

/** Topic ids for all units the student is studying. */
export async function getStudentTopicIds(userId: string) {
    const topics = await db.topic.findMany({
        where: { unit: { students: { some: { userId } } } },
        select: { id: true },
    });
    return topics.map((t) => t.id);
}
