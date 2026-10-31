import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { revisionPriority } from "@/lib/mastery";
import { getStudentTopicIds, getTopicMastery } from "@/lib/queries/mastery";
import { buildQueue, NEW_CARDS_PER_DAY } from "@/lib/srs";
import { localDay, localDayKey } from "@/lib/time";

/** Cards a student may see and review: published shared cards plus their own. */
export function visibleCards(userId: string): Prisma.FlashcardWhereInput {
    return { OR: [{ userId: null, status: "PUBLISHED" }, { userId }] };
}

export type ReviewCard = {
    id: string;
    front: string;
    back: string;
    isNew: boolean;
    own: boolean;
    topic: { id: string; code: string; name: string; unitCode: string };
};

/**
 * Today's review queue: due cards, then new cards from the weakest topics (capped per day). Scoped to one topic when
 * `topicId` is given, otherwise to the student's units.
 */
export async function getReviewQueue(userId: string, { topicId, now = new Date() }: { topicId?: string; now?: Date }) {
    const today = localDay(now);
    const topicIds = topicId ? [topicId] : await getStudentTopicIds(userId);
    if (topicIds.length === 0) return [];

    const cardWhere: Prisma.FlashcardWhereInput = { AND: [visibleCards(userId), { topicId: { in: topicIds } }] };
    const [due, unseen, introducedToday, mastery] = await Promise.all([
        db.flashcardReview.findMany({
            where: { userId, dueDay: { lte: today }, flashcard: cardWhere },
            select: { flashcardId: true, dueDay: true, flashcard: { select: { topicId: true } } },
        }),
        db.flashcard.findMany({
            where: { AND: [cardWhere, { reviews: { none: { userId } } }] },
            select: { id: true, topicId: true },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        }),
        db.flashcardReview.count({ where: { userId, introducedDay: today } }),
        getTopicMastery(userId, topicIds),
    ]);

    const priority = new Map([...mastery].map(([id, m]) => [id, revisionPriority(m, now)]));
    const queue = buildQueue({
        due: due.map((r) => ({
            id: r.flashcardId,
            topicId: r.flashcard.topicId,
            dueDay: r.dueDay.toISOString().slice(0, 10),
        })),
        unseen,
        topicPriority: priority,
        introducedToday,
    });
    const ids = [...queue.due, ...queue.fresh];
    if (ids.length === 0) return [];

    const cards = await db.flashcard.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            front: true,
            back: true,
            userId: true,
            topic: { select: { id: true, code: true, name: true, unit: { select: { code: true } } } },
        },
    });
    const byId = new Map(cards.map((c) => [c.id, c]));
    const fresh = new Set(queue.fresh);
    return ids.flatMap((id): ReviewCard[] => {
        const c = byId.get(id);
        if (!c) return [];
        return [
            {
                id: c.id,
                front: c.front,
                back: c.back,
                isNew: fresh.has(id),
                own: c.userId === userId,
                topic: { id: c.topic.id, code: c.topic.code, name: c.topic.name, unitCode: c.topic.unit.code },
            },
        ];
    });
}

export type DeckCounts = { total: number; due: number; unseen: number };

/** Per-topic card counts for the given topics: visible cards, due today, and never reviewed. */
export async function getDeckCounts(userId: string, topicIds: string[], now = new Date()) {
    const counts = new Map<string, DeckCounts>(topicIds.map((id) => [id, { total: 0, due: 0, unseen: 0 }]));
    if (topicIds.length === 0) return counts;
    const today = localDay(now);
    const cards = await db.flashcard.findMany({
        where: { AND: [visibleCards(userId), { topicId: { in: topicIds } }] },
        select: { topicId: true, reviews: { where: { userId }, select: { dueDay: true } } },
    });
    for (const c of cards) {
        const n = counts.get(c.topicId)!;
        n.total++;
        const r = c.reviews[0];
        if (!r) n.unseen++;
        else if (r.dueDay <= today) n.due++;
    }
    return counts;
}

/**
 * Headline numbers for the dashboard and /flashcards: cards due today across the student's units, new cards they can
 * start today, and the next due day when nothing is due.
 */
export async function getFlashcardSummary(userId: string, now = new Date()) {
    const today = localDay(now);
    const topicIds = await getStudentTopicIds(userId);
    const cardWhere: Prisma.FlashcardWhereInput = { AND: [visibleCards(userId), { topicId: { in: topicIds } }] };
    const [due, unseen, introducedToday, next] = await Promise.all([
        db.flashcardReview.count({ where: { userId, dueDay: { lte: today }, flashcard: cardWhere } }),
        db.flashcard.count({ where: { AND: [cardWhere, { reviews: { none: { userId } } }] } }),
        db.flashcardReview.count({ where: { userId, introducedDay: today } }),
        db.flashcardReview.findFirst({
            where: { userId, dueDay: { gt: today }, flashcard: cardWhere },
            orderBy: { dueDay: "asc" },
            select: { dueDay: true },
        }),
    ]);
    const newToday = Math.min(unseen, Math.max(0, NEW_CARDS_PER_DAY - introducedToday));
    return {
        due,
        newToday,
        unseen,
        /** "YYYY-MM-DD" of the next review after today, if any */
        nextDue: next ? next.dueDay.toISOString().slice(0, 10) : null,
        today: localDayKey(now),
    };
}
