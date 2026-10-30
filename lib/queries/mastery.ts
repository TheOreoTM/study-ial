import "server-only";
import { db } from "@/lib/db";
import { computeMastery, MASTERY_WINDOW, type Mastery } from "@/lib/mastery";

/**
 * Mastery for each requested topic (topics without attempts get level "new").
 * Pulls only the most recent MASTERY_WINDOW attempts per topic worth of data.
 */
export async function getTopicMastery(userId: string, topicIds: string[]): Promise<Map<string, Mastery>> {
    const attempts = await db.attempt.findMany({
        where: { userId, question: { topicId: { in: topicIds } } },
        select: { marksAwarded: true, maxMarks: true, createdAt: true, question: { select: { topicId: true } } },
        orderBy: { createdAt: "desc" },
    });

    const byTopic = new Map<string, { marksAwarded: number; maxMarks: number; createdAt: Date }[]>();
    const totals = new Map<string, number>();
    for (const a of attempts) {
        const t = a.question.topicId;
        totals.set(t, (totals.get(t) ?? 0) + 1);
        const list = byTopic.get(t) ?? [];
        if (list.length < MASTERY_WINDOW) list.push(a);
        byTopic.set(t, list);
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
