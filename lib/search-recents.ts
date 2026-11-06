// Recently opened search results, kept on this device only (localStorage). Pure helpers (unit-tested); the palette
// reads and writes through `loadRecents` / `saveRecents`, which never throw.

import type { SearchKind } from "@/lib/search";

export type RecentPick = { href: string; name: string; context: string; kind: SearchKind };

export const RECENTS_KEY = "study-ial:search-recents";
export const MAX_RECENTS = 5;

/** Puts `pick` first, dropping an older copy of the same link and anything past the limit. */
export function addRecent(list: RecentPick[], pick: RecentPick, max = MAX_RECENTS): RecentPick[] {
    return [pick, ...list.filter((r) => r.href !== pick.href)].slice(0, max);
}

/** Reads stored picks, ignoring anything malformed (storage is user-editable and may be from an older version). */
export function parseRecents(raw: string | null): RecentPick[] {
    if (!raw) return [];
    try {
        const data: unknown = JSON.parse(raw);
        if (!Array.isArray(data)) return [];
        return data
            .filter(
                (r): r is RecentPick =>
                    !!r &&
                    typeof r.href === "string" &&
                    r.href.startsWith("/") &&
                    !r.href.startsWith("//") &&
                    typeof r.name === "string" &&
                    typeof r.context === "string" &&
                    typeof r.kind === "string",
            )
            .slice(0, MAX_RECENTS);
    } catch {
        return [];
    }
}

export function loadRecents(): RecentPick[] {
    try {
        return parseRecents(window.localStorage.getItem(RECENTS_KEY));
    } catch {
        return [];
    }
}

export function saveRecents(list: RecentPick[]) {
    try {
        window.localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
    } catch {
        // Private mode or storage full: recents are a convenience, so carry on without them.
    }
}
