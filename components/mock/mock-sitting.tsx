"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlarmClock, Check, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { abandonMock, saveMockAnswers, submitMock } from "@/app/(app)/mock/actions";
import type { MockAnswers } from "@/app/(app)/mock/answers";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatClock } from "@/lib/mock-exam";
import { cn } from "@/lib/utils";

export type SittingQuestion = {
    id: string;
    type: "MCQ" | "SHORT" | "CALCULATION" | "LONG";
    marks: number;
    stem: string;
    stemEn: string | null;
    options: { id: string; label: string; text: string }[];
};

const AUTOSAVE_MS = 10_000;
const WARN_SECONDS = 5 * 60;

export function MockSitting({
    mockId,
    questions,
    initialAnswers,
    endsAt,
    serverNow,
    expired,
}: {
    mockId: string;
    questions: SittingQuestion[];
    initialAnswers: MockAnswers;
    /** ISO instant the clock runs out */
    endsAt: string;
    /** ISO instant the page was rendered on the server, to correct for a wrong device clock */
    serverNow: string;
    /** Time already ran out before the page opened: hand in the last autosave straight away */
    expired: boolean;
}) {
    const router = useRouter();
    const [answers, setAnswers] = useState<MockAnswers>(initialAnswers);
    const [left, setLeft] = useState(() => Math.max(0, Math.floor((Date.parse(endsAt) - Date.parse(serverNow)) / 1000)));
    const [confirming, setConfirming] = useState(false);
    const [submitting, startSubmit] = useTransition();
    const [abandoning, startAbandon] = useTransition();
    const dirty = useRef(false);
    const answersRef = useRef(answers);
    const handedIn = useRef(false);
    const skew = useRef(0);

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const save = useCallback(async () => {
        if (!dirty.current || handedIn.current) return;
        dirty.current = false;
        const res = await saveMockAnswers({ id: mockId, answers: answersRef.current });
        if (!res.ok) dirty.current = true;
    }, [mockId]);

    const handIn = useCallback(
        (reason: "manual" | "time") => {
            if (handedIn.current) return;
            handedIn.current = true;
            startSubmit(async () => {
                // After the deadline the server ignores what we send and uses the last autosave.
                const res = await submitMock({ id: mockId, answers: answersRef.current });
                if (!res.ok) {
                    handedIn.current = false;
                    toast.error(res.error);
                    return;
                }
                if (reason === "time") toast("Time's up. Your paper has been handed in.");
                router.refresh();
            });
        },
        [mockId, router],
    );

    // Clock: measured against the server's time, ticking once a second.
    useEffect(() => {
        skew.current = Date.parse(serverNow) - Date.now();
        const end = Date.parse(endsAt);
        const tick = () => {
            const s = Math.max(0, Math.floor((end - (Date.now() + skew.current)) / 1000));
            setLeft(s);
            if (s === 0) handIn("time");
        };
        tick();
        const t = window.setInterval(tick, 1000);
        return () => window.clearInterval(t);
    }, [endsAt, serverNow, handIn]);

    useEffect(() => {
        if (expired) handIn("time");
    }, [expired, handIn]);

    // Autosave on a timer and whenever the tab is hidden (phone locked, app switched).
    useEffect(() => {
        const t = window.setInterval(save, AUTOSAVE_MS);
        const onHide = () => document.visibilityState === "hidden" && void save();
        document.addEventListener("visibilitychange", onHide);
        return () => {
            window.clearInterval(t);
            document.removeEventListener("visibilitychange", onHide);
        };
    }, [save]);

    function update(questionId: string, patch: { optionId?: string; answer?: string }) {
        dirty.current = true;
        setAnswers((a) => ({ ...a, [questionId]: { ...a[questionId], ...patch } }));
    }

    const isAnswered = (q: SittingQuestion) =>
        q.type === "MCQ" ? !!answers[q.id]?.optionId : !!answers[q.id]?.answer?.trim();
    const answeredCount = questions.filter(isAnswered).length;
    const unanswered = questions.length - answeredCount;
    const low = left <= WARN_SECONDS;

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
            {/* Clock and question map: a sticky bar on phones, a sticky rail from 1024px. */}
            <aside
                aria-label="Paper status"
                className="sticky top-16 z-20 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-24 lg:order-2 lg:mx-0 lg:rounded-xl lg:border-0 lg:bg-muted lg:p-5"
            >
                <div className="flex items-center justify-between gap-3 lg:block">
                    <div>
                        <p className="hidden text-sm font-bold text-muted-foreground lg:block">Time left</p>
                        <p
                            className={cn(
                                "num flex items-center gap-2 text-2xl leading-none lg:mt-1 lg:text-[2.5rem]",
                                low && "text-warning",
                            )}
                        >
                            <AlarmClock className="size-5 lg:hidden" aria-hidden />
                            <span>
                                <span className="sr-only">Time left: </span>
                                {formatClock(left)}
                            </span>
                        </p>
                        <p className="sr-only" aria-live="polite">
                            {low && left > 0 ? "Five minutes or less left." : ""}
                        </p>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground lg:mt-3">
                        <span className="num text-foreground">{answeredCount}</span> of {questions.length} answered
                    </p>
                    <Button onClick={() => setConfirming(true)} disabled={submitting} className="lg:hidden" size="sm">
                        {submitting ? <Loader2 className="animate-spin" /> : <Send />}
                        Hand in
                    </Button>
                </div>
                <nav aria-label="Questions" className="mt-3 hidden flex-wrap gap-1.5 lg:flex">
                    {questions.map((q, i) => (
                        <a
                            key={q.id}
                            href={`#q-${i + 1}`}
                            className={cn(
                                "num grid size-9 place-items-center rounded-[10px] text-sm transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                isAnswered(q) ? "bg-selected text-selected-foreground" : "bg-card text-muted-foreground",
                            )}
                        >
                            <span className="sr-only">Question </span>
                            {i + 1}
                            {isAnswered(q) && <span className="sr-only"> (answered)</span>}
                        </a>
                    ))}
                </nav>
                <Button onClick={() => setConfirming(true)} disabled={submitting} className="mt-5 hidden w-full lg:flex">
                    {submitting ? <Loader2 className="animate-spin" /> : <Send />}
                    Hand in paper
                </Button>
            </aside>

            <ol className="grid min-w-0 gap-5 lg:order-1">
                {questions.map((q, i) => (
                    <li
                        key={q.id}
                        id={`q-${i + 1}`}
                        className="scroll-mt-36 rounded-xl border bg-card p-5 shadow-card sm:p-7 lg:scroll-mt-24"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-lg">Question {i + 1}</h2>
                            <span className="num rounded-full bg-muted px-2.5 py-1 text-sm leading-none">
                                {q.marks} mark{q.marks === 1 ? "" : "s"}
                            </span>
                        </div>
                        <Markdown className="max-w-[62ch] text-[1.0625rem] font-semibold [&_p]:my-1.5">{q.stem}</Markdown>
                        {q.stemEn && (
                            <details className="mt-3 rounded-lg bg-muted px-4 py-2.5 text-[0.9375rem]">
                                <summary className="cursor-pointer font-bold">In English</summary>
                                <Markdown className="mt-2 [&_p]:my-1">{q.stemEn}</Markdown>
                            </details>
                        )}

                        {q.type === "MCQ" ? (
                            <fieldset className="mt-4 grid gap-2.5">
                                <legend className="sr-only">Options for question {i + 1}</legend>
                                {q.options.map((o) => {
                                    const on = answers[q.id]?.optionId === o.id;
                                    return (
                                        <label
                                            key={o.id}
                                            className={cn(
                                                "grid min-h-[56px] cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-lg py-2 pr-4 pl-2 transition-[background-color,box-shadow] duration-200 ease-out-soft has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                                                on
                                                    ? "bg-selected shadow-[inset_0_0_0_2px_var(--progress)]"
                                                    : "bg-card shadow-[inset_0_0_0_1.5px_var(--border)] hover:shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                value={o.id}
                                                checked={on}
                                                onChange={() => update(q.id, { optionId: o.id })}
                                                className="sr-only"
                                            />
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    "grid size-10 place-items-center rounded-[12px] font-display text-lg leading-none font-extrabold",
                                                    on ? "bg-progress text-card" : "bg-muted",
                                                )}
                                            >
                                                {on ? <Check className="size-5" strokeWidth={3.5} /> : o.label}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="sr-only">{o.label}. </span>
                                                <Markdown className="text-base leading-snug font-semibold [&_p]:my-0">
                                                    {o.text}
                                                </Markdown>
                                            </span>
                                        </label>
                                    );
                                })}
                            </fieldset>
                        ) : (
                            <div className="mt-4">
                                <label htmlFor={`a-${q.id}`} className="mb-1.5 block text-sm font-bold">
                                    Your answer
                                </label>
                                <Textarea
                                    id={`a-${q.id}`}
                                    value={answers[q.id]?.answer ?? ""}
                                    onChange={(e) => update(q.id, { answer: e.target.value })}
                                    maxLength={5000}
                                    rows={q.marks >= 4 ? 7 : 4}
                                    placeholder={
                                        q.type === "CALCULATION" ? "Show your working — method marks count." : undefined
                                    }
                                />
                            </div>
                        )}
                    </li>
                ))}
            </ol>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between lg:order-3 lg:col-span-1">
                <Button
                    variant="ghost"
                    disabled={abandoning || submitting}
                    onClick={() => {
                        if (!window.confirm("Abandon this paper? Nothing from it will be saved.")) return;
                        handedIn.current = true;
                        startAbandon(async () => {
                            const res = await abandonMock({ id: mockId });
                            if (!res.ok) {
                                handedIn.current = false;
                                toast.error(res.error);
                                return;
                            }
                            router.push("/mock");
                        });
                    }}
                >
                    Abandon paper
                </Button>
                <Button onClick={() => setConfirming(true)} disabled={submitting} variant="outline">
                    {submitting ? <Loader2 className="animate-spin" /> : <Send />}
                    Hand in paper
                </Button>
            </div>

            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hand in your paper?</DialogTitle>
                        <DialogDescription>
                            {unanswered === 0
                                ? "You've answered every question. Multiple choice is marked straight away; then you mark your written answers against the mark scheme."
                                : `${unanswered} question${unanswered === 1 ? " is" : "s are"} still blank and will score 0. You have ${formatClock(left)} left.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Keep going</Button>
                        </DialogClose>
                        <Button
                            onClick={() => {
                                setConfirming(false);
                                handIn("manual");
                            }}
                        >
                            <Send />
                            Hand in
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
