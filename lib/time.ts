// Students are in the Maldives (UTC+5) first. Calendar-day logic — "today", streaks, plan task
// dates — uses this zone so that the day doesn't flip at 5am local time.
export const APP_TIME_ZONE = process.env.NEXT_PUBLIC_APP_TIME_ZONE || "Indian/Maldives";

/** "YYYY-MM-DD" for the given instant in the app's time zone. */
export function localDayKey(now = new Date(), timeZone = APP_TIME_ZONE) {
    // en-CA formats as YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** The local calendar day as a Date at 00:00Z — the same shape as `@db.Date` columns. */
export function localDay(now = new Date(), timeZone = APP_TIME_ZONE) {
    return new Date(`${localDayKey(now, timeZone)}T00:00:00Z`);
}
