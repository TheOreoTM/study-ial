import Link from "next/link";
import { CalendarClock, Clock, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProgressAnalytics } from "@/lib/queries/analytics";
import { FOCUS_WINDOW_DAYS, TREND_WEEKS } from "@/lib/queries/analytics";
import { formatMinutes, pct, shortDay } from "./format";
import { PlanPaceChart } from "./plan-pace-chart";
import { Sparkline } from "./sparkline";
import { SubjectTime } from "./subject-time";

const MAX_TRENDS = 8;

/** The three /progress analytics panels: focus time per subject, accuracy trends and plan pace. */
export function ProgressAnalyticsPanels({ data }: { data: ProgressAnalytics }) {
    const totalFocus = data.focus.reduce((n, r) => n + r.minutes, 0);
    const trends = data.trends.slice(0, MAX_TRENDS);
    return (
        <div className="grid items-start gap-5 lg:grid-cols-2">
            <section aria-labelledby="pace" className="rounded-xl border bg-card p-5 shadow-card sm:p-6 lg:col-span-2">
                <PacePanel data={data} />
            </section>

            <section aria-labelledby="trends" className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
                <h2 id="trends" className="text-lg">
                    Accuracy by topic
                </h2>
                <p className="mt-1 mb-4 text-sm text-muted-foreground">
                    Marks scored per week over the last {TREND_WEEKS} weeks. Topics that are slipping come first.
                </p>
                {trends.length === 0 ? (
                    <p className="rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                        Answer questions over a couple of weeks to see whether each topic is improving.
                    </p>
                ) : (
                    <ul className="divide-y">
                        {trends.map((t) => {
                            const last = [...t.weeks].reverse().find((w) => w.accuracy !== null)!;
                            const change = t.change === null ? null : Math.round(t.change * 100);
                            return (
                                <li
                                    key={t.topicId}
                                    className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
                                        <p className="leading-snug font-bold sm:truncate">{t.topic.name}</p>
                                        <p className="flex flex-wrap items-center gap-x-2 text-[0.8125rem] text-muted-foreground">
                                            <span>
                                                {t.topic.unit.code} · {t.attempts} answer{t.attempts === 1 ? "" : "s"}
                                            </span>
                                            {change !== null && change !== 0 && (
                                                <span className="inline-flex items-center gap-1 font-bold text-foreground">
                                                    {change < 0 ? (
                                                        <TrendingDown className="size-3.5" aria-hidden />
                                                    ) : (
                                                        <TrendingUp className="size-3.5" aria-hidden />
                                                    )}
                                                    {change > 0 ? "+" : "−"}
                                                    {Math.abs(change)} pts
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Sparkline
                                            weeks={t.weeks}
                                            label={`${t.topic.name}: ${t.weeks
                                                .filter((w) => w.accuracy !== null)
                                                .map((w) => `week to ${shortDay(w.end)} ${pct(w.accuracy!)}`)
                                                .join(", ")}`}
                                        />
                                        <span className="num w-11 shrink-0 text-right text-lg leading-none">
                                            {pct(last.accuracy!)}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <section aria-labelledby="focus-time" className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
                <h2 id="focus-time" className="text-lg">
                    Focus time by subject
                </h2>
                <p className="mt-1 mb-4 text-sm text-muted-foreground">
                    {totalFocus > 0
                        ? `${formatMinutes(totalFocus)} in the last ${FOCUS_WINDOW_DAYS} days.`
                        : `Focus sessions from the last ${FOCUS_WINDOW_DAYS} days.`}
                </p>
                {data.focus.length === 0 ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3">
                        <p className="text-muted-foreground">No focus sessions yet.</p>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/focus">
                                <Clock />
                                Start a focus session
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <SubjectTime rows={data.focus} />
                )}
            </section>
        </div>
    );
}

function PacePanel({ data }: { data: ProgressAnalytics }) {
    if (!data.plan) {
        return (
            <>
                <h2 id="pace" className="text-lg">
                    Plan pace
                </h2>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3">
                    <p className="text-muted-foreground">
                        Make a study plan to see whether you&apos;re on track for your exam.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/plans/new">
                            <CalendarClock />
                            Create a plan
                        </Link>
                    </Button>
                </div>
            </>
        );
    }
    const { pace } = data.plan;
    const finished = pace.done + pace.skipped;
    const summary =
        pace.daysLeft < 0
            ? `The exam date has passed. You finished ${pace.done} of ${pace.total} tasks.`
            : pace.behind > 0
              ? `${pace.behind} task${pace.behind === 1 ? "" : "s"} behind, ${pace.daysLeft} day${pace.daysLeft === 1 ? "" : "s"} to go.`
              : pace.scheduledByToday === 0
                ? `Your plan starts soon. ${pace.daysLeft} days to go.`
                : `On track: ${finished} of ${pace.scheduledByToday} tasks so far, ${pace.daysLeft} day${pace.daysLeft === 1 ? "" : "s"} to go.`;
    return (
        <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h2 id="pace" className="text-lg">
                        Plan pace
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        <Link
                            href={`/plans/${data.plan.id}`}
                            className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                        >
                            {data.plan.title}
                        </Link>{" "}
                        · {summary}
                    </p>
                </div>
                {pace.behind > 0 && pace.daysLeft >= 0 && (
                    <Button asChild variant="outline" size="sm" className="shrink-0 self-start">
                        <Link href={`/plans/${data.plan.id}`}>
                            <CalendarClock />
                            Catch up
                        </Link>
                    </Button>
                )}
            </div>
            <dl className="mb-5 grid grid-cols-3 gap-3 sm:max-w-lg">
                <PaceStat label="Done" value={pace.done} />
                <PaceStat label="Due so far" value={pace.scheduledByToday} />
                <PaceStat label="Days left" value={Math.max(0, pace.daysLeft)} />
            </dl>
            <PlanPaceChart pace={pace} today={data.today} />
        </>
    );
}

function PaceStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg bg-muted px-3 py-2.5">
            <dt className="text-[0.8125rem] font-semibold text-muted-foreground">{label}</dt>
            <dd className="num mt-0.5 text-2xl leading-none">{value}</dd>
        </div>
    );
}
