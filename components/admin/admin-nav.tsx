"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { href: "/admin", label: "Overview", exact: true },
    { href: "/admin/questions", label: "Questions", exact: false },
    { href: "/admin/questions/new", label: "New question", exact: true },
    { href: "/admin/import", label: "Import", exact: true },
];

export function AdminNav() {
    const pathname = usePathname();
    return (
        <nav aria-label="Admin" className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b pb-px text-sm">
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
                            "-mb-px shrink-0 border-b-2 px-3 py-2 font-medium transition-colors",
                            active
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
