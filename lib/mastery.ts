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

/**
 * Tailwind classes by level. `fill` paints code tiles and bars, `text` is the score/level word on light or dark
 * grounds, `pale` tints marked answers, `badge` is the level pill. Teal, sun and bubblegum mean mastery only.
 */
export const masteryTone: Record<MasteryLevel, { badge: string; bar: string; fill: string; text: string; pale: string }> = {
    new: {
        badge: "bg-muted text-muted-foreground",
        bar: "bg-border-strong/55",
        fill: "bg-muted text-muted-foreground",
        text: "text-muted-foreground",
        pale: "bg-muted",
    },
    weak: {
        badge: "bg-mastery-weak-pale text-mastery-weak-text",
        bar: "bg-mastery-weak",
        fill: "bg-mastery-weak text-on-mastery",
        text: "text-mastery-weak-text",
        pale: "bg-mastery-weak-pale",
    },
    developing: {
        badge: "bg-mastery-developing-pale text-mastery-developing-text",
        bar: "bg-mastery-developing",
        fill: "bg-mastery-developing text-on-mastery",
        text: "text-mastery-developing-text",
        pale: "bg-mastery-developing-pale",
    },
    strong: {
        badge: "bg-mastery-strong-pale text-mastery-strong-text",
        bar: "bg-mastery-strong",
        fill: "bg-mastery-strong text-on-mastery",
        text: "text-mastery-strong-text",
        pale: "bg-mastery-strong-pale",
    },
};

/** Priority for revision: higher = study sooner. Unseen topics rank between weak and developing. */
export function revisionPriority(m: Mastery, now = new Date()): number {
    const base = m.score === null ? 0.6 : 1 - m.score;
    const daysSince = m.lastPracticedAt ? (now.getTime() - m.lastPracticedAt.getTime()) / 86_400_000 : 30;
    const staleness = Math.min(daysSince / 30, 1) * 0.25; // forgetting nudge, max +0.25
    return base + staleness;
}
