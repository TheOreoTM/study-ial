// Spec checklist: students rate their confidence on each specification point. Pure functions (unit-tested).
//
// Ratings never change mastery (that only comes from marks). They're compared with mastery to point out where a
// student's feeling and their results disagree, which is exactly where revision is most useful.

import type { Mastery } from "@/lib/mastery";

export type Confidence = "RED" | "AMBER" | "GREEN";

export const CONFIDENCE_ORDER: Confidence[] = ["RED", "AMBER", "GREEN"];

/** Words, not colours: teal, sun and bubblegum are reserved for mastery. */
export const confidenceLabel: Record<Confidence, string> = { RED: "Not yet", AMBER: "Shaky", GREEN: "Got it" };

const VALUE: Record<Confidence, number> = { RED: 0, AMBER: 0.5, GREEN: 1 };

export type StoredRating = { point: number; text: string; rating: Confidence };

/**
 * Ratings that still match the topic's current spec points. A rating is keyed by position but remembers the
 * point's text, so if the specification is edited and points move, old ratings drop out instead of landing on
 * the wrong point.
 */
export function currentRatings(specPoints: string[], stored: StoredRating[]): Map<number, Confidence> {
    const out = new Map<number, Confidence>();
    for (const r of stored) if (specPoints[r.point] === r.text) out.set(r.point, r.rating);
    return out;
}

export type ConfidenceSummary = { total: number; green: number; amber: number; red: number; unrated: number };

export function summarize(total: number, ratings: Iterable<Confidence>): ConfidenceSummary {
    const s = { total, green: 0, amber: 0, red: 0, unrated: 0 };
    for (const r of ratings) {
        if (r === "GREEN") s.green++;
        else if (r === "AMBER") s.amber++;
        else s.red++;
    }
    s.unrated = Math.max(0, total - s.green - s.amber - s.red);
    return s;
}

export function addSummaries(a: ConfidenceSummary, b: ConfidenceSummary): ConfidenceSummary {
    return {
        total: a.total + b.total,
        green: a.green + b.green,
        amber: a.amber + b.amber,
        red: a.red + b.red,
        unrated: a.unrated + b.unrated,
    };
}

/** 0–1 average confidence over the rated points, or null when nothing is rated. */
export function confidenceScore(ratings: Iterable<Confidence>): number | null {
    let n = 0;
    let sum = 0;
    for (const r of ratings) {
        n++;
        sum += VALUE[r];
    }
    return n === 0 ? null : sum / n;
}

export type Mismatch = "overconfident" | "underconfident";

/** Marks need this many attempts before we'd contradict how a student feels. */
const MIN_ATTEMPTS = 3;

/**
 * Where confidence and marks disagree: feeling confident (≥ 75%) on a topic whose marks say it needs work, or
 * feeling unsure (≤ 35%) on a topic that's Strong. Needs at least a third of the points rated and a few attempts.
 */
export function findMismatch(ratings: Confidence[], pointCount: number, mastery: Mastery): Mismatch | null {
    if (ratings.length === 0 || ratings.length * 3 < pointCount) return null;
    if (mastery.attempts < MIN_ATTEMPTS || mastery.score === null) return null;
    const c = confidenceScore(ratings)!;
    if (c >= 0.75 && mastery.level === "weak") return "overconfident";
    if (c <= 0.35 && mastery.level === "strong") return "underconfident";
    return null;
}

export const mismatchMessage: Record<Mismatch, string> = {
    overconfident: "You feel confident, but your recent marks here are low. Worth practising before you tick it off.",
    underconfident: "You feel unsure, but your recent marks here are strong. You may know this better than you think.",
};
