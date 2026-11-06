import type { Heatmap } from "@/lib/heatmap";
import { lastWeeks, weeklyTotals } from "@/lib/heatmap";
import { cn } from "@/lib/utils";

// Grape (the progress colour) in four strengths; teal, sun and bubblegum are reserved for mastery.
const LEVEL_CLS = ["bg-track", "bg-progress/25", "bg-progress/50", "bg-progress/75", "bg-progress"] as const;
const ROW_LABELS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];

function describeDay(date: string, questions: number, minutes: number) {
    const day = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
    });
    if (questions === 0 && minutes === 0) return `${day}: no study`;
    const parts = [
        questions && `${questions} question${questions === 1 ? "" : "s"}`,
        minutes && `${minutes} min focus`,
    ].filter(Boolean);
    return `${day}: ${parts.join(", ")}`;
}

/** Weeks shown on phones; the full map (a year) shows from 640px. */
const PHONE_WEEKS = 26;

/**
 * GitHub-style calendar of study activity by Maldives day, with a weekly table for screen readers. Totals describe
 * the full map (shown from 640px); phones show the latest 26 weeks.
 */
export function StudyHeatmap({ map }: { map: Heatmap }) {
    const phone = lastWeeks(map, PHONE_WEEKS);
    const hours = Math.round(map.minutes / 6) / 10;
    const span = map.weeks.length >= 52 ? "the last year" : `the last ${map.weeks.length} weeks`;
    return (
        <section aria-labelledby="heatmap" className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <div>
                    <h2 id="heatmap" className="text-lg">
                        Study calendar
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">Questions answered and focus time, {span}.</p>
                </div>
                <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <div className="flex items-baseline gap-1.5">
                        <dt className="text-muted-foreground">Days studied</dt>
                        <dd className="num text-base">{map.activeDays}</dd>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <dt className="text-muted-foreground">Longest run</dt>
                        <dd className="num text-base">
                            {map.longestStreak} day{map.longestStreak === 1 ? "" : "s"}
                        </dd>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <dt className="text-muted-foreground">Focus</dt>
                        <dd className="num text-base">{hours} h</dd>
                    </div>
                </dl>
            </div>

            <Grid map={phone} className="sm:hidden" />
            <Grid map={map} className="hidden sm:grid" />

            <div aria-hidden className="mt-3 flex items-center justify-end gap-1.5 text-[0.6875rem] font-bold text-muted-foreground">
                Less
                {LEVEL_CLS.map((cls) => (
                    <span key={cls} className={cn("size-3 rounded-[3px]", cls)} />
                ))}
                More
            </div>

            {/* sr-only on a wrapper: a table ignores the 1px width and would widen the page. */}
            <div className="sr-only">
            <table>
                <caption>Study activity by week, oldest first</caption>
                <thead>
                    <tr>
                        <th scope="col">Week starting</th>
                        <th scope="col">Days studied</th>
                        <th scope="col">Questions</th>
                        <th scope="col">Focus minutes</th>
                    </tr>
                </thead>
                <tbody>
                    {weeklyTotals(map).map((w) => (
                        <tr key={w.from}>
                            <th scope="row">{w.from}</th>
                            <td>{w.activeDays}</td>
                            <td>{w.questions}</td>
                            <td>{w.minutes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </section>
    );
}

function Grid({ map, className }: { map: Heatmap; className?: string }) {
    const cols = map.weeks.length;
    const template = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };
    return (
        // Cells cap at about 18px so a wide screen doesn't turn them into tiles.
        <div aria-hidden className={cn("grid max-w-[68rem] grid-cols-[auto_minmax(0,1fr)] gap-x-2", className)}>
            <span />
            <div className="mb-1 grid h-4 overflow-hidden text-[0.6875rem] font-bold text-muted-foreground" style={template}>
                {map.months.map((m) => (
                    <span
                        key={m.column}
                        style={{ gridColumnStart: m.column + 1, gridRowStart: 1 }}
                        className={cn("whitespace-nowrap", m.column >= cols - 2 && "justify-self-end")}
                    >
                        {m.label}
                    </span>
                ))}
            </div>
            <div className="grid grid-rows-7 gap-[3px] text-[0.625rem] leading-none font-bold text-muted-foreground">
                {ROW_LABELS.map((l, i) => (
                    <span key={i} className="flex items-center">
                        {l}
                    </span>
                ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={template}>
                {map.weeks.flatMap((week) =>
                    week.map((c) => (
                        <span
                            key={c.date}
                            title={c.future ? undefined : describeDay(c.date, c.questions, c.minutes)}
                            className={cn(
                                "aspect-square w-full rounded-[3px]",
                                c.future ? "bg-transparent" : LEVEL_CLS[c.level],
                            )}
                        />
                    )),
                )}
            </div>
        </div>
    );
}
