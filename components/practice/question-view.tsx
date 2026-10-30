"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, ClipboardCheck, Loader2, Sparkles, X } from "lucide-react";
import { markWithAi, revealMarkScheme, submitMcq, submitSelfMark } from "@/app/(app)/practice/actions";
import type { MarkSchemeView, PracticeQuestion, SessionTopic } from "@/app/(app)/practice/types";
import { Markdown } from "@/components/markdown";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
        <Card className="gap-5">
            <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="secondary">{typeLabel[question.type]}</Badge>
                    <Badge variant="outline">{difficultyLabel[question.difficulty]}</Badge>
                    <span className="ml-auto font-medium text-muted-foreground tabular-nums">
                        {question.marks} mark{question.marks === 1 ? "" : "s"}
                    </span>
                </div>
                {topic && (
                    <p className="text-xs text-muted-foreground">
                        {topic.unitCode} · {topic.code} {topic.name}
                    </p>
                )}
            </CardHeader>
            <CardContent>
                <Markdown>{question.stem}</Markdown>
            </CardContent>
            {question.type === "MCQ" ? <McqBody {...props} /> : <WrittenBody {...props} />}
        </Card>
    );
}

// ─── Shared bits ─────────────────────────────────────────────────────────────

function ScoreBanner({ marks, max }: { marks: number; max: number }) {
    const ratio = max > 0 ? marks / max : 0;
    const tone =
        ratio >= 0.75
            ? "border-success/30 bg-success/10 text-success"
            : ratio >= 0.4
              ? "border-warning/40 bg-warning/10 text-amber-700 dark:text-warning"
              : "border-destructive/30 bg-destructive/10 text-destructive";
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
        <div role="status" className={cn("flex items-center justify-between rounded-lg border px-4 py-3", tone)}>
            <span className="font-medium">{message}</span>
            <span className="text-lg font-semibold tabular-nums">
                {marks}/{max}
            </span>
        </div>
    );
}

