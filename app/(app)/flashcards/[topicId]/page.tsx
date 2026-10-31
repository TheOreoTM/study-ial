import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";
import { CardEditor, OwnCardActions } from "@/components/flashcards/card-editor";
import { formatDueDay } from "@/components/flashcards/format";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { visibleCards } from "@/lib/queries/flashcards";
import { requireUser } from "@/lib/session";
import { localDay, localDayKey } from "@/lib/time";

export const metadata: Metadata = { title: "Flashcard deck", robots: { index: false } };

type Props = { params: Promise<{ topicId: string }> };

export default async function DeckPage({ params }: Props) {
    const { topicId } = await params;
    const user = await requireUser();
    const topic = await db.topic.findUnique({
        where: { id: topicId },
        select: {
            id: true,
            code: true,
            name: true,
            slug: true,
            unit: { select: { code: true, subject: { select: { slug: true } } } },
        },
    });
    if (!topic) notFound();

    const now = new Date();
    const today = localDay(now);
    const todayKey = localDayKey(now);
    const cards = await db.flashcard.findMany({
        where: { AND: [visibleCards(user.id), { topicId: topic.id }] },
        orderBy: [{ userId: { sort: "asc", nulls: "first" } }, { createdAt: "asc" }, { id: "asc" }],
        select: {
            id: true,
            front: true,
            back: true,
            userId: true,
            reviews: { where: { userId: user.id }, select: { dueDay: true } },
        },
    });
    const shared = cards.filter((c) => c.userId === null);
    const own = cards.filter((c) => c.userId === user.id);
    const due = cards.filter((c) => c.reviews[0] && c.reviews[0].dueDay <= today).length;
    const unseen = cards.filter((c) => !c.reviews[0]).length;
    const topicHref = `/subjects/${topic.unit.subject.slug}/${topic.unit.code.toLowerCase()}/${topic.slug}`;

    const status = (reviews: { dueDay: Date }[]) => {
        const r = reviews[0];
        if (!r) return "New";
        const key = r.dueDay.toISOString().slice(0, 10);
        return r.dueDay <= today ? "Due today" : `Due ${formatDueDay(key, todayKey)}`;
    };

    return (
        <>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
                <Link href="/flashcards">
                    <ArrowLeft />
                    All flashcards
                </Link>
            </Button>
            <PageHeader
                title={topic.name}
                description={
                    <span className="mt-1 flex flex-wrap items-center gap-2">
                        <UnitChip code={topic.unit.code} />
                        <span>
                            {cards.length} card{cards.length === 1 ? "" : "s"}
                            {due > 0 && ` · ${due} due`}
                            {unseen > 0 && ` · ${unseen} new`}
                        </span>
                        <Link
                            href={topicHref}
                            className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                        >
                            Topic page
                        </Link>
                    </span>
                }
                actions={
                    due + unseen > 0 ? (
                        <Button asChild size="lg">
                            <Link href={`/flashcards/review?topic=${topic.id}`}>
                                <Layers />
                                Review this topic
                            </Link>
                        </Button>
                    ) : undefined
                }
            />

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="min-w-0 space-y-8">
                    <section aria-labelledby="shared-cards">
                        <h2 id="shared-cards" className="mb-3 text-lg">
                            Topic cards
                        </h2>
                        {shared.length === 0 ? (
                            <p className="rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                                There are no reviewed cards for this topic yet. Add your own to start a deck.
                            </p>
                        ) : (
                            <CardList cards={shared} status={status} />
                        )}
                    </section>
                    <section aria-labelledby="own-cards">
                        <h2 id="own-cards" className="mb-3 text-lg">
                            Your cards
                        </h2>
                        {own.length === 0 ? (
                            <p className="rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                                Cards you write for this topic show up here. Only you can see them.
                            </p>
                        ) : (
                            <CardList cards={own} status={status} own />
                        )}
                    </section>
                </div>
                <aside className="rounded-xl bg-muted p-5 lg:sticky lg:top-24">
                    <h2 className="mb-1 text-lg">Add a card</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Something you keep forgetting? Write it down as a question and an answer.
                    </p>
                    <CardEditor topicId={topic.id} />
                </aside>
            </div>
        </>
    );
}

function CardList({
    cards,
    status,
    own = false,
}: {
    cards: { id: string; front: string; back: string; reviews: { dueDay: Date }[] }[];
    status: (reviews: { dueDay: Date }[]) => string;
    own?: boolean;
}) {
    return (
        <ul className="space-y-2">
            {cards.map((c) => (
                <li key={c.id} className="rounded-lg border bg-card px-4 py-3.5 sm:px-5">
                    <div className="flex items-start gap-3">
                        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 sm:gap-5">
                            <Markdown className="min-w-0 font-semibold [&_p]:my-0">{c.front}</Markdown>
                            <Markdown className="min-w-0 text-muted-foreground [&_p]:my-0">{c.back}</Markdown>
                        </div>
                        {own && <OwnCardActions card={{ id: c.id, front: c.front, back: c.back }} />}
                    </div>
                    <p className="mt-2 text-[0.8125rem] font-semibold text-muted-foreground">
                        {status(c.reviews)}
                    </p>
                </li>
            ))}
        </ul>
    );
}
