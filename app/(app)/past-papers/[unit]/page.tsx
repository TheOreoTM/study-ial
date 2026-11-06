import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { unitDisplayName } from "@/lib/papers/config";
import { AddPaperButton } from "@/components/papers/add-paper-button";
import { PaperCopyrightNote } from "@/components/papers/copyright-note";
import { DocChips } from "@/components/papers/doc-chips";
import { paperLabel, SERIES, SERIES_LABEL, type Series } from "@/lib/papers/filename";
import { getSavedSittingIds, getUnitSittings, seriesKey } from "@/lib/queries/papers";
import { getUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../../subjects/_components/breadcrumbs";
import { UnitChip } from "../../subjects/_components/chips";

type Params = Promise<{ unit: string }>;
type Search = Promise<{ series?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { unit } = await params;
    return { title: `${unit.toUpperCase()} past papers`, robots: { index: false, follow: false } };
}

export default async function UnitPapersPage({ params, searchParams }: { params: Params; searchParams: Search }) {
    const [{ unit: code }, { series: seriesParam }] = await Promise.all([params, searchParams]);
    if (!/^[a-z]{3}\d{2}$/i.test(code)) notFound();
    const [all, user] = await Promise.all([getUnitSittings(code), getUser()]);
    if (all.length === 0) notFound();
    const saved = user ? await getSavedSittingIds(user.id) : new Set<string>();

    const series = SERIES.includes(seriesParam as Series) ? (seriesParam as Series) : null;
    const sittings = series ? all.filter((s) => seriesKey(s.series) === series) : all;
    const first = all[0];
    const unitName = unitDisplayName(first.unitCode, first.unit?.name);
    const subject = first.unit?.subject ?? null;
    const here = `/past-papers/${code.toLowerCase()}`;

    const byYear = new Map<number, typeof sittings>();
    for (const s of sittings) {
        const y = s.year ?? 0;
        byYear.set(y, [...(byYear.get(y) ?? []), s]);
    }

    return (
        <>
            <Breadcrumbs items={[{ href: "/past-papers", label: "Past papers" }, { label: first.unitCode }]} />
            <PageHeader
                title={
                    <span className="flex flex-wrap items-center gap-3">
                        <UnitChip>{first.unitCode}</UnitChip>
                        {unitName}
                    </span>
                }
                description={
                    <>
                        {all.length} sitting{all.length === 1 ? "" : "s"}
                        {first.spec ? ` · ${first.spec} specification` : ""}
                        {subject && (
                            <>
                                {" · "}
                                <Link
                                    href={`/subjects/${subject.slug}/${first.unitCode.toLowerCase()}`}
                                    className="font-semibold underline decoration-border-strong underline-offset-4 hover:text-foreground"
                                >
                                    Topics for this unit
                                </Link>
                            </>
                        )}
                    </>
                }
            />

            <nav aria-label="Series" className="mb-6 flex flex-wrap gap-1.5">
                {[null, ...SERIES].map((s) => {
                    const active = s === series;
                    return (
                        <Link
                            key={s ?? "all"}
                            href={s ? `${here}?series=${s}` : here}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "inline-flex min-h-11 items-center rounded-full px-4 font-display font-bold transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                active ? "bg-selected text-selected-foreground" : "bg-muted hover:bg-track",
                            )}
                        >
                            {s ? SERIES_LABEL[s] : "All series"}
                        </Link>
                    );
                })}
            </nav>

            {sittings.length === 0 ? (
                <EmptyState icon={FileText} title="No sittings in this series" description="Try another series." />
            ) : (
                <div className="space-y-8">
                    {[...byYear.entries()].map(([year, rows]) => (
                        <section key={year} aria-labelledby={`y${year}`}>
                            <h2 id={`y${year}`} className="mb-3 text-lg">
                                {year || "Unknown year"}
                            </h2>
                            <ul className="divide-y rounded-lg border bg-card shadow-card">
                                {rows.map((s) => {
                                    const sk = seriesKey(s.series);
                                    return (
                                        <li key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-display text-[1.0625rem] font-extrabold">
                                                    {sk ? SERIES_LABEL[sk] : "Unknown series"} {s.year}
                                                    {s.paperCode !== "01" && (
                                                        <span className="ml-2 text-muted-foreground">{paperLabel(s.paperCode)}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <DocChips types={s.types} />
                                            <AddPaperButton sittingId={s.id} saved={saved.has(s.id)} signedIn={!!user} next={here} />
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
            <PaperCopyrightNote className="mt-12 max-w-3xl" />
        </>
    );
}