function Explanation({ text }: { text: string | null }) {
    if (!text) return null;
    return (
        <div className="rounded-lg bg-muted/60 px-4 py-3">
            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Explanation</p>
            <Markdown>{text}</Markdown>
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

function NextButton({ isLast, onNext }: { isLast: boolean; onNext: () => void }) {
    return (
        <Button onClick={onNext} autoFocus className="w-full sm:w-auto">
            {isLast ? "See results" : "Next question"}
            <ArrowRight />
        </Button>
    );
}

function SkipButton({ props, disabled }: { props: Props; disabled?: boolean }) {
    const { question, onOutcome, onNext } = props;
    return (
        <Button
            variant="ghost"
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
            <CardContent className="space-y-4">
                <RadioGroup
                    value={selected}
                    onValueChange={setSelected}
                    disabled={!!result || pending}
                    aria-label="Answer options"
                    className="gap-2"
                >
                    {question.options.map((o) => {
                        const isCorrect = result && o.id === result.correctOptionId;
                        const isWrongPick = result && o.id === selected && !isCorrect;
                        return (
                            <Label
                                key={o.id}
                                htmlFor={`opt-${o.id}`}
                                className={cn(
                                    "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm leading-normal font-normal transition-colors select-text",
                                    !result &&
                                        "hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5",
                                    result && "cursor-default",
                                    isCorrect && "border-success/50 bg-success/10",
                                    isWrongPick && "border-destructive/50 bg-destructive/10",
                                )}
                            >
                                <RadioGroupItem value={o.id} id={`opt-${o.id}`} className="mt-0.5" />
                                <span className="w-4 shrink-0 font-semibold">{o.label}</span>
                                <Markdown className="min-w-0 flex-1 [&_p]:my-0!">{o.text}</Markdown>
                                {isCorrect && (
                                    <Check
                                        className="mt-0.5 size-4 shrink-0 text-success"
                                        aria-label="Correct answer"
                                    />
                                )}
                                {isWrongPick && (
                                    <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="Your answer" />
                                )}
                            </Label>
                        );
                    })}
                </RadioGroup>
                {result && (
                    <>
                        <ScoreBanner marks={result.marks} max={question.marks} />
                        <Explanation text={result.explanation} />
                    </>
                )}
                <ErrorNote error={error} />
            </CardContent>
            <CardFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {result ? (
                    <NextButton isLast={isLast} onNext={onNext} />
                ) : (
                    <>
                        <SkipButton props={props} disabled={pending} />
                        <Button onClick={submit} disabled={!selected || pending} className="w-full sm:w-auto">
                            {pending && <Loader2 className="animate-spin" />}
                            Check answer
                        </Button>
                    </>
                )}
            </CardFooter>
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

    return (
        <>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={answerId}>Your answer</Label>
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
                            question.type === "LONG" ? "min-h-48" : "min-h-28",
                            locked && "bg-muted/40 text-muted-foreground",
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
                        <ScoreBanner marks={phase.marks} max={question.marks} />
                        <SelfMarkList
                            scheme={phase.scheme}
                            ticked={phase.ticked}
                            disabled
                            marks={phase.marks}
                            max={question.marks}
                        />
                        <Explanation text={phase.scheme.explanation} />
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
                            <Button variant="outline" size="sm" onClick={() => setShowScheme(true)}>
                                <ClipboardCheck />
                                Show mark scheme
                            </Button>
                        )}
                    </>
                )}

                <ErrorNote error={error} />
            </CardContent>

            <CardFooter className="flex-col items-stretch gap-3">
                {phase.kind === "answering" && (
                    <>
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <SkipButton props={props} disabled={pending} />
                            <Button variant="outline" onClick={startSelf} disabled={!hasAnswer || pending}>
                                {pendingAction === "self" ? <Loader2 className="animate-spin" /> : <ClipboardCheck />}
                                Mark it myself
                            </Button>
                            <Button onClick={markAi} disabled={!hasAnswer || pending || !aiAvailable}>
                                {pendingAction === "ai" ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                {pendingAction === "ai" ? "Marking…" : "Mark with AI"}
                            </Button>
                        </div>
                        <p className="text-right text-xs text-muted-foreground">
                            {!ai.enabled
                                ? "AI marking isn't available right now — mark it yourself against the mark scheme."
                                : ai.remaining === 0
                                  ? "You've used today's AI marks (resets at midnight UTC). Mark it yourself for now."
                                  : `${ai.remaining} AI mark${ai.remaining === 1 ? "" : "s"} left today.`}
                        </p>
                    </>
                )}
                {phase.kind === "self" && (
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button onClick={saveSelf} disabled={pending}>
                            {pendingAction === "save" && <Loader2 className="animate-spin" />}
                            Save {tickedMarks}/{question.marks} marks
                        </Button>
                    </div>
                )}
                {(phase.kind === "selfDone" || phase.kind === "aiDone") && (
                    <div className="flex justify-end">
                        <NextButton isLast={isLast} onNext={onNext} />
                    </div>
                )}
            </CardFooter>
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
        <fieldset className="space-y-3 rounded-lg border p-4">
            <legend className="px-1 text-sm font-medium">Mark scheme</legend>
            {!disabled && (
                <p className="text-sm text-muted-foreground">
                    Tick each point your answer clearly makes. Be strict — an examiner would be.
                </p>
            )}
            {scheme.notes.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    {scheme.notes.map((n, i) => (
                        <Markdown key={i} className="[&_p]:my-0.5!">
                            {n}
                        </Markdown>
                    ))}
                </div>
            )}
            <ul className="space-y-2">
                {scheme.points.map((p, i) => {
                    const id = `pt-${i}`;
                    return (
                        <li key={i} className="flex items-start gap-3">
                            <Checkbox
                                id={id}
                                checked={ticked.includes(i)}
                                onCheckedChange={(v) => onToggle?.(i, v === true)}
                                disabled={disabled}
                                className="mt-1"
                            />
                            <Label
                                htmlFor={id}
                                className="block flex-1 cursor-pointer text-sm leading-normal font-normal select-text peer-disabled:cursor-default peer-disabled:opacity-100"
                            >
                                <Markdown className="[&_p]:my-0!">{p.text}</Markdown>
                            </Label>
                            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">({p.marks})</span>
                        </li>
                    );
                })}
            </ul>
            <p className="text-right text-sm font-medium tabular-nums" aria-live="polite">
                {marks}/{max} marks
            </p>
        </fieldset>
    );
}

function MarkSchemeList({ scheme }: { scheme: MarkSchemeView }) {
    return (
        <div className="rounded-lg border p-4">
            <p className="mb-2 text-sm font-medium">Mark scheme</p>
            {scheme.notes.map((n, i) => (
                <Markdown key={`n${i}`} className="text-sm text-muted-foreground [&_p]:my-0.5!">
                    {n}
                </Markdown>
            ))}
            <ul className="space-y-1.5">
                {scheme.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                        <Markdown className="flex-1 [&_p]:my-0!">{p.text}</Markdown>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">({p.marks})</span>
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
        <div className="space-y-3 rounded-lg border p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="size-4 text-primary" aria-hidden />
                AI examiner feedback
            </p>
            {feedback && <Markdown>{feedback}</Markdown>}
            {points.length > 0 && (
                <ul className="space-y-2">
                    {points.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                            {p.awarded ? (
                                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-label="Awarded" />
                            ) : (
                                <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="Not awarded" />
                            )}
                            <div className="min-w-0">
                                <Markdown className="[&_p]:my-0!">{p.point}</Markdown>
                                {p.comment && <p className="text-muted-foreground">{p.comment}</p>}
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
