"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeQuestion, SessionTopic } from "@/app/(app)/practice/types";
import { Progress } from "@/components/ui/progress";
import type { Mastery } from "@/lib/mastery";
import { QuestionView, type QuestionOutcome } from "./question-view";
import { SessionSummary } from "./session-summary";

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

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground">{session.description}</p>
                <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-1 text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
                >
                    {finished ? "Session complete" : session.title}
                </h1>
            </div>

            {!finished && (
                <div className="mb-6 space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span aria-live="polite">
                            Question <span className="font-medium text-foreground tabular-nums">{index + 1}</span> of{" "}
                            <span className="tabular-nums">{questions.length}</span>
                        </span>
                        {possible > 0 && (
                            <span className="tabular-nums">
                                {earned}/{possible} marks
                            </span>
                        )}
                    </div>
                    <Progress
                        value={(index / questions.length) * 100}
                        aria-label={`Question ${index + 1} of ${questions.length}`}
                    />
                </div>
            )}

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
                <QuestionView
                    key={question.id}
                    question={question}
                    topic={topic}
                    isLast={index === questions.length - 1}
                    ai={ai}
                    onAiRemaining={(remaining) => setAi((a) => ({ ...a, remaining }))}
                    onOutcome={onOutcome}
                    onNext={next}
                />
            )}
        </div>
    );
}
