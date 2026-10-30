import { levelFor, type Mastery, type MasteryLevel } from "@/lib/mastery";

export type MasterySummary = {
    /** Mean score across all topics, counting unstarted topics as 0 (so coverage matters) */
    score: number | null;
    level: MasteryLevel;
    topics: number;
    started: number;
    counts: Record<MasteryLevel, number>;
};

/** Roll up topic masteries (e.g. for a unit or subject). */
export function summarizeMastery(masteries: Mastery[]): MasterySummary {
    const counts: Record<MasteryLevel, number> = { new: 0, weak: 0, developing: 0, strong: 0 };
    let total = 0;
    let started = 0;
    for (const m of masteries) {
        counts[m.level]++;
        if (m.score !== null) {
            total += m.score;
            started++;
        }
    }
    const score = started === 0 ? null : total / masteries.length;
    // A unit is only "strong" when most of it is strong — reuse the topic thresholds on the coverage-weighted mean.
    const level = score === null ? "new" : levelFor(score, started >= 3 ? 3 : started);
    return { score, level, topics: masteries.length, started, counts };
}
