import { cn } from "@/lib/utils";

/** Published / Draft pill. Semantic tokens only — never mastery colours. */
export function StatusBadge({ status, className }: { status: "DRAFT" | "PUBLISHED"; className?: string }) {
    const published = status === "PUBLISHED";
    return (
        <span
            className={cn(
                "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap",
                published ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
                className,
            )}
        >
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            {published ? "Published" : "Draft"}
        </span>
    );
}
