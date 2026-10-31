"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, ClipboardCheck, Loader2, Sparkles, X } from "lucide-react";
import { markWithAi, revealMarkScheme, submitMcq, submitSelfMark } from "@/app/(app)/practice/actions";
import type { MarkSchemeView, PracticeQuestion, SessionTopic } from "@/app/(app)/practice/types";
import { Markdown } from "@/components/markdown";
import { QuestionTutor } from "@/components/tutor/question-tutor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { Mastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";
import type { AiState } from "./practice-session";

export type QuestionOutcome = {
    questionId: string;
    topicId: string;
    marksAwarded: number;
    maxMarks: number;
    skipped: boolean;
};

type MasteryUpdate = { topicId: string; mastery: Mastery };

type Props = {
    question: PracticeQuestion;
    topic?: SessionTopic;
    isLast: boolean;
    ai: AiState;
    onAiRemaining: (remaining: number) => void;
    onOutcome: (o: QuestionOutcome, update?: MasteryUpdate) => void;
    onNext: () => void;
};

const typeLabel: Record<PracticeQuestion["type"], string> = {
    MCQ: "Multiple choice",
    SHORT: "Short answer",
    CALCULATION: "Calculation",
    LONG: "Extended response",
};

const difficultyLabel: Record<PracticeQuestion["difficulty"], string> = {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
};

export function QuestionView(props: Props) {
    const { question, topic } = props;
    return (
        <>
            <div className="grid gap-3">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold text-muted-foreground">
                    <span>{typeLabel[question.type]}</span>
                    <span aria-hidden>·</span>
                    <span>{difficultyLabel[question.difficulty]}</span>
                    <span aria-hidden>·</span>
                    <span className="tabular-nums">
                        {question.marks} mark{question.marks === 1 ? "" : "s"}
                    </span>
                    {topic && (
                        <>
                            <span aria-hidden>·</span>
                            <span>
                                {topic.unitCode} {topic.code} {topic.name}
                            </span>
                        </>
                    )}
                </p>
                <Markdown className="max-w-[62ch] text-[1.125rem] leading-normal font-semibold sm:text-[1.25rem]">
                    {question.stem}
                </Markdown>
            </div>
            {question.type === "MCQ" ? <McqBody {...props} /> : <WrittenBody {...props} />}
        </>
    );
}

// ─── Shared bits ─────────────────────────────────────────────────────────────

function ScoreBanner({
    marks,
    max,
    children,
}: {
    marks: number;
    max: number;
    /** Explanation or other notes shown under the result line. */
    children?: React.ReactNode;
}) {
    const ratio = max > 0 ? marks / max : 0;
    const tone =
        ratio >= 0.75
            ? "text-mastery-strong-text"
            : ratio >= 0.4
              ? "text-mastery-developing-text"
              : "text-mastery-weak-text";
    const message =
        ratio === 1
            ? "Full marks"
            : ratio >= 0.75
              ? "Nice work"
              : ratio >= 0.4
                ? "Partly there"
                : ratio > 0
                  ? "A few marks"
                  : "Not this time";
    return (
        <div className="grid gap-2 rounded-lg bg-muted px-4 py-4 animate-in duration-200 ease-out-soft fade-in slide-in-from-bottom-1 sm:px-5">
            <p role="status" className="flex items-baseline justify-between gap-3">
                <span className={cn("font-display text-xl leading-tight font-extrabold", tone)}>{message}</span>
                <span className="text-[0.9375rem] font-bold text-muted-foreground tabular-nums">
                    {marks} / {max} mark{max === 1 ? "" : "s"}
                </span>
            </p>
            {children}
        </div>
    );
}

function Explanation({ text, bare = false }: { text: string | null; bare?: boolean }) {
    if (!text) return null;
    return (
        <div className={cn(!bare && "rounded-lg bg-muted px-4 py-4 sm:px-5")}>
            <p className="text-sm font-extrabold">Explanation</p>
            <Markdown className="[&>p:first-child]:mt-1">{text}</Markdown>
        </div>
    );
}

function ErrorNote({ error }: { error: string | null }) {
    if (!error) return null;
    return (
        <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
}

function Actions({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:flex-wrap sm:justify-end [&>*]:w-full sm:[&>*]:w-auto",
                className,
            )}
        >
            {children}
        </div>
    );
}

