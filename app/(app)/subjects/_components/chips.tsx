import { cn } from "@/lib/utils";

/** Paper code label, e.g. WPH11: lilac rounded square, Baloo 800. */
export function UnitChip({
    children,
    size = "md",
    muted = false,
    className,
}: {
    children: React.ReactNode;
    size?: "sm" | "md";
    /** Units without content yet: neutral instead of lilac. */
    muted?: boolean;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex w-fit shrink-0 items-center font-display font-extrabold tracking-[0.02em] whitespace-nowrap",
                size === "sm"
                    ? "h-6 rounded-[9px] px-2 pt-px text-[0.8125rem]"
                    : "h-7 rounded-[12px] px-2.5 pt-px text-[0.975rem]",
                muted ? "bg-muted text-muted-foreground" : "bg-selected text-selected-foreground",
                className,
            )}
        >
            {children}
        </span>
    );
}

/** Neutral sand pill for facts like "Topic 1.1" or "Coming soon". */
export function Chip({
    children,
    icon,
    className,
}: {
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex min-h-7 w-fit shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-0.5 text-sm font-bold whitespace-nowrap text-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
                className,
            )}
        >
            {icon}
            {children}
        </span>
    );
}
