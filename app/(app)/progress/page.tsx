import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, BookOpen, Target } from "lucide-react";
import { MasteryBadge, MasteryBar, MasteryBreakdown, summarizeMastery } from "@/components/mastery";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { revisionPriority } from "@/lib/mastery";
import { getQuestionCounts } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Progress", robots: { index: false } };

const DAY = 86_400_000;

/** UTC midnight six days ago — the start of a 7-day activity window including today. */
function startOfWindow() {
    const d = new Date(Date.now() - 6 * DAY);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export default async function ProgressPage() {
    const user = await requireUser();
    const since = startOfWindow();

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
    const [mastery, questionCounts] = await Promise.all([
        getTopicMastery(user.id, topicIds),
        getQuestionCounts(topicIds),
    ]);

    const attempted = totals._count._all;
    const pct =
        totals._sum.maxMarks && totals._sum.maxMarks > 0
            ? Math.round(((totals._sum.marksAwarded ?? 0) / totals._sum.maxMarks) * 100)
            : null;

    // Last 7 days, oldest first
    const days = Array.from({ length: 7 }, (_, i) => {
        const start = new Date(since.getTime() + i * DAY);
        return { start, count: 0 };
    });
    for (const a of recent) {
        const i = Math.floor((a.createdAt.getTime() - since.getTime()) / DAY);
        if (i >= 0 && i < 7) days[i].count++;
    }
    const weekCount = recent.length;
    const maxDay = Math.max(1, ...days.map((d) => d.count));

    const now = new Date();
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
            ) : (
                <div className="space-y-8">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Stat label="Questions attempted" value={attempted.toLocaleString("en-GB")} />
                        <Stat
                            label="Marks scored"
                            value={pct === null ? "—" : `${pct}%`}
                            hint={`${totals._sum.marksAwarded ?? 0}/${totals._sum.maxMarks ?? 0} marks`}
                        />
                        <Card className="gap-2 py-5">
                            <CardContent className="px-5">
                                <p className="text-sm text-muted-foreground">Last 7 days</p>
                                <div className="mt-1 flex items-end justify-between gap-4">
                                    <p className="text-3xl font-semibold tabular-nums">{weekCount}</p>
                                    <div
                                        className="flex h-10 items-end gap-1"
                                        role="img"
                                        aria-label={`Questions per day: ${days.map((d) => d.count).join(", ")}`}
                                    >
                                        {days.map((d) => (
                                            <div
                                                key={d.start.toISOString()}
                                                title={`${d.start.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })}: ${d.count}`}
                                                className={
                                                    d.count > 0
                                                        ? "w-2.5 rounded-sm bg-primary"
                                                        : "w-2.5 rounded-sm bg-muted"
                                                }
                                                style={{
                                                    height: `${d.count > 0 ? Math.max(15, (d.count / maxDay) * 100) : 10}%`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">questions answered</p>
                            </CardContent>
                        </Card>
                    </div>

                    {weakest.length > 0 && (
                        <section aria-labelledby="weakest">
                            <h2 id="weakest" className="mb-3 text-lg font-semibold tracking-tight">
                                Focus next
                            </h2>
                            <ul className="divide-y rounded-xl border bg-card">
                                {weakest.map(({ topic, m }) => (
                                    <li
                                        key={topic.id}
                                        className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/subjects/${topic.unit.subject.slug}/${topic.unit.code.toLowerCase()}/${topic.slug}`}
                                                className="font-medium hover:underline"
                                            >
                                                {topic.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">
                                                {topic.unit.code} · {topic.code}
                                                {m.attempts > 0 &&
                                                    ` · ${m.attempts} attempt${m.attempts === 1 ? "" : "s"}`}
                                            </p>
                                            <MasteryBadge
                                                level={m.level}
                                                score={m.score}
                                                showScore
                                                className="mt-1.5 sm:hidden"
                                            />
                                        </div>
                                        <MasteryBadge
                                            level={m.level}
                                            score={m.score}
                                            showScore
                                            className="hidden sm:inline-flex"
                                        />
                                        <Button asChild size="sm" variant="outline">
                                            <Link
                                                href={`/practice?topic=${topic.id}`}
                                                aria-label={`Practise ${topic.name}`}
                                            >
                                                Practise
                                            </Link>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {[...bySubject.values()].map((subject) => (
                        <section key={subject.slug} aria-labelledby={`s-${subject.slug}`} className="space-y-4">
                            <h2 id={`s-${subject.slug}`} className="text-lg font-semibold tracking-tight">
                                {subject.name}
                            </h2>
                            {subject.units.map((unit) => {
                                const summary = summarizeMastery(unit.topics.map((t) => mastery.get(t.id)!));
                                const unitHref = `/subjects/${subject.slug}/${unit.code.toLowerCase()}`;
                                return (
                                    <Card key={unit.id} className="gap-4">
                                        <CardHeader>
                                            <CardTitle className="flex flex-wrap items-baseline justify-between gap-2">
                                                <Link href={unitHref} className="hover:underline">
                                                    <span className="font-mono text-sm text-muted-foreground">
                                                        {unit.code}
                                                    </span>{" "}
                                                    {unit.name}
                                                </Link>
                                                <span className="text-sm font-normal text-muted-foreground tabular-nums">
                                                    {summary.score === null
                                                        ? "Not started"
                                                        : `${Math.round(summary.score * 100)}%`}
                                                </span>
                                            </CardTitle>
                                            {summary.topics > 0 && (
                                                <MasteryBreakdown counts={summary.counts} className="mt-1" />
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            {unit.topics.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">Topics coming soon.</p>
                                            ) : (
                                                <ul className="divide-y">
                                                    {unit.topics.map((t) => {
                                                        const m = mastery.get(t.id)!;
                                                        return (
                                                            <li
                                                                key={t.id}
                                                                className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 gap-y-1.5 py-2.5 sm:grid-cols-[2.5rem_1fr_10rem_7.5rem]"
                                                            >
                                                                <span className="font-mono text-xs text-muted-foreground">
                                                                    {t.code}
                                                                </span>
                                                                <Link
                                                                    href={`${unitHref}/${t.slug}`}
                                                                    className="min-w-0 text-sm leading-snug hover:underline sm:truncate"
                                                                >
                                                                    {t.name}
                                                                </Link>
                                                                <MasteryBar
                                                                    level={m.level}
                                                                    score={m.score}
                                                                    label={t.name}
                                                                    className="col-start-2 sm:col-start-auto"
                                                                />
                                                                <MasteryBadge
                                                                    level={m.level}
                                                                    score={m.score}
                                                                    showScore
                                                                    className="col-start-3 row-start-1 justify-self-end sm:col-start-auto sm:row-start-auto"
                                                                />
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </section>
                    ))}
                </div>
            )}
        </>
    );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <Card className="gap-2 py-5">
            <CardContent className="px-5">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
                {hint && <p className="mt-1 text-xs text-muted-foreground tabular-nums">{hint}</p>}
            </CardContent>
        </Card>
    );
}