function NextButton({ isLast, onNext }: { isLast: boolean; onNext: () => void }) {
    // autoFocus: "Check" is replaced by this button, so keyboard focus carries over to the next action.
    return (
        <Button onClick={onNext} autoFocus>
            {isLast ? "See results" : "Next question"}
            <ArrowRight />
        </Button>
    );
}

function SkipButton({ props, disabled }: { props: Props; disabled?: boolean }) {
    const { question, onOutcome, onNext } = props;
    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={() => {
                onOutcome({
                    questionId: question.id,
                    topicId: question.topicId,
                    marksAwarded: 0,
                    maxMarks: question.marks,
                    skipped: true,
                });
                onNext();
            }}
        >
            Skip
        </Button>
    );
}

// ─── Multiple choice ─────────────────────────────────────────────────────────

function McqBody(props: Props) {
    const { question, onOutcome, isLast, onNext } = props;
    const [selected, setSelected] = useState<string>("");
    const [result, setResult] = useState<{
        correctOptionId: string | null;
        marks: number;
        explanation: string | null;
    }>();
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const submit = () =>
        startTransition(async () => {
            setError(null);
            const res = await submitMcq({ questionId: question.id, optionId: selected }).catch(() => null);
            if (!res || !res.ok) return setError(res?.error ?? "Couldn't save your answer. Check your connection.");
            setResult({ correctOptionId: res.correctOptionId, marks: res.marksAwarded, explanation: res.explanation });
            onOutcome(
                {
                    questionId: question.id,
                    topicId: question.topicId,
                    marksAwarded: res.marksAwarded,
                    maxMarks: question.marks,
                    skipped: false,
                },
                { topicId: res.topicId, mastery: res.mastery },
            );
        });

    return (
        <>
            <RadioGroup
                value={selected}
                onValueChange={setSelected}
                disabled={!!result || pending}
                aria-label="Answer options"
                className="gap-3"
            >
                {question.options.map((o) => {
                    const isSelected = o.id === selected;
                    const isCorrect = !!result && o.id === result.correctOptionId;
                    const isWrongPick = !!result && isSelected && !isCorrect;
                    const state = !result
                        ? isSelected
                            ? "selected"
                            : "idle"
                        : isCorrect
                          ? "correct"
                          : isWrongPick
                            ? "wrong"
                            : "dim";
                    return (
                        <label
                            key={o.id}
                            htmlFor={`opt-${o.id}`}
                            data-state={state}
                            className={cn(
                                "relative grid min-h-[60px] grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-lg py-2.5 pr-4 pl-2.5 transition-[background-color,box-shadow,color] duration-200 ease-out-soft select-text has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring sm:pr-5",
                                state === "idle" &&
                                    "cursor-pointer bg-card shadow-[inset_0_0_0_1.5px_var(--border)] hover:shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
                                state === "selected" &&
                                    "cursor-pointer bg-selected shadow-[inset_0_0_0_2px_var(--progress)]",
                                state === "correct" &&
                                    "bg-mastery-strong-pale shadow-[inset_0_0_0_2px_var(--mastery-strong-text)]",
                                state === "wrong" &&
                                    "bg-mastery-weak-pale shadow-[inset_0_0_0_2px_var(--mastery-weak-text)]",
                                state === "dim" &&
                                    "bg-card text-muted-foreground shadow-[inset_0_0_0_1.5px_var(--border)]",
                            )}
                        >
                            <RadioGroupItem value={o.id} id={`opt-${o.id}`} className="sr-only" />
                            <span
                                aria-hidden
                                className={cn(
                                    "grid size-10 place-items-center rounded-[12px] font-display text-lg leading-none font-extrabold transition-colors duration-200 ease-out-soft",
                                    state === "idle" && "bg-muted text-foreground",
                                    state === "dim" && "bg-muted text-muted-foreground",
                                    state === "selected" && "bg-progress text-card",
                                    state === "correct" && "bg-mastery-strong-text text-card",
                                    state === "wrong" && "bg-mastery-weak-text text-card",
                                )}
                            >
                                {state === "correct" ? (
                                    <Check className="size-5" strokeWidth={3.5} />
                                ) : state === "wrong" ? (
                                    <X className="size-5" strokeWidth={3.5} />
                                ) : (
                                    o.label
                                )}
                            </span>
                            <span className="min-w-0">
                                <span className="sr-only">{o.label}. </span>
                                <Markdown className="text-base leading-snug font-semibold [&_p]:my-0">
                                    {o.text}
                                </Markdown>
                                {state === "correct" && <span className="sr-only"> (correct answer)</span>}
                                {state === "wrong" && <span className="sr-only"> (your answer)</span>}
                            </span>
                        </label>
                    );
                })}
            </RadioGroup>
            {result && (
                <ScoreBanner marks={result.marks} max={question.marks}>
                    <Explanation text={result.explanation} bare />
                </ScoreBanner>
            )}
            {result && props.ai.enabled && <QuestionTutor questionId={question.id} />}
            <ErrorNote error={error} />
            <Actions>
                {result ? (
                    <NextButton isLast={isLast} onNext={onNext} />
                ) : (
                    <>
                        <SkipButton props={props} disabled={pending} />
                        <Button onClick={submit} disabled={!selected || pending}>
                            {pending && <Loader2 className="animate-spin" />}
                            Check answer
                        </Button>
                    </>
                )}
            </Actions>
        </>
    );
}

