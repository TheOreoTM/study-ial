import { cn } from "@/lib/utils";

export function PageHeader({
    title,
    description,
    actions,
    eyebrow,
    className,
}: {
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    eyebrow?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
            <div className="min-w-0">
                {eyebrow && <div className="mb-1.5 text-sm font-bold text-muted-foreground">{eyebrow}</div>}
                <h1 className="text-[1.75rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.125rem]">{title}</h1>
                {description && <p className="mt-2 max-w-2xl text-[1.0625rem] text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
    );
}
