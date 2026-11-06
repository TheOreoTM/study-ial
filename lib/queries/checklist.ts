import "server-only";
import { db } from "@/lib/db";
import { currentRatings, type Confidence } from "@/lib/checklist";

/** The student's current ratings for each topic (stale ones dropped), keyed by topic id then point index. */
export async function getSpecRatings(
    userId: string,
    topics: { id: string; specPoints: string[] }[],
): Promise<Map<string, Map<number, Confidence>>> {
    if (topics.length === 0) return new Map();
    const rows = await db.specPointRating.findMany({
        where: { userId, topicId: { in: topics.map((t) => t.id) } },
        select: { topicId: true, point: true, text: true, rating: true },
    });
    return new Map(
        topics.map((t) => [
            t.id,
            currentRatings(
                t.specPoints,
                rows.filter((r) => r.topicId === t.id),
            ),
        ]),
    );
}
