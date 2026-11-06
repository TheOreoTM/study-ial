import { describe, expect, it } from "vitest";
import { ancestors, leafMarks, leaves, paperTotal } from "@/lib/papers/tree";

const rows = [
    { id: "1", parentId: null, number: "1", order: 0, marks: 4 },
    { id: "2", parentId: null, number: "2", order: 1, marks: 0 },
    { id: "2a", parentId: "2", number: "2(a)", order: 2, marks: 2 },
    { id: "2b", parentId: "2", number: "2(b)", order: 3, marks: 0 },
    { id: "2bi", parentId: "2b", number: "2(b)(i)", order: 4, marks: 0 },
    { id: "2bii", parentId: "2b", number: "2(b)(ii)", order: 5, marks: 0 },
];
rows[3].marks = 3; // marks printed once for 2(b) after its sub-parts

describe("question tree", () => {
    it("lists leaves in paper order", () => {
        expect(leaves(rows).map((r) => r.number)).toEqual(["1", "2(a)", "2(b)(i)", "2(b)(ii)"]);
    });

    it("gives a part's ancestors from the question down", () => {
        expect(ancestors(rows, "2bii").map((r) => r.number)).toEqual(["2", "2(b)"]);
        expect(ancestors(rows, "1")).toEqual([]);
    });

    it("puts a group's printed marks on its last sub-part", () => {
        expect(leafMarks(rows, rows[4])).toBe(0);
        expect(leafMarks(rows, rows[5])).toBe(3);
        expect(leafMarks(rows, rows[2])).toBe(2);
        expect(paperTotal(rows)).toBe(9);
    });
});
