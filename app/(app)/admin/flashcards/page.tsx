import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { FlashcardAdminRow, PublishTopicButton } from "@/components/admin/flashcard-admin";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { getCurriculumTree } from "../queries";

export const metadata: Metadata = { title: "Flashcards · Admin" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminFlashcardsPage({ searchParams }: { searchParams: SearchParams }) {
    await requireAdmin();
    const sp = await searchParams;
    const topicId = typeof sp.topic === "string" ? sp.topic : null;

    if (topicId) return <TopicDeck topicId={topicId} />;

    const [tree, counts] = await Promise.all([
        getCurriculumTree(),
        db.flashcard.groupBy({ by: ["topicId", "status"], where: { userId: null }, _count: { _all: true } }),
    ]);
    const byTopic = new Map<string, { draft: number; published: number }>();
    for (const row of counts) {
        const c = byTopic.get(row.topicId) ?? { draft: 0, published: 0 };
        c[row.status === "PUBLISHED" ? "published" : "draft"] += row._count._all;
        byTopic.set(row.topicId, c);
    }
    const totals = [...byTopic.values()].reduce(
        (t, c) => ({ draft: t.draft + c.draft, published: t.published + c.published }),
        { draft: 0, published: 0 },
    );

    return (
        <>
            <PageHeader
                title="Flashcards"
                description="Shared topic decks. Seeded cards start as drafts; students only see published cards."
            />
            <p className="mb-6 text-muted-foreground">
                <span className="num text-foreground">{totals.published}</span> published ·{" "}
                <span className="num text-foreground">{totals.draft}</span> drafts to review
            </p>
            {tree.length === 0 ? (
                <EmptyState icon={Layers} title="No curriculum yet" description="Run the seed to add subjects." />
            ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                    {tree.map((subject) => {
                        const topics = subject.units.flatMap((u) => u.topics.map((t) => ({ ...t, unit: u })));
                        if (topics.every((t) => !byTopic.has(t.id))) return null;
                        return (
                            <Card key={subject.id} className="gap-3 py-5">
                                <h2 className="px-5 text-lg">{subject.name}</h2>
                                <ul className="px-2">
                                    {topics.map((t) => {
                                        const c = byTopic.get(t.id);
                                        if (!c) return null;
                                        return (
                                            <li key={t.id}>
                                                <Link
                                                    href={`/admin/flashcards?topic=${t.id}`}
                                                    className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
                                                >
                                                    <span className="w-16 shrink-0 text-sm font-bold text-muted-foreground">
                                                        {t.unit.code}
                                                    </span>
                                                    <span className="min-w-0 flex-1 truncate font-semibold">{t.name}</span>
                                                    <span className="shrink-0 text-sm tabular-nums">
                                                        {c.published}
                                                        <span className="text-muted-foreground"> pub</span>
                                                    </span>
                                                    {c.draft > 0 && (
                                                        <span className="shrink-0 text-sm text-warning tabular-nums">
                                                            {c.draft} draft
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
}

async function TopicDeck({ topicId }: { topicId: string }) {
    const topic = await db.topic.findUnique({
        where: { id: topicId },
        select: {
            id: true,
            code: true,
            name: true,
            unit: { select: { code: true } },
            flashcards: {
                where: { userId: null },
                orderBy: [{ seedKey: "asc" }, { createdAt: "asc" }],
                select: { id: true, front: true, back: true, status: true },
            },
        },
    });
    if (!topic) {
        return (
            <EmptyState
                icon={Layers}
                title="Topic not found"
                action={
                    <Button asChild variant="outline">
                        <Link href="/admin/flashcards">All decks</Link>
                    </Button>
                }
            />
        );
    }
    const drafts = topic.flashcards.filter((c) => c.status === "DRAFT").length;
    return (
        <>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
                <Link href="/admin/flashcards">
                    <ArrowLeft />
                    All decks
                </Link>
            </Button>
            <PageHeader
                title={topic.name}
                description={`${topic.unit.code} · topic ${topic.code} · ${topic.flashcards.length} shared cards`}
                actions={drafts > 0 ? <PublishTopicButton topicId={topic.id} drafts={drafts} /> : undefined}
            />
            <ul className="space-y-2">
                {topic.flashcards.map((c) => (
                    <li key={c.id} className="rounded-lg border bg-card px-4 py-3.5 sm:px-5">
                        <div className="flex items-start gap-3">
                            <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 sm:gap-5">
                                <Markdown className="min-w-0 font-semibold [&_p]:my-0">{c.front}</Markdown>
                                <Markdown className="min-w-0 text-muted-foreground [&_p]:my-0">{c.back}</Markdown>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <StatusBadge status={c.status} className="hidden sm:inline-flex" />
                                <FlashcardAdminRow id={c.id} status={c.status} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
