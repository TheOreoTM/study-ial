"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PracticeQuestion, SessionTopic } from "@/app/(app)/practice/types";
import { Button } from "@/components/ui/button";
import { MASTERY_WINDOW, type Mastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";
import { QuestionView, type QuestionOutcome } from "./question-view";
import { SessionProgress } from "./session-progress";
import { SessionSummary } from "./session-summary";
import { TopicMasteryRow } from "./topic-mastery-row";

export type AiState = { enabled: boolean; remaining: number };

/**
 * Walks through a practice session one question at a time. All session state lives here, seeded once from
 * props — server re-renders (e.g. after an action revalidates) don't reset an in-progress session.
 */
export function PracticeSession(props: {
    title: string;
    description: string;
    questions: PracticeQuestion[];
    topics: SessionTopic[];
    back: { href: string; label: string };
    againQuery: string;
    ai: AiState;
}) {
    const [session] = useState(() => ({
        title: props.title,
        description: props.description,
        questions: props.questions,
        topics: props.topics,
        back: props.back,
        againQuery: props.againQuery,
    }));
    const [index, setIndex] = useState(0);
    const [outcomes, setOutcomes] = useState<Record<string, QuestionOutcome>>({});
    const [masteryAfter, setMasteryAfter] = useState<Record<string, Mastery>>({});
    const [ai, setAi] = useState(props.ai);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const { questions, topics } = session;
    const finished = index >= questions.length;
    const question = questions[index];
    const topic = question ? topics.find((t) => t.id === question.topicId) : undefined;

    const scored = Object.values(outcomes).filter((o) => !o.skipped);
    const earned = scored.reduce((n, o) => n + o.marksAwarded, 0);
    const possible = scored.reduce((n, o) => n + o.maxMarks, 0);

    const onOutcome = useCallback((o: QuestionOutcome, update?: { topicId: string; mastery: Mastery }) => {
        setOutcomes((prev) => ({ ...prev, [o.questionId]: o }));
        if (update) setMasteryAfter((prev) => ({ ...prev, [update.topicId]: update.mastery }));
    }, []);

    const next = useCallback(() => setIndex((i) => i + 1), []);

    // Move focus to the new question (or the summary) for keyboard and screen-reader users.
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        headingRef.current?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [index]);

    // Live mastery change for the topic on screen, in whole points.
    const live = topic ? (masteryAfter[topic.id] ?? topic.before) : undefined;
    const delta =
        topic && live && live.score !== null ? Math.round(((live.score ?? 0) - (topic.before.score ?? 0)) * 100) : 0;

    return (
        <div className={cn("mx-auto", finished ? "max-w-3xl" : "max-w-[1180px]")}>
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="text-sm font-bold text-muted-foreground">{session.description}</p>
                    <h1
                        ref={headingRef}
                        tabIndex={-1}
                        className="mt-1.5 text-[1.625rem] leading-[1.1] tracking-[-0.01em] outline-none sm:text-[2rem]"
                    >
                        {finished ? "Session complete" : session.title}
                    </h1>
                </div>
                {!finished && (
                    <Button asChild variant="outline" className="self-start sm:self-auto">
                        <Link href={session.back.href}>End session</Link>
                    </Button>
                )}
            </div>

            {finished ? (
                <SessionSummary
                    questions={questions}
                    topics={topics}
                    outcomes={outcomes}
                    masteryAfter={masteryAfter}
                    back={session.back}
                    againQuery={session.againQuery}
                />
            ) : (
                <div className="grid items-start gap-6 min-[960px]:grid-cols-[minmax(0,1fr)_380px] min-[960px]:gap-8">
                    <section
                        aria-label={`Question ${index + 1}`}
                        className="grid gap-6 rounded-xl border bg-card p-5 text-card-foreground shadow-card sm:p-8"
                    >
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between gap-3 text-[0.9375rem] font-bold">
                                <span aria-live="polite">
                                    Question <span className="tabular-nums">{index + 1}</span> of{" "}
                                    <span className="tabular-nums">{questions.length}</span>
                                </span>
                                {possible > 0 && (
                                    <span className="text-muted-foreground tabular-nums">
                                        {earned} of {possible} marks
                                    </span>
                                )}
                            </div>
                            <SessionProgress questions={questions} outcomes={outcomes} current={index} />
                        </div>

                        <QuestionView
                            key={question.id}
                            question={question}
                            topic={topics.length > 1 ? topic : undefined}
                            isLast={index === questions.length - 1}
                            ai={ai}
                            onAiRemaining={(remaining) => setAi((a) => ({ ...a, remaining }))}
                            onOutcome={onOutcome}
                            onNext={next}
                        />
                    </section>

                    <aside className="min-[960px]:sticky min-[960px]:top-24" aria-label="Topic mastery">
                        <section className="grid gap-4 rounded-xl bg-muted p-5 sm:p-6">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h2 className="text-lg leading-tight">
                                    {topics.length > 1 ? "Topics in this session" : "Your mastery"}
                                </h2>
                                {delta !== 0 && (
                                    <span
                                        className={cn(
                                            "text-sm font-extrabold tabular-nums",
                                            delta > 0 ? "text-mastery-strong-text" : "text-mastery-weak-text",
                                        )}
                                    >
                                        {delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`} this session
                                    </span>
                                )}
                            </div>
                            <ul className="grid gap-2">
                                {topics.map((t) => (
                                    <TopicMasteryRow
                                        key={t.id}
                                        code={t.code}
                                        name={t.name}
                                        mastery={masteryAfter[t.id] ?? t.before}
                                        current={t.id === topic?.id}
                                    />
                                ))}
                            </ul>
                            <p className="text-sm text-muted-foreground">
                                Mastery comes from your last {MASTERY_WINDOW} answers in each topic and updates as you go.
                            </p>
                        </section>
                    </aside>
                </div>
            )}
        </div>
    );
}
