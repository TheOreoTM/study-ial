import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { MasteryTile } from "@/components/mastery";
import { PageHeader } from "@/components/page-header";
import { UnitChip } from "@/components/plans/unit-chip";
import { SearchForm } from "@/components/search/search-form";
import { masteryLabel } from "@/lib/mastery";
import { getSearchDocs } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { highlight, plainSnippet, search, tokenize, type SearchHit } from "@/lib/search";
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

const kindLabel = { subject: "Subject", unit: "Unit", topic: "Topic" } as const;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
    const q = readQuery((await searchParams).q);
    const [docs, user] = await Promise.all([getSearchDocs(), getUser()]);
    const hits = q ? search(docs, q) : [];
    const tokens = tokenize(q);
    const topicIds = hits.filter((h) => h.doc.kind === "topic").map((h) => h.doc.id);
    const mastery = user && topicIds.length ? await getTopicMastery(user.id, topicIds) : null;

    return (
        <>
            <PageHeader
                title="Search"
                description="Find any subject, unit, topic or specification point, by name, paper code or keyword."
            />
            <SearchForm defaultValue={q} className="mb-8 max-w-2xl" autoFocus={!q} />

            {!q ? (
                <p className="text-muted-foreground">
                    Try{" "}
                    {["projectile", "WCH12", "enthalpy", "integration by parts", "photoelectric"].map((ex, i) => (
                        <span key={ex}>
                            {i > 0 && ", "}
                            <Link
                                href={`/search?q=${encodeURIComponent(ex)}`}
                                className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                            >
                                {ex}
                            </Link>
                        </span>
                    ))}
                    .
                </p>
            ) : hits.length === 0 ? (
                <EmptyState
                    icon={SearchX}
                    title={`Nothing matches “${q}”`}
                    description="Check the spelling, try fewer words, or search by paper code (like WPH11)."
                />
            ) : (
                <section aria-labelledby="results">
                    <h2 id="results" className="mb-3 text-sm font-bold text-muted-foreground" aria-live="polite">
                        {hits.length === 30 ? "Top 30 results" : `${hits.length} result${hits.length === 1 ? "" : "s"}`}{" "}
                        for “{q}”
                    </h2>
                    <ul className="grid gap-2">
                        {hits.map((hit) => (
                            <Result
                                key={`${hit.doc.kind}-${hit.doc.id}`}
                                hit={hit}
                                tokens={tokens}
                                mastery={mastery?.get(hit.doc.id) ?? null}
                            />
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}

function Result({
    hit,
    tokens,
    mastery,
}: {
    hit: SearchHit;
    tokens: string[];
    mastery: { level: Parameters<typeof MasteryTile>[0]["level"]; score: number | null } | null;
}) {
    const { doc, point } = hit;
    const snippet = point ? plainSnippet(point.text) : doc.summary ? plainSnippet(doc.summary) : null;
    return (
        <li>
            <Link
                href={doc.href}
                className="group flex items-start gap-3 rounded-lg border bg-card px-4 py-3.5 transition-[border-color,box-shadow] duration-200 ease-out-soft hover:border-border-strong hover:shadow-card focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5"
            >
                {doc.kind === "topic" ? (
                    <MasteryTile code={doc.code} level={mastery?.level ?? "new"} className="mt-0.5" />
                ) : doc.kind === "unit" ? (
                    <UnitChip code={doc.code} className="mt-2" />
                ) : (
                    <span
                        className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-[14px] bg-foreground font-display text-[0.9375rem] font-extrabold text-background"
                        aria-hidden
                    >
                        {doc.name.slice(0, 2)}
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug">
                        <Highlighted text={doc.name} tokens={tokens} />
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                        {kindLabel[doc.kind]} · {doc.context}
                        {mastery && mastery.score !== null && ` · ${masteryLabel[mastery.level]} ${Math.round(mastery.score * 100)}%`}
                    </p>
                    {snippet && (
                        <p className="mt-1.5 line-clamp-2 text-[0.9375rem] text-muted-foreground">
                            {point && <span className="font-bold text-foreground">Spec point {point.index + 1}: </span>}
                            <Highlighted text={snippet} tokens={tokens} />
                        </p>
                    )}
                </div>
            </Link>
        </li>
    );
}

function Highlighted({ text, tokens }: { text: string; tokens: string[] }) {
    return (
        <>
            {highlight(text, tokens).map((s, i) =>
                s.match ? (
                    <mark key={i} className="rounded-[3px] bg-selected text-selected-foreground">
                        {s.text}
                    </mark>
                ) : (
                    <span key={i}>{s.text}</span>
                ),
            )}
        </>
    );
}
