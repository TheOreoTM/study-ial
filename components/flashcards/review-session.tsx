"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { gradeCard } from "@/app/(app)/flashcards/actions";
import { EmptyState } from "@/components/empty-state";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { ReviewCard } from "@/lib/queries/flashcards";
import type { Grade } from "@/lib/srs";

const gradeButtons: { grade: Grade; label: string; hint: string; key: string }[] = [
    { grade: "again", label: "Again", hint: "Didn't know it", key: "1" },
    { grade: "good", label: "Good", hint: "Got it", key: "2" },
    { grade: "easy", label: "Easy", hint: "Knew it instantly", key: "3" },
];

/**
 * One review pass: front → reveal → grade. "Again" sends the card to the back of today's queue once, so it's seen
 * again before the session ends.
 */
export function ReviewSession({
    cards,
    title,
    back,
    emptyMessage,
}: {
    cards: ReviewCard[];
    title: string;
    back: { href: string; label: string };
    /** Shown when there was nothing to review when the page opened */
    emptyMessage: string;
}) {
    // Props refresh when grading revalidates the page; the session works from the queue it started with.
    const [initial] = useState(cards);
    const [queue, setQueue] = useState(cards);
    const [revealed, setRevealed] = useState(false);
    const [done, setDone] = useState(0);
    const [repeated, setRepeated] = useState<Set<string>>(new Set());
    const [pending, startTransition] = useTransition();
    const card = queue[0];
    const total = initial.length + repeated.size;

    const grade = useCallback(
        (g: Grade) => {
            if (!card || pending) return;
            startTransition(async () => {
                const res = await gradeCard({ cardId: card.id, grade: g });
                if (!res.ok) {
                    toast.error(res.error);
                    return;
                }
                const again = g === "again" && !repeated.has(card.id);
                if (again) setRepeated((s) => new Set(s).add(card.id));
                setQueue((q) => (again ? [...q.slice(1), q[0]] : q.slice(1)));
                setDone((n) => n + 1);
                setRevealed(false);
            });
        },
        [card, pending, repeated],
    );

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")) return;
            if (!revealed && (e.key === " " || e.key === "Enter")) {
                e.preventDefault();
                setRevealed(true);
            } else if (revealed) {
                const b = gradeButtons.find((x) => x.key === e.key);
                if (b) grade(b.grade);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [revealed, grade]);

    if (initial.length === 0) {
        return (
            <EmptyState
                icon={CheckCircle2}
                title="Nothing to review right now"
                description={emptyMessage}
                action={
                    <Button asChild variant="outline">
                        <Link href={back.href}>{back.label}</Link>
                    </Button>
                }
            />
        );
    }

    if (!card) {
        return (
            <div className="mx-auto max-w-xl rounded-xl bg-muted px-6 py-12 text-center">
                <div className="mx-auto mb-4 grid size-14 place-items-center rounded-lg bg-card shadow-card">
                    <CheckCircle2 className="size-6 text-selected-foreground" aria-hidden />
                </div>
                <h1 className="text-2xl">Done for now</h1>
                <p className="mt-1.5 text-muted-foreground">
                    You reviewed {initial.length} card{initial.length === 1 ? "" : "s"}. They&apos;ll come back when
                    they&apos;re due.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <Button asChild>
                        <Link href="/practice?mode=weak">Practise weak topics</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={back.href}>{back.label}</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl">
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
                <Link href={back.href}>
                    <ArrowLeft />
                    {back.label}
                </Link>
            </Button>
            <div className="mb-4 flex items-baseline justify-between gap-3">
                <h1 className="min-w-0 truncate text-[1.625rem] leading-tight sm:text-[2rem]">{title}</h1>
                <p className="num shrink-0 text-muted-foreground" aria-live="polite">
                    <span className="sr-only">Card </span>
                    {Math.min(done + 1, total)}
                    <span aria-hidden> / </span>
                    <span className="sr-only"> of </span>
                    {total}
                </p>
            </div>
            <Progress value={(done / total) * 100} className="mb-6 h-2" aria-label="Review progress" />

            <article className="rounded-xl border bg-card p-5 shadow-card sm:p-8" aria-labelledby="card-front">
                <p className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold text-muted-foreground">
                    <span>
                        {card.topic.unitCode} · {card.topic.code} {card.topic.name}
                    </span>
                    {card.isNew && (
                        <span className="rounded-full bg-selected px-2 py-0.5 text-xs text-selected-foreground">New</span>
                    )}
                    {card.own && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Your card</span>}
                </p>
                <div id="card-front">
                    <Markdown className="max-w-[62ch] text-[1.125rem] font-semibold sm:text-[1.25rem] [&_p]:my-0">
                        {card.front}
                    </Markdown>
                </div>

                {revealed ? (
                    <div className="mt-6 rounded-lg bg-muted p-4 sm:p-5" aria-live="polite">
                        <Markdown className="max-w-[62ch] [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
                            {card.back}
                        </Markdown>
                    </div>
                ) : (
                    <div className="mt-8">
                        <Button size="lg" className="w-full sm:w-auto" onClick={() => setRevealed(true)}>
                            Show answer
                        </Button>
                        <p className="mt-2 hidden text-[0.8125rem] text-muted-foreground sm:block">
                            Try to recall it first. Press Space to reveal.
                        </p>
                    </div>
                )}
            </article>

            {revealed && (
                <div className="mt-5">
                    <p className="mb-3 font-bold">How well did you know it?</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {gradeButtons.map((b) => (
                            <Button
                                key={b.grade}
                                variant={b.grade === "good" ? "default" : "outline"}
                                disabled={pending}
                                onClick={() => grade(b.grade)}
                                className="h-auto min-h-14 flex-col gap-0 py-2"
                            >
                                <span className="flex items-center gap-1.5">
                                    {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                                    {b.label}
                                </span>
                                <span className="font-sans text-xs font-semibold opacity-80">{b.hint}</span>
                            </Button>
                        ))}
                    </div>
                    <p className="mt-2 hidden text-[0.8125rem] text-muted-foreground sm:block">Keys 1, 2 and 3 work too.</p>
                </div>
            )}
        </div>
    );
}
