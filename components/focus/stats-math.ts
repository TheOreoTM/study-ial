// Pure helpers for focus stats / study streaks (unit-tested). DB access lives in lib/queries/focus.ts.

/** Students are in the Maldives first; day boundaries for stats use this zone unless told otherwise. */
export const DEFAULT_TIME_ZONE = "Indian/Maldives";

/** "YYYY-MM-DD" for `date` as seen in `timeZone`. */
export function dayKey(date: Date, timeZone: string = DEFAULT_TIME_ZONE): string {
    // en-CA formats as YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
        date,
    );
}

/** Shift a "YYYY-MM-DD" key by whole days (calendar arithmetic, timezone-free). */
export function addDays(key: string, days: number): string {
    const d = new Date(`${key}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

/** The last `n` day keys ending at `today`, oldest first. */
export function lastNDays(today: string, n: number): string[] {
    return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

/**
 * Consecutive days with activity, ending today — or ending yesterday if there's nothing yet today
 * (so the streak doesn't look broken first thing in the morning).
 */
export function countStreak(activeDays: Iterable<string>, today: string): number {
    const days = new Set(activeDays);
    let cursor = days.has(today) ? today : addDays(today, -1);
    let streak = 0;
    while (days.has(cursor)) {
        streak++;
        cursor = addDays(cursor, -1);
    }
    return streak;
}

/** Sum minutes per day over the given window. */
export function bucketMinutes(
    sessions: { endedAt: Date; minutes: number }[],
    days: string[],
    timeZone: string = DEFAULT_TIME_ZONE,
): { date: string; minutes: number }[] {
    const totals = new Map(days.map((d) => [d, 0]));
    for (const s of sessions) {
        const k = dayKey(s.endedAt, timeZone);
        if (totals.has(k)) totals.set(k, totals.get(k)! + s.minutes);
    }
    return days.map((date) => ({ date, minutes: totals.get(date)! }));
}
