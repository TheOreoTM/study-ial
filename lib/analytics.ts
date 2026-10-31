// Analytics for /progress: pure maths (unit-tested). DB access lives in lib/queries/analytics.ts.
// Every day boundary is a local calendar day (lib/time.ts) keyed "YYYY-MM-DD"; weeks are 7-day windows ending today,
// so "this week" always includes today.

import { addDays, dayKey, lastNDays } from "@/components/focus/stats-math";
import { APP_TIME_ZONE } from "@/lib/time";

// ─── Time per subject ────────────────────────────────────────────────────────

export type SubjectRef = { slug: string; name: string };

export type SubjectMinutes = { slug: string | null; name: string; minutes: number };

/**
 * Focus minutes per subject over `days` (local day keys). Sessions without a topic are grouped under `slug: null`,
 * listed last; subjects are ordered by minutes, most first.
 */
export function minutesBySubject(
    sessions: { endedAt: Date; minutes: number; subject: SubjectRef | null }[],
    days: string[],
    timeZone = APP_TIME_ZONE,
): SubjectMinutes[] {
    const window = new Set(days);
    const totals = new Map<string | null, SubjectMinutes>();
    for (const s of sessions) {
        if (!window.has(dayKey(s.endedAt, timeZone))) continue;
        const key = s.subject?.slug ?? null;
        const row = totals.get(key) ?? { slug: key, name: s.subject?.name ?? "Not linked to a topic", minutes: 0 };
        row.minutes += s.minutes;
        totals.set(key, row);
    }
    return [...totals.values()]
        .filter((r) => r.minutes > 0)
        .sort((a, b) => (a.slug === null ? 1 : 0) - (b.slug === null ? 1 : 0) || b.minutes - a.minutes);
}

// ─── Accuracy trend ──────────────────────────────────────────────────────────

export type MarkLike = { createdAt: Date; marksAwarded: number; maxMarks: number };

export type WeekAccuracy = {
    /** First and last local day of the week, inclusive */
    start: string;
    end: string;
    marks: number;
    max: number;
    attempts: number;
    /** marks ÷ max, or null for a week with no attempts (a gap, not a zero) */
    accuracy: number | null;
};

/** Weekly accuracy over the last `weeks` 7-day windows ending `today`, oldest first. */
export function weeklyAccuracy(
    attempts: MarkLike[],
    today: string,
    weeks = 6,
    timeZone = APP_TIME_ZONE,
): WeekAccuracy[] {
    const out: WeekAccuracy[] = Array.from({ length: weeks }, (_, i) => {
        const end = addDays(today, -7 * (weeks - 1 - i));
        return { start: addDays(end, -6), end, marks: 0, max: 0, attempts: 0, accuracy: null };
    });
    for (const a of attempts) {
        const k = dayKey(a.createdAt, timeZone);
        const w = out.find((x) => x.start <= k && k <= x.end);
        if (!w) continue;
        w.marks += a.marksAwarded;
        w.max += a.maxMarks;
        w.attempts++;
    }
    for (const w of out) w.accuracy = w.max > 0 ? w.marks / w.max : null;
    return out;
}

/** Change from the first to the last week with data; null with fewer than two such weeks. */
export function accuracyChange(weeks: WeekAccuracy[]): number | null {
    const withData = weeks.filter((w) => w.accuracy !== null);
    if (withData.length < 2) return null;
    return withData[withData.length - 1].accuracy! - withData[0].accuracy!;
}

export type TopicTrend = { topicId: string; weeks: WeekAccuracy[]; change: number | null; attempts: number };

/**
 * Weekly accuracy per topic for topics practised in the window. Slipping topics come first (most negative change),
 * then topics without enough weeks to compare, then improving ones; ties go to the most-practised.
 */
