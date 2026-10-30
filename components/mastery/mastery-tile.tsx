import { masteryLabel, masteryTone, type MasteryLevel } from "@/lib/mastery";
import { cn } from "@/lib/utils";

/**
 * Rounded-square code tile (e.g. "1.5" or "WPH11") filled with the topic's mastery colour —
 * the leading cell of a mastery row. Unstarted topics get a neutral tile.
 */
export function MasteryTile({
    code,
    level,
    size = "md",
    className,
}: {
    code: React.ReactNode;
    level: MasteryLevel;
    size?: "sm" | "md";
    className?: string;
}) {
    return (
        <span
            title={masteryLabel[level]}
            className={cn(
                "num grid shrink-0 place-items-center rounded-[12px] leading-none",
                size === "sm" ? "size-9 text-[0.8125rem]" : "size-11 text-[0.9375rem]",
                masteryTone[level].fill,
                className,
            )}
        >
            {code}
        </span>
    );
}
