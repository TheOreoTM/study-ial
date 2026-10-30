import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MasteryBar, MasteryTile } from "@/components/mastery";
import { masteryLabel, masteryTone, type Mastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";

/**
 * One topic as a Mastery Row: code tile, name, score, bar and level word.
 * The name links to the topic; with `stretch` the whole row is the link's hit area.
 */
export function MasteryRow({
    code,
    name,
    href,
    mastery,
    meta,
    action,
    isNext,
    stretch,
    className,
}: {
    code: string;
    name: string;
    href: string;
    mastery: Mastery;
    /** Small muted line under the name */
    meta?: React.ReactNode;
    /** Trailing control (e.g. a Practise button) — sits above the stretched link */
    action?: React.ReactNode;
    /** The topic to revise next: Tangerine Pale ground and an arrow flag */
    isNext?: boolean;
    stretch?: boolean;
    className?: string;
}) {
    const { level, score } = mastery;
    const pct = score === null ? null : Math.round(score * 100);
    return (
        <li
            className={cn(
                "relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-lg p-2.5 pr-3.5 sm:gap-x-4",
                isNext ? "bg-primary-soft shadow-raised" : "bg-card",
                action && "sm:grid-cols-[auto_minmax(0,1fr)_auto_auto]",
                stretch && "transition-colors duration-200 ease-out-soft hover:bg-accent",
                className,
            )}
        >
            {isNext && (
                <span
                    aria-hidden
                    className="absolute top-1/2 -left-3 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-mastery-weak text-on-mastery"
                >
                    <ArrowRight className="size-4" strokeWidth={3} />
                </span>
            )}
            <MasteryTile
                code={code}
                level={level}
                className="row-span-2 row-start-1 h-auto min-h-11 w-11 self-stretch"
            />
            <div className="col-span-2 col-start-2 row-start-1 min-w-0 self-end sm:col-span-1">
                <Link
                    href={href}
                    className={cn(
                        "leading-snug font-bold underline-offset-4 outline-none hover:underline focus-visible:underline",
                        stretch &&
                            "after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-3 focus-visible:after:outline-ring",
                    )}
                >
                    {name}
                </Link>
                {meta && <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{meta}</p>}
            </div>
            <MasteryBar
                level={level}
                score={score}
                label={name}
                className="col-start-2 row-start-2 h-2.5 self-center"
            />
            {/* Phones: level word and score share the bar's line. sm+: score above the level word. */}
            <div className="col-start-3 row-start-2 flex items-center justify-end gap-2 sm:contents">
                <span
                    className={cn(
                        "text-right text-[0.75rem] leading-none font-extrabold tracking-[0.05em] whitespace-nowrap uppercase sm:col-start-3 sm:row-start-2",
                        level === "new" || !isNext ? "text-muted-foreground" : masteryTone[level].text,
                    )}
                >
                    {masteryLabel[level]}
                </span>
                {pct !== null && (
                    <span
                        className={cn(
                            "num text-right text-lg leading-none sm:col-start-3 sm:row-start-1 sm:self-end sm:text-xl",
                            masteryTone[level].text,
                        )}
                    >
                        {pct}%
                    </span>
                )}
            </div>
            {action && (
                <div className="relative z-10 col-span-2 col-start-2 row-start-3 flex justify-end sm:col-span-1 sm:col-start-4 sm:row-span-2 sm:row-start-1 sm:pl-1">
                    {action}
                </div>
            )}
        </li>
    );
}
