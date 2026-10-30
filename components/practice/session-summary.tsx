"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Target } from "lucide-react";
import type { PracticeQuestion, SessionTopic } from "@/app/(app)/practice/types";
import { MasteryBadge } from "@/components/mastery/mastery-badge";
import { MasteryBar } from "@/components/mastery/mastery-bar";
import { MasteryTile } from "@/components/mastery/mastery-tile";
import { Button } from "@/components/ui/button";
import type { Mastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";
import type { QuestionOutcome } from "./question-view";
import { SessionProgress } from "./session-progress";

export function SessionSummary({
    questions,
    topics,
    outcomes,
    masteryAfter,
    back,
    againQuery,
}: {
    questions: PracticeQuestion[];
    topics: SessionTopic[];
    outcomes: Record<string, QuestionOutcome>;
    masteryAfter: Record<string, Mastery>;
    back: { href: string; label: string };
    againQuery: string;
}) {
    const router = useRouter();
    const answered = questions.map((q) => outcomes[q.id]).filter((o): o is QuestionOutcome => !!o && !o.skipped);
    const skipped = questions.length - answered.length;
    const earned = answered.reduce((n, o) => n + o.marksAwarded, 0);
    const possible = answered.reduce((n, o) => n + o.maxMarks, 0);
    const pct = possible > 0 ? Math.round((earned / possible) * 100) : null;

    const perTopic = topics
        .map((t) => {
            const os = answered.filter((o) => o.topicId === t.id);
            return {
                topic: t,
                answered: os.length,
                earned: os.reduce((n, o) => n + o.marksAwarded, 0),
                possible: os.reduce((n, o) => n + o.maxMarks, 0),
                after: masteryAfter[t.id] ?? t.before,
            };
        })
        .filter((r) => r.answered > 0);

    // Fresh session: a new nonce remounts the client state with newly picked questions.
    const start = (query: string) => router.push(`/practice?${query}${query ? "&" : ""}s=${Date.now().toString(36)}`);

    const headline =
        pct === null
            ? "No questions answered"
            : pct >= 80
              ? "Excellent session"
              : pct >= 60
                ? "Solid work"
                : pct >= 40
                  ? "Good practice — keep going"
                  : "Tough one — that's how you learn";

    return (
        <div className="grid gap-6">
            <section
                aria-label="Session score"
                className="grid gap-5 rounded-xl border bg-card p-6 text-center shadow-card sm:p-8"
            >
                <div className="grid gap-1">
                    <p className="font-display text-xl leading-tight font-extrabold">{headline}</p>
                    <p className="num text-[3.5rem] leading-none sm:text-[4rem]">{pct === null ? "—" : `${pct}%`}</p>
                    <p className="text-[0.9375rem] font-semibold text-muted-foreground tabular-nums">
                        {earned}/{possible} marks · {answered.length} answered
                        {skipped > 0 && ` · ${skipped} skipped`}
                    </p>
                </div>
                <SessionProgress questions={questions} outcomes={outcomes} current={-1} className="mx-auto w-full max-w-md" />
            </section>

            {perTopic.length > 0 && (
                <section className="grid gap-4 rounded-xl bg-muted p-5 sm:p-6" aria-labelledby="by-topic">
                    <h2 id="by-topic" className="text-lg leading-tight">
                        By topic
                    </h2>
                    <ul className="grid gap-2">
                        {perTopic.map(({ topic, earned, possible, after }) => {
                            const before = topic.before;
                            const delta =
                                after.score !== null ? Math.round(((after.score ?? 0) - (before.score ?? 0)) * 100) : 0;
                            return (
                                <li
                                    key={topic.id}
                                    className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-lg bg-card p-3 sm:p-4"
                                >
                                    <MasteryTile code={topic.code} level={after.level} className="row-span-3" />
                                    <div className="flex items-start justify-between gap-3">
                                        <Link
                                            href={topic.href}
                                            className="min-w-0 text-[0.9375rem] leading-snug font-bold underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-border-strong"
                                        >
                                            {topic.name}
                                        </Link>
                                        <span className="num shrink-0 text-lg leading-none">
                                            {earned}/{possible}
                                        </span>
                                    </div>
                                    <MasteryBar level={after.level} score={after.score} label={topic.name} />
                                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                        <MasteryBadge level={before.level} score={before.score} showScore />
                                        <ArrowRight className="size-3.5" aria-label="now" />
                                        <MasteryBadge level={after.level} score={after.score} showScore />
                                        {delta !== 0 && (
                                            <span
                                                className={cn(
                                                    "ml-1 text-sm font-extrabold tabular-nums",
                                                    delta > 0 ? "text-mastery-strong-text" : "text-mastery-weak-text",
                                                )}
                                            >
                                                {delta > 0 ? "+" : "\u2212"}
                                                {Math.abs(delta)} pts
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" asChild>
                    <Link href={back.href}>{back.label}</Link>
                </Button>
                <Button variant="outline" onClick={() => start("mode=weak")}>
                    <Target />
                    Weak topics
                </Button>
                <Button onClick={() => start(againQuery)} autoFocus>
                    <RotateCcw />
                    Practise again
                </Button>
            </div>
        </div>
    );
}
