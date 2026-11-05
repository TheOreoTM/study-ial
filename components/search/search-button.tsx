"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** App-bar link to /search. Pressing "/" outside a text field opens it, as on most sites (not during a mock paper). */
export function SearchButton() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
            // Never pull a student out of a timed paper by accident.
            if (pathname.startsWith("/mock/")) return;
            const t = e.target as HTMLElement | null;
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
            e.preventDefault();
            if (pathname === "/search") document.getElementById("search-q")?.focus();
            else router.push("/search");
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [pathname, router]);

    return (
        <Link
            href="/search"
            aria-label="Search"
            title="Search (press /)"
            aria-current={pathname === "/search" ? "page" : undefined}
            className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:bg-selected aria-[current=page]:text-selected-foreground"
        >
            <Search className="size-5" aria-hidden />
        </Link>
    );
}
