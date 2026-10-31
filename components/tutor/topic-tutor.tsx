"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { explainTopic, type TutorResult } from "@/app/(app)/tutor/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TutorAnswer } from "./tutor-answer";

/** Strip Markdown/LaTeX markers so a spec point reads cleanly inside a select. */
function plain(text: string) {
    return text
        .replace(/\$+([^$]*)\$+/g, "$1")
        .replace(/\\(?:text|mathrm)\{([^}]*)\}/g, "$1")
        .replace(/\\[a-zA-Z]+/g, "")
        .replace(/[{}*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/** "Explain this" for a topic: the student picks a spec point (or the whole topic); there's no free-text box. */
export function TopicTutor({
    topicId,
    specPoints,
    signedIn,
}: {
    topicId: string;
    specPoints: string[];
    signedIn: boolean;
}) {
    const [point, setPoint] = useState("-1");
    const [result, setResult] = useState<Extract<TutorResult, { ok: true }> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    if (!signedIn) {
        return (
            <p className="text-muted-foreground">
                <Link
                    href="/sign-in"
                    className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                >
                    Sign in
                </Link>{" "}
                to get a plain-language explanation of any specification point.
            </p>
        );
    }

    return (
        <div className="grid gap-4">
            <form
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={(e) => {
                    e.preventDefault();
                    setError(null);
                    startTransition(async () => {
                        const res = await explainTopic({ topicId, point: Number(point) });
                        if (res.ok) setResult(res);
                        else setError(res.error);
                    });
                }}
            >
                <div className="grid min-w-0 flex-1 gap-1.5">
                    <Label htmlFor="tutor-point">What should we explain?</Label>
                    <Select
                        value={point}
                        onValueChange={(v) => {
                            setPoint(v);
                            setResult(null);
                        }}
                    >
                        <SelectTrigger id="tutor-point" className="w-full min-w-0 [&>span]:truncate">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-w-[min(36rem,calc(100vw-2rem))]">
                            <SelectItem value="-1">The whole topic</SelectItem>
                            {specPoints.map((p, i) => (
                                <SelectItem key={i} value={String(i)}>
                                    <span className="line-clamp-2 text-left whitespace-normal">
                                        {i + 1}. {plain(p)}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" variant="outline" disabled={pending} className="shrink-0">
                    {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    Explain
                </Button>
            </form>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {result && <TutorAnswer result={result} />}
        </div>
    );
}
