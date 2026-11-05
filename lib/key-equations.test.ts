import katex from "katex";
import { describe, expect, it } from "vitest";
import { subjects } from "@/prisma/seed-data";
import { keyEquations } from "./key-equations";

const units = new Map(subjects.flatMap((s) => s.units.map((u) => [u.code, new Set(u.topics.map((t) => t.code))])));

describe("key equations", () => {
    it("belong to real units and topics, in topic order", () => {
        for (const [code, groups] of Object.entries(keyEquations)) {
            const topics = units.get(code);
            expect(topics, code).toBeDefined();
            for (const g of groups) expect(topics!.has(g.topic), `${code} ${g.topic}`).toBe(true);
            const order = groups.map((g) => Number(g.topic.split(".")[1]));
            expect(order).toEqual([...order].sort((a, b) => a - b));
        }
    });

    it("all render in KaTeX", () => {
        for (const groups of Object.values(keyEquations)) {
            for (const g of groups) {
                for (const e of g.equations) {
                    expect(() => katex.renderToString(e.tex, { throwOnError: true }), e.tex).not.toThrow();
                    for (const m of e.meaning.matchAll(/\$([^$]+)\$/g)) {
                        expect(() => katex.renderToString(m[1], { throwOnError: true }), m[1]).not.toThrow();
                    }
                }
            }
        }
    });

    it("have something to say for each formula", () => {
        for (const groups of Object.values(keyEquations))
            for (const g of groups) for (const e of g.equations) expect(e.meaning.length).toBeGreaterThan(8);
    });
});
