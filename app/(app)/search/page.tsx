import type { Metadata } from "next";
import { LiveSearch } from "@/components/search/live-search";
import { PageHeader } from "@/components/page-header";
import { getSearchDocs } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { search } from "@/lib/search";
import { getUser } from "@/lib/session";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
    const q = readQuery((await searchParams).q);
    // Result pages are thin and endless; keep them out of the index but let crawlers follow the links.
    return { title: q ? `Search: ${q}` : "Search", robots: { index: false, follow: true } };
}

function readQuery(raw: string | string[] | undefined) {
    const q = Array.isArray(raw) ? raw[0] : raw;
    return (q ?? "").trim().slice(0, 100);
}

/**
 * Live search. The server finds results for the URL's query so the first paint (and visitors without JavaScript)
 * gets real results; then the browser's own index takes over and every keystroke is answered locally.
 */
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
    const q = readQuery((await searchParams).q);
    const [docs, user] = await Promise.all([getSearchDocs(), getUser()]);
    const seed = q ? search(docs, q).map((h) => h.doc) : [];
    const topicIds = seed.filter((d) => d.kind === "topic").map((d) => d.id);
    const mastery = user && topicIds.length ? await getTopicMastery(user.id, topicIds) : null;
    const initialMastery = Object.fromEntries(
        [...(mastery ?? [])].filter(([, m]) => m.attempts > 0).map(([id, m]) => [id, { level: m.level, score: m.score }]),
    );

    return (
        <>
            <PageHeader
                title="Search"
                description="Results appear as you type. Search every subject, unit, topic and specification point by name, paper code or keyword. Press ⌘K or / anywhere to search without leaving the page."
            />
            <LiveSearch
                initialQuery={q}
                signedIn={!!user}
                isAdmin={user?.role === "ADMIN"}
                seedDocs={seed}
                initialMastery={initialMastery}
            />
        </>
    );
}
