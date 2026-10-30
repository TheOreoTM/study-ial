import { Flame, Timer } from "lucide-react";
import type { FocusStats } from "@/lib/queries/focus";
import { cn } from "@/lib/utils";
import { WeekBars } from "./week-bars";

function weekday(date: string) {
    return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
}

function formatMinutes(m: number) {
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const r = m % 60;
    return r ? `${h} h ${r} min` : `${h} h`;
}

/** Today's focus total, the study streak and a 7-day bar chart. Server-renderable (no hooks). */
export function FocusStatsCard({ stats, className }: { stats: FocusStats; className?: string }) {
    const weekTotal = stats.last7Days.reduce((sum, d) => sum + d.minutes, 0);

    return (
        <section aria-labelledby="focus-stats" className={cn("flex flex-col gap-4 rounded-xl bg-muted p-5", className)}>
            <h2 id="focus-stats" className="text-lg">
                Your focus
            </h2>
            <dl className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg bg-card p-4">
                    <dt className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-muted-foreground">
                        <Timer className="size-4" aria-hidden /> Today
                    </dt>
                    <dd className="num mt-1.5 text-2xl leading-none">{formatMinutes(stats.todayMinutes)}</dd>
                </div>
                <div className="rounded-lg bg-card p-4">
                    <dt className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-muted-foreground">
                        <Flame className="size-4" aria-hidden /> Study streak
                    </dt>
                    <dd className="num mt-1.5 text-2xl leading-none">
                        {stats.streakDays} day{stats.streakDays === 1 ? "" : "s"}
                    </dd>
                </div>
            </dl>

            <figure className="rounded-lg bg-card p-4">
                <figcaption className="mb-4 flex items-baseline justify-between gap-2 text-[0.8125rem] font-bold text-muted-foreground">
                    <span>Last 7 days</span>
                    <span className="num text-base text-foreground">{formatMinutes(weekTotal)}</span>
                </figcaption>
                <WeekBars
                    days={stats.last7Days.map((d, i) => ({
                        key: d.date,
                        weekday: weekday(d.date),
                        value: d.minutes,
                        isToday: i === stats.last7Days.length - 1,
                    }))}
                    describe={(m) => `${m} minutes`}
                />
            </figure>
        </section>
    );
}
