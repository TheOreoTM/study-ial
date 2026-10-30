"use client";

import { useMemo, useState } from "react";
import { CalendarClock, ChevronDown, ChevronUp } from "lucide-react";
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
export function PlanTaskList({
    tasks,
    todayDay,
    highlightNext = true,
}: {
    tasks: TaskLike[];
    todayDay: number;
    /** Give today's first pending task the view's primary action (off when another primary is on screen). */
    highlightNext?: boolean;
}) {
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

    const nextId = highlightNext
        ? items.find((t) => dayNum(t.date) === todayDay && t.status === "PENDING")?.id
        : undefined;
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
            <section key={w.start} aria-label={label} className="space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-xl">{label}</h2>
                    <span className="text-sm font-semibold text-muted-foreground">
                        <span className="num text-foreground">
                            {done}/{all.length}
                        </span>{" "}
                        done
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
                            className={cn("scroll-mt-24", isToday && "-mx-2 rounded-xl bg-muted p-2 sm:-mx-4 sm:p-4")}
                        >
                            <h3 className="mb-2.5 flex min-h-7 flex-wrap items-center gap-2 px-1 font-sans text-[0.9375rem] font-bold">
                                <span>{formatDay(new Date(d.day * DAY_MS))}</span>
                                {isToday && (
                                    <span className="inline-flex h-6 items-center rounded-full bg-selected px-2.5 font-display text-xs font-extrabold text-selected-foreground">
                                        Today
                                    </span>
                                )}
                                {overdue && (
                                    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-muted px-2.5 text-xs font-bold text-warning">
                                        <CalendarClock className="size-3.5" aria-hidden />
                                        Missed
                                    </span>
                                )}
                                <span className="ml-auto text-sm font-semibold text-muted-foreground">
                                    {formatMinutes(minutes)}
                                </span>
                            </h3>
                            <ul className={cn(isToday ? "space-y-3" : "space-y-2")}>
                                {d.tasks.map((t) => (
                                    <TaskItem
                                        key={t.id}
                                        task={t}
                                        compact={!isToday}
                                        next={t.id === nextId}
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
        <div className="space-y-10">
            {past.length > 0 && (
                <div className="space-y-8">
                    <Button variant="ghost" size="sm" className="-ml-3" onClick={() => setShowPast((v) => !v)} aria-expanded={showPast}>
                        {showPast ? <ChevronUp /> : <ChevronDown />}
                        {showPast ? "Hide earlier weeks" : `Show ${past.length} earlier ${past.length === 1 ? "week" : "weeks"}`}
                    </Button>
                    {showPast && past.map(renderWeek)}
                </div>
            )}
            {upcoming.length === 0 && (
                <p className="rounded-xl bg-muted p-6 text-center text-muted-foreground">
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
