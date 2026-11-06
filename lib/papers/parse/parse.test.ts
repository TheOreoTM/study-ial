import { describe, expect, it } from "vitest";
import type { PageText, TextItem } from "@/lib/papers/pdf";
import { inferDependsOn, looksGarbled, parseQuestionPaperLayout } from "@/lib/papers/parse/layout";
import { parseMarkCodes, parseMarkSchemeLayout, resolveLabel } from "@/lib/papers/parse/layout-ms";
import { matchMarkScheme } from "@/lib/papers/parse/match";
import { compareNumbers, nextLabel, normaliseNumber, parentNumber } from "@/lib/papers/parse/numbering";
import type { MarkSchemeEntry, ParsedPaper } from "@/lib/papers/parse/schema";
import { validateParsedPaper, validateStructure } from "@/lib/papers/parse/validate";

/** Builds a page from "x,y text" rows (one text run each), A4 points. */
function page(n: number, rows: [number, number, string][]): PageText {
    const items: TextItem[] = rows.map(([x, y, str]) => ({ str, x, y, width: str.length * 5, height: 10 }));
    return { page: n, width: 595, height: 842, items };
}

describe("numbering", () => {
    it("normalises question numbers", () => {
        expect(normaliseNumber("3 (b) (ii)")).toBe("3(b)(ii)");
        expect(normaliseNumber("Q3b(ii)")).toBe("3(b)(ii)");
        expect(normaliseNumber("12.")).toBe("12");
        expect(normaliseNumber("4(i)(a)")).toBe("4(i)(a)");
        expect(normaliseNumber("hello")).toBeNull();
    });

    it("finds parents and orders numbers", () => {
        expect(parentNumber("3(b)(ii)")).toBe("3(b)");
        expect(parentNumber("3(b)")).toBe("3");
        expect(parentNumber("3")).toBeNull();
        const sorted = ["10", "2(b)", "2", "2(a)(ii)", "2(a)", "2(a)(ix)", "2(a)(iv)", "1"].sort(compareNumbers);
        expect(sorted).toEqual(["1", "2", "2(a)", "2(a)(ii)", "2(a)(iv)", "2(a)(ix)", "2(b)", "10"]);
    });

    it("knows the next label", () => {
        expect(nextLabel("a", false)).toBe("b");
        expect(nextLabel("iii", true)).toBe("iv");
        expect(nextLabel("h", false)).toBe("i");
    });
});

describe("question paper layout engine", () => {
    const pages = [
        page(1, [[200, 100, "Mathematics"], [200, 120, "TOTAL FOR PAPER IS 12 MARKS"]]),
        page(2, [
            [71, 30, "1."],
            [89, 30, "Find the value of x when 2x + 3 = 11"],
            [524, 60, "(2)"],
            [71, 100, "_______________________________"],
            [371, 733, "(Total for Question 1 is 2 marks)"],
        ]),
        page(3, [
            [71, 30, "2."],
            [89, 30, "A particle moves along a straight line from rest."],
            [89, 60, "(a)"],
            [108, 60, "Find its speed after 3 seconds."],
            [524, 75, "(3)"],
            [89, 120, "The particle then decelerates uniformly to rest."],
            [88, 140, "(b)"],
            [108, 140, "Hence find the total distance travelled."],
            [524, 155, "(4)"],
            [305, 200, "Figure 1"],
            [89, 260, "(c)"],
            [108, 260, "(i) state one assumption you have made,"],
            [108, 290, "(ii)"],
            [126, 290, "explain how it affects your answer to part (a)."],
            [524, 305, "(3)"],
            [371, 733, "(Total for Question 2 is 10 marks)"],
        ]),
    ];
    const r = parseQuestionPaperLayout(pages, { unit: "WMA11" });

    it("recovers the question tree", () => {
        expect(r.questions.map((q) => q.number)).toEqual(["1", "2", "2(a)", "2(b)", "2(c)", "2(c)(i)", "2(c)(ii)"]);
        expect(r.questions.find((q) => q.number === "2(c)(ii)")?.parent).toBe("2(c)");
    });

    it("assigns marks, including one total printed after the last sub-part", () => {
        const marks = Object.fromEntries(r.questions.map((q) => [q.number, q.marks]));
        expect(marks).toMatchObject({ "1": 2, "2(a)": 3, "2(b)": 4, "2(c)": 3, "2(c)(i)": 0, "2(c)(ii)": 0 });
        expect(r.totals).toEqual({ paper: 12, questions: { "1": 2, "2": 10 } });
        expect(validateStructure(r).ok).toBe(true);
    });

    it("keeps intro text for the next part, figures and page regions", () => {
        const b = r.questions.find((q) => q.number === "2(b)")!;
        expect(b.stem).toContain("decelerates uniformly");
        expect(b.stem).toContain("Hence find");
        expect(b.dependsOn).toEqual(["2(a)"]);
        expect(r.questions.find((q) => q.number === "2(b)")!.figures).toHaveLength(1);
        expect(b.regions[0].page).toBe(3);
        expect(b.regions[0].bbox[1]).toBeLessThan(140 / 842);
    });

    it("drops answer lines and margin text", () => {
        expect(r.questions[0].stem).toBe("Find the value of x when 2x + 3 = 11");
    });
});

