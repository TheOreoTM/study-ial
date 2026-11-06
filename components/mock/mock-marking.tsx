"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { markMock, suggestMockMarks } from "@/app/(app)/mock/actions";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type MarkingQuestion = {
    id: string;
    number: number;
    marks: number;
    stem: string;
    answer: string;
    points: { text: string; marks: number }[];
    notes: string[];
    translation: string | null;
    /** AI suggestions are allowed for this question (AI on, quota left, not Dhivehi) */
    aiAllowed: boolean;
};

/** Self-marking every written answer on a handed-in paper, then finishing it. */
export function MockMarking({
    mockId,
    questions,
    mcqMarks,
    mcqPossible,
}: {
    mockId: string;
    questions: MarkingQuestion[];
    mcqMarks: number;
    mcqPossible: number;
}) {
    const router = useRouter();
    const [ticks, setTicks] = useState<Record<string, number[]>>({});
    const [comments, setComments] = useState<Record<string, string[]>>({});
    const [suggesting, setSuggesting] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    async function suggest(questionId: string) {
        setSuggesting(questionId);
        const res = await suggestMockMarks({ id: mockId, questionId }).catch(() => null);
        setSuggesting(null);
        if (!res || !res.ok) return void toast.error(res?.error ?? "The AI marker couldn't help. Mark it yourself.");
        setTicks((t) => ({ ...t, [questionId]: res.ticks }));
        setComments((c) => ({ ...c, [questionId]: res.comments }));
        toast("Suggested marks ticked. Check each one before you finish.");
    }

    const marksFor = (q: MarkingQuestion) =>
        Math.min(
            q.marks,
            (ticks[q.id] ?? []).reduce((n, i) => n + (q.points[i]?.marks ?? 0), 0),
        );
    const written = questions.reduce((n, q) => n + marksFor(q), 0);

    function toggle(q: string, i: number, on: boolean) {
        setTicks((t) => {
            const cur = new Set(t[q] ?? []);
            if (on) cur.add(i);
            else cur.delete(i);
            return { ...t, [q]: [...cur].sort((a, b) => a - b) };
        });
    }

    function finish() {
        startTransition(async () => {
            const res = await markMock({ id: mockId, ticks });
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            router.refresh();
        });
    }

    return (
        <div className="grid gap-5">
            <div className="rounded-xl bg-muted p-5 sm:p-6">
                <p className="text-[1.0625rem]">
                    Multiple choice is marked:{" "}
                    <span className="num">
                        {mcqMarks}/{mcqPossible}
                    </span>{" "}
                    marks. Now mark your written answers. Tick each point your answer clearly makes, and be as strict
                    as an examiner would be.
                </p>
            </div>

            <ol className="grid gap-5">
                {questions.map((q) => (
                    <li key={q.id} className="rounded-xl border bg-card p-5 shadow-card sm:p-7">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-lg">Question {q.number}</h2>
                            <span className="num rounded-full bg-muted px-2.5 py-1 text-sm leading-none" aria-live="polite">
                                {marksFor(q)}/{q.marks}
                                <span className="sr-only"> marks</span>
                            </span>
                        </div>
                        <Markdown className="max-w-[62ch] text-[1.0625rem] font-semibold [&_p]:my-1.5">{q.stem}</Markdown>
                        <h3 className="mt-4 mb-1 text-base">Your answer</h3>
                        <p className="rounded-lg bg-muted px-4 py-3 whitespace-pre-wrap">{q.answer}</p>

                        <fieldset className="mt-4 grid gap-2">
                            <legend className="mb-2 font-display text-base font-extrabold">Mark scheme</legend>
                            {q.notes.map((n, i) => (
                                <Markdown key={i} className="text-sm text-muted-foreground [&_p]:my-0.5">
                                    {n}
                                </Markdown>
                            ))}
                            <ul className="grid gap-2">
                                {q.points.map((p, i) => {
                                    const id = `${q.id}-pt-${i}`;
                                    const on = (ticks[q.id] ?? []).includes(i);
                                    return (
                                        <li
                                            key={i}
                                            className={cn(
                                                "flex items-start gap-3 rounded-lg px-3.5 py-3 transition-[background-color,box-shadow] duration-200 ease-out-soft",
                                                on ? "bg-selected shadow-[inset_0_0_0_2px_var(--progress)]" : "bg-muted",
                                            )}
                                        >
                                            <Checkbox
                                                id={id}
                                                checked={on}
                                                onCheckedChange={(v) => toggle(q.id, i, v === true)}
                                                className="mt-0.5"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <Label
                                                    htmlFor={id}
                                                    className="block cursor-pointer text-[0.9375rem] leading-normal font-semibold select-text"
                                                >
                                                    <Markdown className="text-[0.9375rem] [&_p]:my-0">{p.text}</Markdown>
                                                </Label>
                                                {comments[q.id]?.[i] && (
                                                    <p className="mt-1 flex items-start gap-1.5 text-[0.8125rem] text-muted-foreground">
                                                        <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                                                        <span>
                                                            <span className="sr-only">AI comment: </span>
                                                            {comments[q.id][i]}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                            <span className="num shrink-0 rounded-full bg-card px-2 py-1 text-xs leading-none text-muted-foreground">
                                                {p.marks}
                                                <span className="sr-only"> mark{p.marks === 1 ? "" : "s"}</span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                            {q.translation && (
                                <Markdown className="mt-1 rounded-lg bg-muted px-4 py-3 text-sm [&_p]:my-0.5">
                                    {q.translation}
                                </Markdown>
                            )}
                        </fieldset>
                        {q.aiAllowed && (
                            <div className="mt-3 flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={suggesting !== null || pending}
                                    onClick={() => suggest(q.id)}
                                >
                                    {suggesting === q.id ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                    Suggest marks with AI
                                </Button>
                            </div>
                        )}
                    </li>
                ))}
            </ol>

            <div className="flex flex-col items-stretch gap-3 rounded-xl bg-muted p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[1.0625rem] font-bold">
                    Written: <span className="num">{written}</span> marks so far
                </p>
                <Button onClick={finish} disabled={pending} size="lg">
                    {pending ? <Loader2 className="animate-spin" /> : <CircleCheck />}
                    Finish marking
                </Button>
            </div>
        </div>
    );
}
