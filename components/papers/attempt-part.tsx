"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Lightbulb, Loader2, MessageCircleQuestion, Shuffle, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { aiMarkPart, explainPart, selfMarkPart, type MarkView } from "@/app/(app)/papers/attempt-actions";
import { cn } from "@/lib/utils";

type Point = { code: string; marks: number };

export function AttemptPart({
    questionId,
    number,
    maxMarks,
    points,
    hasMarkScheme,
    aiEnabled,
    scheme,
    nextHref,
    sessionId = null,
    examMode = false,
}: {
    questionId: string;
    number: string;
    maxMarks: number;
    points: Point[];
    hasMarkScheme: boolean;
    aiEnabled: boolean;
    /** Server-rendered mark scheme crops + guidance, revealed after answering */
    scheme: React.ReactNode;
    nextHref: string | null;
    sessionId?: string | null;
    /** Timed exam: marking happens at the end */
    examMode?: boolean;
}) {
    const router = useRouter();
    const [answer, setAnswer] = useState("");
    const [photos, setPhotos] = useState<{ key: string; url: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selfMarking, setSelfMarking] = useState(false);
    const [ticked, setTicked] = useState<number[]>([]);
    const [manual, setManual] = useState(0);
    const [result, setResult] = useState<Extract<MarkView, { ok: true }> | null>(null);
    const [explain, setExplain] = useState<{ mode: string; markdown: string; ai: boolean } | null>(null);
    const [pending, start] = useTransition();
    const [explaining, startExplain] = useTransition();
    const fileRef = useRef<HTMLInputElement>(null);
    const hasAnswer = answer.trim().length > 0 || photos.length > 0;

    const addPhoto = async (file: File) => {
        if (photos.length >= 3) return toast.error("Up to 3 photos per answer.");
        setUploading(true);
        try {
            const form = new FormData();
            form.set("file", file);
            const res = await fetch("/api/papers/attempt-images", { method: "POST", body: form });
            const json = (await res.json().catch(() => ({}))) as { key?: string; error?: string };
            if (!res.ok || !json.key) return toast.error(json.error ?? "That photo didn't upload.");
            setPhotos((p) => [...p, { key: json.key!, url: `/api/papers/attempt-images?key=${encodeURIComponent(json.key!)}` }]);
        } finally {
            setUploading(false);
        }
    };

    const done = (res: MarkView) => {
        if (!res.ok) {
            toast.error(res.error);
            return;
        }
        setResult(res);
        setSelfMarking(false);
        router.refresh();
    };

    const runExplain = (mode: "explain" | "hints" | "similar") =>
        startExplain(async () => {
            const res = await explainPart({ questionId, mode, attemptId: result?.attemptId ?? null });
            if (!res.ok) toast.error(res.error);
            else setExplain({ mode, markdown: res.markdown, ai: res.ai });
        });

    const tone = result ? (result.marksAwarded >= result.maxMarks ? "strong" : result.marksAwarded > 0 ? "developing" : "weak") : null;

    return (
        <div className="space-y-5">
            {!result && (
                <section aria-label="Your answer" className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor={`a-${questionId}`}>Your answer to {number}</Label>
                        <Textarea
                            id={`a-${questionId}`}
                            rows={6}
                            value={answer}
                            maxLength={6000}
                            placeholder="Type your working. Maths in $…$, e.g. $x^2 + 3x = 10$, $\frac{dy}{dx}$, $\sqrt{3}$"
                            onChange={(e) => setAnswer(e.target.value)}
                            className="text-base"
                        />
                    </div>
                    {answer.includes("$") && (
                        <div className="rounded-lg bg-muted p-3">
                            <p className="mb-1 text-xs font-bold text-muted-foreground uppercase">Preview</p>
                            <Markdown>{answer}</Markdown>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            capture="environment"
                            className="sr-only"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) void addPhoto(f);
                                e.target.value = "";
                            }}
                        />
                        <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading || photos.length >= 3}>
                            {uploading ? <Loader2 className="animate-spin" aria-hidden /> : <Camera aria-hidden />}
                            Add a photo of your working
                        </Button>
                        {photos.map((p, i) => (
                            <span key={p.key} className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element -- the student's own private photo */}
                                <img src={p.url} alt={`Your working, photo ${i + 1}`} className="size-14 rounded-md border object-cover" />
                                <button
                                    type="button"
                                    aria-label={`Remove photo ${i + 1}`}
                                    onClick={() => setPhotos(photos.filter((x) => x.key !== p.key))}
                                    className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-foreground text-background"
                                >
                                    <X className="size-3.5" aria-hidden />
                                </button>
                            </span>
                        ))}
                    </div>

                    {!selfMarking ? (
                        <div className="flex flex-wrap gap-2">
                            {aiEnabled && !examMode && (
                                <Button
                                    disabled={!hasAnswer || pending || maxMarks === 0}
                                    onClick={() => start(async () => done(await aiMarkPart({ questionId, answer, imageKeys: photos.map((p) => p.key), sessionId })))}
                                >
                                    {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />}
                                    {hasMarkScheme ? "Mark with AI" : "Estimate marks with AI"}
                                </Button>
                            )}
                            <Button variant={aiEnabled && !examMode ? "outline" : "default"} disabled={pending} onClick={() => setSelfMarking(true)}>
                                {examMode ? "Save and mark myself" : "Mark it myself"}
                            </Button>
                            {!examMode && (
                                <Button variant="ghost" disabled={explaining} onClick={() => runExplain("hints")}>
                                    <Lightbulb aria-hidden />
                                    Hints
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 rounded-xl bg-muted p-4 sm:p-5">
                            <h3 className="text-lg">Mark scheme</h3>
                            {scheme}
                            {points.length > 0 ? (
                                <fieldset>
                                    <legend className="mb-2 text-sm font-bold">Tick the marks you earned</legend>
                                    <div className="flex flex-wrap gap-2">
                                        {points.map((p, i) => {
                                            const on = ticked.includes(i);
                                            return (
                                                <label
                                                    key={i}
                                                    className={cn(
                                                        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 font-display font-extrabold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ring",
                                                        on ? "bg-mastery-strong-pale text-mastery-strong-text shadow-[inset_0_0_0_2px_currentColor]" : "bg-card shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
                                                    )}
                                                >
                                                    <input type="checkbox" className="sr-only" checked={on} onChange={() => setTicked(on ? ticked.filter((t) => t !== i) : [...ticked, i])} />
                                                    {on && <Check className="size-4" aria-hidden />}
                                                    {p.code}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Label htmlFor={`m-${questionId}`}>Marks</Label>
                                    <input
                                        id={`m-${questionId}`}
                                        type="range"
                                        min={0}
                                        max={maxMarks}
                                        value={manual}
                                        onChange={(e) => setManual(Number(e.target.value))}
                                        className="w-48 accent-[var(--progress)]"
                                    />
                                    <span className="num font-display text-lg">
                                        {manual}/{maxMarks}
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    disabled={pending}
                                    onClick={() =>
                                        start(async () =>
                                            done(
                                                await selfMarkPart({
                                                    questionId,
                                                    answer,
                                                    imageKeys: photos.map((p) => p.key),
                                                    ticked: points.length ? ticked : undefined,
                                                    marks: points.length ? undefined : manual,
                                                    sessionId,
                                                }),
                                            ),
                                        )
                                    }
                                >
                                    Save marks
                                </Button>
                                <Button variant="ghost" onClick={() => setSelfMarking(false)}>
                                    Back
                                </Button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {result && (
                <section aria-label="Result" className="space-y-4">
                    <div
                        className={cn(
                            "flex flex-wrap items-center gap-3 rounded-xl p-4 sm:p-5",
                            tone === "strong" && "bg-mastery-strong-pale",
                            tone === "developing" && "bg-mastery-developing-pale",
                            tone === "weak" && "bg-mastery-weak-pale",
                        )}
                        role="status"
                    >
                        <p className="num font-display text-3xl font-extrabold">
                            {result.marksAwarded}/{result.maxMarks}
                        </p>
                        <p className="font-semibold">
                            {result.method === "SELF" ? "Self-marked" : result.method === "AI_ESTIMATED" ? "AI-estimated: no mark scheme was available" : "Marked by AI against the mark scheme"}
                        </p>
                    </div>
                    {result.method !== "SELF" && (
                        <div className="space-y-3">
                            {result.feedback && <Markdown>{result.feedback}</Markdown>}
                            <ul className="space-y-1.5">
                                {result.points.map((p, i) => (
                                    <li key={i} className="flex gap-2">
                                        {p.awarded ? <Check className="mt-1 size-4 shrink-0 text-success" aria-label="Awarded" /> : <X className="mt-1 size-4 shrink-0 text-destructive" aria-label="Not awarded" />}
                                        <span>
                                            <span className="font-display font-extrabold">{p.code !== "-" ? `${p.code} ` : ""}</span>
                                            <span className="font-semibold">{p.point}</span>
                                            {p.comment && <span className="text-muted-foreground"> — {p.comment}</span>}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {result.justification && <p className="text-sm text-muted-foreground">{result.justification}</p>}
                            {result.remaining !== null && <p className="text-sm text-muted-foreground">{result.remaining} AI markings left today.</p>}
                        </div>
                    )}
                    {result.method !== "SELF" && hasMarkScheme && (
                        <details className="rounded-xl bg-muted p-4">
                            <summary className="cursor-pointer font-display font-extrabold">Mark scheme</summary>
                            <div className="mt-3">{scheme}</div>
                        </details>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {nextHref && (
                            <Button onClick={() => router.push(nextHref)}>Next part</Button>
                        )}
                        <Button variant="outline" disabled={explaining} onClick={() => runExplain("explain")}>
                            <MessageCircleQuestion aria-hidden />
                            Explain step by step
                        </Button>
                        {aiEnabled && (
                            <Button variant="ghost" disabled={explaining} onClick={() => runExplain("similar")}>
                                <Shuffle aria-hidden />
                                Similar question
                            </Button>
                        )}
                        <Button variant="ghost" onClick={() => { setResult(null); setExplain(null); setTicked([]); }}>
                            Try again
                        </Button>
                    </div>
                </section>
            )}

            {explaining && (
                <p className="flex items-center gap-2 text-muted-foreground" role="status">
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Thinking…
                </p>
            )}
            {explain && (
                <section aria-label="Explanation" className="rounded-xl border bg-card p-4 sm:p-5">
                    <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">
                        {explain.mode === "hints" ? "Hints" : explain.mode === "similar" ? "A similar question" : "Step by step"}
                        {explain.ai ? " · AI" : " · from the mark scheme"}
                    </p>
                    <Markdown>{explain.markdown}</Markdown>
                </section>
            )}
        </div>
    );
}