describe("layout helpers", () => {
    it("infers dependencies", () => {
        expect(inferDependsOn("5(c)", "Hence find k")).toEqual(["5(b)"]);
        expect(inferDependsOn("5(c)", "Using your answer to part (a), find k")).toEqual(["5(a)"]);
        expect(inferDependsOn("5(a)", "Find k")).toEqual([]);
    });

    it("flags garbled maths", () => {
        expect(looksGarbled("Find  8x3  6 x  52x3  dx")).toBe(true);
        expect(looksGarbled("Find the size of angle OAB, giving your answer in radians")).toBe(false);
    });
});

describe("mark scheme layout engine", () => {
    it("parses mark codes", () => {
        expect(parseMarkCodes("A1A1A1").map((p) => p.code)).toEqual(["A1", "A1", "A1"]);
        expect(parseMarkCodes("M1 dM1 A1ft B1 A1*").map((p) => p.code)).toEqual(["M1", "dM1", "A1ft", "B1", "A1*"]);
        expect(parseMarkCodes("B2").map((p) => p.marks)).toEqual([2]);
    });

    it("resolves relative labels", () => {
        expect(resolveLabel("2(a)", null)).toBe("2(a)");
        expect(resolveLabel("(b)", "2(a)")).toBe("2(b)");
        expect(resolveLabel("(ii)", "5(a)(i)")).toBe("5(a)(ii)");
        expect(resolveLabel("(i)", "5(a)")).toBe("5(a)(i)");
        expect(resolveLabel("1.", null)).toBe("1");
        expect(resolveLabel("M1", "2(a)")).toBeNull();
    });

    it("reads a scheme table and its notes", () => {
        const ms = parseMarkSchemeLayout([
            page(1, [[28, 50, "The total number of marks for the paper is 75."]]),
            page(2, [
                [36, 74, "Question Number"],
                [262, 81, "Scheme Marks"],
                [53, 100, "2(a)"],
                [250, 100, "Gradient = 3/9"],
                [500, 100, "M1"],
                [506, 120, "A1"],
                [507, 140, "(2)"],
                [56, 180, "(b)"],
                [250, 180, "y - 5 = -3(x - 2)"],
                [500, 180, "B1ft M1A1"],
                [507, 200, "(3)"],
                [489, 220, "(5 marks)"],
                [28, 260, "(a)"],
                [64, 260, "M1 Finds a correct expression for the gradient"],
            ]),
        ]);
        expect(ms.entries.map((e) => [e.number, e.marks, e.points.map((p) => p.code).join(" ")])).toEqual([
            ["2(a)", 2, "M1 A1"],
            ["2(b)", 3, "B1ft M1 A1"],
        ]);
        expect(ms.totals).toEqual({ paper: 75, questions: { "2": 5 } });
        expect(ms.notes["2"].text).toContain("Finds a correct expression");
    });
});

describe("mark scheme matching", () => {
    const entry = (number: string): MarkSchemeEntry => ({ number, points: [], marks: null, text: "", regions: [] });
    const qs = ["1", "2", "2(a)", "2(b)", "3", "3(a)", "3(b)", "4", "4(a)"].map((number) => ({ number, marks: 1 }));

    it("matches exactly, through ancestors and by folding deeper entries", () => {
        const r = matchMarkScheme(qs, [entry("1"), entry("2(a)"), entry("2(b)"), entry("3"), entry("4(a)(i)"), entry("4(a)(ii)"), entry("9")]);
        expect(r.how.get("2(a)")).toBe("exact");
        expect(r.how.get("3(a)")).toBe("ancestor");
        expect(r.matched.get("3(b)")?.[0].number).toBe("3");
        expect(r.how.get("4(a)")).toBe("descendants");
        expect(r.matched.get("4(a)")?.map((e) => e.number)).toEqual(["4(a)(i)", "4(a)(ii)"]);
        expect(r.missing).toEqual([]);
        // "9" isn't on the paper: guidance-page noise, not reported
        expect(r.unmatched).toEqual([]);
    });

    it("reports parts with no scheme", () => {
        const r = matchMarkScheme(qs, [entry("1"), entry("2(a)")]);
        expect(r.missing).toEqual(["2(b)", "3(a)", "3(b)", "4(a)"]);
    });
});

