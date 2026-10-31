import type { Metadata } from "next";
import { ReviewSession } from "@/components/flashcards/review-session";
import { formatDueDay } from "@/components/flashcards/format";
import { db } from "@/lib/db";
import { getFlashcardSummary, getReviewQueue } from "@/lib/queries/flashcards";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Review flashcards", robots: { index: false } };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ReviewPage({ searchParams }: { searchParams: SearchParams }) {
    const user = await requireUser();
    const sp = await searchParams;
    const topicParam = typeof sp.topic === "string" && sp.topic.length <= 64 ? sp.topic : undefined;
    const topic = topicParam
        ? await db.topic.findUnique({ where: { id: topicParam }, select: { id: true, name: true } })
        : null;

    const [queue, summary] = await Promise.all([
        getReviewQueue(user.id, { topicId: topic?.id }),
        topic ? null : getFlashcardSummary(user.id),
    ]);
    const back = topic ? { href: `/flashcards/${topic.id}`, label: "Back to the deck" } : { href: "/flashcards", label: "All flashcards" };

    // Always the same client component, with no key: grading revalidates this page, and an in-progress session must
    // keep its client state (including its summary) even when the fresh server queue comes back empty.
    return (
        <ReviewSession
            cards={queue}
            title={topic?.name ?? "Today's cards"}
            back={back}
            emptyMessage={
                summary?.nextDue
                    ? `Your next cards are due ${formatDueDay(summary.nextDue, summary.today)}.`
                    : topic
                      ? "You've reviewed everything due in this topic today."
                      : "You've reviewed everything due today."
            }
        />
    );
}
