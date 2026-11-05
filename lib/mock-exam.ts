// Timed mock papers: assembly, timing and indicative grades. Pure functions (unit-tested); DB access lives in
// app/(app)/mock/actions.ts and lib/queries/mock-exams.ts.

export type MockLength = "short" | "half" | "full";

/** Target marks per length. A full IAL unit paper is 75–80 marks; the bank may hold fewer. */
export const MOCK_TARGET: Record<MockLength, number> = { short: 20, half: 40, full: 80 };

export const MOCK_LENGTH_LABEL: Record<MockLength, string> = {
    short: "Quick paper",
    half: "Half paper",
    full: "Full paper",
};

/**
 * Minutes per mark, from the real papers (e.g. WPH11: 80 marks in 1 h 45 min; WCH11 and WBI11: 80 in 1 h 30;
 * WMA11: 75 in 1 h 30). Local subjects use the default.
 */
const MINUTES_PER_MARK: Record<string, number> = {
    physics: 105 / 80,
    chemistry: 90 / 80,
    biology: 90 / 80,
    mathematics: 90 / 75,
    "further-mathematics": 90 / 75,
};
const DEFAULT_MINUTES_PER_MARK = 1.25;

export function minutesPerMark(subjectSlug: string) {
    return MINUTES_PER_MARK[subjectSlug] ?? DEFAULT_MINUTES_PER_MARK;
}

/** Time allowed for a paper: marks × the subject's rate, rounded to the nearest 5 minutes, at least 10. */
export function durationFor(marks: number, subjectSlug: string) {
    return Math.max(10, Math.round((marks * minutesPerMark(subjectSlug)) / 5) * 5);
}

/** A length is offered when the bank can fill most of it (a "full" paper takes whatever is there, from 50 marks). */
export function lengthAvailable(length: MockLength, availableMarks: number) {
    if (length === "full") return availableMarks >= 50;
    return availableMarks >= MOCK_TARGET[length] * 0.8;
}

export type PaperCandidate = {
    id: string;
    topicId: string;
    /** Topic order within the unit, so written questions follow the spec */
    topicOrder: number;
    marks: number;
    isMcq: boolean;
};

/**
 * Builds a paper of at most `target` marks that spreads across as many topics as possible: topics take turns
 * (in random order) to contribute one question each, sized to their share of the marks left where possible, preferring questions the student hasn't answered recently
 * (`seen` = latest share of marks, lower first; unseen first of all). Like an IAL paper, the multiple-choice
 * questions come first, then the written ones in specification order.
 */
export function assemblePaper(
    candidates: PaperCandidate[],
    target: number,
    { seen = new Map<string, number>(), rng = Math.random }: { seen?: Map<string, number>; rng?: () => number } = {},
): PaperCandidate[] {
    const shuffled = shuffle(candidates, rng);
    const byTopic = new Map<string, PaperCandidate[]>();
    for (const q of shuffled) {
        const list = byTopic.get(q.topicId) ?? [];
        list.push(q);
        byTopic.set(q.topicId, list);
    }
    // Unseen first, then the worst-answered; the shuffle keeps ties random (sort is stable).
    for (const list of byTopic.values()) list.sort((a, b) => (seen.get(a.id) ?? -1) - (seen.get(b.id) ?? -1));

    const order = shuffle([...byTopic.keys()], rng);
    const picked: PaperCandidate[] = [];
    let total = 0;
    let progress = true;
    while (progress && total < target) {
        progress = false;
        // Each round shares what's left between the topics, so one long question can't crowd the others out.
        const share = Math.max(1, Math.ceil((target - total) / order.length));
        for (const topicId of order) {
            const list = byTopic.get(topicId)!;
            const fits = (q: PaperCandidate) => total + q.marks <= target;
            let i = list.findIndex((q) => fits(q) && q.marks <= share);
            if (i === -1) i = list.findIndex(fits);
            if (i === -1) continue;
            const [q] = list.splice(i, 1);
            picked.push(q);
            total += q.marks;
            progress = true;
            if (total >= target) break;
        }
    }
    return picked.sort((a, b) => Number(b.isMcq) - Number(a.isMcq) || a.topicOrder - b.topicOrder);
}

function shuffle<T>(items: T[], rng: () => number): T[] {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export type Grade = "A" | "B" | "C" | "D" | "E" | "U";

/**
 * An indicative grade from the share of marks, using the IAL's UMS grade thresholds (80/70/60/50/40%). Real raw
 * boundaries move from paper to paper, so this is only ever shown as an estimate.
 */
export function indicativeGrade(earned: number, possible: number): Grade {
    if (possible <= 0) return "U";
    const share = earned / possible;
    if (share >= 0.8) return "A";
    if (share >= 0.7) return "B";
    if (share >= 0.6) return "C";
    if (share >= 0.5) return "D";
    if (share >= 0.4) return "E";
    return "U";
}

/** Marks needed for the next grade up, or null at A. */
export function marksToNextGrade(earned: number, possible: number): { grade: Grade; marks: number } | null {
    const steps: [Grade, number][] = [
        ["E", 0.4],
        ["D", 0.5],
        ["C", 0.6],
        ["B", 0.7],
        ["A", 0.8],
    ];
    for (const [grade, share] of steps) {
        const need = Math.ceil(share * possible - 1e-9);
        if (earned < need) return { grade, marks: need - earned };
    }
    return null;
}

/** Seconds left on the clock (never negative). */
export function secondsLeft(startedAt: Date, durationMinutes: number, now: Date) {
    const end = startedAt.getTime() + durationMinutes * 60_000;
    return Math.max(0, Math.floor((end - now.getTime()) / 1000));
}

/**
 * The server accepts a submission up to this long after time is up, so a paper submitted by the client the moment
 * the clock hits zero (or over a slow connection) still counts.
 */
export const SUBMIT_GRACE_SECONDS = 120;

export function isPastDeadline(startedAt: Date, durationMinutes: number, now: Date) {
    return now.getTime() > startedAt.getTime() + (durationMinutes * 60 + SUBMIT_GRACE_SECONDS) * 1000;
}

/** "1:05:09" / "42:07" for the countdown. */
export function formatClock(totalSeconds: number) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
    return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

/** "1 h 45 min" / "50 min". */
export function formatDuration(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/**
 * Turns an AI marker's per-point verdicts (in mark-scheme order) into suggested ticks for self-marking. Verdicts are
 * matched by position, so if the reply has a different number of points than the mark scheme (merged, skipped or
 * extra points) nothing is ticked: a shifted tick on the wrong point is worse than none. Returns null then.
 */
export function ticksFromAi(points: { awarded: boolean }[], pointCount: number): number[] | null {
    if (points.length !== pointCount) return null;
    return points.flatMap((p, i) => (p.awarded ? [i] : []));
}
