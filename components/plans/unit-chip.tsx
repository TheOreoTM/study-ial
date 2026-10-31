import { cn } from "@/lib/utils";

/** Unit code label (e.g. WPH11): lilac rounded square with deep-grape Baloo text. */
export function UnitChip({ code, size = "md", className }: { code: string; size?: "sm" | "md"; className?: string }) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center rounded-[10px] bg-selected font-display font-extrabold tracking-[0.02em] text-selected-foreground",
                size === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2.5 text-sm",
                className,
            )}
        >
            {code}
        </span>
    );
}
