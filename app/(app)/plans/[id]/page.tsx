import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveRestore, ArrowLeft, CalendarClock, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PlanActions, RescheduleButton } from "@/components/plans/plan-actions";
import { PlanTaskList } from "@/components/plans/plan-task-list";
import { daysLeftLabel, formatDate, formatMinutes } from "@/components/plans/task-meta";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toDayNumber } from "@/lib/planner";
import { UnitChip } from "@/components/plans/unit-chip";
import { unitCodeFromTitle } from "@/components/plans/unit-code";
import { daysUntil, getPlan, percentDone } from "@/lib/queries/plans";
import { requireUser } from "@/lib/session";
import { localDay } from "@/lib/time";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Study plan", robots: { index: false } };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function describeDays(days: number[]) {
    if (days.length === 7) return "every day";
    // List Monday-first for readability.
    return [1, 2, 3, 4, 5, 6, 0]
        .filter((d) => days.includes(d))
        .map((d) => DAY_NAMES[d])
        .join(", ");
}

export default async function PlanPage({ params }: Props) {
    const { id } = await params;
    const user = await requireUser();
    const plan = await getPlan(user.id, id);
    if (!plan) notFound();

    const now = new Date();
    const todayDay = toDayNumber(localDay(now));
    const archived = plan.status === "ARCHIVED";
    const tasks = plan.tasks;
    const done = tasks.filter((t) => t.status === "DONE").length;
    const skipped = tasks.filter((t) => t.status === "SKIPPED").length;
    const pct = percentDone(done, tasks.length, skipped);
    const daysLeft = daysUntil(plan.examDate, now);
    const today = tasks.filter((t) => toDayNumber(t.date) === todayDay);
    const todayMinutes = today.filter((t) => t.status !== "SKIPPED").reduce((s, t) => s + t.minutes, 0);
    const missed = tasks.filter((t) => t.status === "PENDING" && toDayNumber(t.date) < todayDay).length;
    const codes = [
        ...new Set(
            tasks.map((t) => t.topic?.unit.code ?? (t.type === "PAST_PAPER" ? unitCodeFromTitle(t.title) : null)),
        ),
    ].filter((c): c is string => Boolean(c));

    const showMissed = !archived && missed > 0;
    const todayDone = today.filter((t) => t.status === "DONE").length;

    return (
        <>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
                <Link href="/plans">
                    <ArrowLeft />
                    Study plans
                </Link>
            </Button>
            <PageHeader
                title={plan.title}
                description={
                    <>
                        {formatMinutes(plan.minutesPerDay)} a day, {describeDays(plan.studyDays)}.
                        {codes.length > 0 && (
                            <span className="mt-3 flex flex-wrap gap-1.5">
                                {codes.sort().map((c) => (
                                    <UnitChip key={c} code={c} size="sm" />
                                ))}
                            </span>
                        )}
                    </>
                }
                actions={<PlanActions planId={plan.id} title={plan.title} archived={archived} />}
            />

            {archived && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                    <ArchiveRestore className="size-5 shrink-0" aria-hidden />
                    This plan is archived, so its sessions don&apos;t show on your dashboard. Unarchive it from the menu.
                </div>
            )}

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Exam">
                    {daysLeft > 1 ? (
                        <p className="flex items-baseline gap-1.5">
                            <span className="num text-[1.75rem] leading-none">{daysLeft}</span>
                            <span className="font-semibold text-muted-foreground">days to go</span>
                        </p>
                    ) : (
                        <p className="num text-[1.75rem] leading-none">{daysLeftLabel(daysLeft)}</p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{formatDate(plan.examDate)}</p>
                </Stat>
                <Stat label="Progress" className="order-last col-span-2 sm:order-none sm:col-span-1">
                    <p className="num text-[1.75rem] leading-none">{pct}%</p>
                    <Progress value={pct} className="mt-3 h-2" aria-label="Plan progress" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        <span className="tabular-nums">
                            {done} of {tasks.length - skipped}
                        </span>{" "}
                        sessions done
                    </p>
                </Stat>
                <Stat label="Today">
                    {today.length > 0 ? (
                        <>
                            <p className="flex items-baseline gap-1.5">
                                <span className="num text-[1.75rem] leading-none">
                                    {todayDone}/{today.length}
                                </span>
                                <span className="font-semibold text-muted-foreground">done</span>
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {formatMinutes(todayMinutes)} ·{" "}
                                <a
                                    href="#today"
                                    className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                                >
                                    Jump to today
                                </a>
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="num text-[1.75rem] leading-none">Rest day</p>
                            <p className="mt-2 text-sm text-muted-foreground">Nothing scheduled today.</p>
                        </>
                    )}
                </Stat>
            </div>

            {showMissed && (
                <div className="mb-8 flex flex-col gap-4 rounded-xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex gap-3">
                        <CalendarClock className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
                        <div>
                            <p className="font-display text-lg leading-tight font-extrabold">
                                {missed} missed {missed === 1 ? "session" : "sessions"}
                            </p>
                            <p className="mt-1 text-muted-foreground">
                                Falling behind happens. Reschedule to spread the remaining work from today — finished
                                sessions are kept.
                            </p>
                        </div>
                    </div>
                    <RescheduleButton planId={plan.id} variant="default" />
                </div>
            )}

            {plan.summary && (
                <div className="mb-8 flex gap-3 rounded-xl bg-muted p-4 leading-relaxed sm:p-5">
                    <Sparkles className="mt-1 size-4 shrink-0 text-selected-foreground" aria-hidden />
                    <p>{plan.summary}</p>
                </div>
            )}

            {tasks.length === 0 ? (
                <p className="rounded-xl bg-muted p-6 text-center text-muted-foreground">
                    This plan has no sessions. Try rescheduling it.
                </p>
            ) : (
                <PlanTaskList tasks={tasks} todayDay={todayDay} highlightNext={!archived && !showMissed} />
            )}
        </>
    );
}

function Stat({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("min-w-0 rounded-xl border bg-card p-4 sm:px-5", className)}>
            <p className="mb-2 text-[0.8125rem] font-bold text-muted-foreground">{label}</p>
            {children}
        </div>
    );
}
