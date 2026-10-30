import { describe, expect, it } from "vitest";
import { computeMastery, levelFor, MASTERY_WINDOW, masteryLabel, masteryTone, revisionPriority } from "@/lib/mastery";

const day = 86_400_000;
const now = new Date("2026-06-01T12:00:00Z");
const at = (daysAgo: number) => new Date(now.getTime() - daysAgo * day);
const attempt = (marksAwarded: number, maxMarks: number, daysAgo: number) => ({
    marksAwarded,
    maxMarks,
    createdAt: at(daysAgo),
});

describe("computeMastery", () => {
    it("is 'new' with no attempts", () => {
        expect(computeMastery([])).toEqual({ score: null, level: "new", attempts: 0, lastPracticedAt: null });
    });

    it("scores a single attempt as its share of marks", () => {
        const m = computeMastery([attempt(3, 4, 1)]);
        expect(m.score).toBeCloseTo(0.75);
        expect(m.attempts).toBe(1);
        expect(m.lastPracticedAt).toEqual(at(1));
        // Strong needs at least 3 attempts
        expect(m.level).toBe("developing");
    });

    it("weights recent attempts more heavily, regardless of input order", () => {
        const improving = computeMastery([attempt(0, 1, 3), attempt(0, 1, 2), attempt(1, 1, 0)]);
        const declining = computeMastery([attempt(1, 1, 3), attempt(1, 1, 2), attempt(0, 1, 0)].reverse());
        expect(improving.score!).toBeGreaterThan(1 / 3);
        expect(declining.score!).toBeLessThan(2 / 3);
        expect(improving.lastPracticedAt).toEqual(at(0));
        expect(declining.lastPracticedAt).toEqual(at(0));
    });

    it("uses exact 0.85^age weights", () => {
        const m = computeMastery([attempt(1, 1, 0), attempt(0, 1, 1)]);
        expect(m.score).toBeCloseTo(1 / 1.85);
    });

    it("weights by marks available, not per question", () => {
        // Same age: a 6-mark question counts more than a 1-mark one
        const m = computeMastery([attempt(6, 6, 0), attempt(0, 1, 0)]);
        expect(m.score!).toBeGreaterThan(0.8);
    });

    it("only looks at the most recent MASTERY_WINDOW attempts but counts all", () => {
        const old = Array.from({ length: 20 }, (_, i) => attempt(0, 1, 100 + i));
        const recent = Array.from({ length: MASTERY_WINDOW }, (_, i) => attempt(1, 1, i));
        const m = computeMastery([...old, ...recent]);
        expect(m.score).toBe(1);
        expect(m.attempts).toBe(30);
        expect(m.level).toBe("strong");
    });

    it("treats zero-mark questions as a score of 0 rather than NaN", () => {
        expect(computeMastery([attempt(0, 0, 0)]).score).toBe(0);
    });
});

describe("levelFor", () => {
    it.each([
        [null, 0, "new"],
        [0.9, 0, "new"],
        [0.9, 2, "developing"],
        [0.75, 3, "strong"],
        [0.74, 10, "developing"],
        [0.5, 1, "developing"],
        [0.49, 5, "weak"],
        [0, 1, "weak"],
    ] as const)("score %s with %s attempts → %s", (score, attempts, level) => {
        expect(levelFor(score, attempts)).toBe(level);
    });
});

describe("labels and tones", () => {
    it("covers every level", () => {
        for (const level of ["new", "weak", "developing", "strong"] as const) {
            expect(masteryLabel[level]).toBeTruthy();
            expect(masteryTone[level].badge).toBeTruthy();
            expect(masteryTone[level].bar).toBeTruthy();
        }
    });
});

describe("revisionPriority", () => {
    const m = (score: number | null, daysAgo: number | null) => ({
        score,
        level: levelFor(score, score === null ? 0 : 3),
        attempts: score === null ? 0 : 3,
        lastPracticedAt: daysAgo === null ? null : at(daysAgo),
    });

    it("ranks weak and unseen topics above developing, and developing above strong", () => {
        const weak = revisionPriority(m(0.2, 0), now);
        const unseen = revisionPriority(m(null, null), now);
        const developing = revisionPriority(m(0.6, 0), now);
        const strong = revisionPriority(m(0.95, 0), now);
        expect(weak).toBeGreaterThan(developing);
        expect(unseen).toBeGreaterThan(developing);
        expect(developing).toBeGreaterThan(strong);
    });

    it("adds a staleness nudge capped at 30 days", () => {
        expect(revisionPriority(m(0.8, 15), now) - revisionPriority(m(0.8, 0), now)).toBeCloseTo(0.125);
        expect(revisionPriority(m(0.8, 60), now)).toBeCloseTo(revisionPriority(m(0.8, 30), now));
        expect(revisionPriority(m(null, null), now)).toBeCloseTo(0.85);
    });
});