describe("validation", () => {
    const base: ParsedPaper = {
        paper: { board: "Pearson Edexcel", unit: "WMA11", series: "jan 2025", paperType: "QP" },
        questions: [
            { number: "1", parent: null, stem: "Find x", marks: 4, latex: false, figures: [], dependsOn: [], regions: [] },
            { number: "2", parent: null, stem: "A curve", marks: 0, latex: false, figures: [], dependsOn: [], regions: [] },
            { number: "2(a)", parent: "2", stem: "Show that", marks: 2, latex: false, figures: [], dependsOn: [], regions: [] },
            { number: "2(b)", parent: "2", stem: "Hence", marks: 3, latex: false, figures: [], dependsOn: ["2(a)"], regions: [] },
        ],
        totals: { paper: 9, questions: { "1": 4, "2": 5 } },
    };

    it("accepts a consistent paper", () => {
        const r = validateParsedPaper(base);
        expect(r.ok).toBe(true);
        expect(r.totalMarks).toBe(9);
        expect(r.issues).toEqual([]);
    });

    it("rejects malformed JSON shapes", () => {
        const r = validateParsedPaper({ paper: { board: "x" }, questions: [{ number: "3b" }] });
        expect(r.ok).toBe(false);
        expect(r.issues[0].code).toBe("schema");
    });

    it("catches mark totals that don't add up", () => {
        const r = validateStructure({ ...base, questions: base.questions.map((q) => (q.number === "2(b)" ? { ...q, marks: 2 } : q)) });
        expect(r.ok).toBe(false);
        expect(r.issues.map((i) => i.code)).toEqual(expect.arrayContaining(["question-total", "paper-total"]));
    });

    it("catches numbering gaps, duplicates, bad parents and sequence breaks", () => {
        const q = (number: string, parent: string | null) => ({ number, parent, stem: "x", marks: 1, latex: false, figures: [], dependsOn: [], regions: [] });
        const r = validateStructure({
            ...base,
            totals: { paper: null, questions: {} },
            questions: [q("1", null), q("1", null), q("3", null), q("3(a)", null), q("3(c)", "3")],
        });
        const codes = r.issues.map((i) => i.code);
        expect(codes).toEqual(expect.arrayContaining(["duplicate", "gap", "parent", "sequence"]));
        expect(r.ok).toBe(false);
    });
});

describe("science papers", () => {
    it("reads bare question numbers, multiple choice and \"=\" totals", () => {
        const r = parseQuestionPaperLayout([
            page(1, [[200, 100, "TOTAL FOR PAPER = 4 MARKS"]]),
            page(2, [
                [43, 149, "1"],
                [61, 149, "Which of the following is a vector quantity?"],
                [87, 180, "A"],
                [105, 180, "efficiency"],
                [87, 204, "B"],
                [105, 204, "weight"],
                [348, 276, "(Total for Question 1 = 1 mark)"],
                [36, 310, "*2"],
                [61, 310, "A student inflates a balloon and releases it."],
                [61, 340, "(a)"],
                [79, 340, "Explain why the balloon moves forwards."],
                [496, 355, "(3)"],
                [348, 400, "(Total for Question 2 = 3 marks)"],
            ]),
        ]);
        expect(r.questions.map((q) => [q.number, q.marks])).toEqual([
            ["1", 1],
            ["2", 0],
            ["2(a)", 3],
        ]);
        expect(r.totals.paper).toBe(4);
        expect(validateStructure(r).ok).toBe(true);
    });

    it("reads science mark schemes: (1) per point, bare part marks, multiple-choice rows", () => {
        const ms = parseMarkSchemeLayout([
            page(1, [
                [72, 53, "Question Number"],
                [288, 53, "Answer"],
                [498, 53, "Mark"],
                [69, 79, "1"],
                [128, 79, "D is the correct answer"],
                [508, 79, "1"],
                [69, 120, "13(a)"],
                [126, 140, "Use of Ek = ½ m v2"],
                [471, 140, "(1)"],
                [126, 160, "Ek = 2.1 × 109 J"],
                [471, 160, "(1)"],
                [508, 160, "2"],
                [126, 200, "Total for question 13 2"],
            ]),
        ]);
        expect(ms.entries.map((e) => [e.number, e.marks, e.points.length])).toEqual([
            ["1", 1, 1],
            ["13(a)", 2, 2],
        ]);
        expect(ms.entries[1].points[0].text).toContain("Use of Ek");
        expect(ms.totals.questions["13"]).toBe(2);
    });
});
