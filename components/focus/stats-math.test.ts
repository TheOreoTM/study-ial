import { describe, expect, it } from "vitest";
import { addDays, bucketMinutes, countStreak, dayKey, lastNDays } from "./stats-math";

describe("day keys", () => {
    it("uses the Maldives day boundary by default", () => {
        // 20:00 UTC is 01:00 the next day in Malé (UTC+5)
        expect(dayKey(new Date("2026-10-29T20:00:00Z"))).toBe("2026-10-30");
        expect(dayKey(new Date("2026-10-29T18:59:00Z"))).toBe("2026-10-29");
        expect(dayKey(new Date("2026-10-29T20:00:00Z"), "UTC")).toBe("2026-10-29");
    });

    it("does calendar arithmetic across months and leap days", () => {
        expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
        expect(addDays("2028-03-01", -1)).toBe("2028-02-29");
        expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
        expect(lastNDays("2026-11-02", 3)).toEqual(["2026-10-31", "2026-11-01", "2026-11-02"]);
    });
});

describe("countStreak", () => {
    const today = "2026-10-30";
    it("counts consecutive days ending today", () => {
        expect(countStreak(["2026-10-30", "2026-10-29", "2026-10-28", "2026-10-26"], today)).toBe(3);
    });
    it("still counts a streak ending yesterday", () => {
        expect(countStreak(["2026-10-29", "2026-10-28"], today)).toBe(2);
    });
    it("is zero when the last activity was two days ago", () => {
        expect(countStreak(["2026-10-28", "2026-10-27"], today)).toBe(0);
        expect(countStreak([], today)).toBe(0);
    });
    it("crosses month boundaries", () => {
        expect(countStreak(["2026-11-01", "2026-10-31", "2026-10-30"], "2026-11-01")).toBe(3);
    });
});

describe("bucketMinutes", () => {
    it("sums sessions per local day and ignores ones outside the window", () => {
        const days = lastNDays("2026-10-30", 2);
        const out = bucketMinutes(
            [
                { endedAt: new Date("2026-10-30T03:00:00Z"), minutes: 25 },
                { endedAt: new Date("2026-10-30T04:00:00Z"), minutes: 10 },
                { endedAt: new Date("2026-10-28T22:00:00Z"), minutes: 5 }, // 03:00 on the 29th in Malé
                { endedAt: new Date("2026-10-20T04:00:00Z"), minutes: 99 },
            ],
            days,
        );
        expect(out).toEqual([
            { date: "2026-10-29", minutes: 5 },
            { date: "2026-10-30", minutes: 35 },
        ]);
    });
});
