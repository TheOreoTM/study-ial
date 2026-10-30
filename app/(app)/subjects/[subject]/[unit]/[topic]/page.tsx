import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, History, Play } from "lucide-react";
import { MasteryBadge, MasteryBar } from "@/components/mastery";
import { EmptyState } from "@/components/empty-state";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { masteryLabel } from "@/lib/mastery";
import { getTopic, getTopicQuestionTypeCounts, getUnitByCode } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { getUser } from "@/lib/session";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../../../_components/breadcrumbs";
import { PracticeLink } from "../../../_components/practice-link";

type Params = Promise<{ subject: string; unit: string; topic: string }>;

const typeLabels = [
    ["MCQ", "Multiple choice"],
    ["SHORT", "Short answer"],
    ["CALCULATION", "Calculation"],
    ["LONG", "Extended response"],
] as const;

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
                eyebrow={
                    <>
                        <span className="font-mono">{unit.code}</span> · Topic {topic.code}
                    </>
                }
                title={topic.name}
                actions={
                    total > 0 ? (
                        <PracticeLink href={`/practice?topic=${topic.id}`} signedIn={!!user} size="lg">
                            <Play />
                            {user ? "Start practice" : "Sign up to practise"}
                        </PracticeLink>
                    ) : undefined
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <div className="min-w-0 space-y-6">
                    {topic.summary && (
                        <section aria-label="Summary">
                            <Markdown className="text-base text-muted-foreground">{topic.summary}</Markdown>
                        </section>
                    )}

                    <Card className="gap-4">
                        <CardHeader>
                            <CardTitle>
                                <h2>Specification points</h2>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topic.specPoints.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Specification points for this topic are coming soon.
                                </p>
                            ) : (
                                <ol className="space-y-2.5">
                                    {topic.specPoints.map((point, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="mt-0.5 w-5 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
                                                {i + 1}.
                                            </span>
                                            <Markdown className="min-w-0 flex-1 [&_p]:my-0!">{point}</Markdown>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </CardContent>
                    </Card>

                    {user && (
                        <section aria-labelledby="recent-attempts">
                            <h2 id="recent-attempts" className="mb-3 font-semibold">
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
                                <ul className="divide-y rounded-xl border bg-card">
                                    {recent.map((a) => {
                                        const ratio = a.maxMarks > 0 ? a.marksAwarded / a.maxMarks : 0;
                                        return (
                                            <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                                                <div className="min-w-0 flex-1">
                                                    <Markdown className="line-clamp-2 text-sm [&_.katex-display]:my-0! [&_p]:my-0!">
                                                        {a.question.stem}
                                                    </Markdown>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {methodLabel[a.method]} ·{" "}
                                                        <time dateTime={a.createdAt.toISOString()}>
                                                            {formatDistanceToNow(a.createdAt, { addSuffix: true })}
                                                        </time>
                                                    </p>
                                                </div>
                                                <span
                                                    className={cn(
                                                        "shrink-0 rounded-md px-2 py-0.5 text-sm font-medium tabular-nums",
                                                        ratio >= 0.75
                                                            ? "bg-success/15 text-success"
                                                            : ratio >= 0.4
                                                              ? "bg-warning/15 text-amber-700 dark:text-warning"
                                                              : "bg-destructive/10 text-destructive",
                                                    )}
                                                >
                                                    {a.marksAwarded}/{a.maxMarks}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </section>
                    )}
                </div>

                <aside className="space-y-4">
                    {mastery && (
                        <Card className="gap-3 py-5">
                            <CardHeader className="px-5">
                                <CardTitle className="flex items-center justify-between gap-2 text-sm">
                                    <h2>Your mastery</h2>
                                    <MasteryBadge level={mastery.level} />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 px-5">
                                <p className="text-3xl font-semibold tabular-nums">
                                    {mastery.score === null ? "—" : `${Math.round(mastery.score * 100)}%`}
                                </p>
                                <MasteryBar level={mastery.level} score={mastery.score} label={topic.name} />
                                <p className="text-xs text-muted-foreground">
                                    {mastery.attempts === 0
                                        ? masteryLabel.new
                                        : `${mastery.attempts} attempt${mastery.attempts === 1 ? "" : "s"} · last ${formatDistanceToNow(mastery.lastPracticedAt!, { addSuffix: true })}`}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="gap-3 py-5">
                        <CardHeader className="px-5">
                            <CardTitle className="text-sm">
                                <h2>Questions</h2>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-5">
                            {total === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Questions for this topic are coming soon.
                                </p>
                            ) : (
                                <dl className="space-y-1.5 text-sm">
                                    {typeLabels.map(([type, label]) => {
                                        const n = typeCounts.get(type) ?? 0;
                                        if (n === 0) return null;
                                        return (
                                            <div key={type} className="flex justify-between gap-2">
                                                <dt className="text-muted-foreground">{label}</dt>
                                                <dd className="font-medium tabular-nums">{n}</dd>
                                            </div>
                                        );
                                    })}
                                    <div className="flex justify-between gap-2 border-t pt-1.5">
                                        <dt className="font-medium">Total</dt>
                                        <dd className="font-medium tabular-nums">{total}</dd>
                                    </div>
                                </dl>
                            )}
                            {total > 0 && (
                                <PracticeLink
                                    href={`/practice?topic=${topic.id}`}
                                    signedIn={!!user}
                                    className="mt-4 w-full"
                                >
                                    <Play />
                                    {user ? "Start practice" : "Sign up to practise"}
                                </PracticeLink>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </div>

            {(prev || next) && (
                <nav aria-label="Other topics in this unit" className="mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2">
                    {prev ? (
                        <Link
                            href={`${unitHref}/${prev.slug}`}
                            className="group rounded-lg border p-3 hover:bg-muted/50"
                        >
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ChevronLeft className="size-3.5" /> Previous topic
                            </span>
                            <span className="mt-0.5 block text-sm font-medium">
                                {prev.code} {prev.name}
                            </span>
                        </Link>
                    ) : (
                        <span className="hidden sm:block" />
                    )}
                    {next && (
                        <Link
                            href={`${unitHref}/${next.slug}`}
                            className="group rounded-lg border p-3 text-right hover:bg-muted/50"
                        >
                            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                                Next topic <ChevronRight className="size-3.5" />
                            </span>
                            <span className="mt-0.5 block text-sm font-medium">
                                {next.code} {next.name}
                            </span>
                        </Link>
                    )}
                </nav>
            )}
        </>
    );
}
