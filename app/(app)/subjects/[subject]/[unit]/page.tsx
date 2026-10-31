import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ListTree, Target } from "lucide-react";
import { MasteryBreakdown, summarizeMastery } from "@/components/mastery";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { getQuestionCounts, getUnitByCode } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { masteryLabel, masteryTone } from "@/lib/mastery";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { Breadcrumbs } from "../../_components/breadcrumbs";
import { Chip, UnitChip } from "../../_components/chips";
import { PracticeLink } from "../../_components/practice-link";
import { TopicRow } from "../../_components/topic-row";

type Params = Promise<{ subject: string; unit: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { unit: code } = await params;
    const unit = await getUnitByCode(code);
    if (!unit) return { title: "Unit not found" };
    const prefix = unit.subject.isLocal ? unit.subject.name : `IAL ${unit.subject.name}`;
    const title = `${unit.code} ${unit.name} — ${prefix} Unit ${unit.number}`;
    const topics = unit.topics
        .slice(0, 6)
        .map((t) => t.name)
        .join(", ");
    return {
        title,
        description: `Topic-by-topic practice questions for ${prefix} ${unit.code} (${unit.name})${topics ? `: ${topics}${unit.topics.length > 6 ? " and more" : ""}` : ""}. Marked against exam-style mark schemes.`,
        alternates: { canonical: `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}` },
        openGraph: { title: `${title} · ${site.name}` },
    };
}

export default async function UnitPage({ params }: { params: Params }) {
    const { subject: subjectSlug, unit: code } = await params;
    const [unit, user] = await Promise.all([getUnitByCode(code), getUser()]);
    if (!unit) notFound();
    const canonical = `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`;
    if (subjectSlug !== unit.subject.slug || code !== unit.code.toLowerCase()) permanentRedirect(canonical);

    const topicIds = unit.topics.map((t) => t.id);
    const [counts, mastery] = await Promise.all([
        getQuestionCounts(topicIds),
        user ? getTopicMastery(user.id, topicIds) : null,
    ]);
    const totalQuestions = [...counts.values()].reduce((a, b) => a + b, 0);
    const summary = mastery ? summarizeMastery(topicIds.map((id) => mastery.get(id)!)) : null;

    // "Next up": the weakest started topic that isn't strong yet and has questions to practise.
    let nextUpId: string | null = null;
    if (mastery) {
        let lowest = Infinity;
        for (const t of unit.topics) {
            const m = mastery.get(t.id);
            if (!m || m.score === null || m.level === "strong" || (counts.get(t.id) ?? 0) === 0) continue;
            if (m.score < lowest) {
                lowest = m.score;
                nextUpId = t.id;
            }
        }
    }

    const showSummary = !!summary && summary.started > 0;
    const showSignUp = !user && totalQuestions > 0;
    const hasRail = showSummary || showSignUp;

    return (
        <>
            <Breadcrumbs
                items={[
                    { href: "/subjects", label: "Subjects" },
                    { href: `/subjects/${unit.subject.slug}`, label: unit.subject.name },
                    { label: unit.code },
                ]}
            />
            <PageHeader
                title={unit.name}
                description={
                    <>
                        <span className="mt-1 flex flex-wrap items-center gap-2">
                            <UnitChip>{unit.code}</UnitChip>
                            <Chip>Unit {unit.number}</Chip>
                            <Chip>
                                {unit.topics.length} topic{unit.topics.length === 1 ? "" : "s"} · {totalQuestions}{" "}
                                question{totalQuestions === 1 ? "" : "s"}
                            </Chip>
                        </span>
                        {unit.description && <span className="mt-3 block">{unit.description}</span>}
                    </>
                }
                actions={
                    totalQuestions > 0 ? (
                        // Phones: full-width buttons, the main action on top. From 640px they sit in a row with the
                        // main action on the right.
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row-reverse">
                            <PracticeLink href={`/practice?unit=${unit.id}`} signedIn={!!user}>
                                Practise this unit
                            </PracticeLink>
                            <PracticeLink
                                href={`/practice?mode=weak&unit=${unit.id}`}
                                signedIn={!!user}
                                variant="outline"
                            >
                                <Target />
                                Practise weak topics
                            </PracticeLink>
                        </div>
                    ) : undefined
                }
            />

            {unit.topics.length === 0 ? (
                <EmptyState
                    icon={ListTree}
                    title="Topics coming soon"
                    description="We're mapping this unit's specification now."
                />
            ) : (
                <div className={hasRail ? "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]" : undefined}>
                    <section aria-labelledby="unit-topics" className="rounded-xl border bg-card p-3 shadow-card">
                        <h2 id="unit-topics" className="sr-only">
                            Topics
                        </h2>
                        <ol className="space-y-1.5">
                            {unit.topics.map((topic) => {
                                const n = counts.get(topic.id) ?? 0;
                                const m = mastery?.get(topic.id);
                                const isNext = topic.id === nextUpId;
                                return (
                                    <li key={topic.id} className={isNext ? "py-1" : undefined}>
                                        <TopicRow
                                            href={`${canonical}/${topic.slug}`}
                                            code={topic.code}
                                            name={topic.name}
                                            mastery={m ?? null}
                                            isNext={isNext}
                                            meta={
                                                <>
                                                    {isNext && (
                                                        <span className="font-bold text-foreground">
                                                            Revise next ·{" "}
                                                        </span>
                                                    )}
                                                    {n === 0
                                                        ? "Questions coming soon"
                                                        : `${n} question${n === 1 ? "" : "s"}`}
                                                    {m &&
                                                        m.attempts > 0 &&
                                                        ` · ${m.attempts} attempt${m.attempts === 1 ? "" : "s"}`}
                                                </>
                                            }
                                        />
                                    </li>
                                );
                            })}
                        </ol>
                    </section>

                    {hasRail && (
                        <aside className="space-y-4 lg:sticky lg:top-6">
                            {showSummary && summary && (
                                <section aria-labelledby="unit-mastery" className="rounded-xl bg-muted p-5 sm:p-6">
                                    <h2 id="unit-mastery" className="text-lg">
                                        Your unit mastery
                                    </h2>
                                    <div className="mt-3 mb-4 flex items-end justify-between gap-3">
                                        <span
                                            className={cn(
                                                "num text-[2.5rem] leading-none",
                                                masteryTone[summary.level].text,
                                            )}
                                        >
                                            {summary.score === null ? "–" : `${Math.round(summary.score * 100)}%`}
                                        </span>
                                        <span className="pb-1 text-right text-sm text-muted-foreground">
                                            <span className="block text-[0.8125rem] font-extrabold tracking-[0.05em] text-foreground uppercase">
                                                {masteryLabel[summary.level]}
                                            </span>
                                            <span className="num text-foreground">
                                                {summary.started}/{summary.topics}
                                            </span>{" "}
                                            topics started
                                        </span>
                                    </div>
                                    <MasteryBreakdown counts={summary.counts} />
                                </section>
                            )}
                            {showSignUp && (
                                <p className="rounded-xl bg-muted p-5 text-muted-foreground sm:p-6">
                                    <Link
                                        href="/sign-up"
                                        className="font-bold text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
                                    >
                                        Create a free account
                                    </Link>{" "}
                                    to practise these topics and track your mastery of each one.
                                </p>
                            )}
                        </aside>
                    )}
                </div>
            )}
        </>
    );
}
