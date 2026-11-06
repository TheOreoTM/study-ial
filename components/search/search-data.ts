"use client";

import type { PersonalSearch, SearchDoc } from "@/lib/search";

// Client-side caches for the two search indexes. Each loads at most once per page lifetime (the personal one refreshes
// after a minute), whichever component asks first; failures clear the cache so the next attempt retries.

let index: Promise<SearchDoc[]> | null = null;

/** The public curriculum index (CDN-cached, ~25 KB gzipped). */
export function loadSearchIndex(): Promise<SearchDoc[]> {
    index ??= fetch("/api/search/index")
        .then((r) => {
            if (!r.ok) throw new Error(`search index: ${r.status}`);
            return r.json() as Promise<{ docs: SearchDoc[] }>;
        })
        .then((j) => j.docs)
        .catch((e) => {
            index = null;
            throw e;
        });
    return index;
}

const PERSONAL_MAX_AGE = 60_000;
let personal: { at: number; data: Promise<PersonalSearch | null> } | null = null;

/** The signed-in student's own search data, or null when signed out. */
export function loadPersonalSearch(): Promise<PersonalSearch | null> {
    if (!personal || Date.now() - personal.at > PERSONAL_MAX_AGE) {
        const data = fetch("/api/search/personal", { cache: "no-store" })
            .then((r) => (r.status === 401 ? null : r.ok ? (r.json() as Promise<PersonalSearch>) : Promise.reject(r.status)))
            .catch((e) => {
                personal = null;
                throw e;
            });
        personal = { at: Date.now(), data };
    }
    return personal.data;
}
