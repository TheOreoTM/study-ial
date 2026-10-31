import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Layers } from "lucide-react";
import { MasteryBreakdown, MasteryTile, summarizeMastery } from "@/components/mastery";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getSubjectBySlug, getUnitQuestionCounts } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { masteryLabel, masteryTone } from "@/lib/mastery";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../_components/breadcrumbs";
import { Chip, UnitChip } from "../_components/chips";
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
                title={subject.name}
                description={
                    <>
                        <span className="mt-1 flex flex-wrap items-center gap-2">
                            {subject.isLocal ? (
                                <Chip>Local subject</Chip>
                            ) : (
                                <>
                                    <Chip>Pearson Edexcel IAL</Chip>
                                    <Chip>{subject.code}</Chip>
                                </>
                            )}
                        </span>
                        {subject.description && <span className="mt-3 block">{subject.description}</span>}
                    </>
                }
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
                        const level = summary?.level ?? "new";
                        return (
                            <li key={unit.id} className="flex">
                                <article
                                    className={cn(
                                        "flex w-full flex-col rounded-xl p-5 sm:p-6",
                                        hasTopics ? "border bg-card shadow-card" : "bg-muted",
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <MasteryTile
                                            code={unit.number}
                                            level={level}
                                            className={cn("size-12 text-lg", !hasTopics && "bg-card")}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <UnitChip
                                                    size="sm"
                                                    muted={!hasTopics}
                                                    className={!hasTopics ? "bg-card" : undefined}
                                                >
                                                    {unit.code}
                                                </UnitChip>
                                                <span className="text-[0.8125rem] font-bold text-muted-foreground">
                                                    Unit {unit.number}
                                                </span>
                                                {!hasTopics && <Chip className="ml-auto bg-card">Coming soon</Chip>}
                                            </div>
                                            <h2 className="mt-2 text-xl leading-tight">
                                                {hasTopics ? (
                                                    <Link
                                                        href={href}
                                                        className="rounded-sm hover:underline hover:decoration-border-strong hover:underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                                    >
                                                        {unit.name}
                                                    </Link>
                                                ) : (
                                                    unit.name
                                                )}
                                            </h2>
                                            {hasTopics && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {unit.topics.length} topics · {questions} question
                                                    {questions === 1 ? "" : "s"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {unit.description && (
                                        <p className="mt-3 text-[0.9375rem] text-muted-foreground">
                                            {unit.description}
                                        </p>
                                    )}

                                    {summary && hasTopics && (
                                        <div className="mt-5 rounded-lg bg-muted px-4 py-3.5">
                                            <div className="mb-2.5 flex items-baseline justify-between gap-3">
                                                <span className="text-sm font-bold">Unit mastery</span>
                                                {summary.score === null ? (
                                                    <span className="text-sm text-muted-foreground">Not started</span>
                                                ) : (
                                                    <span className="flex items-baseline gap-2">
                                                        <span className="text-[0.75rem] font-extrabold tracking-[0.05em] text-muted-foreground uppercase">
                                                            {masteryLabel[summary.level]}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                "num text-xl leading-none",
                                                                masteryTone[summary.level].text,
                                                            )}
                                                        >
                                                            {Math.round(summary.score * 100)}%
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                            {summary.started > 0 ? (
                                                <MasteryBreakdown counts={summary.counts} />
                                            ) : (
                                                <div className="h-2.5 w-full rounded-full bg-track" aria-hidden />
                                            )}
                                        </div>
                                    )}

                                    {hasTopics && (
                                        <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                            {questions > 0 && (
                                                <PracticeLink
                                                    href={`/practice?unit=${unit.id}`}
                                                    signedIn={!!user}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Practise unit
                                                </PracticeLink>
                                            )}
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={href}>
                                                    View topics <ArrowRight />
                                                </Link>
                                            </Button>
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
