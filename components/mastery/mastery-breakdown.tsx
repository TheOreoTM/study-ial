import { masteryLabel, masteryTone, type MasteryLevel } from "@/lib/mastery";
import { cn } from "@/lib/utils";

const ORDER: MasteryLevel[] = ["strong", "developing", "weak", "new"];

/** Stacked bar + legend showing how many topics sit at each mastery level. */
export function MasteryBreakdown({ counts, className }: { counts: Record<MasteryLevel, number>; className?: string }) {
    const total = ORDER.reduce((n, l) => n + counts[l], 0);
    if (total === 0) return null;
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
                {ORDER.map((l) =>
                    counts[l] > 0 ? (
                        <div
                            key={l}
                            className={masteryTone[l].bar}
                            style={{ width: `${(counts[l] / total) * 100}%` }}
                        />
                    ) : null,
                )}
            </div>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {ORDER.filter((l) => counts[l] > 0).map((l) => (
                    <li key={l} className="flex items-center gap-1.5">
                        <span className={cn("size-2 rounded-full", masteryTone[l].bar)} aria-hidden />
                        <span className="tabular-nums">{counts[l]}</span> {masteryLabel[l].toLowerCase()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
