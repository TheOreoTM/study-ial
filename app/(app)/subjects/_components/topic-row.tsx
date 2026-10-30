import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { MasteryBar, MasteryTile } from "@/components/mastery";
import { masteryLabel, masteryTone, type Mastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";

/**
 * The app-tier Mastery Row: code tile filled with the level colour, topic name, score, bar and level word.
 * Without `mastery` (signed out) it degrades to a plain code + name row. With `href` the whole row is a link.
 * `isNext` marks the topic to revise next: tangerine-pale ground, slightly raised, with a bubblegum arrow flag.
 */
export function TopicRow({
    code,
    name,
    meta,
    mastery,
    isNext = false,
    href,
    className,
}: {
    code: string;
    name: string;
    meta?: React.ReactNode;
    mastery?: Mastery | null;
    isNext?: boolean;
    href?: string;
    className?: string;
}) {
    const level = mastery?.level ?? "new";
    const pct = mastery?.score === null || mastery?.score === undefined ? null : Math.round(mastery.score * 100);
    const tone = masteryTone[level];

    const body = (
        <>
            <MasteryTile
                code={code}
                level={level}
                className={cn("h-auto min-h-11 self-stretch", mastery && "row-span-2")}
            />
            <span className="min-w-0 self-center">
                <span className="block leading-snug font-bold">
                    {isNext && <span className="sr-only">Revise next: </span>}
                    {name}
                </span>
                {meta && <span className="mt-0.5 block text-[0.8125rem] text-muted-foreground">{meta}</span>}
            </span>
            {mastery ? (
                <>
                    <span
                        className={cn("num self-center justify-self-end text-xl leading-none sm:text-2xl", tone.text)}
                    >
                        {pct === null || level === "new" ? <span className="text-muted-foreground">–</span> : `${pct}%`}
                    </span>
                    <MasteryBar level={level} score={mastery.score} label={name} className="self-center" />
                    <span
                        className={cn(
                            "self-center justify-self-end text-[0.75rem] leading-none font-extrabold tracking-[0.05em] whitespace-nowrap uppercase sm:text-[0.8125rem]",
                            isNext ? tone.text : "text-muted-foreground",
                        )}
                    >
                        {masteryLabel[level]}
                    </span>
                </>
            ) : (
                href && <ChevronRight className="size-5 self-center text-muted-foreground" aria-hidden />
            )}
            {isNext && (
                <span
                    className="absolute top-1/2 -left-3 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-mastery-weak text-on-mastery shadow-action"
                    aria-hidden
                >
                    <ArrowRight className="size-4" strokeWidth={3} />
                </span>
            )}
        </>
    );

    const cls = cn(
        "relative grid items-center gap-x-3.5 rounded-lg px-3 py-3 sm:px-4",
        "grid-cols-[auto_minmax(0,1fr)_auto]",
        mastery ? "grid-rows-[auto_auto] gap-y-2" : "grid-rows-1",
        mastery && href && "sm:grid-cols-[auto_minmax(0,1fr)_8.5rem]",
        isNext ? "bg-primary-soft shadow-raised" : "bg-card",
        className,
    );

    if (!href) return <div className={cls}>{body}</div>;
    return (
        <Link
            href={href}
            className={cn(
                cls,
                "transition-[background-color,box-shadow,translate] duration-200 ease-out-soft outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isNext ? "hover:-translate-y-px" : "hover:bg-muted hover:shadow-[inset_0_0_0_1.5px_var(--border)]",
            )}
        >
            {body}
        </Link>
    );
}
