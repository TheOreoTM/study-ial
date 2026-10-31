"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { href: "/admin", label: "Overview", exact: true },
    { href: "/admin/questions", label: "Questions", exact: false },
    { href: "/admin/questions/new", label: "New question", exact: true },
    { href: "/admin/import", label: "Import", exact: true },
    { href: "/admin/flashcards", label: "Flashcards", exact: false },
];

export function AdminNav() {
    const pathname = usePathname();
    return (
        <nav aria-label="Admin" className="-mx-1 mb-6 flex gap-1 overflow-x-auto px-1 py-0.5">
            {links.map(({ href, label, exact }) => {
                const active = exact
                    ? pathname === href
                    : pathname.startsWith(href) && pathname !== "/admin/questions/new";
                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "flex min-h-10 shrink-0 items-center rounded-full px-4 font-display text-[0.95rem] font-bold whitespace-nowrap transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            active
                                ? "bg-selected text-selected-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
