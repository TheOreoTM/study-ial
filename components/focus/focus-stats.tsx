import { Flame, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FocusStats } from "@/lib/queries/focus";
import { cn } from "@/lib/utils";

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
    const max = Math.max(...stats.last7Days.map((d) => d.minutes), 1);
    const weekTotal = stats.last7Days.reduce((sum, d) => sum + d.minutes, 0);

    return (
        <Card className={cn("gap-5", className)}>
            <CardHeader>
                <CardTitle className="text-base">Your focus</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <dl className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                        <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Timer className="size-3.5" aria-hidden /> Today
                        </dt>
                        <dd className="mt-1 text-xl font-semibold tabular-nums">{formatMinutes(stats.todayMinutes)}</dd>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                        <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Flame className="size-3.5" aria-hidden /> Study streak
                        </dt>
                        <dd className="mt-1 text-xl font-semibold tabular-nums">
                            {stats.streakDays} day{stats.streakDays === 1 ? "" : "s"}
                        </dd>
                    </div>
                </dl>

                <figure>
                    <figcaption className="mb-3 flex items-baseline justify-between text-xs text-muted-foreground">
                        <span>Last 7 days</span>
                        <span className="tabular-nums">{formatMinutes(weekTotal)}</span>
                    </figcaption>
                    <ul className="grid h-28 grid-cols-7 items-end gap-1.5">
                        {stats.last7Days.map((d, i) => {
                            const isToday = i === stats.last7Days.length - 1;
                            const pct = d.minutes > 0 ? Math.max(6, Math.round((d.minutes / max) * 100)) : 0;
                            return (
                                <li key={d.date} className="flex h-full flex-col items-center justify-end gap-1.5">
                                    <span className="sr-only">
                                        {weekday(d.date)}
                                        {isToday ? " (today)" : ""}: {d.minutes} minutes
                                    </span>
                                    <div
                                        aria-hidden
                                        className="flex w-full flex-1 items-end justify-center"
                                        title={`${d.minutes} min`}
                                    >
                                        <div
                                            className={cn(
                                                "w-full max-w-7 rounded-t-sm",
                                                d.minutes === 0
                                                    ? "h-0.5 bg-border"
                                                    : isToday
                                                      ? "bg-primary"
                                                      : "bg-primary/45",
                                            )}
                                            style={d.minutes > 0 ? { height: `${pct}%` } : undefined}
                                        />
                                    </div>
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "text-[0.7rem]",
                                            isToday ? "font-medium text-foreground" : "text-muted-foreground",
                                        )}
                                    >
                                        {weekday(d.date).slice(0, 2)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </figure>
            </CardContent>
        </Card>
    );
}
