import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
const { estimateCostMicros, priceFor } = await import("@/lib/ai-log");

describe("AI cost estimates", () => {
    it("prices known models per million tokens", () => {
        // 1M input + 1M output on Gemini 2.5 Flash = $0.30 + $2.50
        expect(estimateCostMicros("google/gemini-2.5-flash", 1_000_000, 1_000_000)).toBe(2_800_000);
        expect(estimateCostMicros("google/gemini-2.5-flash", 1000, 500)).toBe(1550);
    });

    it("falls back for unknown models", () => {
        expect(priceFor("someone/new-model")).toEqual([1, 4]);
    });
});
