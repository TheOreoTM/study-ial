"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { explainQuestion, type TutorResult } from "@/app/(app)/tutor/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TutorAnswer } from "./tutor-answer";

/** "Explain this question", shown once a practice question has been marked. */
export function QuestionTutor({ questionId }: { questionId: string }) {
    const [result, setResult] = useState<Extract<TutorResult, { ok: true }> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const ask = () =>
        startTransition(async () => {
            setError(null);
            const res = await explainQuestion({ questionId });
            if (res.ok) setResult(res);
            else setError(res.error);
        });

    if (result) return <TutorAnswer result={result} onUnlocked={ask} />;
    return (
        <div className="grid gap-3">
            <div>
                <Button variant="ghost" size="sm" className="-ml-3" disabled={pending} onClick={ask}>
                    {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    Explain this question step by step
                </Button>
            </div>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
