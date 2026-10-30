import { ArrowRight } from "lucide-react";
import { MasteryBar } from "@/components/mastery/mastery-bar";
import { MasteryTile } from "@/components/mastery/mastery-tile";
import { masteryLabel, masteryTone, type Mastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";

/**
 * Compact mastery row for the practice rail: code tile, name, score, bar and level word.
 * `current` marks the topic of the question on screen (tangerine-pale ground plus the next-up flag).
 */
export function TopicMasteryRow({
    code,
    name,
    mastery,
    current = false,
}: {
    code: string;
    name: string;
    mastery: Mastery;
    current?: boolean;
}) {
    const { level, score } = mastery;
    const pct = score === null ? null : Math.round(score * 100);
    return (
        <li
            className={cn(
                "relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-200 ease-out-soft",
                current ? "ml-3.5 bg-primary-soft shadow-raised" : "bg-card",
            )}
            aria-current={current ? "true" : undefined}
        >
            {current && (
                <span
                    className="absolute top-1/2 -left-3.5 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-mastery-weak text-on-mastery"
                    aria-hidden
                >
                    <ArrowRight className="size-4" strokeWidth={3} />
                </span>
            )}
            <MasteryTile code={code} level={level} />
            <div className="grid min-w-0 gap-2">
                <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 text-[0.9375rem] leading-snug font-bold">{name}</span>
                    <span className={cn("num shrink-0 text-lg leading-none", masteryTone[level].text)}>
                        {pct === null ? "—" : `${pct}%`}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <MasteryBar level={level} score={score} label={name} className="min-w-0 flex-1" />
                    <span
                        className={cn(
                            "shrink-0 text-[0.6875rem] leading-none font-extrabold tracking-[0.05em] whitespace-nowrap uppercase",
                            masteryTone[level].text,
                        )}
                    >
                        {masteryLabel[level]}
                    </span>
                </div>
            </div>
        </li>
    );
}
