import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CircleAlert, ListChecks } from "lucide-react";
import { ConfidencePicker } from "@/components/checklist/confidence-picker";
import { PrintButton } from "@/components/checklist/print-button";
import { KeyEquations } from "@/components/key-equations";
import { keyEquations } from "@/lib/key-equations";
import { EmptyState } from "@/components/empty-state";
import { MasteryTile } from "@/components/mastery";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import {
    addSummaries,
    confidenceLabel,
    findMismatch,
    mismatchMessage,
    summarize,
    type ConfidenceSummary,
} from "@/lib/checklist";
import { masteryLabel, masteryTone } from "@/lib/mastery";
import { getSpecRatings } from "@/lib/queries/checklist";
import { getUnitByCode } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { requireUser } from "@/lib/session";
import { APP_TIME_ZONE } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../../../_components/breadcrumbs";

type Params = Promise<{ subject: string; unit: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { unit: code } = await params;
    const unit = await getUnitByCode(code);
    return { title: unit ? `${unit.code} checklist` : "Checklist", robots: { index: false } };
}

export default async function ChecklistPage({ params }: { params: Params }) {
    const user = await requireUser();
    const { subject: subjectSlug, unit: code } = await params;
    const unit = await getUnitByCode(code);
    if (!unit) notFound();
    const unitHref = `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`;
    if (subjectSlug !== unit.subject.slug || code !== unit.code.toLowerCase()) permanentRedirect(`${unitHref}/checklist`);

    const topics = unit.topics.filter((t) => t.specPoints.length > 0);
    const [ratings, mastery] = await Promise.all([
        getSpecRatings(user.id, topics),
        getTopicMastery(
            user.id,
            topics.map((t) => t.id),
        ),
    ]);

    const rows = topics.map((t) => {
        const r = ratings.get(t.id)!;
        const m = mastery.get(t.id)!;
        return {
            topic: t,
            ratings: r,
            mastery: m,
            summary: summarize(t.specPoints.length, r.values()),
            mismatch: findMismatch([...r.values()], t.specPoints.length, m),
        };
    });
    const total = rows.reduce<ConfidenceSummary>((acc, r) => addSummaries(acc, r.summary), summarize(0, []));
    const flagged = rows.filter((r) => r.mismatch);
    const printedOn = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: APP_TIME_ZONE }).format(new Date());

    return (
        <>
            <div className="print:hidden">
                <Breadcrumbs
                    items={[
                        { href: "/subjects", label: "Subjects" },
                        { href: `/subjects/${unit.subject.slug}`, label: unit.subject.name },
                        { href: unitHref, label: unit.code },
                        { label: "Checklist" },
                    ]}
                />
            </div>
            <PageHeader
                title={`${unit.code} checklist`}
                description={
                    <>
                        Every specification point in {unit.name}. Rate how you feel about each one; your mastery from
                        practice sits alongside. <span className="hidden print:inline">Printed {printedOn}.</span>
                    </>
                }
                actions={topics.length > 0 ? <PrintButton /> : undefined}
            />

            {topics.length === 0 ? (
                <EmptyState
                    icon={ListChecks}
                    title="No specification points yet"
                    description="We're still mapping this unit's specification."
                />
            ) : (
                <>
                    <section
                        aria-label="Checklist summary"
                        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 print:mb-4 print:grid-cols-4"
                    >
                        <Count label={confidenceLabel.GREEN} value={total.green} total={total.total} />
                        <Count label={confidenceLabel.AMBER} value={total.amber} total={total.total} />
                        <Count label={confidenceLabel.RED} value={total.red} total={total.total} />
                        <Count label="Not rated" value={total.unrated} total={total.total} muted />
                    </section>

                    {flagged.length > 0 && (
                        <section
                            aria-labelledby="check-these"
                            className="mb-8 rounded-xl bg-primary-soft p-5 sm:p-6 print:break-inside-avoid print:border print:bg-transparent"
                        >
                            <h2 id="check-these" className="flex items-center gap-2 text-lg">
                                <CircleAlert className="size-5" aria-hidden /> Check these
                            </h2>
                            <ul className="mt-3 grid gap-2">
                                {flagged.map(({ topic, mismatch, mastery: m }) => (
                                    <li key={topic.id} className="rounded-lg bg-card px-4 py-3">
                                        <Link
                                            href={`${unitHref}/${topic.slug}`}
                                            className="font-bold underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                                        >
                                            {topic.code} {topic.name}
                                        </Link>{" "}
                                        <span className={cn("num", masteryTone[m.level].text)}>
                                            {m.score === null ? "" : `${Math.round(m.score * 100)}%`}
                                        </span>
                                        <p className="mt-0.5 text-[0.9375rem] text-muted-foreground">
                                            {mismatchMessage[mismatch!]}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <div className="grid gap-6 print:gap-4">
                        {rows.map(({ topic, ratings: r, mastery: m, summary }) => (
                            <section
                                key={topic.id}
                                aria-labelledby={`t-${topic.id}`}
                                className="rounded-xl border bg-card p-5 shadow-card sm:p-7 print:break-inside-avoid print:p-4 print:shadow-none"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <MasteryTile code={topic.code} level={m.level} />
                                    <div className="min-w-0 flex-1">
                                        <h2 id={`t-${topic.id}`} className="text-lg leading-tight">
                                            <Link
                                                href={`${unitHref}/${topic.slug}`}
                                                className="underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-border-strong"
                                            >
                                                {topic.name}
                                            </Link>
                                        </h2>
                                        <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                                            <span className={cn("font-bold", m.level !== "new" && masteryTone[m.level].text)}>
                                                {masteryLabel[m.level]}
                                                {m.score !== null && ` ${Math.round(m.score * 100)}%`}
                                            </span>{" "}
                                            · <span className="num">{summary.green}</span>/{summary.total} got it
                                        </p>
                                    </div>
                                </div>
                                <ol className="grid gap-4 print:gap-2">
                                    {topic.specPoints.map((point, i) => {
                                        const rating = r.get(i) ?? null;
                                        return (
                                            <li
                                                key={i}
                                                className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-6 print:grid-cols-[minmax(0,1fr)_7rem] print:gap-3"
                                            >
                                                <div className="flex gap-3">
                                                    <span
                                                        className="num grid size-7 shrink-0 place-items-center rounded-[10px] bg-muted pt-px text-sm text-muted-foreground"
                                                        aria-hidden
                                                    >
                                                        {i + 1}
                                                    </span>
                                                    <Markdown className="min-w-0 flex-1 pt-0.5 text-[0.9375rem] [&_p]:my-0">
                                                        {point}
                                                    </Markdown>
                                                </div>
                                                <ConfidencePicker
                                                    topicId={topic.id}
                                                    point={i}
                                                    initial={rating}
                                                    label={`How confident are you with ${topic.code} point ${i + 1}?`}
                                                    className="ml-10 sm:ml-0 print:hidden"
                                                />
                                                <span className="hidden text-right text-sm font-bold print:block">
                                                    {rating ? confidenceLabel[rating] : "☐"}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </section>
                        ))}
                        {keyEquations[unit.code] && (
                            <KeyEquations
                                groups={keyEquations[unit.code]}
                                topics={new Map(unit.topics.map((t) => [t.code, t.name]))}
                        title={unit.subject.slug.includes("mathematics") ? "Key formulae" : "Key equations"}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

function Count({ label, value, total, muted = false }: { label: string; value: number; total: number; muted?: boolean }) {
    return (
        <div className="rounded-xl border bg-card p-4 sm:px-5 print:p-3">
            <p className="text-[0.8125rem] font-bold text-muted-foreground">{label}</p>
            <p className="mt-1.5 flex items-baseline gap-1.5">
                <span className={cn("num text-[1.75rem] leading-none", muted && "text-muted-foreground")}>{value}</span>
                <span className="text-sm font-semibold text-muted-foreground">of {total}</span>
            </p>
        </div>
    );
}
