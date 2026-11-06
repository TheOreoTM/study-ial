// Study calendar heatmap: one cell per local (Maldives) day over the last N weeks. Pure functions (unit-tested);
// DB access lives in lib/queries/heatmap.ts.

import { addDays } from "@/components/focus/stats-math";

export type DayActivity = { questions: number; minutes: number };

export type HeatCell = {
    /** "YYYY-MM-DD" */
    date: string;
    questions: number;
    minutes: number;
    level: 0 | 1 | 2 | 3 | 4;
    future: boolean;
};

export type Heatmap = {
    /** Columns of seven days, Sunday first (the Maldivian school week starts on Sunday), oldest column first */
    weeks: HeatCell[][];
    /** Month label at the column where each month starts */
    months: { column: number; label: string }[];
    activeDays: number;
    longestStreak: number;
    questions: number;
    minutes: number;
};

/** Five minutes of focus counts like one answered question. */
export function activityPoints(a: DayActivity) {
    return a.questions + a.minutes / 5;
}

export function levelFor(a: DayActivity): HeatCell["level"] {
    const p = activityPoints(a);
    if (p <= 0) return 0;
    if (p < 6) return 1;
    if (p < 15) return 2;
    if (p < 30) return 3;
    return 4;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Day of the week for a "YYYY-MM-DD" key, 0 = Sunday. */
export function weekday(key: string) {
    return new Date(`${key}T00:00:00Z`).getUTCDay();
}

/**
 * The grid for the `weeks` weeks ending with the one containing `today`. Days after today in the last column are
 * marked `future` (drawn empty).
 */
export function buildHeatmap(today: string, activity: Map<string, DayActivity>, weeks = 26): Heatmap {
    const lastSunday = addDays(today, -weekday(today));
    const start = addDays(lastSunday, -7 * (weeks - 1));
    const grid: HeatCell[][] = [];
    const months: Heatmap["months"] = [];
    let activeDays = 0;
    let questions = 0;
    let minutes = 0;
    let run = 0;
    let longest = 0;

    for (let w = 0; w < weeks; w++) {
        const col: HeatCell[] = [];
        for (let d = 0; d < 7; d++) {
            const date = addDays(start, w * 7 + d);
            const future = date > today;
            const a = (!future && activity.get(date)) || { questions: 0, minutes: 0 };
            const level = future ? 0 : levelFor(a);
            col.push({ date, questions: a.questions, minutes: a.minutes, level, future });
            if (!future) {
                questions += a.questions;
                minutes += a.minutes;
                if (level > 0) {
                    activeDays++;
                    run++;
                    longest = Math.max(longest, run);
                } else {
                    run = 0;
                }
            }
            // Label the column holding the 1st of a month (or the first column).
            if (date.endsWith("-01") || (w === 0 && d === 0)) {
                const label = MONTHS[Number(date.slice(5, 7)) - 1];
                if (!months.some((m) => m.column === w)) months.push({ column: w, label });
            }
        }
        grid.push(col);
    }
    // Two labels in neighbouring columns collide; keep the later one (the month that actually starts).
    const spaced = months.filter((m, i) => !(months[i + 1] && months[i + 1].column - m.column < 2));
    return { weeks: grid, months: spaced, activeDays, longestStreak: longest, questions, minutes };
}

/** The most recent `weeks` columns of a heatmap, with month labels and totals recomputed for that span. */
export function lastWeeks(map: Heatmap, weeks: number): Heatmap {
    if (weeks >= map.weeks.length) return map;
    const offset = map.weeks.length - weeks;
    const cols = map.weeks.slice(offset);
    const days = cols.flat().filter((c) => !c.future);
    let run = 0;
    let longest = 0;
    for (const c of days) {
        run = c.level > 0 ? run + 1 : 0;
        longest = Math.max(longest, run);
    }
    const months = map.months.filter((m) => m.column >= offset).map((m) => ({ ...m, column: m.column - offset }));
    return {
        weeks: cols,
        months,
        activeDays: days.filter((c) => c.level > 0).length,
        longestStreak: longest,
        questions: days.reduce((n, c) => n + c.questions, 0),
        minutes: days.reduce((n, c) => n + c.minutes, 0),
    };
}

/** Weekly totals (for the screen-reader table), oldest first. */
export function weeklyTotals(map: Heatmap) {
    return map.weeks.map((col) => ({
        from: col[0].date,
        to: col[6].date,
        activeDays: col.filter((c) => !c.future && c.level > 0).length,
        questions: col.reduce((n, c) => n + c.questions, 0),
        minutes: col.reduce((n, c) => n + c.minutes, 0),
    }));
}
