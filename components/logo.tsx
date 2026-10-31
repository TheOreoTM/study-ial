import Link from "next/link";
import { cn } from "@/lib/utils";

/** The brand mark: mastery bars climbing as steps (weak → developing → strong) on a plum tile, standing on a cream
 * baseline, with the orange "you" dot about to land on the top step. */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            aria-hidden="true"
            className={cn("size-9 shrink-0 dark:rounded-[13px] dark:ring-1 dark:ring-border", className)}
        >
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <path d="M8 32V26.5Q8 24 10.5 24H13Q15.5 24 15.5 26.5V32Z" className="fill-mastery-weak" />
            <path d="M16.25 32V21Q16.25 18.5 18.75 18.5H21.25Q23.75 18.5 23.75 21V32Z" className="fill-mastery-developing" />
            <path d="M24.5 32V15.5Q24.5 13 27 13H29.5Q32 13 32 15.5V32Z" className="fill-mastery-strong" />
            <rect x="7" y="31" width="26" height="2.5" rx="1.25" className="fill-cream" />
            <circle cx="28.25" cy="7.5" r="3.5" className="fill-tangerine" />
        </svg>
    );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex min-h-11 items-center gap-2.5 rounded-md font-display text-xl font-extrabold tracking-tight focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                className,
            )}
        >
            <LogoMark />
            <span>Study-IAL</span>
        </Link>
    );
}
