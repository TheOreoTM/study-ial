"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamSessionPicker } from "@/components/units/exam-session-picker";
import { UnitPicker } from "@/components/units/unit-picker";
import { useUnitChoices } from "@/components/units/units-editor";
import type { PickerSubject, UnitChoice } from "@/components/units/types";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "./actions";

const STEPS = ["Your units", "Exam dates"] as const;

export function OnboardingFlow({
    firstName,
    subjects,
    initial,
    today,
}: {
    firstName: string;
    subjects: PickerSubject[];
    initial: UnitChoice[];
    today: string;
}) {
    const [step, setStep] = useState(0);
    const { choices, setChoices, selectedIds, selectedUnits, setSelectedIds } = useUnitChoices(subjects, initial);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    function next() {
        if (choices.length === 0) {
            setError("Pick at least one unit to continue.");
            return;
        }
        setError(null);
        setStep(1);
        window.scrollTo({ top: 0 });
    }

    function finish() {
        setError(null);
        startTransition(async () => {
            // Redirects to /dashboard on success.
            const res = await completeOnboarding({ units: choices });
            if (res && !res.ok) setError(res.error);
        });
    }

    return (
        <div className="flex flex-col gap-8">
            <ol className="flex items-center gap-2 text-xs font-medium" aria-label="Progress">
                {STEPS.map((label, i) => (
                    <li key={label} className="flex flex-1 flex-col gap-2" aria-current={i === step ? "step" : undefined}>
                        <span className={cn("h-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
                        <span className={i === step ? "text-foreground" : "text-muted-foreground"}>
                            {i + 1}. {label}
                        </span>
                    </li>
                ))}
            </ol>

            {step === 0 ? (
                <>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome, {firstName}</h1>
                        <p className="mt-2 text-muted-foreground">
                            Which units are you taking? We&apos;ll tailor practice, your dashboard and study plans to
                            them. You can change this later.
                        </p>
                    </div>
                    <UnitPicker subjects={subjects} selectedIds={selectedIds} onChange={setSelectedIds} />
                </>
            ) : (
                <>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">When are your exams?</h1>
                        <p className="mt-2 text-muted-foreground">
                            Pick the session you&apos;re sitting each unit in — or &ldquo;Not sure yet&rdquo;.
                        </p>
                    </div>
                    <ExamSessionPicker units={selectedUnits} choices={choices} onChange={setChoices} today={today} />
                </>
            )}

            <div className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t bg-background/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                {error && (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                )}
                <div className="flex items-center justify-between gap-3">
                    {step === 0 ? (
                        <span className="text-sm text-muted-foreground" aria-live="polite">
                            {choices.length} unit{choices.length === 1 ? "" : "s"} selected
                        </span>
                    ) : (
                        <Button variant="ghost" onClick={() => setStep(0)} disabled={pending}>
                            <ArrowLeft aria-hidden /> Back
                        </Button>
                    )}
                    {step === 0 ? (
                        <Button onClick={next}>
                            Continue <ArrowRight aria-hidden />
                        </Button>
                    ) : (
                        <Button onClick={finish} disabled={pending}>
                            {pending && <Loader2 className="animate-spin" aria-hidden />}
                            Finish setup
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
