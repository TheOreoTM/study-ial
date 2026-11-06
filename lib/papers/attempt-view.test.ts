import { describe, expect, it } from "vitest";
import { feedbackWithExplanation, restoreAttempt, savedExplanation } from "./attempt-view";

const point = { code: "M1", point: "Differentiates", awarded: true, comment: "Good" };
const attempt = { id: "a1", marksAwarded: 2, maxMarks: 3, method: "AI" as const };

describe("restoreAttempt", () => {
    it("rebuilds an AI-marked result from the saved feedback", () => {
        const restored = restoreAttempt({ ...attempt, feedback: { points: [point], justification: "Why", feedback: "Check signs" } });
        expect(restored?.result).toEqual({
            ok: true,
            attemptId: "a1",
            marksAwarded: 2,
            maxMarks: 3,
            method: "AI",
            points: [point],
            justification: "Why",
            feedback: "Check signs",
            remaining: null,
        });
        expect(restored?.explanation).toBeNull();
    });

    it("brings back a saved step-by-step", () => {
        const feedback = feedbackWithExplanation({ points: [point] }, { markdown: "Step 1", ai: true });
        expect(restoreAttempt({ ...attempt, feedback })?.explanation).toEqual({ markdown: "Step 1", ai: true });
    });

    it("treats an exam answer that hasn't been marked as no result", () => {
        expect(restoreAttempt({ ...attempt, marksAwarded: null, method: null, feedback: null })).toBeNull();
    });

    it("still shows the marks when the saved feedback is missing or malformed", () => {
        for (const feedback of [null, "nonsense", { points: "nope", justification: 3, explanation: { markdown: "" } }]) {
            const restored = restoreAttempt({ ...attempt, feedback });
            expect(restored?.result).toMatchObject({ marksAwarded: 2, points: [], justification: "", feedback: "" });
            expect(restored?.explanation).toBeNull();
        }
    });

    it("reads a self-marked attempt, which only saves its points", () => {
        const restored = restoreAttempt({ ...attempt, method: "SELF", feedback: { points: [{ ...point, comment: "" }] } });
        expect(restored?.result.method).toBe("SELF");
        expect(restored?.result.points).toHaveLength(1);
    });
});

describe("feedbackWithExplanation", () => {
    it("keeps the marks and comments already saved", () => {
        const saved = feedbackWithExplanation({ points: [point], feedback: "Check signs" }, { markdown: "Step 1", ai: false });
        expect(saved).toEqual({ points: [point], feedback: "Check signs", explanation: { markdown: "Step 1", ai: false } });
    });

    it("replaces an earlier explanation and copes with no feedback", () => {
        const first = feedbackWithExplanation(null, { markdown: "From the scheme", ai: false });
        expect(savedExplanation(feedbackWithExplanation(first, { markdown: "From AI", ai: true }))).toEqual({ markdown: "From AI", ai: true });
    });
});
