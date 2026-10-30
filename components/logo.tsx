import Link from "next/link";
import { cn } from "@/lib/utils";

/** The brand mark: a plum tile with three rising bars (weak → developing → strong). */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            aria-hidden="true"
            className={cn("size-9 shrink-0 text-ink dark:rounded-[13px] dark:ring-1 dark:ring-border", className)}
        >
            <rect width="40" height="40" rx="13" fill="currentColor" />
            <rect x="9" y="22" width="6" height="9" rx="3" className="fill-mastery-developing" />
            <rect x="17" y="16" width="6" height="15" rx="3" className="fill-mastery-weak" />
            <rect x="25" y="9" width="6" height="22" rx="3" className="fill-mastery-strong" />
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
