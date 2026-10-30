"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavLinks({
    isAdmin,
    onNavigate,
    orientation = "vertical",
    exclude = [],
}: {
    isAdmin: boolean;
    onNavigate?: () => void;
    /** "horizontal" is the desktop app bar; "vertical" is the mobile menu. */
    orientation?: "horizontal" | "vertical";
    /** Hrefs to leave out (e.g. /settings, which the app bar reaches through the user menu). */
    exclude?: string[];
}) {
    const pathname = usePathname();
    const horizontal = orientation === "horizontal";
    return (
        <nav aria-label="Main" className={cn("flex gap-1", horizontal ? "items-center" : "flex-col")}>
            {appNav
                .filter((item) => (!item.adminOnly || isAdmin) && !exclude.includes(item.href))
                .map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(`${href}/`);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex min-h-11 items-center gap-3 rounded-full font-display font-bold whitespace-nowrap transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                horizontal ? "px-4 text-[0.975rem]" : "px-4 text-[1.05rem]",
                                active
                                    ? "bg-selected text-selected-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                        >
                            {!horizontal && <Icon className="size-5" aria-hidden />}
                            {label}
                        </Link>
                    );
                })}
        </nav>
    );
}
