import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: {
    icon: LucideIcon;
    title: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col items-center rounded-xl bg-muted px-6 py-12 text-center", className)}>
            <div className="mb-4 grid size-14 place-items-center rounded-lg bg-card shadow-card">
                <Icon className="size-6 text-selected-foreground" aria-hidden />
            </div>
            <h3 className="text-xl">{title}</h3>
            {description && <p className="mt-1.5 max-w-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
