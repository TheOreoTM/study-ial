"use client";

import { useState, useTransition } from "react";
import { Circle, CircleCheck, CircleDot, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { rateSpecPoint } from "@/app/(app)/subjects/actions";
import { CONFIDENCE_ORDER, confidenceLabel, type Confidence } from "@/lib/checklist";
import { cn } from "@/lib/utils";

const ICON: Record<Confidence, LucideIcon> = { RED: Circle, AMBER: CircleDot, GREEN: CircleCheck };

/**
 * Three-way confidence control for one spec point ("Not yet", "Shaky", "Got it"). Picking the current rating again
 * clears it. Neutral and lilac only: mastery colours are for marks, not feelings.
 */
export function ConfidencePicker({
    topicId,
    point,
    initial,
    label,
    onChange,
    className,
}: {
    topicId: string;
    point: number;
    initial: Confidence | null;
    /** Accessible name of the group, e.g. "Confidence: spec point 3" */
    label: string;
    onChange?: (rating: Confidence | null) => void;
    className?: string;
}) {
    const [rating, setRating] = useState<Confidence | null>(initial);
    const [, startTransition] = useTransition();

    function pick(next: Confidence) {
        const previous = rating;
        const value = previous === next ? null : next;
        setRating(value);
        onChange?.(value);
        startTransition(async () => {
            const res = await rateSpecPoint({ topicId, point, rating: value });
            if (!res.ok) {
                setRating(previous);
                onChange?.(previous);
                toast.error(res.error);
            }
        });
    }

    return (
        <div role="group" aria-label={label} className={cn("inline-flex flex-wrap gap-1.5", className)}>
            {CONFIDENCE_ORDER.map((c) => {
                const Icon = ICON[c];
                const on = rating === c;
                return (
                    <button
                        key={c}
                        type="button"
                        aria-pressed={on}
                        onClick={() => pick(c)}
                        className={cn(
                            "inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-display text-sm font-extrabold transition-[background-color,box-shadow,color] duration-150 ease-out-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            on
                                ? "bg-selected text-selected-foreground shadow-[inset_0_0_0_2px_var(--progress)]"
                                : "bg-card text-muted-foreground shadow-[inset_0_0_0_1.5px_var(--border)] hover:text-foreground hover:shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
                        )}
                    >
                        <Icon className="size-4" aria-hidden />
                        {confidenceLabel[c]}
                    </button>
                );
            })}
        </div>
    );
}
