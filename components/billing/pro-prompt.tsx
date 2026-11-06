"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { startTrialAction } from "@/app/(app)/billing/actions";
import { Button } from "@/components/ui/button";
import { formatMvr, priceWithGst, PRO_PRICE_LAARI, TRIAL_DAYS } from "@/lib/billing";
import { cn } from "@/lib/utils";

const PRICE = `${formatMvr(PRO_PRICE_LAARI)} + 8% GST (${formatMvr(priceWithGst().total)}) a month`;

/**
 * Shown where a student reaches for AI marking or the tutor without Pro. "trial" starts the free week in place
 * (no card) and calls `onUnlocked`, so the AI action can run straight away; "upgrade" links to /billing.
 */
export function ProPrompt({
    access,
    feature,
    onUnlocked,
    className,
}: {
    access: "trial" | "upgrade";
    /** e.g. "AI marking" */
    feature: string;
    onUnlocked?: () => void;
    className?: string;
}) {
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const [started, setStarted] = useState(false);

    if (started) {
        return (
            <p className={cn("text-sm font-semibold text-success", className)} role="status">
                Your free week of Pro has started.
            </p>
        );
    }

    return (
        <div className={cn("grid gap-3 rounded-lg bg-muted px-4 py-3.5 text-sm", className)}>
            <p>
                <span className="font-bold">{feature} is part of Pro.</span>{" "}
                <span className="text-muted-foreground">
                    {access === "trial"
                        ? `Try AI marking and the AI tutor free for ${TRIAL_DAYS} days. No card needed.`
                        : `Your free week is over. Pro is ${PRICE}; everything else stays free.`}
                </span>
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {access === "trial" ? (
                    <Button
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                            startTransition(async () => {
                                setError(null);
                                const res = await startTrialAction().catch(() => null);
                                if (!res) return setError("Something went wrong. Check your connection and try again.");
                                if (!res.ok) return setError(res.error);
                                setStarted(true);
                                onUnlocked?.();
                            })
                        }
                    >
                        {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        Start your free week
                    </Button>
                ) : (
                    <Button size="sm" asChild>
                        <Link href="/billing">
                            <Sparkles />
                            Get Pro
                        </Link>
                    </Button>
                )}
                <Link
                    href="/billing"
                    className="text-muted-foreground underline decoration-border-strong underline-offset-4 hover:text-foreground"
                >
                    {access === "trial" ? `Then ${PRICE}` : "What's in Pro"}
                </Link>
            </div>
            {error && (
                <p className="text-destructive" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
