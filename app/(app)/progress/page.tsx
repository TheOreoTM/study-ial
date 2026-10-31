import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, BookOpen, Target } from "lucide-react";
import { ProgressAnalyticsPanels } from "@/components/analytics/progress-analytics";
import { MilestoneGrid } from "@/components/milestones/milestone-grid";
import { MasteryBreakdown, summarizeMastery } from "@/components/mastery";
import { lastNDays } from "@/components/focus/stats-math";
import { WeekBars } from "@/components/focus/week-bars";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { masteryLabel, masteryTone, revisionPriority } from "@/lib/mastery";
import { cn } from "@/lib/utils";
import { getProgressAnalytics } from "@/lib/queries/analytics";
import { syncMilestones } from "@/lib/queries/milestones";
import { getQuestionCounts } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { requireUser } from "@/lib/session";
import { localDayKey } from "@/lib/time";
import { MasteryRow } from "./mastery-row";

export const metadata: Metadata = { title: "Progress", robots: { index: false } };

const DAY = 86_400_000;

export default async function ProgressPage() {
    const user = await requireUser();
    // The last 7 calendar days in Maldives time, oldest first and ending today. Fetch a day extra so the oldest
    // local day is fully covered, then bucket by local day.
    const now = new Date();
    const dayKeys = lastNDays(localDayKey(now), 7);
    const since = new Date(now.getTime() - 8 * DAY);

    const [userUnits, totals, recent] = await Promise.all([
        db.userUnit.findMany({
            where: { userId: user.id },
            include: {
                unit: {
                    include: {
                        subject: { select: { name: true, slug: true, order: true, isLocal: true } },
                        topics: { orderBy: { order: "asc" } },
                    },
                },
            },
        }),
        db.attempt.aggregate({
            where: { userId: user.id },
            _count: { _all: true },
            _sum: { marksAwarded: true, maxMarks: true },
        }),
        db.attempt.findMany({ where: { userId: user.id, createdAt: { gte: since } }, select: { createdAt: true } }),
    ]);

    if (userUnits.length === 0) {
        return (
            <>
                <PageHeader title="Progress" />
                <EmptyState
                    icon={BookOpen}
                    title="Add the units you're studying"
                    description="Pick your units in Settings and we'll track your mastery of every topic in them."
                    action={
                        <Button asChild>
                            <Link href="/settings">Choose units</Link>
                        </Button>
                    }
                />
            </>
        );
    }

    const units = userUnits.map((uu) => uu.unit).sort((a, b) => a.subject.order - b.subject.order || a.order - b.order);
    const topics = units.flatMap((u) => u.topics.map((t) => ({ ...t, unit: u })));
    const topicIds = topics.map((t) => t.id);
    const [mastery, questionCounts, analytics] = await Promise.all([
        getTopicMastery(user.id, topicIds),
        getQuestionCounts(topicIds),
        getProgressAnalytics(user.id, now),
    ]);
    // Sequential: the local dev Postgres drops connections beyond ~5 concurrent ones.
    const { milestones } = await syncMilestones(user.id, now);

    const attempted = totals._count._all;
    const pct =
        totals._sum.maxMarks && totals._sum.maxMarks > 0
            ? Math.round(((totals._sum.marksAwarded ?? 0) / totals._sum.maxMarks) * 100)
            : null;

    const days = dayKeys.map((key) => ({ key, count: 0 }));
    for (const a of recent) {
        const day = days.find((d) => d.key === localDayKey(a.createdAt));
        if (day) day.count++;
    }
    const weekCount = days.reduce((sum, d) => sum + d.count, 0);

    const weakest = topics
        .filter((t) => (questionCounts.get(t.id) ?? 0) > 0)
        .map((t) => ({ topic: t, m: mastery.get(t.id)!, p: revisionPriority(mastery.get(t.id)!, now) }))
        .sort((a, b) => b.p - a.p)
        .slice(0, 5);

    const bySubject = new Map<string, { name: string; slug: string; units: typeof units }>();
    for (const u of units) {
        const s = bySubject.get(u.subject.slug) ?? { name: u.subject.name, slug: u.subject.slug, units: [] };
        s.units.push(u);
        bySubject.set(u.subject.slug, s);
    }

    return (
        <>
            <PageHeader
                title="Progress"
                description="Mastery is a recency-weighted score from your latest attempts in each topic."
                actions={
                    attempted > 0 ? (
                        <Button asChild>
                            <Link href="/practice?mode=weak">
                                <Target />
                                Practise weak topics
                            </Link>
                        </Button>
                    ) : undefined
                }
            />

            {attempted === 0 ? (
                <div className="space-y-10">
                    <EmptyState
                        icon={BarChart3}
                        title="No attempts yet"
                        description="Answer a few questions and your mastery of each topic will show up here."
                        action={
                            <div className="flex flex-wrap justify-center gap-2">
                                <Button asChild>
                                    <Link href="/practice?mode=weak">Start practising</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/subjects">Browse topics</Link>
                                </Button>
                            </div>
                        }
                    />
                    <ProgressAnalyticsPanels data={analytics} />
                </div>
            ) : (
                <div className="space-y-10">
                    <section aria-label="Totals" className="rounded-xl border bg-card shadow-card">
                        <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1.5fr]">
                            <Stat
                                label="Questions attempted"
                                value={attempted.toLocaleString("en-GB")}
                                className="border-r"
                            />
                            <Stat
                                className="sm:border-r"
                                label="Marks scored"
                                value={pct === null ? "—" : `${pct}%`}
                                hint={`${totals._sum.marksAwarded ?? 0}/${totals._sum.maxMarks ?? 0} marks`}
                            />
                            <div className="col-span-2 flex items-end justify-between gap-5 border-t px-5 py-5 sm:col-span-1 sm:border-t-0 sm:px-6">
                                <div className="shrink-0">
                                    <p className="text-sm font-semibold text-muted-foreground">Last 7 days</p>
                                    <p className="num mt-1 text-[2.5rem] leading-none">{weekCount}</p>
                                    <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">questions answered</p>
                                </div>
                                <div className="w-full max-w-56 min-w-0">
                                    <WeekBars
                                        className="h-20"
                                        days={days.map((d, i) => ({
                                            key: d.key,
                                            weekday: new Date(`${d.key}T00:00:00Z`).toLocaleDateString("en-GB", {
                                                weekday: "short",
                                                timeZone: "UTC",
                                            }),
                                            value: d.count,
                                            isToday: i === days.length - 1,
                                        }))}
                                        describe={(n) => `${n} question${n === 1 ? "" : "s"}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <ProgressAnalyticsPanels data={analytics} />

                    {weakest.length > 0 && (
                        <section aria-labelledby="weakest">
                            <h2 id="weakest" className="mb-3 text-lg">
                                Focus next
                            </h2>
                            <ol className="space-y-2.5 rounded-xl bg-muted p-3 sm:p-4 sm:pl-6">
                                {weakest.map(({ topic, m }, i) => (
                                    <MasteryRow
                                        key={topic.id}
                                        code={topic.code}
                                        name={topic.name}
                                        href={`/subjects/${topic.unit.subject.slug}/${topic.unit.code.toLowerCase()}/${topic.slug}`}
                                        mastery={m}
                                        isNext={i === 0}
                                        meta={
                                            <>
                                                {topic.unit.code}
                                                {m.attempts > 0 &&
                                                    ` · ${m.attempts} attempt${m.attempts === 1 ? "" : "s"}`}
                                            </>
                                        }
                                        action={
                                            <Button asChild size="sm" variant="outline">
                                                <Link
                                                    href={`/practice?topic=${topic.id}`}
                                                    aria-label={`Practise ${topic.name}`}
                                                >
                                                    Practise
                                                </Link>
                                            </Button>
                                        }
                                    />
                                ))}
                            </ol>
                        </section>
                    )}

                    {[...bySubject.values()].map((subject) => (
                        <section key={subject.slug} aria-labelledby={`s-${subject.slug}`}>
                            <h2 id={`s-${subject.slug}`} className="mb-3 text-lg">
                                {subject.name}
                            </h2>
                            <div className="grid items-start gap-5 lg:grid-cols-2">
                                {subject.units.map((unit) => {
                                    const summary = summarizeMastery(unit.topics.map((t) => mastery.get(t.id)!));
                                    const unitHref = `/subjects/${subject.slug}/${unit.code.toLowerCase()}`;
                                    return (
                                        <Card key={unit.id} className="gap-5 py-5 sm:py-6">
                                            <div className="space-y-4 px-5 sm:px-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <span className="inline-flex h-7 items-center rounded-[12px] bg-selected px-2.5 font-display text-sm font-extrabold text-selected-foreground">
                                                            {unit.code}
                                                        </span>
                                                        <h3 className="mt-2 text-lg leading-tight">
                                                            <Link
                                                                href={unitHref}
                                                                className="underline-offset-4 hover:underline"
                                                            >
                                                                {unit.name}
                                                            </Link>
                                                        </h3>
                                                    </div>
                                                    <div className="shrink-0 text-right">
                                                        {summary.score !== null && (
                                                            <p
                                                                className={cn(
                                                                    "num mb-1.5 text-[1.75rem] leading-none",
                                                                    masteryTone[summary.level].text,
                                                                )}
                                                            >
                                                                {Math.round(summary.score * 100)}%
                                                            </p>
                                                        )}
                                                        <p className="text-[0.75rem] font-extrabold tracking-[0.05em] text-muted-foreground uppercase">
                                                            {masteryLabel[summary.level]}
                                                        </p>
                                                    </div>
                                                </div>
                                                {summary.topics > 0 && <MasteryBreakdown counts={summary.counts} />}
                                            </div>
                                            <div className="px-2.5 sm:px-3.5">
                                                {unit.topics.length === 0 ? (
                                                    <p className="px-2.5 text-sm text-muted-foreground">
                                                        Topics coming soon.
                                                    </p>
                                                ) : (
                                                    <ul className="space-y-1">
                                                        {unit.topics.map((t) => (
                                                            <MasteryRow
                                                                key={t.id}
                                                                code={t.code}
                                                                name={t.name}
                                                                href={`${unitHref}/${t.slug}`}
                                                                mastery={mastery.get(t.id)!}
                                                                stretch
                                                            />
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            )}
            <div className="mt-10">
                <MilestoneGrid milestones={milestones} />
            </div>
        </>
    );
}

function Stat({ label, value, hint, className }: { label: string; value: string; hint?: string; className?: string }) {
    return (
        <div className={cn("px-5 py-5 sm:px-6", className)}>
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="num mt-1 text-[2.5rem] leading-none">{value}</p>
            {hint && <p className="mt-1.5 text-[0.8125rem] text-muted-foreground tabular-nums">{hint}</p>}
        </div>
    );
}
