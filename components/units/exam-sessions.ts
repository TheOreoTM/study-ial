// IAL exam sessions. Pearson runs three series a year: January, May/June and October/November.
// Pure helpers (unit-tested) shared by onboarding and settings; dates are stored as UTC midnight.

export type ExamSeries = {
    key: "jan" | "jun" | "oct";
    name: string;
    /** Month (0-based) and day of the approximate exam date */
    month: number;
    day: number;
    /** First and last months (0-based) the series runs in */
    firstMonth: number;
    lastMonth: number;
};

export const EXAM_SERIES: ExamSeries[] = [
    { key: "jan", name: "January", month: 0, day: 15, firstMonth: 0, lastMonth: 0 },
    { key: "jun", name: "May/June", month: 5, day: 1, firstMonth: 4, lastMonth: 5 },
    { key: "oct", name: "October/November", month: 9, day: 20, firstMonth: 9, lastMonth: 10 },
];

export type ExamSession = {
    /** "2027-jan" */
    id: string;
    label: string;
    /** Approximate exam date, "YYYY-MM-DD" */
    date: string;
};

function isoDate(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Upcoming sessions for this year and next. A session is excluded once all of its months have passed
 * (so October/November stays available throughout November).
 */
export function upcomingExamSessions(today: Date = new Date()): ExamSession[] {
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const todayIso = today.toISOString().slice(0, 10);
    const sessions: ExamSession[] = [];
    for (const y of [year, year + 1]) {
        for (const s of EXAM_SERIES) {
            const date = isoDate(y, s.month, s.day);
            // Skip sessions whose (approximate) exam date has already passed — plans can't target the past.
            if (y === year && (s.lastMonth < month || date < todayIso)) continue;
            sessions.push({ id: `${y}-${s.key}`, label: `${s.name} ${y}`, date });
        }
    }
    return sessions;
}

/** Map a stored exam date back to the session it represents (same year + series month), if any. */
export function sessionForDate(date: Date | string | null | undefined): ExamSession | null {
    if (!date) return null;
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const s = EXAM_SERIES.find((x) => m >= x.firstMonth && m <= x.lastMonth);
    if (!s) return null;
    return { id: `${y}-${s.key}`, label: `${s.name} ${y}`, date: isoDate(y, s.month, s.day) };
}

/** Format a stored date as "YYYY-MM-DD" (UTC). */
export function toIsoDate(date: Date | null | undefined): string | null {
    return date ? date.toISOString().slice(0, 10) : null;
}

/**
 * The options to show for a unit: upcoming sessions, plus the unit's current session if it has already
 * passed or doesn't match a series (so editing never silently drops a saved date).
 */
export function sessionOptions(today: Date, current: string | null): ExamSession[] {
    const upcoming = upcomingExamSessions(today);
    if (!current || upcoming.some((s) => s.date === current)) return upcoming;
    const match = sessionForDate(current);
    const extra: ExamSession =
        match && match.date === current
            ? match
            : { id: `custom-${current}`, label: formatDateLabel(current), date: current };
    return [extra, ...upcoming];
}

function formatDateLabel(iso: string) {
    const d = new Date(`${iso}T00:00:00Z`);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
