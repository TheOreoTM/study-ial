"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Loader2 } from "lucide-react";
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
        <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-muted-foreground">
                    Step <span className="num text-foreground">{step + 1}</span> of{" "}
                    <span className="num">{STEPS.length}</span>
                </p>
                <ol className="grid grid-cols-2 gap-2" aria-label="Progress">
                    {STEPS.map((label, i) => {
                        const done = i < step;
                        const current = i === step;
                        return (
                            <li
                                key={label}
                                className="flex flex-col gap-2"
                                aria-current={current ? "step" : undefined}
                            >
                                <span
                                    className={cn(
                                        "h-2 rounded-full transition-colors duration-200 ease-out-soft",
                                        done || current ? "bg-progress" : "bg-track",
                                    )}
                                />
                                <span
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm font-bold",
                                        current
                                            ? "text-selected-foreground"
                                            : done
                                              ? "text-foreground"
                                              : "text-muted-foreground",
                                    )}
                                >
                                    {done && <Check className="size-4" strokeWidth={3} aria-hidden />}
                                    {label}
                                    {done && <span className="sr-only">(done)</span>}
                                </span>
                            </li>
                        );
                    })}
                </ol>
            </div>

            {step === 0 ? (
                <>
                    <div>
                        <h1 className="text-[1.75rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.125rem]">
                            Welcome, {firstName}
                        </h1>
                        <p className="mt-2 max-w-[60ch] text-[1.0625rem] text-muted-foreground">
                            Which units are you taking? We&apos;ll tailor practice, your dashboard and study plans to
                            them. You can change this later.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-card sm:p-7">
                        <UnitPicker
                            subjects={subjects}
                            selectedIds={selectedIds}
                            onChange={(ids) => {
                                setSelectedIds(ids);
                                // Picking a unit answers "Pick at least one unit", so the message goes.
                                setError(null);
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <h1 className="text-[1.75rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.125rem]">
                            When are your exams?
                        </h1>
                        <p className="mt-2 max-w-[60ch] text-[1.0625rem] text-muted-foreground">
                            Pick the session you&apos;re sitting each unit in — or &ldquo;Not sure yet&rdquo;.
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-card sm:p-7">
                        <ExamSessionPicker
                            units={selectedUnits}
                            choices={choices}
                            onChange={setChoices}
                            today={today}
                        />
                    </div>
                </>
            )}

            <div className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t bg-card px-4 py-3.5 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                {error && (
                    <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-destructive">
                        <CircleAlert className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
                        {error}
                    </p>
                )}
                <div className="flex items-center justify-between gap-3">
                    {step === 0 ? (
                        <span className="text-sm font-semibold text-muted-foreground" aria-live="polite">
                            <span className={cn("num text-base", choices.length > 0 && "text-selected-foreground")}>
                                {choices.length}
                            </span>{" "}
                            unit{choices.length === 1 ? "" : "s"} selected
                        </span>
                    ) : (
                        <Button variant="ghost" onClick={() => setStep(0)} disabled={pending}>
                            <ArrowLeft aria-hidden /> Back
                        </Button>
                    )}
                    {step === 0 ? (
                        <Button size="lg" onClick={next}>
                            Continue <ArrowRight aria-hidden />
                        </Button>
                    ) : (
                        <Button size="lg" onClick={finish} disabled={pending}>
                            {pending && <Loader2 className="animate-spin" aria-hidden />}
                            Finish setup
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