// ─── Written (short / calculation / long) ───────────────────────────────────

type WrittenPhase =
    | { kind: "answering" }
    | { kind: "self"; scheme: MarkSchemeView; ticked: number[] }
    | { kind: "selfDone"; scheme: MarkSchemeView; ticked: number[]; marks: number }
    | {
          kind: "aiDone";
          scheme: MarkSchemeView;
          marks: number;
          feedback: string;
          points: { point: string; awarded: boolean; comment: string }[];
      };

function WrittenBody(props: Props) {
    const { question, ai, onAiRemaining, onOutcome, isLast, onNext } = props;
    const [answer, setAnswer] = useState("");
    const [phase, setPhase] = useState<WrittenPhase>({ kind: "answering" });
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const [pendingAction, setPendingAction] = useState<"ai" | "self" | "save" | null>(null);
    const [showScheme, setShowScheme] = useState(false);

    const hasAnswer = answer.trim().length > 0;
    const locked = phase.kind !== "answering";
    const aiAvailable = ai.enabled && ai.remaining > 0;
    const answerId = `answer-${question.id}`;

    const record = (marks: number, update: MasteryUpdate) =>
        onOutcome(
            {
                questionId: question.id,
                topicId: question.topicId,
                marksAwarded: marks,
                maxMarks: question.marks,
                skipped: false,
            },
            update,
        );

    const run = (which: "ai" | "self" | "save", fn: () => Promise<void>) => {
        setPendingAction(which);
        setError(null);
        startTransition(async () => {
            try {
                await fn();
            } catch {
                setError("Something went wrong. Check your connection and try again.");
            } finally {
                setPendingAction(null);
            }
        });
    };

    const markAi = () =>
        run("ai", async () => {
            const res = await markWithAi({ questionId: question.id, answer });
            if (!res.ok) return setError(res.error);
            onAiRemaining(res.remaining);
            setPhase({
                kind: "aiDone",
                scheme: res.markScheme,
                marks: res.marksAwarded,
                feedback: res.feedback,
                points: res.points,
            });
            record(res.marksAwarded, { topicId: res.topicId, mastery: res.mastery });
        });

    const startSelf = () =>
        run("self", async () => {
            const res = await revealMarkScheme({ questionId: question.id });
            if (!res.ok) return setError(res.error);
            setPhase({
                kind: "self",
                scheme: { points: res.points, notes: res.notes, explanation: res.explanation },
                ticked: [],
            });
        });

    const saveSelf = () => {
        if (phase.kind !== "self") return;
        const { scheme, ticked } = phase;
        run("save", async () => {
            const res = await submitSelfMark({ questionId: question.id, answer, ticked });
            if (!res.ok) return setError(res.error);
            setPhase({ kind: "selfDone", scheme, ticked, marks: res.marksAwarded });
            record(res.marksAwarded, { topicId: res.topicId, mastery: res.mastery });
        });
    };

    const toggle = (i: number, on: boolean) => {
        if (phase.kind !== "self") return;
        setPhase({ ...phase, ticked: on ? [...phase.ticked, i] : phase.ticked.filter((t) => t !== i) });
    };

    const tickedMarks =
        phase.kind === "self" || phase.kind === "selfDone"
            ? Math.min(
                  phase.ticked.reduce((n, i) => n + (phase.scheme.points[i]?.marks ?? 0), 0),
                  question.marks,
              )
            : 0;

    const selfButton = (
        <Button variant={aiAvailable ? "outline" : "default"} onClick={startSelf} disabled={!hasAnswer || pending}>
            {pendingAction === "self" ? <Loader2 className="animate-spin" /> : <ClipboardCheck />}
            Mark it myself
        </Button>
    );
    const aiButton = (
        <Button
            variant={aiAvailable ? "default" : "outline"}
            onClick={markAi}
            disabled={!hasAnswer || pending || !aiAvailable}
        >
            {pendingAction === "ai" ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {pendingAction === "ai" ? "Marking…" : "Mark with AI"}
        </Button>
    );

    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor={answerId} className="text-[0.9375rem]">
                    Your answer
                </Label>
                <Textarea
                    id={answerId}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    readOnly={locked}
                    disabled={pending && !locked}
                    maxLength={5000}
                    placeholder={
                        question.type === "CALCULATION"
                            ? "Show your working — method marks count."
                            : "Write your answer as you would in the exam."
                    }
                    className={cn(
                        "rounded-lg px-4 py-3 text-base! leading-relaxed",
                        question.type === "LONG" ? "min-h-48" : "min-h-32",
                        locked && "border-border bg-muted text-muted-foreground hover:border-border",
                    )}
                />
            </div>

            {phase.kind === "self" && (
                <SelfMarkList
                    scheme={phase.scheme}
                    ticked={phase.ticked}
                    onToggle={toggle}
                    disabled={pending}
                    marks={tickedMarks}
                    max={question.marks}
                />
            )}

            {phase.kind === "selfDone" && (
                <>
                    <ScoreBanner marks={phase.marks} max={question.marks}>
                        <Explanation text={phase.scheme.explanation} bare />
                    </ScoreBanner>
                    <SelfMarkList
                        scheme={phase.scheme}
                        ticked={phase.ticked}
                        disabled
                        marks={phase.marks}
                        max={question.marks}
                    />
                </>
            )}

            {phase.kind === "aiDone" && (
                <>
                    <ScoreBanner marks={phase.marks} max={question.marks} />
                    <AiFeedback feedback={phase.feedback} points={phase.points} />
                    {showScheme ? (
                        <>
                            <MarkSchemeList scheme={phase.scheme} />
                            <Explanation text={phase.scheme.explanation} />
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="justify-self-start"
                            onClick={() => setShowScheme(true)}
                        >
                            <ClipboardCheck />
                            Show mark scheme
                        </Button>
                    )}
                </>
            )}

            <ErrorNote error={error} />

            {phase.kind === "answering" && (
                <div className="grid gap-3">
                    <Actions>
                        <SkipButton props={props} disabled={pending} />
                        {/* The main action takes the orange and sits last (rightmost on desktop, top on phones):
                            AI marking when it's available, otherwise marking it yourself. */}
                        {aiAvailable ? (
                            <>
                                {selfButton}
                                {aiButton}
                            </>
                        ) : (
                            <>
                                {aiButton}
                                {selfButton}
                            </>
                        )}
                    </Actions>
                    <p className="text-sm text-muted-foreground sm:text-right">
                        {!ai.enabled
                            ? "AI marking isn't available right now — mark it yourself against the mark scheme."
                            : ai.remaining === 0
                              ? "You've used today's AI marks (resets at midnight UTC). Mark it yourself for now."
                              : `${ai.remaining} AI mark${ai.remaining === 1 ? "" : "s"} left today.`}
                    </p>
                </div>
            )}
            {phase.kind === "self" && (
                <Actions>
                    <Button onClick={saveSelf} disabled={pending}>
                        {pendingAction === "save" && <Loader2 className="animate-spin" />}
                        Save {tickedMarks}/{question.marks} marks
                    </Button>
                </Actions>
            )}
            {(phase.kind === "selfDone" || phase.kind === "aiDone") && ai.enabled && (
                <QuestionTutor questionId={question.id} />
            )}
            {(phase.kind === "selfDone" || phase.kind === "aiDone") && (
                <Actions>
                    <NextButton isLast={isLast} onNext={onNext} />
                </Actions>
            )}
        </>
    );
}

