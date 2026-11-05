import { describe, expect, it } from "vitest";
import { activityPoints, buildHeatmap, lastWeeks, levelFor, weekday, weeklyTotals } from "./heatmap";

describe("levels", () => {
    it("counts five focus minutes like one question", () => {
        expect(activityPoints({ questions: 3, minutes: 25 })).toBe(8);
    });
    it("steps up with activity", () => {
        expect(levelFor({ questions: 0, minutes: 0 })).toBe(0);
        expect(levelFor({ questions: 1, minutes: 0 })).toBe(1);
        expect(levelFor({ questions: 6, minutes: 0 })).toBe(2);
        expect(levelFor({ questions: 0, minutes: 75 })).toBe(3);
        expect(levelFor({ questions: 20, minutes: 50 })).toBe(4);
    });
});

describe("buildHeatmap", () => {
    // 2026-11-05 is a Thursday.
    const today = "2026-11-05";

    it("has full Sunday-first weeks ending with this week", () => {
        const map = buildHeatmap(today, new Map(), 4);
        expect(weekday("2026-11-01")).toBe(0);
        expect(map.weeks).toHaveLength(4);
        expect(map.weeks.every((w) => w.length === 7)).toBe(true);
        expect(map.weeks[3][0].date).toBe("2026-11-01");
        expect(map.weeks[0][0].date).toBe("2026-10-11");
    });

    it("marks days after today as future and ignores their activity", () => {
        const map = buildHeatmap(today, new Map([["2026-11-06", { questions: 9, minutes: 0 }]]), 2);
        const fri = map.weeks[1][5];
        expect(fri.date).toBe("2026-11-06");
        expect(fri.future).toBe(true);
        expect(fri.level).toBe(0);
        expect(map.questions).toBe(0);
    });

    it("totals activity and finds the longest run", () => {
        const activity = new Map([
            ["2026-11-01", { questions: 2, minutes: 0 }],
            ["2026-11-02", { questions: 0, minutes: 25 }],
            ["2026-11-03", { questions: 4, minutes: 0 }],
            ["2026-11-05", { questions: 1, minutes: 0 }],
        ]);
        const map = buildHeatmap(today, activity, 2);
        expect(map.activeDays).toBe(4);
        expect(map.longestStreak).toBe(3);
        expect(map.questions).toBe(7);
        expect(map.minutes).toBe(25);
    });

    it("labels the column where each month starts", () => {
        const map = buildHeatmap(today, new Map(), 12);
        const labels = map.months.map((m) => m.label);
        expect(labels).toContain("Nov");
        expect(labels).toContain("Oct");
        expect(map.months.find((m) => m.label === "Nov")!.column).toBe(11);
    });

    it("never puts two labels in neighbouring columns", () => {
        const map = buildHeatmap(today, new Map(), 26);
        for (let i = 1; i < map.months.length; i++) {
            expect(map.months[i].column - map.months[i - 1].column).toBeGreaterThanOrEqual(2);
        }
    });

    it("works when today is a Sunday", () => {
        const map = buildHeatmap("2026-11-01", new Map(), 1);
        expect(map.weeks[0][0].date).toBe("2026-11-01");
        expect(map.weeks[0].slice(1).every((c) => c.future)).toBe(true);
    });
});

describe("weeklyTotals", () => {
    it("sums each week", () => {
        const map = buildHeatmap("2026-11-05", new Map([["2026-11-02", { questions: 5, minutes: 10 }]]), 2);
        expect(weeklyTotals(map)[1]).toEqual({
            from: "2026-11-01",
            to: "2026-11-07",
            activeDays: 1,
            questions: 5,
            minutes: 10,
        });
    });
});

describe("lastWeeks", () => {
    it("keeps the latest columns and recounts", () => {
        const activity = new Map([
            ["2026-09-01", { questions: 3, minutes: 0 }],
            ["2026-11-02", { questions: 2, minutes: 0 }],
        ]);
        const year = buildHeatmap("2026-11-05", activity, 52);
        const recent = lastWeeks(year, 4);
        expect(recent.weeks).toHaveLength(4);
        expect(recent.weeks[3]).toEqual(year.weeks[51]);
        expect(recent.questions).toBe(2);
        expect(recent.activeDays).toBe(1);
        expect(recent.months.every((m) => m.column >= 0 && m.column < 4)).toBe(true);
    });
    it("returns the map when asked for more weeks than it has", () => {
        const map = buildHeatmap("2026-11-05", new Map(), 4);
        expect(lastWeeks(map, 10)).toBe(map);
    });
});
