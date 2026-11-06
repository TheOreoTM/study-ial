import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    headingLevel = 3,
}: {
    icon: LucideIcon;
    title: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
    /** Use 2 when the empty state sits straight under the page's h1, so heading levels don't skip. */
    headingLevel?: 2 | 3;
}) {
    const Heading = headingLevel === 2 ? "h2" : "h3";
    return (
        <div className={cn("flex flex-col items-center rounded-xl bg-muted px-6 py-12 text-center", className)}>
            <div className="mb-4 grid size-14 place-items-center rounded-lg bg-card shadow-card">
                <Icon className="size-6 text-selected-foreground" aria-hidden />
            </div>
            <Heading className="text-xl">{title}</Heading>
            {description && <p className="mt-1.5 max-w-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
