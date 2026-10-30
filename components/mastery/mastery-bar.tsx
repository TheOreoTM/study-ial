import { masteryLabel, masteryTone, type MasteryLevel } from "@/lib/mastery";
import { cn } from "@/lib/utils";

/**
 * Thin horizontal bar filled to the mastery score, coloured by level.
 * Works in server and client components.
 */
export function MasteryBar({
    level,
    score,
    label,
    className,
}: {
    level: MasteryLevel;
    /** 0–1; null/undefined renders an empty track */
    score?: number | null;
    /** Accessible name, e.g. the topic name. Defaults to "Mastery". */
    label?: string;
    className?: string;
}) {
    const pct = score === null || score === undefined ? 0 : Math.round(Math.min(Math.max(score, 0), 1) * 100);
    return (
        <div
            role="meter"
            aria-label={label ? `${label} mastery` : "Mastery"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-valuetext={level === "new" ? masteryLabel.new : `${pct}% — ${masteryLabel[level]}`}
            className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
        >
            <div
                className={cn("h-full rounded-full transition-[width] duration-500", masteryTone[level].bar)}
                style={{ width: `${level === "new" ? 0 : Math.max(pct, 3)}%` }}
            />
        </div>
    );
}
