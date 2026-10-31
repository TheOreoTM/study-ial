import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, CalendarDays, Flame, Layers, Target, Timer } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { formatDueDay } from "@/components/flashcards/format";
import { MilestoneNotice } from "@/components/milestones/milestone-notice";
import { MasteryBar, summarizeMastery } from "@/components/mastery";
import { TodayTasks } from "@/components/plans/today-tasks";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { masteryTone, revisionPriority } from "@/lib/mastery";
import { getQuestionCounts } from "@/lib/queries/curriculum";
import { getFlashcardSummary } from "@/lib/queries/flashcards";
import { getFocusStats } from "@/lib/queries/focus";
import { syncMilestones } from "@/lib/queries/milestones";
import { getTopicMastery } from "@/lib/queries/mastery";
import { daysUntil, getActivePlanSummary, getTodayTasks } from "@/lib/queries/plans";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { ReviseRow } from "./revise-row";

export const metadata: Metadata = { title: "Today" };

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

    const [mastery, questionCounts, focus, todayTasks, plan, cards] = await Promise.all([
        getTopicMastery(user.id, topicIds),
        getQuestionCounts(topicIds),
        getFocusStats(user.id),
        getTodayTasks(user.id),
        getActivePlanSummary(user.id),
        getFlashcardSummary(user.id),
    ]);

    // After the parallel reads: the local dev Postgres drops connections beyond ~5 concurrent ones.
    const { unseen } = await syncMilestones(user.id);
    const now = new Date();
    const practisable = topics.filter((t) => (questionCounts.get(t.id) ?? 0) > 0);
    const weakTopics = practisable
        .map((t) => ({ topic: t, m: mastery.get(t.id)! }))
        .sort((a, b) => revisionPriority(b.m, now) - revisionPriority(a.m, now))
        .slice(0, 5);
    const upcomingExams = userUnits.filter((uu) => uu.examDate && daysUntil(uu.examDate, now) >= 0);
    const firstName = user.name.split(" ")[0];
    // The one tangerine action: the first unfinished task in today's plan when there is one,
    // otherwise the header's weak-topic practice.
    const hasNextTask = todayTasks.some((t) => t.status === "PENDING");
    const nextExam = upcomingExams[0];

    return (
        <>
            <PageHeader
                title={`${firstName}, here's today`}
                actions={
                    practisable.length > 0 ? (
                        <Button asChild variant={hasNextTask ? "outline" : "default"}>
                            <Link href="/practice?mode=weak">
                                <Target className="size-4" /> Practise weak topics
                            </Link>
                        </Button>
                    ) : undefined
                }
            />

            {unseen[0] && (
                <MilestoneNotice
                    milestone={{ key: unseen[0].key, title: unseen[0].title, detail: unseen[0].detail }}
                    more={unseen.length - 1}
                    next={
                        weakTopics[0]
                            ? { name: weakTopics[0].topic.name, href: `/practice?topic=${weakTopics[0].topic.id}` }
                            : null
                    }
                />
            )}

            {/* Stat strip */}
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat
                    icon={Flame}
                    label="Day streak"
                    value={focus.streakDays}
                    suffix={focus.streakDays === 1 ? "day" : "days"}
                />
                <Stat icon={Timer} label="Focus today" value={focus.todayMinutes} suffix="min" />
                <Stat
                    icon={CalendarCheck}
                    label="Plan progress"
                    value={plan ? `${plan.percentDone}%` : "–"}
                    href={plan ? `/plans/${plan.id}` : "/plans/new"}
                >
                    {plan && <Progress value={plan.percentDone} className="mt-3 h-1.5" aria-label="Plan progress" />}
                </Stat>
                <Stat
                    icon={BookOpen}
                    label="Next exam"
                    value={nextExam ? daysUntil(nextExam.examDate!, now) : "–"}
                    suffix={nextExam ? `days · ${nextExam.unit.code}` : undefined}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
                {/* Today's plan */}
                <Card className="min-w-0 gap-5 lg:col-start-1">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div className="min-w-0">
                            <CardTitle className="text-xl">Today&apos;s plan</CardTitle>
                            <CardDescription className="mt-1">
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
                            <Button asChild variant="ghost" size="sm" className="-mt-1 -mr-2 shrink-0">
                                <Link href={`/plans/${plan.id}`}>
                                    Full plan <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        {plan ? (
                            todayTasks.length > 0 ? (
                                <TodayTasks tasks={todayTasks} />
                            ) : (
                                <p className="rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                                    Nothing scheduled today. Take the rest — or get ahead with some weak-topic practice.
                                </p>
                            )
                        ) : (
                            <EmptyState
                                icon={CalendarCheck}
                                title="Plan your revision"
                                description="Get a day-by-day plan that covers every topic before your exams and focuses on your weakest ones."
                                action={
                                    <Button asChild variant="outline">
                                        <Link href="/plans/new">Create a study plan</Link>
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Weak topics: flat sand rail of mastery rows */}
                <section
                    aria-labelledby="revise-next"
                    className="h-fit min-w-0 rounded-xl bg-muted p-4 sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1"
                >
                    <h2 id="revise-next" className="text-xl">
                        Revise next
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">Your weakest and least-recent topics.</p>
                    {weakTopics.length === 0 ? (
                        <p className="mt-4 text-muted-foreground">
                            No practice questions for your units yet. Browse{" "}
                            <Link
                                href="/subjects"
                                className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                            >
                                other subjects
                            </Link>{" "}
                            in the meantime.
                        </p>
                    ) : (
                        <ul className="mt-4 grid gap-2.5">
                            {weakTopics.map(({ topic, m }, i) => (
                                <ReviseRow
                                    key={topic.id}
                                    href={`/practice?topic=${topic.id}`}
                                    code={topic.code}
                                    unitCode={topic.unit.code}
                                    name={topic.name}
                                    level={m.level}
                                    score={m.score}
                                    isNext={i === 0}
                                />
                            ))}
                        </ul>
                    )}
                    {(cards.due + cards.newToday > 0 || cards.nextDue) && (
                        <div className="mt-5 flex items-center gap-3 border-t border-border-strong/25 pt-5">
                            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-card text-selected-foreground shadow-card">
                                <Layers className="size-5" aria-hidden />
                            </span>
                            <p className="min-w-0 flex-1 leading-snug">
                                <span className="block font-bold">Flashcards</span>
                                <span className="block text-[0.8125rem] text-muted-foreground">
                                    {cards.due + cards.newToday > 0
                                        ? [
                                              cards.due && `${cards.due} due today`,
                                              cards.newToday && `${cards.newToday} new`,
                                          ]
                                              .filter(Boolean)
                                              .join(" · ")
                                        : `All done. Next cards ${formatDueDay(cards.nextDue!, cards.today)}.`}
                                </span>
                            </p>
                            <Button asChild variant="outline" size="sm" className="shrink-0">
                                <Link href={cards.due + cards.newToday > 0 ? "/flashcards/review" : "/flashcards"}>
                                    {cards.due + cards.newToday > 0 ? "Review" : "Decks"}
                                </Link>
                            </Button>
                        </div>
                    )}
                </section>

                {/* Units */}
                <Card className="min-w-0 gap-5 lg:col-start-1">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div className="min-w-0">
                            <CardTitle className="text-xl">Your units</CardTitle>
                            <CardDescription className="mt-1">Mastery across each unit&apos;s topics.</CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="-mt-1 -mr-2 shrink-0">
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
                                    <Button asChild variant={practisable.length > 0 ? "outline" : "default"}>
                                        <Link href="/settings">Add units</Link>
                                    </Button>
                                }
                            />
                        ) : (
                            <ul className="grid gap-2">
                                {userUnits.map(({ unit, examDate }) => {
                                    const summary = summarizeMastery(unit.topics.map((t) => mastery.get(t.id)!));
                                    const days = examDate ? daysUntil(examDate, now) : null;
                                    const pct = summary.score === null ? null : Math.round(summary.score * 100);
                                    return (
                                        <li key={unit.id}>
                                            <Link
                                                href={`/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`}
                                                className="group -mx-3 block rounded-lg px-3 py-3 outline-none transition-colors duration-200 ease-out-soft hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
                                            >
                                                <div className="mb-2.5 flex items-center gap-3">
                                                    <UnitChip code={unit.code} />
                                                    <span className="min-w-0 flex-1 truncate font-bold">
                                                        {unit.name}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            "num shrink-0 text-lg leading-none",
                                                            pct === null
                                                                ? "text-muted-foreground"
                                                                : masteryTone[summary.level].text,
                                                        )}
                                                    >
                                                        {pct === null ? "–" : `${pct}%`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MasteryBar
                                                        level={summary.level}
                                                        score={summary.score}
                                                        label={unit.name}
                                                        className="flex-1"
                                                    />
                                                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-muted-foreground">
                                                        <CalendarDays className="size-3.5" aria-hidden />
                                                        {days === null
                                                            ? "No exam date"
                                                            : days >= 0
                                                              ? `${days} days`
                                                              : "Exam passed"}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
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
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
    suffix?: string;
    href?: string;
    children?: React.ReactNode;
}) {
    const body = (
        <div
            className={cn(
                "h-full rounded-xl border bg-card p-4 sm:px-5",
                href && "transition-[border-color] duration-200 ease-out-soft group-hover:border-border-strong",
            )}
        >
            <div className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-muted-foreground">
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
                {href && (
                    <ArrowRight
                        className="ml-auto hidden size-3.5 shrink-0 transition-transform sm:block duration-200 ease-out-soft group-hover:translate-x-0.5"
                        aria-hidden
                    />
                )}
            </div>
            <div className="mt-2 flex min-w-0 items-baseline gap-1.5">
                <span className="num text-[1.75rem] leading-none">{value}</span>
                {suffix && <span className="truncate text-sm font-semibold text-muted-foreground">{suffix}</span>}
            </div>
            {children}
        </div>
    );
    return href ? (
        <Link
            href={href}
            className="group block rounded-xl outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
            {body}
        </Link>
    ) : (
        body
    );
}