function SelfMarkList({
    scheme,
    ticked,
    onToggle,
    disabled,
    marks,
    max,
}: {
    scheme: MarkSchemeView;
    ticked: number[];
    onToggle?: (i: number, on: boolean) => void;
    disabled?: boolean;
    marks: number;
    max: number;
}) {
    return (
        <fieldset className="grid gap-3 rounded-lg bg-muted px-4 py-4 animate-in duration-200 ease-out-soft fade-in slide-in-from-bottom-1 sm:px-5">
            {/* Floated so the legend sits inside the panel instead of on its top edge. */}
            <legend className="float-left w-full font-display text-lg leading-tight font-extrabold">Mark scheme</legend>
            {!disabled && (
                <p className="clear-both text-sm text-muted-foreground">
                    Tick each point your answer clearly makes. Be strict — an examiner would be.
                </p>
            )}
            {scheme.notes.length > 0 && (
                <div className="clear-both text-sm text-muted-foreground">
                    {scheme.notes.map((n, i) => (
                        <Markdown key={i} className="text-sm [&_p]:my-0.5">
                            {n}
                        </Markdown>
                    ))}
                </div>
            )}
            <ul className="clear-both grid gap-2">
                {scheme.points.map((p, i) => {
                    const id = `pt-${i}`;
                    const on = ticked.includes(i);
                    return (
                        <li
                            key={i}
                            className={cn(
                                "flex items-start gap-3 rounded-lg px-3.5 py-3 transition-[background-color,box-shadow] duration-200 ease-out-soft",
                                on ? "bg-selected shadow-[inset_0_0_0_2px_var(--progress)]" : "bg-card",
                            )}
                        >
                            <Checkbox
                                id={id}
                                checked={on}
                                onCheckedChange={(v) => onToggle?.(i, v === true)}
                                disabled={disabled}
                                className="mt-0.5 disabled:opacity-100"
                            />
                            <Label
                                htmlFor={id}
                                className="block flex-1 cursor-pointer text-[0.9375rem] leading-normal font-semibold select-text peer-disabled:cursor-default peer-disabled:opacity-100"
                            >
                                <Markdown className="text-[0.9375rem] [&_p]:my-0">{p.text}</Markdown>
                            </Label>
                            <span className="num shrink-0 rounded-full bg-muted px-2 py-1 text-xs leading-none text-muted-foreground">
                                {p.marks}
                                <span className="sr-only"> mark{p.marks === 1 ? "" : "s"}</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
            <p className="text-right text-[0.9375rem] font-bold tabular-nums" aria-live="polite">
                {marks}/{max} marks
            </p>
        </fieldset>
    );
}

function MarkSchemeList({ scheme }: { scheme: MarkSchemeView }) {
    return (
        <div className="grid gap-2 rounded-lg bg-muted px-4 py-4 sm:px-5">
            <p className="font-display text-lg leading-tight font-extrabold">Mark scheme</p>
            {scheme.notes.map((n, i) => (
                <Markdown key={`n${i}`} className="text-sm text-muted-foreground [&_p]:my-0.5">
                    {n}
                </Markdown>
            ))}
            <ul className="grid gap-2">
                {scheme.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-lg bg-card px-3.5 py-3">
                        <Markdown className="flex-1 text-[0.9375rem] [&_p]:my-0">{p.text}</Markdown>
                        <span className="num shrink-0 rounded-full bg-muted px-2 py-1 text-xs leading-none text-muted-foreground">
                            {p.marks}
                            <span className="sr-only"> mark{p.marks === 1 ? "" : "s"}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function AiFeedback({
    feedback,
    points,
}: {
    feedback: string;
    points: { point: string; awarded: boolean; comment: string }[];
}) {
    return (
        <div className="grid gap-3 rounded-lg bg-muted px-4 py-4 sm:px-5">
            <p className="flex items-center gap-2 font-display text-lg leading-tight font-extrabold">
                <Sparkles className="size-4 text-muted-foreground" aria-hidden />
                AI examiner feedback
            </p>
            {feedback && <Markdown>{feedback}</Markdown>}
            {points.length > 0 && (
                <ul className="grid gap-2">
                    {points.map((p, i) => (
                        <li key={i} className="flex items-start gap-3 rounded-lg bg-card px-3.5 py-3 text-[0.9375rem]">
                            {p.awarded ? (
                                <Check
                                    className="mt-0.5 size-4 shrink-0 text-mastery-strong-text"
                                    strokeWidth={3}
                                    aria-label="Awarded"
                                />
                            ) : (
                                <X
                                    className="mt-0.5 size-4 shrink-0 text-mastery-weak-text"
                                    strokeWidth={3}
                                    aria-label="Not awarded"
                                />
                            )}
                            <div className="min-w-0">
                                <Markdown className="text-[0.9375rem] font-semibold [&_p]:my-0">{p.point}</Markdown>
                                {p.comment && (
                                    <Markdown className="mt-0.5 text-muted-foreground [&_p]:my-0">{p.comment}</Markdown>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <p className="text-xs text-muted-foreground">
                AI marking can make mistakes — check it against the mark scheme.
            </p>
        </div>
    );
}
