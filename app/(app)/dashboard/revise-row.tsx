import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { MasteryTile } from "@/components/mastery";
import { masteryLabel, masteryTone, type MasteryLevel } from "@/lib/mastery";
import { cn } from "@/lib/utils";

/**
 * Mastery Row for the dashboard rail: code tile, topic name, score, bar and level word, linking to practice.
 * `isNext` marks the topic to revise next (tangerine-pale ground, lifted, with the bubblegum arrow flag).
 */
export function ReviseRow({
    href,
    code,
    unitCode,
    name,
    level,
    score,
    isNext = false,
}: {
    href: string;
    code: string;
    unitCode: string;
    name: string;
    level: MasteryLevel;
    /** 0–1, null when not started */
    score: number | null;
    isNext?: boolean;
}) {
    const pct = score === null ? null : Math.round(score * 100);
    const tone = masteryTone[level];
    return (
        <li className="relative">
            {isNext && (
                <span
                    aria-hidden
                    className="absolute top-1/2 -left-3 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-mastery-weak text-on-mastery shadow-raised"
                >
                    <ArrowRight className="size-4" strokeWidth={3} />
                </span>
            )}
            <Link
                href={href}
                aria-label={`Practise ${name}`}
                className={cn(
                    "group grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-1.5 [grid-template-areas:'tile_name_name_chev'_'tile_level_level_chev'_'tile_bar_score_chev'] sm:gap-y-2 sm:[grid-template-areas:'tile_name_score_chev'_'tile_bar_level_chev'] rounded-lg py-3 pr-2.5 pl-3 outline-none transition-[box-shadow,background-color] duration-200 ease-out-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isNext
                        ? "bg-primary-soft pl-5 shadow-raised"
                        : "bg-card hover:shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
                )}
            >
                <MasteryTile code={code} level={level} className="h-auto min-h-11 w-12 self-stretch [grid-area:tile]" />
                <span className="min-w-0 self-end leading-tight font-bold [grid-area:name]">
                    {name} <span className="text-xs font-bold whitespace-nowrap text-muted-foreground">{unitCode}</span>
                </span>
                <span className={cn("num justify-self-end text-xl leading-none [grid-area:score] sm:self-end", pct === null ? "text-muted-foreground" : tone.text)}>
                    {pct === null ? "–" : `${pct}%`}
                </span>
                <ChevronRight
                    className="size-4 text-muted-foreground [grid-area:chev] transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5"
                    aria-hidden
                />
                <span className="block h-2 overflow-hidden [grid-area:bar] sm:self-start rounded-full bg-track" aria-hidden>
                    <span
                        className={cn("block h-full rounded-full", tone.bar)}
                        style={{ width: `${pct === null ? 0 : Math.max(pct, 3)}%` }}
                    />
                </span>
                <span
                    className={cn(
                        "text-[0.6875rem] [grid-area:level] sm:self-start sm:justify-self-end leading-none font-extrabold tracking-[0.05em] whitespace-nowrap uppercase",
                        isNext && level !== "new" ? tone.text : "text-muted-foreground",
                    )}
                >
                    {masteryLabel[level]}
                </span>
            </Link>
        </li>
    );
}
