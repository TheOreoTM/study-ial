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

/** Minutes the zone is ahead of UTC at the given instant (Maldives: 300). */
export function zoneOffsetMinutes(at: Date, timeZone = APP_TIME_ZONE) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).formatToParts(at);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60_000);
}

/** The instant local midnight began today (e.g. 19:00Z the day before, in the Maldives). */
export function localDayStart(now = new Date(), timeZone = APP_TIME_ZONE) {
    const day = localDay(now, timeZone);
    return new Date(day.getTime() - zoneOffsetMinutes(day, timeZone) * 60_000);
}
