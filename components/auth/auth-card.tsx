import Link from "next/link";
import { CircleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** The white form card used by every auth page: title, optional lede, body, optional footer line. */
export function AuthCard({
    title,
    description,
    footer,
    children,
}: {
    title: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-card px-5 py-7 text-card-foreground shadow-card sm:px-9 sm:py-9">
            <div className="mb-7">
                <h1 className="text-[1.75rem] leading-[1.1] tracking-[-0.01em]">{title}</h1>
                {description && <p className="mt-2 text-muted-foreground">{description}</p>}
            </div>
            {children}
            {footer && <div className="mt-7 border-t pt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
    );
}

/** An inline text link inside auth copy. */
export function AuthLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex min-h-6 items-center rounded-sm font-bold text-selected-foreground underline decoration-border-strong decoration-2 underline-offset-4 transition-colors duration-150 hover:decoration-current focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                className,
            )}
        >
            {children}
        </Link>
    );
}

/** A calm confirmation block (e.g. "check your inbox") shown in place of a form. */
export function AuthNotice({
    icon: Icon,
    title,
    children,
}: {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div role="status" className="flex flex-col items-center rounded-lg bg-muted px-5 py-7 text-center">
            <div className="mb-3 grid size-12 place-items-center rounded-[14px] bg-card shadow-card">
                <Icon className="size-6 text-selected-foreground" aria-hidden />
            </div>
            <p className="font-display text-lg font-extrabold">{title}</p>
            <div className="mt-1 max-w-[34ch] text-sm text-muted-foreground">{children}</div>
        </div>
    );
}

/** Field error / form error line, legible in both themes. */
export function FormError({ children }: { children: React.ReactNode }) {
    return (
        <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border-[1.5px] border-destructive/35 bg-destructive/[0.06] px-4 py-3 text-sm font-semibold text-destructive"
        >
            <CircleAlert className="mt-px size-[18px] shrink-0" strokeWidth={2.5} aria-hidden />
            <span className="min-w-0">{children}</span>
        </div>
    );
}
