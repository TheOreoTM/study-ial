"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { loadPersonalSearch, loadSearchIndex } from "./search-data";
// The palette's code loads only when it's about to be used (hover, focus, idle time or the shortcut), so it adds
// nothing to the first load of any page.
const loadExperience = () => import("./search-experience");
const SearchExperience = dynamic(() => loadExperience().then((m) => m.SearchExperience), { ssr: false });

/**
 * The app-bar search button and the ⌘K palette it opens. ⌘K / Ctrl+K toggles it from anywhere; "/" opens it when
 * you're not typing (and never during a timed mock paper). Without JavaScript the button is a plain link to /search.
 * The index is fetched when the browser is idle, or as soon as the button is hovered, so the first keystroke is
 * already instant.
 */
export function SearchPalette({ signedIn, isAdmin }: { signedIn: boolean; isAdmin: boolean }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const warm = useCallback(() => {
        loadExperience().catch(() => {});
        loadSearchIndex().catch(() => {});
        if (signedIn) loadPersonalSearch().catch(() => {});
    }, [signedIn]);

    useEffect(() => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
        const cancel = window.cancelIdleCallback ?? window.clearTimeout;
        const id = idle(() => {
            loadExperience().catch(() => {});
            loadSearchIndex().catch(() => {});
        });
        return () => cancel(id);
    }, []);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((o) => !o);
                return;
            }
            if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
            const t = e.target as HTMLElement | null;
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
            // Never pull a student out of a timed paper by accident.
            if (pathname.startsWith("/mock/")) return;
            e.preventDefault();
            setOpen(true);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [pathname]);

    return (
        <>
            <a
                href="/search"
                onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    setOpen(true);
                }}
                onPointerEnter={warm}
                onFocus={warm}
                aria-label="Search"
                aria-haspopup="dialog"
                title="Search (⌘K or /)"
                className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
                <Search className="size-5" aria-hidden />
            </a>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="top-[10dvh] max-w-[calc(100%-1.5rem)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-2xl"
                >
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <DialogDescription className="sr-only">
                        Type to search. Use the up and down arrows to move through results and Enter to open one.
                    </DialogDescription>
                    {open && (
                        <SearchExperience
                            variant="palette"
                            signedIn={signedIn}
                            isAdmin={isAdmin}
                            onNavigate={() => setOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
