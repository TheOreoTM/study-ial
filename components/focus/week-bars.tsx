import { cn } from "@/lib/utils";

export type WeekBarDay = {
    key: string;
    /** Short weekday name, e.g. "Sat" — the visible label uses the first two letters */
    weekday: string;
    value: number;
    isToday: boolean;
};

/**
 * Seven-day activity bars: grape bars scaled to the busiest day, today in full grape, empty days as short track stubs.
 * Each day has a screen-reader sentence; the bars themselves are decorative. Server-renderable.
 */
export function WeekBars({
    days,
    describe,
    className,
}: {
    days: WeekBarDay[];
    /** Screen-reader text for one day's value, e.g. (n) => `${n} questions` */
    describe: (value: number) => string;
    className?: string;
}) {
    const max = Math.max(1, ...days.map((d) => d.value));
    return (
        <ul className={cn("grid h-24 grid-cols-7 items-end gap-1.5", className)}>
            {days.map((d) => {
                const pct = d.value > 0 ? Math.max(12, Math.round((d.value / max) * 100)) : 0;
                return (
                    <li key={d.key} className="flex h-full flex-col items-center justify-end gap-1.5">
                        <span className="sr-only">
                            {d.weekday}
                            {d.isToday ? " (today)" : ""}: {describe(d.value)}
                        </span>
                        <div
                            aria-hidden
                            className="flex w-full flex-1 items-end justify-center"
                            title={describe(d.value)}
                        >
                            <div
                                className={cn(
                                    "w-full max-w-6 rounded-full",
                                    d.value === 0 ? "h-1.5 bg-track" : d.isToday ? "bg-progress" : "bg-progress/45",
                                )}
                                style={d.value > 0 ? { height: `${pct}%` } : undefined}
                            />
                        </div>
                        <span
                            aria-hidden
                            className={cn(
                                "text-xs leading-none",
                                d.isToday
                                    ? "font-extrabold text-selected-foreground"
                                    : "font-semibold text-muted-foreground",
                            )}
                        >
                            {d.weekday.slice(0, 2)}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}
