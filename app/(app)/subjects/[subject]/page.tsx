import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Layers } from "lucide-react";
import { MasteryBadge, MasteryBar, MasteryBreakdown, summarizeMastery } from "@/components/mastery";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getSubjectBySlug, getUnitQuestionCounts } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { Breadcrumbs } from "../_components/breadcrumbs";
import { PracticeLink } from "../_components/practice-link";

type Params = Promise<{ subject: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const subject = await getSubjectBySlug((await params).subject);
    if (!subject) return { title: "Subject not found" };
    const qualifier = subject.isLocal ? subject.name : `Edexcel IAL ${subject.name}`;
    const units = subject.units.map((u) => u.code).join(", ");
    return {
        title: `${qualifier} — units and topics`,
        description:
            `${qualifier} practice questions by unit and topic${units ? ` (${units})` : ""}. ${subject.description ?? ""}`.trim(),
        alternates: { canonical: `/subjects/${subject.slug}` },
        openGraph: { title: `${qualifier} · ${site.name}`, url: `/subjects/${subject.slug}` },
    };
}

export default async function SubjectPage({ params }: { params: Params }) {
    const { subject: slug } = await params;
    const [subject, user] = await Promise.all([getSubjectBySlug(slug), getUser()]);
    if (!subject) notFound();

    const topicIds = subject.units.flatMap((u) => u.topics.map((t) => t.id));
    const [questionCounts, mastery] = await Promise.all([
        getUnitQuestionCounts(subject.units.map((u) => u.id)),
        user ? getTopicMastery(user.id, topicIds) : null,
    ]);

    return (
        <>
            <Breadcrumbs items={[{ href: "/subjects", label: "Subjects" }, { label: subject.name }]} />
            <PageHeader
                eyebrow={subject.isLocal ? "Local subject" : `Pearson Edexcel IAL · ${subject.code}`}
                title={subject.name}
                description={subject.description}
            />

            {subject.units.length === 0 ? (
                <EmptyState
                    icon={Layers}
                    title="Units coming soon"
                    description="We're adding this subject's units now."
                />
            ) : (
                <ul className="grid gap-4 md:grid-cols-2">
                    {subject.units.map((unit) => {
                        const href = `/subjects/${subject.slug}/${unit.code.toLowerCase()}`;
                        const questions = questionCounts.get(unit.id) ?? 0;
                        const hasTopics = unit.topics.length > 0;
                        const summary = mastery ? summarizeMastery(unit.topics.map((t) => mastery.get(t.id)!)) : null;
                        return (
                            <li key={unit.id} className="flex">
                                <article className="flex w-full flex-col rounded-xl border bg-card p-5 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Unit {unit.number} · <span className="font-mono">{unit.code}</span>
                                            </p>
                                            <h2 className="mt-1 font-semibold leading-snug">
                                                {hasTopics ? (
                                                    <Link href={href} className="hover:underline">
                                                        {unit.name}
                                                    </Link>
                                                ) : (
                                                    unit.name
                                                )}
                                            </h2>
                                        </div>
                                        {!hasTopics && <Badge variant="outline">Coming soon</Badge>}
                                        {summary && summary.started > 0 && <MasteryBadge level={summary.level} />}
                                    </div>
                                    {unit.description && (
                                        <p className="mt-2 text-sm text-muted-foreground">{unit.description}</p>
                                    )}
                                    {hasTopics && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {unit.topics.length} topics · {questions} question
                                            {questions === 1 ? "" : "s"}
                                        </p>
                                    )}

                                    {summary && hasTopics && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Unit mastery</span>
                                                <span className="tabular-nums">
                                                    {summary.score === null
                                                        ? "Not started"
                                                        : `${Math.round(summary.score * 100)}%`}
                                                </span>
                                            </div>
                                            {summary.started > 0 ? (
                                                <MasteryBreakdown counts={summary.counts} />
                                            ) : (
                                                <MasteryBar
                                                    level={summary.level}
                                                    score={summary.score}
                                                    label={unit.name}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {hasTopics && (
                                        <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                            {questions > 0 && (
                                                <PracticeLink
                                                    href={`/practice?unit=${unit.id}`}
                                                    signedIn={!!user}
                                                    size="sm"
                                                >
                                                    Practise unit
                                                </PracticeLink>
                                            )}
                                            <Link
                                                href={href}
                                                className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                View topics <ArrowRight className="size-3.5" />
                                            </Link>
                                        </div>
                                    )}
                                </article>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
