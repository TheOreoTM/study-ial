import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: {} }));
const { answerNumbers, answersAgree, buildGenerationPrompt, closestPastPaper, PARAPHRASE_THRESHOLD, textSimilarity } = await import("@/lib/generate");

describe("copyright guard", () => {
    const past = "A particle P of mass 2 kg is projected up a rough plane inclined at 30 degrees to the horizontal with speed 8 m/s";
    it("scores paraphrases high and different questions low", () => {
        expect(textSimilarity(past, past)).toBe(1);
        expect(textSimilarity(past, "A particle P of mass 3 kg is projected up a rough plane inclined at 20 degrees to the horizontal")).toBeGreaterThan(PARAPHRASE_THRESHOLD);
        expect(textSimilarity(past, "Find the sum of the first 20 terms of the arithmetic series 3 + 7 + 11 + ...")).toBeLessThan(0.05);
    });

    it("finds the closest past-paper part", () => {
        const best = closestPastPaper("A particle P of mass 2 kg is projected up a rough plane inclined at 30 degrees", [
            { id: "a", stem: "Find the area of the triangle", label: "WMA11 Jan 2025 Q8(b)" },
            { id: "b", stem: past, label: "WME01 Jun 2019 Q3" },
        ]);
        expect(best?.id).toBe("b");
    });
});

describe("self-check answer comparison", () => {
    it("reads numbers in answers", () => {
        expect(answerNumbers("1.2 × 10^{-3} m")[0]).toBeCloseTo(0.0012);
        expect(answerNumbers("12.4 m s^-1")).toEqual([12.4]);
        expect(answerNumbers("3.0 m s-2")).toEqual([3]);
        expect(answerNumbers("x = 4 or x = -2")).toEqual([4, -2]);
        expect(answerNumbers("1,250 J")).toEqual([1250]);
    });

    it("agrees within rounding, disagrees otherwise", () => {
        expect(answersAgree("12.4 m s^-1", "v = 12.38 m/s")).toBe(true);
        expect(answersAgree("12.4", "14.1")).toBe(false);
        expect(answersAgree("B", "(B)")).toBe(true);
        expect(answersAgree("B", "C")).toBe(false);
        expect(answersAgree("x = 4 or x = -2", "x = -2, x = 4")).toBe(true);
        expect(answersAgree("the reaction is exothermic", "Endothermic")).toBeNull();
    });
});

describe("generation prompt", () => {
    it("includes the spec points and asks for originals", () => {
        const p = buildGenerationPrompt(
            { subject: "Physics", unitCode: "WPH11", unitName: "Mechanics and Materials", topicCode: "1.1", topicName: "Motion", specPoints: ["use suvat equations"], styleExamples: [] },
            { count: 3, difficulty: "MIXED", types: ["CALCULATION"] },
        );
        expect(p).toContain("use suvat equations");
        expect(p).toContain("Write 3 new questions");
    });
});
