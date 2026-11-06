"use client";

import { useCallback, useEffect, useRef } from "react";
import type { SearchDoc } from "@/lib/search";
import type { MasteryLevel } from "@/lib/mastery";
import { SearchExperience } from "./search-experience";

/** The /search page: live results, with the URL kept in step (replaceState, no navigation) so it stays shareable. */
export function LiveSearch(props: {
    initialQuery: string;
    signedIn: boolean;
    isAdmin: boolean;
    seedDocs: SearchDoc[];
    initialMastery: Record<string, { level: MasteryLevel; score: number | null }>;
}) {
    const timer = useRef<number | undefined>(undefined);
    const onQueryChange = useCallback((q: string) => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            const t = q.trim();
            const url = t ? `/search?q=${encodeURIComponent(t)}` : "/search";
            if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
        }, 250);
    }, []);
    useEffect(() => () => window.clearTimeout(timer.current), []);
    return <SearchExperience variant="page" onQueryChange={onQueryChange} {...props} />;
}
