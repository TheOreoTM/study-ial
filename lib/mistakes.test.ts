import { describe, expect, it } from "vitest";
import { groupByTopic, isMistake, missLabel, openMistakes, pickRedo, type QuestionHistory } from "./mistakes";

const day = (n: number) => new Date(Date.UTC(2026, 10, n, 12));

function h(id: string, topicId: string, lastMarks: number, lastMax: number, at: number, misses = 1): QuestionHistory {
    return { questionId: id, topicId, lastMarks, lastMax, lastAt: day(at), attempts: misses + 1, misses };
}

describe("isMistake", () => {
    it("is a mistake while the latest attempt lost marks", () => {
        expect(isMistake({ lastMarks: 0, lastMax: 1 })).toBe(true);
        expect(isMistake({ lastMarks: 3, lastMax: 4 })).toBe(true);
    });
    it("full marks closes it", () => {
        expect(isMistake({ lastMarks: 4, lastMax: 4 })).toBe(false);
    });
    it("ignores zero-mark questions", () => {
        expect(isMistake({ lastMarks: 0, lastMax: 0 })).toBe(false);
    });
});

describe("openMistakes", () => {
    const history = [
        h("a", "t1", 0, 1, 3),
        h("b", "t1", 2, 2, 4), // fixed
        h("c", "t2", 1, 3, 5, 3),
        h("d", "t2", 0, 2, 3, 2),
    ];

    it("drops questions answered fully last time", () => {
        expect(openMistakes(history).map((m) => m.questionId)).not.toContain("b");
    });

    it("lists the newest first by default", () => {
        expect(openMistakes(history).map((m) => m.questionId)).toEqual(["c", "a", "d"]);
    });

    it("redo order puts the oldest first, repeat misses ahead on ties", () => {
        expect(openMistakes(history, "redo").map((m) => m.questionId)).toEqual(["d", "a", "c"]);
    });

    it("adds the share of marks on the latest attempt", () => {
        expect(openMistakes(history).find((m) => m.questionId === "c")!.lastShare).toBeCloseTo(1 / 3);
    });

    it("is empty for no history", () => {
        expect(openMistakes([])).toEqual([]);
    });
});

describe("pickRedo", () => {
    it("takes the oldest mistakes up to the count", () => {
        const history = [h("a", "t", 0, 1, 9), h("b", "t", 0, 1, 1), h("c", "t", 0, 1, 5)];
        expect(pickRedo(history, 2).map((m) => m.questionId)).toEqual(["b", "c"]);
    });
    it("never returns a negative slice", () => {
        expect(pickRedo([h("a", "t", 0, 1, 1)], -3)).toEqual([]);
    });
});

describe("groupByTopic", () => {
    it("keeps order within and across groups", () => {
        const items = [
            { id: 1, topicId: "x" },
            { id: 2, topicId: "y" },
            { id: 3, topicId: "x" },
        ];
        expect(groupByTopic(items)).toEqual([
            { topicId: "x", items: [items[0], items[2]] },
            { topicId: "y", items: [items[1]] },
        ]);
    });
});

describe("missLabel", () => {
    it("says nothing for a single miss", () => {
        expect(missLabel(0)).toBeNull();
        expect(missLabel(1)).toBeNull();
    });
    it("counts repeats", () => {
        expect(missLabel(2)).toBe("Missed twice");
        expect(missLabel(5)).toBe("Missed 5 times");
    });
});
