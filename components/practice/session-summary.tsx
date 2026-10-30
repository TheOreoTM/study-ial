"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Target } from "lucide-react";
import type { PracticeQuestion, SessionTopic } from "@/app/(app)/practice/types";
import { MasteryBadge } from "@/components/mastery/mastery-badge";
import { MasteryBar } from "@/components/mastery/mastery-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Mastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";
import type { QuestionOutcome } from "./question-view";

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
        <div className="space-y-6">
            <Card>
                <CardContent className="flex flex-col items-center gap-2 py-4 text-center">
                    <p className="text-sm text-muted-foreground">{headline}</p>
                    <p className="text-5xl font-semibold tracking-tight tabular-nums">
                        {pct === null ? "—" : `${pct}%`}
                    </p>
                    <p className="text-sm text-muted-foreground tabular-nums">
                        {earned}/{possible} marks · {answered.length} answered
                        {skipped > 0 && ` · ${skipped} skipped`}
                    </p>
                </CardContent>
            </Card>

            {perTopic.length > 0 && (
                <Card className="gap-4">
                    <CardHeader>
                        <CardTitle>By topic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y">
                            {perTopic.map(({ topic, earned, possible, after }) => {
                                const before = topic.before;
                                const delta =
                                    after.score !== null
                                        ? Math.round(((after.score ?? 0) - (before.score ?? 0)) * 100)
                                        : 0;
                                return (
                                    <li key={topic.id} className="space-y-2 py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <Link
                                                href={topic.href}
                                                className="min-w-0 text-sm font-medium hover:underline"
                                            >
                                                <span className="text-muted-foreground">{topic.code}</span> {topic.name}
                                            </Link>
                                            <span className="shrink-0 text-sm tabular-nums">
                                                {earned}/{possible}
                                            </span>
                                        </div>
                                        <MasteryBar level={after.level} score={after.score} label={topic.name} />
                                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                            <MasteryBadge level={before.level} score={before.score} showScore />
                                            <ArrowRight className="size-3" aria-label="now" />
                                            <MasteryBadge level={after.level} score={after.score} showScore />
                                            {delta !== 0 && (
                                                <span
                                                    className={cn(
                                                        "ml-1 font-medium tabular-nums",
                                                        delta > 0 ? "text-success" : "text-destructive",
                                                    )}
                                                >
                                                    {delta > 0 ? "+" : ""}
                                                    {delta} pts
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
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