export function topicTrends(
    attempts: (MarkLike & { topicId: string })[],
    today: string,
    weeks = 6,
    timeZone = APP_TIME_ZONE,
): TopicTrend[] {
    const byTopic = new Map<string, MarkLike[]>();
    for (const a of attempts) {
        const list = byTopic.get(a.topicId) ?? [];
        list.push(a);
        byTopic.set(a.topicId, list);
    }
    // Changes under 3 points are noise, not a trend.
    const rank = (c: number | null) => (c === null || Math.abs(c) < 0.03 ? 0 : c);
    return [...byTopic]
        .map(([topicId, list]) => {
            const w = weeklyAccuracy(list, today, weeks, timeZone);
            return { topicId, weeks: w, change: accuracyChange(w), attempts: w.reduce((n, x) => n + x.attempts, 0) };
        })
        .filter((t) => t.weeks.some((w) => w.accuracy !== null))
        .sort((a, b) => rank(a.change) - rank(b.change) || b.attempts - a.attempts);
}

// ─── Plan pace ───────────────────────────────────────────────────────────────

export type PaceTask = { date: Date; status: "PENDING" | "DONE" | "SKIPPED"; completedAt: Date | null };

export type PlanPace = {
    total: number;
    done: number;
    skipped: number;
    /** Tasks dated on or before today that weren't skipped */
    scheduledByToday: number;
    /** Of those, how many are done */
    doneByToday: number;
    /** Pending tasks dated before today */
    behind: number;
    /** Local days from today until the exam (negative after it) */
    daysLeft: number;
    /** One point per day from the plan's start to its exam day: cumulative tasks scheduled (not skipped) and done */
    series: { day: string; scheduled: number; done: number | null }[];
};

const keyOf = (d: Date) => d.toISOString().slice(0, 10); // @db.Date columns are UTC midnight of the local day

/**
 * How a plan is keeping pace with its exam. Task dates are local days (`@db.Date`); completion times are instants,
 * bucketed into local days. "Done" in the series is only drawn up to today.
 */
export function planPace(
    tasks: PaceTask[],
    {
        startDate,
        examDate,
        today,
        timeZone = APP_TIME_ZONE,
    }: { startDate: Date; examDate: Date; today: string; timeZone?: string },
): PlanPace {
    const start = keyOf(startDate);
    const exam = keyOf(examDate);
    const taskDays = tasks.map((t) => keyOf(t.date));
    const first = [start, ...taskDays].sort()[0];
    const last = [exam, ...taskDays].sort().at(-1)!;

    const days: string[] = [];
    for (let d = first; d <= last && days.length < 800; d = addDays(d, 1)) days.push(d);

    const scheduledOn = new Map<string, number>();
    // Skipped tasks drop out of the schedule: they were dealt with, they just won't be done.
    tasks.forEach((t, i) => {
        if (t.status !== "SKIPPED") scheduledOn.set(taskDays[i], (scheduledOn.get(taskDays[i]) ?? 0) + 1);
    });
    const doneOn = new Map<string, number>();
    for (const t of tasks) {
        if (t.status !== "DONE") continue;
        // Older rows may lack completedAt; count them on their scheduled day.
        const k = t.completedAt ? dayKey(t.completedAt, timeZone) : keyOf(t.date);
        doneOn.set(k, (doneOn.get(k) ?? 0) + 1);
    }

    let scheduled = 0;
    let done = 0;
    // Work finished before the plan's first day still counts from day one.
    for (const [k, n] of doneOn) if (k < first) done += n;
    const series = days.map((day) => {
        scheduled += scheduledOn.get(day) ?? 0;
        done += doneOn.get(day) ?? 0;
        return { day, scheduled, done: day <= today ? done : null };
    });

    return {
        total: tasks.length,
        done: tasks.filter((t) => t.status === "DONE").length,
        skipped: tasks.filter((t) => t.status === "SKIPPED").length,
        scheduledByToday: tasks.filter((t, i) => t.status !== "SKIPPED" && taskDays[i] <= today).length,
        doneByToday: tasks.filter((t, i) => t.status === "DONE" && taskDays[i] <= today).length,
        behind: tasks.filter((t, i) => t.status === "PENDING" && taskDays[i] < today).length,
        daysLeft: Math.round((Date.parse(`${exam}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000),
        series,
    };
}

/** The last `n` local day keys ending today. */
export function windowDays(today: string, n: number) {
    return lastNDays(today, n);
}
