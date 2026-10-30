"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskItem } from "./task-item";
import { formatDay, formatMinutes, type TaskLike } from "./task-meta";
import { useTaskStatuses } from "./use-task-status";

const DAY_MS = 86_400_000;
const dayNum = (d: Date) => Math.floor(new Date(d).getTime() / DAY_MS);
/** Monday-based week start, as a UTC day number. */
const weekOf = (day: number) => day - ((new Date(day * DAY_MS).getUTCDay() + 6) % 7);

type Day<T> = { day: number; tasks: T[] };
type Week<T> = { start: number; days: Day<T>[] };

const WEEKS_STEP = 2;

/** A plan's tasks grouped by week and day, with today highlighted and done/skip/undo inline. */
export function PlanTaskList({ tasks, todayDay }: { tasks: TaskLike[]; todayDay: number }) {
    const [items, setStatus] = useTaskStatuses(tasks);
    const [showPast, setShowPast] = useState(false);
    const [futureWeeks, setFutureWeeks] = useState(WEEKS_STEP);

    const weeks = useMemo(() => {
        const out: Week<TaskLike>[] = [];
        for (const t of items) {
            const day = dayNum(t.date);
            const start = weekOf(day);
            let week = out.at(-1);
            if (!week || week.start !== start) out.push((week = { start, days: [] }));
            let d = week.days.at(-1);
            if (!d || d.day !== day) week.days.push((d = { day, tasks: [] }));
            d.tasks.push(t);
        }
        return out;
    }, [items]);

    const thisWeek = weekOf(todayDay);
    const past = weeks.filter((w) => w.start < thisWeek);
    const upcoming = weeks.filter((w) => w.start >= thisWeek);
    const visibleUpcoming = upcoming.slice(0, futureWeeks);
    const hiddenUpcoming = upcoming.length - visibleUpcoming.length;

    const renderWeek = (w: Week<TaskLike>) => {
        const all = w.days.flatMap((d) => d.tasks);
        const done = all.filter((t) => t.status === "DONE").length;
        const label =
            w.start === thisWeek
                ? "This week"
                : w.start === thisWeek + 7
                  ? "Next week"
                  : `Week of ${formatDay(new Date(w.start * DAY_MS), { weekday: undefined })}`;
        return (
            <section key={w.start} aria-label={label} className="space-y-3">
                <div className="flex items-baseline justify-between gap-2 border-b pb-2">
                    <h2 className="font-semibold">{label}</h2>
                    <span className="text-xs text-muted-foreground tabular-nums">
                        {done}/{all.length} done
                    </span>
                </div>
                {w.days.map((d) => {
                    const isToday = d.day === todayDay;
                    const minutes = d.tasks.filter((t) => t.status !== "SKIPPED").reduce((s, t) => s + t.minutes, 0);
                    const overdue = d.day < todayDay && d.tasks.some((t) => t.status === "PENDING");
                    return (
                        <div
                            key={d.day}
                            id={isToday ? "today" : undefined}
                            className={cn(
                                "scroll-mt-20 rounded-xl p-2 sm:p-3",
                                isToday ? "bg-accent/60 ring-1 ring-primary/30" : "",
                            )}
                        >
                            <h3 className="mb-2 flex flex-wrap items-center gap-2 px-1 text-sm">
                                <span className={cn("font-medium", isToday && "text-accent-foreground")}>
                                    {formatDay(new Date(d.day * DAY_MS))}
                                </span>
                                {isToday && (
                                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                        Today
                                    </span>
                                )}
                                {overdue && (
                                    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-warning">
                                        Missed
                                    </span>
                                )}
                                <span className="ml-auto text-xs text-muted-foreground">{formatMinutes(minutes)}</span>
                            </h3>
                            <ul className="space-y-2">
                                {d.tasks.map((t) => (
                                    <TaskItem
                                        key={t.id}
                                        task={t}
                                        compact={!isToday}
                                        onStatus={(s) => setStatus(t.id, s)}
                                    />
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </section>
        );
    };

    return (
        <div className="space-y-8">
            {past.length > 0 && (
                <div className="space-y-8">
                    <Button variant="ghost" size="sm" onClick={() => setShowPast((v) => !v)} aria-expanded={showPast}>
                        {showPast ? <ChevronUp /> : <ChevronDown />}
                        {showPast ? "Hide earlier weeks" : `Show ${past.length} earlier ${past.length === 1 ? "week" : "weeks"}`}
                    </Button>
                    {showPast && past.map(renderWeek)}
                </div>
            )}
            {upcoming.length === 0 && (
                <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No more sessions scheduled in this plan.
                </p>
            )}
            {visibleUpcoming.map(renderWeek)}
            {hiddenUpcoming > 0 && (
                <div className="flex justify-center">
                    <Button variant="outline" onClick={() => setFutureWeeks((n) => n + WEEKS_STEP)}>
                        <ChevronDown />
                        Show more weeks ({hiddenUpcoming} to go)
                    </Button>
                </div>
            )}
        </div>
    );
}
