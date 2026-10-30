import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, Flame, Target, Timer } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { MasteryBadge, MasteryBar, summarizeMastery } from "@/components/mastery";
import { TodayTasks } from "@/components/plans/today-tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { revisionPriority } from "@/lib/mastery";
import { getQuestionCounts } from "@/lib/queries/curriculum";
import { getFocusStats } from "@/lib/queries/focus";
import { getTopicMastery } from "@/lib/queries/mastery";
import { daysUntil, getActivePlanSummary, getTodayTasks } from "@/lib/queries/plans";
import { requireUser } from "@/lib/session";
import { APP_TIME_ZONE } from "@/lib/time";

export const metadata: Metadata = { title: "Today" };

function greeting(now = new Date()) {
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: APP_TIME_ZONE, hour: "numeric", hourCycle: "h23" }).format(now));
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

export default async function DashboardPage() {
    const user = await requireUser();

    const userUnits = await db.userUnit.findMany({
        where: { userId: user.id },
        include: {
            unit: { include: { subject: true, topics: { orderBy: { order: "asc" } } } },
        },
        orderBy: [{ examDate: { sort: "asc", nulls: "last" } }, { unit: { order: "asc" } }],
    });
    const topics = userUnits.flatMap((uu) => uu.unit.topics.map((t) => ({ ...t, unit: uu.unit })));
    const topicIds = topics.map((t) => t.id);

    const [mastery, questionCounts, focus, todayTasks, plan] = await Promise.all([
        getTopicMastery(user.id, topicIds),
        getQuestionCounts(topicIds),
        getFocusStats(user.id),
        getTodayTasks(user.id),
        getActivePlanSummary(user.id),
    ]);

    const now = new Date();
    const practisable = topics.filter((t) => (questionCounts.get(t.id) ?? 0) > 0);
    const weakTopics = practisable
        .map((t) => ({ topic: t, m: mastery.get(t.id)! }))
        .sort((a, b) => revisionPriority(b.m, now) - revisionPriority(a.m, now))
        .slice(0, 5);
    const upcomingExams = userUnits.filter((uu) => uu.examDate && daysUntil(uu.examDate, now) >= 0);
    const firstName = user.name.split(" ")[0];

    return (
        <>
            <PageHeader
                eyebrow={greeting(now)}
                title={`${firstName}, here's today`}
                actions={
                    practisable.length > 0 ? (
                        <Button asChild>
                            <Link href="/practice?mode=weak">
                                <Target className="size-4" /> Practise weak topics
                            </Link>
                        </Button>
                    ) : undefined
                }
            />

            {/* Stat strip */}
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat icon={Flame} label="Day streak" value={focus.streakDays} suffix={focus.streakDays === 1 ? "day" : "days"} />
                <Stat icon={Timer} label="Focus today" value={focus.todayMinutes} suffix="min" />
                <Stat
                    icon={CalendarCheck}
                    label="Plan progress"
                    value={plan ? `${plan.percentDone}%` : "—"}
                    href={plan ? `/plans/${plan.id}` : "/plans/new"}
                />
                <Stat
                    icon={BookOpen}
                    label="Next exam"
                    value={upcomingExams[0] ? daysUntil(upcomingExams[0].examDate!, now) : "—"}
                    suffix={upcomingExams[0] ? `days · ${upcomingExams[0].unit.code}` : undefined}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="grid min-w-0 content-start gap-6">
                    {/* Today's plan */}
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>Today&apos;s plan</CardTitle>
                                <CardDescription>
                                    {plan ? (
                                        <>
                                            {plan.title} · {plan.daysLeft} days to go
                                        </>
                                    ) : (
                                        "No active study plan yet."
                                    )}
                                </CardDescription>
                            </div>
                            {plan && (
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`/plans/${plan.id}`}>
                                        Full plan <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {plan ? (
                                todayTasks.length > 0 ? (
                                    <TodayTasks tasks={todayTasks} />
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Nothing scheduled today. Take the rest — or get ahead with some weak-topic practice.
                                    </p>
                                )
                            ) : (
                                <EmptyState
                                    icon={CalendarCheck}
                                    title="Plan your revision"
                                    description="Get a day-by-day plan that covers every topic before your exams and focuses on your weakest ones."
                                    action={
                                        <Button asChild>
                                            <Link href="/plans/new">Create a study plan</Link>
                                        </Button>
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Units */}
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>Your units</CardTitle>
                                <CardDescription>Mastery across each unit&apos;s topics.</CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/settings">Edit</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {userUnits.length === 0 ? (
                                <EmptyState
                                    icon={BookOpen}
                                    title="No units yet"
                                    description="Add the units you're sitting to get started."
                                    action={
                                        <Button asChild>
                                            <Link href="/settings">Add units</Link>
                                        </Button>
                                    }
                                />
                            ) : (
                                <ul className="divide-y">
                                    {userUnits.map(({ unit, examDate }) => {
                                        const summary = summarizeMastery(unit.topics.map((t) => mastery.get(t.id)!));
                                        const days = examDate ? daysUntil(examDate, now) : null;
                                        return (
                                            <li key={unit.id} className="py-3 first:pt-0 last:pb-0">
                                                <Link
                                                    href={`/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`}
                                                    className="group block"
                                                >
                                                    <div className="mb-2 flex items-baseline justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <span className="font-mono text-xs text-muted-foreground">
                                                                {unit.code}
                                                            </span>{" "}
                                                            <span className="font-medium group-hover:underline">{unit.name}</span>
                                                        </div>
                                                        <span className="shrink-0 text-xs text-muted-foreground">
                                                            {days === null ? "No exam date" : days >= 0 ? `${days} days` : "Exam passed"}
                                                        </span>
                                                    </div>
                                                    <MasteryBar level={summary.level} score={summary.score} label={unit.name} />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Weak topics */}
                <Card className="h-fit min-w-0">
                    <CardHeader>
                        <CardTitle>Revise next</CardTitle>
                        <CardDescription>Your weakest and least-recent topics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {weakTopics.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No practice questions for your units yet. Browse{" "}
                                <Link href="/subjects" className="underline underline-offset-4">
                                    other subjects
                                </Link>{" "}
                                in the meantime.
                            </p>
                        ) : (
                            <ul className="grid gap-2">
                                {weakTopics.map(({ topic, m }) => (
                                    <li key={topic.id} className="flex items-center gap-3 rounded-lg border p-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{topic.name}</p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {topic.unit.code} · {topic.code}
                                                </span>
                                                <MasteryBadge level={m.level} score={m.score} showScore />
                                            </div>
                                        </div>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/practice?topic=${topic.id}`} aria-label={`Practise ${topic.name}`}>
                                                Practise
                                            </Link>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function Stat({
    icon: Icon,
    label,
    value,
    suffix,
    href,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
    suffix?: string;
    href?: string;
}) {
    const body = (
        <div className="h-full rounded-xl border bg-card p-4 transition-colors hover:border-primary/40">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="size-3.5" />
                {label}
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tabular-nums">{value}</span>
                {suffix && <span className="truncate text-xs text-muted-foreground">{suffix}</span>}
            </div>
        </div>
    );
    return href ? <Link href={href}>{body}</Link> : body;
}
