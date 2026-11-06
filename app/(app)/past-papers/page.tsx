import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { unitDisplayName } from "@/lib/papers/config";
import { PaperCopyrightNote } from "@/components/papers/copyright-note";
import { Button } from "@/components/ui/button";
import { getPaperIndex } from "@/lib/queries/papers";
import { getUser } from "@/lib/session";
import { UnitChip } from "../subjects/_components/chips";

// Metadata only, but kept out of search results anyway: nothing Pearson-owned on SEO pages.
export const metadata: Metadata = {
    title: "IAL past papers",
    description: "Browse Edexcel IAL past paper sittings by subject and unit, and add them to your study workspace.",
    robots: { index: false, follow: true },
};

const ordinalLabel = (ord: number) => {
    if (!ord || !Number.isFinite(ord)) return null;
    return String(Math.floor(ord / 100));
};

export default async function PastPapersPage() {
    const [subjects, user] = await Promise.all([getPaperIndex(), getUser()]);
    const withUnits = subjects.filter((s) => s.units.length > 0);

    return (
        <>
            <PageHeader
                title="Past papers"
                description="Open-access Edexcel IAL question papers, mark schemes and examiner reports. Add a sitting to your papers to read it beside its mark scheme, attempt it and get it marked."
                actions={
                    user ? (
                        <Button asChild variant="outline">
                            <Link href="/papers">My papers</Link>
                        </Button>
                    ) : null
                }
            />
            {withUnits.length === 0 ? (
                <EmptyState icon={FileText} title="No papers indexed yet" description="The index is being built. Check back soon." />
            ) : (
                <>
                    <nav aria-label="Subjects" className="mb-8 flex flex-wrap gap-1.5">
                        {withUnits.map((s) => (
                            <a
                                key={s.slug}
                                href={`#${s.slug}`}
                                className="inline-flex min-h-11 items-center rounded-full bg-muted px-4 font-display font-bold transition-colors duration-150 hover:bg-track focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                                {s.name}
                            </a>
                        ))}
                    </nav>
                    <div className="space-y-10">
                        {withUnits.map((s) => (
                            <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-h`} className="scroll-mt-24">
                                <h2 id={`${s.slug}-h`} className="mb-4 text-xl">
                                    {s.name}
                                </h2>
                                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {s.units.map((u) => {
                                        const from = ordinalLabel(u.earliest);
                                        const to = ordinalLabel(u.latest);
                                        return (
                                            <li key={u.code}>
                                                <Link
                                                    href={`/past-papers/${u.code.toLowerCase()}`}
                                                    className="flex min-h-[4.5rem] items-center gap-3 rounded-lg border bg-card p-4 shadow-card transition-[box-shadow,border-color,translate] duration-200 ease-out-soft hover:-translate-y-px hover:border-border-strong/50 hover:shadow-raised focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                                >
                                                    <UnitChip muted={!u.name} className="w-[4.5rem] justify-center">
                                                        {u.code}
                                                    </UnitChip>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate font-semibold">
                                                            {unitDisplayName(u.code, u.name)}
                                                        </span>
                                                        <span className="block text-sm text-muted-foreground">
                                                            <span className="num text-foreground">{u.sittings}</span> sitting
                                                            {u.sittings === 1 ? "" : "s"}
                                                            {from && to ? ` · ${from === to ? from : `${from}–${to}`}` : ""}
                                                        </span>
                                                    </span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ))}
                    </div>
                </>
            )}
            <PaperCopyrightNote className="mt-12 max-w-3xl" />
        </>
    );
}
