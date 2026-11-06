import { describe, expect, it } from "vitest";
import { mergeCandidates, sha256Hex } from "@/lib/papers/ingest";
import type { PaperCandidate } from "@/lib/papers/sources/types";

const c = (over: Partial<PaperCandidate>): PaperCandidate => ({
    source: "PEARSON",
    sourceUrl: "https://qualifications.pearson.com/a.pdf",
    title: "",
    subject: "mathematics",
    spec: "2018",
    unitCode: "WMA11",
    paperCode: "01",
    type: "QP",
    year: 2024,
    series: "jan",
    publishedAt: null,
    ...over,
});

describe("mergeCandidates", () => {
    it("keeps Pearson's file and drops PMT's copy of the same slot", () => {
        const pearson = [c({})];
        const pmt = [c({ source: "PMT", sourceUrl: "https://pmt.physicsandmathstutor.com/a.pdf" })];
        expect(mergeCandidates(pearson, pmt).map((x) => x.source)).toEqual(["PEARSON"]);
    });

    it("uses PMT for slots Pearson doesn't have", () => {
        const pmt = [c({ source: "PMT", sourceUrl: "https://pmt.physicsandmathstutor.com/b.pdf", year: 2016 })];
        expect(mergeCandidates([c({})], pmt)).toHaveLength(2);
    });

    it("prefers an updated re-issue over the original", () => {
        const merged = mergeCandidates(
            [c({ sourceUrl: "https://x/orig.pdf" }), c({ sourceUrl: "https://x/updated.pdf", preferred: true })],
            [],
        );
        expect(merged.map((x) => x.sourceUrl)).toEqual(["https://x/updated.pdf"]);
    });

    it("passes through candidates without a known sitting", () => {
        expect(mergeCandidates([c({ year: null, series: null }), c({ year: null, series: null, sourceUrl: "https://x/2.pdf" })], [])).toHaveLength(2);
    });
});

describe("sha256Hex", () => {
    it("hashes content", () => {
        expect(sha256Hex(new TextEncoder().encode("abc"))).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    });
});
