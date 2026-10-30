import { describe, expect, it } from "vitest";
import { DEFAULT_COUNT, MAX_COUNT, parseCount, selectQuestions, shuffle } from "./select";

/** Deterministic PRNG (mulberry32) */
function seeded(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const qs = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `q${i}` }));

describe("parseCount", () => {
    it("defaults, clamps and handles arrays", () => {
        expect(parseCount(undefined)).toBe(DEFAULT_COUNT);
        expect(parseCount("abc")).toBe(DEFAULT_COUNT);
        expect(parseCount("5")).toBe(5);
        expect(parseCount("0")).toBe(1);
        expect(parseCount("999")).toBe(MAX_COUNT);
        expect(parseCount(["3", "8"])).toBe(3);
    });
});

describe("shuffle", () => {
    it("is a permutation and doesn't mutate", () => {
        const input = [1, 2, 3, 4, 5];
        const out = shuffle(input, seeded(1));
        expect(input).toEqual([1, 2, 3, 4, 5]);
        expect([...out].sort()).toEqual(input);
    });
});

describe("selectQuestions", () => {
    it("returns at most count questions, without duplicates", () => {
        const out = selectQuestions(qs(20), new Map(), 10, seeded(2));
        expect(out).toHaveLength(10);
        expect(new Set(out.map((q) => q.id)).size).toBe(10);
        expect(selectQuestions(qs(3), new Map(), 10)).toHaveLength(3);
    });

    it("prefers unattempted questions, then the worst-answered", () => {
        const history = new Map([
            ["q0", 1],
            ["q1", 0.2],
            ["q2", 0.9],
            ["q3", 0],
        ]);
        // 6 questions, 2 never attempted (q4, q5)
        const out = selectQuestions(qs(6), history, 4, seeded(3)).map((q) => q.id);
        expect(out.sort()).toEqual(["q1", "q3", "q4", "q5"]);
    });

    it("randomises which equally-ranked questions are picked", () => {
        const picks = new Set<string>();
        for (let s = 0; s < 20; s++) picks.add(selectQuestions(qs(10), new Map(), 1, seeded(s))[0].id);
        expect(picks.size).toBeGreaterThan(3);
    });
});
