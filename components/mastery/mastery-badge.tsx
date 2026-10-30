import { masteryLabel, masteryTone, type MasteryLevel } from "@/lib/mastery";
import { cn } from "@/lib/utils";

/**
 * Pill showing a topic's mastery level, e.g. "Getting there · 62%".
 * Works in server and client components.
 */
export function MasteryBadge({
    level,
    score,
    showScore = false,
    className,
}: {
    level: MasteryLevel;
    /** 0–1 (null/undefined when not started) — only shown with `showScore` */
    score?: number | null;
    showScore?: boolean;
    className?: string;
}) {
    const pct = score === null || score === undefined ? null : Math.round(score * 100);
    return (
        <span
            className={cn(
                "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] leading-none font-extrabold tracking-[0.05em] whitespace-nowrap uppercase",
                masteryTone[level].badge,
                className,
            )}
        >
            {masteryLabel[level]}
            {showScore && pct !== null && level !== "new" && <span className="tabular-nums">· {pct}%</span>}
        </span>
    );
}
