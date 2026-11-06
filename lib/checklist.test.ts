import { describe, expect, it } from "vitest";
import {
    addSummaries,
    confidenceScore,
    currentRatings,
    findMismatch,
    summarize,
    type Confidence,
} from "./checklist";
import type { Mastery } from "./mastery";

const m = (score: number | null, level: Mastery["level"], attempts = 5): Mastery => ({
    score,
    level,
    attempts,
    lastPracticedAt: score === null ? null : new Date(),
});

describe("currentRatings", () => {
    const points = ["Define force", "Use F = ma", "Explain inertia"];
    it("keeps ratings whose text still matches", () => {
        const r = currentRatings(points, [
            { point: 0, text: "Define force", rating: "GREEN" },
            { point: 2, text: "Explain inertia", rating: "RED" },
        ]);
        expect([...r]).toEqual([
            [0, "GREEN"],
            [2, "RED"],
        ]);
    });
    it("drops ratings for points that moved or changed", () => {
        const r = currentRatings(points, [
            { point: 1, text: "Define force", rating: "GREEN" },
            { point: 5, text: "Gone", rating: "AMBER" },
        ]);
        expect(r.size).toBe(0);
    });
});

describe("summarize", () => {
    it("counts each rating and the unrated rest", () => {
        expect(summarize(5, ["GREEN", "GREEN", "RED"])).toEqual({ total: 5, green: 2, amber: 0, red: 1, unrated: 2 });
    });
    it("adds up across topics", () => {
        expect(addSummaries(summarize(2, ["AMBER"]), summarize(3, ["GREEN"]))).toEqual({
            total: 5,
            green: 1,
            amber: 1,
            red: 0,
            unrated: 3,
        });
    });
});

describe("confidenceScore", () => {
    it("averages rated points", () => {
        expect(confidenceScore(["GREEN", "AMBER", "RED"])).toBeCloseTo(0.5);
        expect(confidenceScore(["GREEN"])).toBe(1);
    });
    it("is null when nothing is rated", () => {
        expect(confidenceScore([])).toBeNull();
    });
});

describe("findMismatch", () => {
    const greens: Confidence[] = ["GREEN", "GREEN", "GREEN"];
    const reds: Confidence[] = ["RED", "RED", "AMBER"];

    it("flags confidence on a weak topic", () => {
        expect(findMismatch(greens, 4, m(0.3, "weak"))).toBe("overconfident");
    });
    it("flags doubt on a strong topic", () => {
        expect(findMismatch(reds, 3, m(0.9, "strong"))).toBe("underconfident");
    });
    it("says nothing when they agree", () => {
        expect(findMismatch(greens, 3, m(0.9, "strong"))).toBeNull();
        expect(findMismatch(reds, 3, m(0.3, "weak"))).toBeNull();
        expect(findMismatch(greens, 3, m(0.6, "developing"))).toBeNull();
    });
    it("needs enough attempts", () => {
        expect(findMismatch(greens, 3, m(0.3, "weak", 2))).toBeNull();
        expect(findMismatch(greens, 3, m(null, "new", 0))).toBeNull();
    });
    it("needs a third of the points rated", () => {
        expect(findMismatch(["GREEN"], 4, m(0.2, "weak"))).toBeNull();
        expect(findMismatch(["GREEN", "GREEN"], 6, m(0.2, "weak"))).toBe("overconfident");
    });
});
