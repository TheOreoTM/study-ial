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
import { unitCodeFromTitle } from "@/components/plans/unit-code";
import { daysUntil, getPlan, percentDone } from "@/lib/queries/plans";
import { requireUser } from "@/lib/session";

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
    const todayDay = toDayNumber(now);
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
    ].filter(Boolean);

    return (
        <>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                <Link href="/plans">
                    <ArrowLeft />
                    Study plans
                </Link>
            </Button>
            <PageHeader
                eyebrow={codes.length ? codes.sort().join(" · ") : undefined}
                title={plan.title}
                description={`${formatMinutes(plan.minutesPerDay)} a day, ${describeDays(plan.studyDays)}.`}
                actions={<PlanActions planId={plan.id} title={plan.title} archived={archived} />}
            />

            {archived && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    <ArchiveRestore className="size-4 shrink-0" aria-hidden />
                    This plan is archived, so its sessions don&apos;t show on your dashboard. Unarchive it from the menu.
                </div>
            )}

            <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <Stat label="Exam">
                    <p className="text-2xl font-semibold tabular-nums">{daysLeftLabel(daysLeft)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(plan.examDate)}</p>
                </Stat>
                <Stat label="Progress">
                    <p className="text-2xl font-semibold tabular-nums">{pct}%</p>
                    <Progress value={pct} className="mt-2 h-1.5" aria-label="Plan progress" />
                    <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
                        {done} of {tasks.length - skipped} sessions done
                    </p>
                </Stat>
                <Stat label="Today">
                    {today.length > 0 ? (
                        <>
                            <p className="text-2xl font-semibold tabular-nums">
                                {today.filter((t) => t.status === "DONE").length}/{today.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatMinutes(todayMinutes)} ·{" "}
                                <a href="#today" className="font-medium text-primary hover:underline">
                                    Jump to today
                                </a>
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl font-semibold">Rest day</p>
                            <p className="text-sm text-muted-foreground">Nothing scheduled today.</p>
                        </>
                    )}
                </Stat>
            </div>

            {!archived && missed > 0 && (
                <div className="mb-8 flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <CalendarClock className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-warning" aria-hidden />
                        <div>
                            <p className="font-medium">
                                {missed} missed {missed === 1 ? "session" : "sessions"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Falling behind happens. Reschedule to spread the remaining work from today — finished
                                sessions are kept.
                            </p>
                        </div>
                    </div>
                    <RescheduleButton planId={plan.id} variant="default" />
                </div>
            )}

            {plan.summary && (
                <div className="mb-8 flex gap-3 rounded-xl border bg-card p-4 text-sm leading-relaxed">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <p>{plan.summary}</p>
                </div>
            )}

            {tasks.length === 0 ? (
                <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    This plan has no sessions. Try rescheduling it.
                </p>
            ) : (
                <PlanTaskList tasks={tasks} todayDay={todayDay} />
            )}
        </>
    );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
            {children}
        </div>
    );
}
