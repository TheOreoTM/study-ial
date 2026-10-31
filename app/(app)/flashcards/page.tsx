import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight, Layers } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatDueDay } from "@/components/flashcards/format";
import { PageHeader } from "@/components/page-header";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getDeckCounts, getFlashcardSummary } from "@/lib/queries/flashcards";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Flashcards", robots: { index: false } };

export default async function FlashcardsPage() {
    const user = await requireUser();
    const userUnits = await db.userUnit.findMany({
        where: { userId: user.id },
        include: {
            unit: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                    order: true,
                    subject: { select: { order: true } },
                    topics: { select: { id: true, code: true, name: true }, orderBy: { order: "asc" } },
                },
            },
        },
    });
    const units = userUnits.map((uu) => uu.unit).sort((a, b) => a.subject.order - b.subject.order || a.order - b.order);
    const topicIds = units.flatMap((u) => u.topics.map((t) => t.id));
    const [summary, counts] = await Promise.all([getFlashcardSummary(user.id), getDeckCounts(user.id, topicIds)]);
    const toReview = summary.due + summary.newToday;

    if (units.length === 0) {
        return (
            <>
                <PageHeader title="Flashcards" />
                <EmptyState
                    icon={BookOpen}
                    title="Add the units you're studying"
                    description="Each topic in your units has a deck of short recall cards."
                    action={
                        <Button asChild>
                            <Link href="/settings">Choose units</Link>
                        </Button>
                    }
                />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Flashcards"
                description="Short recall cards for every topic. Each card comes back just before you'd forget it."
                actions={
                    toReview > 0 ? (
                        <Button asChild size="lg">
                            <Link href="/flashcards/review">
                                <Layers />
                                Review {toReview} card{toReview === 1 ? "" : "s"}
                            </Link>
                        </Button>
                    ) : undefined
                }
            />

            <section aria-label="Today" className="mb-8 grid grid-cols-2 gap-3 sm:max-w-xl">
                <Stat label="Due today" value={summary.due} />
                <Stat label="New today" value={summary.newToday} hint={`of ${summary.unseen} not started`} />
            </section>
            {toReview === 0 && (
                <p className="-mt-4 mb-8 rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                    {summary.unseen === 0 && !summary.nextDue
                        ? "There are no cards for your units yet. Open a topic below to add your own."
                        : summary.nextDue
                          ? `You're done for today. Your next cards are due ${formatDueDay(summary.nextDue, summary.today)}.`
                          : "You're done for today."}
                </p>
            )}

            <div className="grid items-start gap-5 lg:grid-cols-2">
                {units.map((unit) => {
                    const unitDue = unit.topics.reduce((n, t) => n + (counts.get(t.id)?.due ?? 0), 0);
                    return (
                        <Card key={unit.id} className="gap-4 py-5 sm:py-6">
                            <div className="flex items-start justify-between gap-3 px-5 sm:px-6">
                                <div className="min-w-0">
                                    <UnitChip code={unit.code} />
                                    <h2 className="mt-2 text-lg leading-tight">{unit.name}</h2>
                                </div>
                                {unitDue > 0 && (
                                    <span className="num shrink-0 rounded-full bg-muted px-2.5 py-1 text-sm leading-none">
                                        {unitDue} due
                                    </span>
                                )}
                            </div>
                            <ul className="px-2.5 sm:px-3.5">
                                {unit.topics.map((t) => {
                                    const c = counts.get(t.id)!;
                                    return (
                                        <li key={t.id}>
                                            <Link
                                                href={`/flashcards/${t.id}`}
                                                className="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-200 ease-out-soft hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
                                            >
                                                <span className="num grid size-9 shrink-0 place-items-center rounded-[10px] bg-muted text-sm text-muted-foreground">
                                                    {t.code}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block leading-snug font-bold">{t.name}</span>
                                                    <span className="block text-[0.8125rem] text-muted-foreground">
                                                        {c.total === 0
                                                            ? "No cards yet"
                                                            : `${c.total} card${c.total === 1 ? "" : "s"}${c.due ? ` · ${c.due} due` : ""}${c.unseen ? ` · ${c.unseen} new` : ""}`}
                                                    </span>
                                                </span>
                                                <ChevronRight
                                                    className="size-4 shrink-0 text-muted-foreground"
                                                    aria-hidden
                                                />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
    return (
        <div className="rounded-xl border bg-card p-4 sm:px-5">
            <p className="text-[0.8125rem] font-bold text-muted-foreground">{label}</p>
            <p className="num mt-2 text-[1.75rem] leading-none">{value}</p>
            {hint && <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">{hint}</p>}
        </div>
    );
}
