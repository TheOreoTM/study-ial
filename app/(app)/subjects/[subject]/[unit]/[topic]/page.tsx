import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, History, Play } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { masteryTone, type MasteryLevel } from "@/lib/mastery";
import { getTopic, getTopicQuestionTypeCounts, getUnitByCode } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../../../_components/breadcrumbs";
import { Chip, UnitChip } from "../../../_components/chips";
import { PracticeLink } from "../../../_components/practice-link";
import { TopicRow } from "../../../_components/topic-row";

type Params = Promise<{ subject: string; unit: string; topic: string }>;

const typeLabels = [
    ["MCQ", "Multiple choice"],
    ["SHORT", "Short answer"],
    ["CALCULATION", "Calculation"],
    ["LONG", "Extended response"],
] as const;

/** Colour a marked attempt like the mastery it feeds: full-ish marks teal, partial sun, low bubblegum. */
function markLevel(ratio: number): MasteryLevel {
    return ratio >= 0.75 ? "strong" : ratio >= 0.4 ? "developing" : "weak";
}

const methodLabel = { AUTO: "Auto-marked", SELF: "Self-marked", AI: "AI-marked" } as const;

/** Strip Markdown/LaTeX noise for meta descriptions. */
function plain(text: string) {
    return text
        .replace(/\$+([^$]*)\$+/g, "$1")
        .replace(/[*_`#>\\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { unit: code, topic: slug } = await params;
    const topic = await getTopic(code, slug);
    if (!topic) return { title: "Topic not found" };
    const { unit } = topic;
    const prefix = unit.subject.isLocal ? unit.subject.name : `IAL ${unit.subject.name}`;
    const title = `${topic.name} — ${unit.code} ${prefix} practice questions`;
    const about = topic.summary
        ? plain(topic.summary)
        : `Specification topic ${topic.code} of ${unit.code} ${unit.name}.`;
    return {
        title,
        description:
            `${about} Practise ${prefix} ${unit.code} topic ${topic.code} questions with mark schemes and instant feedback.`.slice(
                0,
                300,
            ),
        alternates: { canonical: `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}/${topic.slug}` },
        openGraph: { title: `${topic.name} · ${unit.code} · ${site.name}` },
    };
}

export default async function TopicPage({ params }: { params: Params }) {
    const { subject: subjectSlug, unit: code, topic: slug } = await params;
    const [topic, unit, user] = await Promise.all([getTopic(code, slug), getUnitByCode(code), getUser()]);
    if (!topic || !unit) notFound();
    const unitHref = `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`;
    if (subjectSlug !== unit.subject.slug || code !== unit.code.toLowerCase())
        permanentRedirect(`${unitHref}/${topic.slug}`);

    const [typeCounts, mastery, recent] = await Promise.all([
        getTopicQuestionTypeCounts(topic.id),
        user ? getTopicMastery(user.id, [topic.id]).then((m) => m.get(topic.id)!) : null,
        user
            ? db.attempt.findMany({
                  where: { userId: user.id, question: { topicId: topic.id } },
                  orderBy: { createdAt: "desc" },
                  take: 8,
                  select: {
                      id: true,
                      marksAwarded: true,
                      maxMarks: true,
                      method: true,
                      createdAt: true,
                      question: { select: { stem: true, type: true } },
                  },
              })
            : [],
    ]);
    const total = [...typeCounts.values()].reduce((a, b) => a + b, 0);

    const idx = unit.topics.findIndex((t) => t.id === topic.id);
    const prev = idx > 0 ? unit.topics[idx - 1] : null;
    const next = idx >= 0 && idx < unit.topics.length - 1 ? unit.topics[idx + 1] : null;

    return (
        <>
            <Breadcrumbs
                items={[
                    { href: "/subjects", label: "Subjects" },
                    { href: `/subjects/${unit.subject.slug}`, label: unit.subject.name },
                    { href: unitHref, label: unit.code },
                    { label: topic.code },
                ]}
            />
            <PageHeader
                title={topic.name}
                description={
                    <span className="mt-1 flex flex-wrap items-center gap-2">
                        <UnitChip>{unit.code}</UnitChip>
                        <Chip>Topic {topic.code}</Chip>
                        <Chip>
                            {total === 0 ? "Questions coming soon" : `${total} question${total === 1 ? "" : "s"}`}
                        </Chip>
                    </span>
                }
                actions={
                    total > 0 ? (
                        <PracticeLink href={`/practice?topic=${topic.id}`} signedIn={!!user} size="lg">
                            <Play className="fill-current" />
                            {user ? "Start practice" : "Sign up to practise"}
                        </PracticeLink>
                    ) : undefined
                }
            />

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-y-8">
                <section
                    aria-labelledby="spec-points"
                    className="min-w-0 rounded-xl border bg-card p-5 shadow-card sm:p-8 lg:col-start-1"
                >
                    {topic.summary && (
                        <Markdown className="mb-6 max-w-[62ch] text-[1.0625rem] text-muted-foreground [&_p]:my-0!">
                            {topic.summary}
                        </Markdown>
                    )}
                    <h2 id="spec-points" className="text-lg">
                        Specification points
                    </h2>
                    {topic.specPoints.length === 0 ? (
                        <p className="mt-3 text-muted-foreground">
                            Specification points for this topic are coming soon.
                        </p>
                    ) : (
                        <ol className="mt-4 space-y-4">
                            {topic.specPoints.map((point, i) => (
                                <li key={i} className="flex gap-3.5">
                                    <span
                                        className="num grid size-7 shrink-0 place-items-center rounded-[10px] bg-muted pt-px text-sm text-muted-foreground"
                                        aria-hidden
                                    >
                                        {i + 1}
                                    </span>
                                    <Markdown className="min-w-0 flex-1 pt-0.5 text-base [&_p]:my-0!">{point}</Markdown>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>

                {user && (
                    <section aria-labelledby="recent-attempts" className="mt-2 min-w-0 lg:col-start-1 lg:mt-0">
                        <h2 id="recent-attempts" className="mb-3 text-lg">
                            Recent attempts
                        </h2>
                        {recent.length === 0 ? (
                            <EmptyState
                                icon={History}
                                title="No attempts yet"
                                description={
                                    total > 0 ? "Start a practice session to see your answers here." : undefined
                                }
                                className="py-8"
                            />
                        ) : (
                            <ul className="space-y-2">
                                {recent.map((a) => {
                                    const ratio = a.maxMarks > 0 ? a.marksAwarded / a.maxMarks : 0;
                                    return (
                                        <li
                                            key={a.id}
                                            className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3.5"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <Markdown className="line-clamp-2 text-[0.9375rem] [&_.katex-display]:my-0! [&_p]:my-0!">
                                                    {a.question.stem}
                                                </Markdown>
                                                <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                                                    {methodLabel[a.method]} ·{" "}
                                                    <time dateTime={a.createdAt.toISOString()}>
                                                        {formatDistanceToNow(a.createdAt, { addSuffix: true })}
                                                    </time>
                                                </p>
                                            </div>
                                            <span
                                                className={cn(
                                                    "num shrink-0 rounded-full px-2.5 py-1 text-sm leading-none",
                                                    masteryTone[markLevel(ratio)].badge,
                                                )}
                                            >
                                                <span className="sr-only">Marks: </span>
                                                {a.marksAwarded}/{a.maxMarks}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                )}

                <aside
                    className={cn(
                        "space-y-4 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1",
                        user && "lg:row-span-2",
                    )}
                >
                    {mastery && (
                        <section aria-labelledby="your-mastery" className="rounded-xl bg-muted p-5">
                            <h2 id="your-mastery" className="mb-3 text-lg">
                                Your mastery
                            </h2>
                            <TopicRow code={topic.code} name={topic.name} mastery={mastery} />
                            {mastery.attempts > 0 && (
                                <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                                    {mastery.attempts} attempt{mastery.attempts === 1 ? "" : "s"} · last{" "}
                                    {formatDistanceToNow(mastery.lastPracticedAt!, { addSuffix: true })}
                                </p>
                            )}
                        </section>
                    )}

                    <section aria-labelledby="question-types" className="rounded-xl bg-muted p-5">
                        <h2 id="question-types" className="mb-3 text-lg">
                            Questions
                        </h2>
                        {total === 0 ? (
                            <p className="text-muted-foreground">Questions for this topic are coming soon.</p>
                        ) : (
                            <dl className="space-y-1 rounded-lg bg-card px-4 py-3">
                                {typeLabels.map(([type, label]) => {
                                    const n = typeCounts.get(type) ?? 0;
                                    if (n === 0) return null;
                                    return (
                                        <div key={type} className="flex items-baseline justify-between gap-2 py-0.5">
                                            <dt className="text-muted-foreground">{label}</dt>
                                            <dd className="num">{n}</dd>
                                        </div>
                                    );
                                })}
                                <div className="mt-1 flex items-baseline justify-between gap-2 border-t pt-2">
                                    <dt className="font-bold">Total</dt>
                                    <dd className="num text-lg leading-none">{total}</dd>
                                </div>
                            </dl>
                        )}
                    </section>
                </aside>
            </div>

            {(prev || next) && (
                <nav aria-label="Other topics in this unit" className="mt-12 grid gap-3 sm:grid-cols-2">
                    {prev ? (
                        <Link href={`${unitHref}/${prev.slug}`} className={adjacentCls}>
                            <span className="flex items-center gap-1 text-[0.8125rem] font-bold text-muted-foreground">
                                <ChevronLeft className="size-4" aria-hidden /> Previous topic
                            </span>
                            <span className="mt-1 flex items-baseline gap-2 font-bold">
                                <span className="num text-muted-foreground">{prev.code}</span>
                                <span className="min-w-0">{prev.name}</span>
                            </span>
                        </Link>
                    ) : (
                        <span className="hidden sm:block" />
                    )}
                    {next && (
                        <Link href={`${unitHref}/${next.slug}`} className={cn(adjacentCls, "sm:text-right")}>
                            <span className="flex items-center gap-1 text-[0.8125rem] font-bold text-muted-foreground sm:justify-end">
                                Next topic <ChevronRight className="size-4" aria-hidden />
                            </span>
                            <span className="mt-1 flex items-baseline gap-2 font-bold sm:justify-end">
                                <span className="num text-muted-foreground">{next.code}</span>
                                <span className="min-w-0">{next.name}</span>
                            </span>
                        </Link>
                    )}
                </nav>
            )}
        </>
    );
}

const adjacentCls =
    "block rounded-lg border bg-card px-5 py-4 transition-[box-shadow,border-color] duration-200 ease-out-soft hover:border-border-strong hover:shadow-card focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring";
