import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronRight, ListTree, Target } from "lucide-react";
import { MasteryBadge, MasteryBar, MasteryBreakdown, summarizeMastery } from "@/components/mastery";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getQuestionCounts, getUnitByCode } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { Breadcrumbs } from "../../_components/breadcrumbs";
import { PracticeLink } from "../../_components/practice-link";

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
                eyebrow={
                    <>
                        Unit {unit.number} · <span className="font-mono">{unit.code}</span>
                    </>
                }
                title={unit.name}
                description={
                    unit.description ??
                    `${unit.topics.length} topics · ${totalQuestions} practice question${totalQuestions === 1 ? "" : "s"}`
                }
                actions={
                    totalQuestions > 0 ? (
                        <>
                            <PracticeLink
                                href={`/practice?mode=weak&unit=${unit.id}`}
                                signedIn={!!user}
                                variant="outline"
                            >
                                <Target />
                                Practise weak topics
                            </PracticeLink>
                            <PracticeLink href={`/practice?unit=${unit.id}`} signedIn={!!user}>
                                Practise this unit
                            </PracticeLink>
                        </>
                    ) : undefined
                }
            />

            {summary && summary.started > 0 && (
                <div className="mb-6 rounded-xl border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">Your unit mastery</span>
                        <span className="text-muted-foreground tabular-nums">
                            {summary.started}/{summary.topics} topics started
                        </span>
                    </div>
                    <MasteryBreakdown counts={summary.counts} />
                </div>
            )}

            {!user && totalQuestions > 0 && (
                <p className="mb-6 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                    <Link href="/sign-up" className="font-medium text-foreground underline underline-offset-4">
                        Create a free account
                    </Link>{" "}
                    to practise these topics and track your mastery of each one.
                </p>
            )}

            {unit.topics.length === 0 ? (
                <EmptyState
                    icon={ListTree}
                    title="Topics coming soon"
                    description="We're mapping this unit's specification now."
                />
            ) : (
                <ol className="divide-y overflow-hidden rounded-xl border bg-card">
                    {unit.topics.map((topic) => {
                        const n = counts.get(topic.id) ?? 0;
                        const m = mastery?.get(topic.id);
                        return (
                            <li key={topic.id}>
                                <Link
                                    href={`${canonical}/${topic.slug}`}
                                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none sm:gap-4"
                                >
                                    <span className="w-8 shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
                                        {topic.code}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium leading-snug">{topic.name}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {n === 0 ? "Questions coming soon" : `${n} question${n === 1 ? "" : "s"}`}
                                            {m &&
                                                m.attempts > 0 &&
                                                ` · ${m.attempts} attempt${m.attempts === 1 ? "" : "s"}`}
                                        </p>
                                        {m && m.level !== "new" && (
                                            <MasteryBar
                                                level={m.level}
                                                score={m.score}
                                                label={topic.name}
                                                className="mt-2 max-w-xs"
                                            />
                                        )}
                                    </div>
                                    {m && (
                                        <MasteryBadge
                                            level={m.level}
                                            score={m.score}
                                            showScore
                                            className="hidden sm:inline-flex"
                                        />
                                    )}
                                    {m && m.level !== "new" && <MasteryBadge level={m.level} className="sm:hidden" />}
                                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            )}
        </>
    );
}
