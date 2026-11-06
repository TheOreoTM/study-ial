"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitExam } from "@/app/(app)/papers/exam-actions";
import { cn } from "@/lib/utils";

type Part = { id: string; number: string; marks: number; question: React.ReactNode };

const fmt = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** The whole paper under its real time limit. Answers autosave in the browser and submit when time is up. */
export function ExamRunner({ sessionId, endsAt, parts, resultsHref }: { sessionId: string; endsAt: string; parts: Part[]; resultsHref: string }) {
    const router = useRouter();
    const storeKey = `exam:${sessionId}`;
    const [answers, setAnswers] = useState<Record<string, string>>(() => {
        try {
            return JSON.parse(localStorage.getItem(storeKey) ?? "{}") as Record<string, string>;
        } catch {
            return {};
        }
    });
    const [now, setNow] = useState(() => Date.now());
    const [pending, start] = useTransition();
    const submitted = useRef(false);
    const end = Date.parse(endsAt);
    const left = end - now;

    useEffect(() => {
        try {
            localStorage.setItem(storeKey, JSON.stringify(answers));
        } catch {
            // private mode: answers live in memory only
        }
    }, [answers, storeKey]);

    const submit = useCallback(() => {
        if (submitted.current) return;
        submitted.current = true;
        start(async () => {
            const res = await submitExam({ sessionId, answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })) });
            if (!res.ok) {
                submitted.current = false;
                toast.error(res.error);
                return;
            }
            try {
                localStorage.removeItem(storeKey);
            } catch {
                // ignore
            }
            router.push(resultsHref);
        });
    }, [answers, resultsHref, router, sessionId, storeKey]);

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);
    useEffect(() => {
        if (left <= 0) submit();
    }, [left, submit]);

    const answered = parts.filter((p) => answers[p.id]?.trim()).length;
    return (
        <div>
            <div className="sticky top-16 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
                <p className={cn("num flex items-center gap-2 font-display text-2xl font-extrabold", left < 5 * 60_000 && "text-destructive")} role="timer" aria-live="off">
                    <Timer className="size-5" aria-hidden />
                    {fmt(left)}
                </p>
                <p className="text-sm text-muted-foreground">
                    {answered}/{parts.length} parts answered
                </p>
                <Button
                    className="ml-auto"
                    disabled={pending}
                    onClick={() => {
                        if (confirm("Hand in your paper now? You can't change answers afterwards.")) submit();
                    }}
                >
                    {pending && <Loader2 className="animate-spin" aria-hidden />}
                    Hand in
                </Button>
            </div>
            <ol className="space-y-6">
                {parts.map((p) => (
                    <li key={p.id} id={`p-${p.id}`} className="rounded-xl border bg-card p-4 shadow-card sm:p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg">Question {p.number}</h2>
                            <span className="num rounded-full bg-muted px-3 py-0.5 font-display font-extrabold">
                                {p.marks} mark{p.marks === 1 ? "" : "s"}
                            </span>
                        </div>
                        {p.question}
                        <div className="mt-4 space-y-1.5">
                            <Label htmlFor={`e-${p.id}`}>Your answer</Label>
                            <Textarea
                                id={`e-${p.id}`}
                                rows={4}
                                maxLength={6000}
                                value={answers[p.id] ?? ""}
                                onChange={(e) => setAnswers({ ...answers, [p.id]: e.target.value })}
                                placeholder="Working and answer. Maths in $…$"
                            />
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
