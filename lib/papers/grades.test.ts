import { describe, expect, it } from "vitest";
import { gradeFor, marksToNextGrade, parseExamDuration, parseGradeBoundaryLines } from "@/lib/papers/grades";

const lines = [
    "International AS unit grade boundaries Max Mark a b c d e u",
    "WMA11 Unit 1: Pure Mathematics 1 Raw 75 55 48 41 35 29 0",
    "WMA11 Unit 1A: Pure Mathematics 1 Raw 75 55 48 41 35 29 0",
    "International A2 unit grade boundaries Max Mark a* a b c d e u",
    "WMA13 Unit 3: Pure Mathematics 3 Raw 75 63 57 51 45 39 34 0",
    "WBS11 Unit 1: Marketing and People Raw 80 57 52 47 42 37 0",
    "WMA14 Unit 4: Pure Mathematics 4 Raw 75 80 57 51 45 39 34 0",
    "WMA12 P2: Pure Mathematics 2 Raw 75 53 46 39 32 25 0",
    "WMA01 C12: Core Mathematics 12 Raw 125 95 85 75 65 55 0",
];

describe("grade boundaries", () => {
    const rows = parseGradeBoundaryLines(lines, ["WMA"]);

    it("reads AS and A2 rows for allowlisted units, with paper variants", () => {
        expect(rows).toEqual([
            { unitCode: "WMA11", paperCode: "01", maxMark: 75, grades: { a: 55, b: 48, c: 41, d: 35, e: 29 } },
            { unitCode: "WMA11", paperCode: "01a", maxMark: 75, grades: { a: 55, b: 48, c: 41, d: 35, e: 29 } },
            { unitCode: "WMA13", paperCode: "01", maxMark: 75, grades: { "a*": 63, a: 57, b: 51, c: 45, d: 39, e: 34 } },
            { unitCode: "WMA12", paperCode: "01", maxMark: 75, grades: { a: 53, b: 46, c: 39, d: 32, e: 25 } },
            { unitCode: "WMA01", paperCode: "01", maxMark: 125, grades: { a: 95, b: 85, c: 75, d: 65, e: 55 } },
        ]);
    });

    it("grades raw marks", () => {
        const as = rows[0].grades;
        expect(gradeFor(75, as)).toBe("a");
        expect(gradeFor(48, as)).toBe("b");
        expect(gradeFor(28, as)).toBe("u");
        expect(gradeFor(63, rows[2].grades)).toBe("a*");
        expect(marksToNextGrade(46, as)).toEqual({ grade: "b", marks: 2 });
        expect(marksToNextGrade(70, rows[2].grades)).toBeNull();
    });
});

describe("exam duration", () => {
    it("reads the cover page", () => {
        expect(parseExamDuration("Morning (Time: 1 hour 30 minutes) Paper reference WMA11/01")).toBe(90);
        expect(parseExamDuration("Time: 2 hours")).toBe(120);
        expect(parseExamDuration("Time 1 hour 20 minutes")).toBe(80);
        expect(parseExamDuration("Total marks 75")).toBeNull();
    });
});
