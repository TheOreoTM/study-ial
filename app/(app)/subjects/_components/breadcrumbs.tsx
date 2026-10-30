import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-x-1 text-sm font-semibold text-muted-foreground">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden />}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="inline-flex min-h-6 items-center rounded-sm underline decoration-border-strong underline-offset-4 transition-colors duration-150 ease-out-soft hover:text-foreground hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page" className="inline-flex min-h-6 items-center">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
