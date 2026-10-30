// Topic mastery: a recency-weighted score over a student's most recent attempts in a topic.
// Pure functions live here (unit-tested); DB access lives in lib/queries/mastery.ts.

export const MASTERY_WINDOW = 10;

export type MasteryLevel = "new" | "weak" | "developing" | "strong";

export type AttemptLike = { marksAwarded: number; maxMarks: number; createdAt: Date };

export type Mastery = {
    /** 0–1, recency-weighted share of marks earned; null when there are no attempts */
    score: number | null;
    level: MasteryLevel;
    attempts: number;
    lastPracticedAt: Date | null;
};

/** Newest attempts weigh most: weight = 0.85^age, over the last MASTERY_WINDOW attempts. */
export function computeMastery(attempts: AttemptLike[]): Mastery {
    if (attempts.length === 0) return { score: null, level: "new", attempts: 0, lastPracticedAt: null };

    const recent = [...attempts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, MASTERY_WINDOW);

    let earned = 0;
    let possible = 0;
    recent.forEach((a, age) => {
        const w = 0.85 ** age;
        earned += w * a.marksAwarded;
        possible += w * a.maxMarks;
    });
    const score = possible > 0 ? earned / possible : 0;

    return { score, level: levelFor(score, attempts.length), attempts: attempts.length, lastPracticedAt: recent[0].createdAt };
}

export function levelFor(score: number | null, attempts: number): MasteryLevel {
    if (score === null || attempts === 0) return "new";
    if (score >= 0.75 && attempts >= 3) return "strong";
    if (score >= 0.5) return "developing";
    return "weak";
}

export const masteryLabel: Record<MasteryLevel, string> = {
    new: "Not started",
    weak: "Needs work",
    developing: "Getting there",
    strong: "Strong",
};

/** Tailwind classes for badges / bars by level. */
export const masteryTone: Record<MasteryLevel, { badge: string; bar: string }> = {
    new: { badge: "bg-muted text-muted-foreground", bar: "bg-muted-foreground/30" },
    weak: { badge: "bg-destructive/10 text-destructive", bar: "bg-destructive" },
    developing: { badge: "bg-warning/15 text-amber-700 dark:text-warning", bar: "bg-warning" },
    strong: { badge: "bg-success/15 text-success", bar: "bg-success" },
};

/** Priority for revision: higher = study sooner. Unseen topics rank between weak and developing. */
export function revisionPriority(m: Mastery, now = new Date()): number {
    const base = m.score === null ? 0.6 : 1 - m.score;
    const daysSince = m.lastPracticedAt ? (now.getTime() - m.lastPracticedAt.getTime()) / 86_400_000 : 30;
    const staleness = Math.min(daysSince / 30, 1) * 0.25; // forgetting nudge, max +0.25
    return base + staleness;
}
