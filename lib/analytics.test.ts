import { describe, expect, it } from "vitest";
import { accuracyChange, minutesBySubject, planPace, topicTrends, weeklyAccuracy } from "./analytics";

const TZ = "Indian/Maldives"; // UTC+5
const physics = { slug: "physics", name: "Physics" };
const chemistry = { slug: "chemistry", name: "Chemistry" };

describe("minutesBySubject", () => {
    const days = ["2026-10-30", "2026-10-31"];

    it("sums minutes per subject inside the window, most first, unlinked last", () => {
        const rows = minutesBySubject(
            [
                { endedAt: new Date("2026-10-31T06:00:00Z"), minutes: 25, subject: physics },
                { endedAt: new Date("2026-10-30T06:00:00Z"), minutes: 25, subject: physics },
                { endedAt: new Date("2026-10-31T07:00:00Z"), minutes: 30, subject: chemistry },
                { endedAt: new Date("2026-10-31T08:00:00Z"), minutes: 90, subject: null },
                { endedAt: new Date("2026-10-20T08:00:00Z"), minutes: 500, subject: chemistry },
            ],
            days,
            TZ,
        );
        expect(rows).toEqual([
            { slug: "physics", name: "Physics", minutes: 50 },
            { slug: "chemistry", name: "Chemistry", minutes: 30 },
            { slug: null, name: "Not linked to a topic", minutes: 90 },
        ]);
    });

    it("buckets by Maldives day, not UTC day", () => {
        // 19:30 UTC on the 29th is 00:30 on the 30th in Malé: inside the window.
        const rows = minutesBySubject(
            [{ endedAt: new Date("2026-10-29T19:30:00Z"), minutes: 25, subject: physics }],
            days,
            TZ,
        );
        expect(rows).toEqual([{ slug: "physics", name: "Physics", minutes: 25 }]);
        // 18:30 UTC on the 29th is still the 29th locally: outside.
        expect(
            minutesBySubject([{ endedAt: new Date("2026-10-29T18:30:00Z"), minutes: 25, subject: physics }], days, TZ),
        ).toEqual([]);
    });
});

describe("weeklyAccuracy", () => {
    const today = "2026-10-31";

    it("makes 7-day windows ending today, oldest first", () => {
        const weeks = weeklyAccuracy([], today, 3, TZ);
        expect(weeks.map((w) => [w.start, w.end])).toEqual([
            ["2026-10-11", "2026-10-17"],
            ["2026-10-18", "2026-10-24"],
            ["2026-10-25", "2026-10-31"],
        ]);
    });

    it("treats empty weeks as gaps, not zeros", () => {
        const weeks = weeklyAccuracy(
            [
                { createdAt: new Date("2026-10-31T05:00:00Z"), marksAwarded: 3, maxMarks: 4 },
                { createdAt: new Date("2026-10-30T05:00:00Z"), marksAwarded: 1, maxMarks: 4 },
                { createdAt: new Date("2026-10-12T05:00:00Z"), marksAwarded: 0, maxMarks: 2 },
            ],
            today,
            3,
            TZ,
        );
        expect(weeks.map((w) => w.accuracy)).toEqual([0, null, 0.5]);
        expect(weeks.map((w) => w.attempts)).toEqual([1, 0, 2]);
    });

    it("counts a late-evening attempt on the next local day", () => {
        // 2026-10-31 20:00 UTC is 1 November in Malé: after the window ending 31 October.
        const weeks = weeklyAccuracy(
            [{ createdAt: new Date("2026-10-31T20:00:00Z"), marksAwarded: 1, maxMarks: 1 }],
            today,
            1,
            TZ,
        );
        expect(weeks[0].attempts).toBe(0);
    });
});

describe("accuracyChange and topicTrends", () => {
    const today = "2026-10-31";
    const at = (day: string, marks: number, max = 4) => ({
        createdAt: new Date(`${day}T06:00:00Z`),
        marksAwarded: marks,
        maxMarks: max,
    });

    it("needs two weeks with data to report a change", () => {
        expect(accuracyChange(weeklyAccuracy([at("2026-10-31", 2)], today, 6, TZ))).toBeNull();
        expect(accuracyChange(weeklyAccuracy([at("2026-10-10", 1), at("2026-10-31", 3)], today, 6, TZ))).toBeCloseTo(
            0.5,
        );
    });

    it("lists slipping topics first, then topics with no change yet, then improving ones", () => {
        const trends = topicTrends(
            [
                { ...at("2026-10-10", 1), topicId: "up" },
                { ...at("2026-10-31", 4), topicId: "up" },
                { ...at("2026-10-10", 4), topicId: "down" },
                { ...at("2026-10-31", 1), topicId: "down" },
                { ...at("2026-10-31", 2), topicId: "new" },
                { ...at("2026-01-01", 2), topicId: "old" },
            ],
            today,
            6,
            TZ,
        );
        expect(trends.map((t) => t.topicId)).toEqual(["down", "new", "up"]);
    });
});

describe("planPace", () => {
    const d = (k: string) => new Date(`${k}T00:00:00Z`);
    const plan = { startDate: d("2026-10-28"), examDate: d("2026-11-02"), timeZone: TZ };
    const tasks = [
        { date: d("2026-10-28"), status: "DONE" as const, completedAt: new Date("2026-10-28T10:00:00Z") },
        { date: d("2026-10-29"), status: "PENDING" as const, completedAt: null },
        { date: d("2026-10-30"), status: "SKIPPED" as const, completedAt: null },
        { date: d("2026-10-31"), status: "DONE" as const, completedAt: new Date("2026-10-31T19:30:00Z") },
        { date: d("2026-11-01"), status: "PENDING" as const, completedAt: null },
    ];

    it("reports progress mid-plan", () => {
        const pace = planPace(tasks, { ...plan, today: "2026-10-31" });
        expect(pace).toMatchObject({ total: 5, done: 2, skipped: 1, scheduledByToday: 4, behind: 1, daysLeft: 2 });
        expect(pace.series.map((p) => p.day)).toEqual([
            "2026-10-28",
            "2026-10-29",
            "2026-10-30",
            "2026-10-31",
            "2026-11-01",
            "2026-11-02",
        ]);
        expect(pace.series.map((p) => p.scheduled)).toEqual([1, 2, 3, 4, 5, 5]);
        // The task done at 19:30 UTC on the 31st counts on 1 November locally, which is after today.
        expect(pace.series.map((p) => p.done)).toEqual([1, 1, 1, 1, null, null]);
    });

    it("handles today being before the plan starts", () => {
        const pace = planPace(
            tasks.map((t) => ({ ...t, status: "PENDING" as const, completedAt: null })),
            { ...plan, today: "2026-10-20" },
        );
        expect(pace).toMatchObject({ scheduledByToday: 0, behind: 0, daysLeft: 13 });
        expect(pace.series.every((p) => p.done === null)).toBe(true);
    });

    it("handles today being after the exam", () => {
        const pace = planPace(tasks, { ...plan, today: "2026-11-10" });
        expect(pace.daysLeft).toBe(-8);
        expect(pace.behind).toBe(2);
        expect(pace.series.at(-1)).toEqual({ day: "2026-11-02", scheduled: 5, done: 2 });
    });

    it("draws an empty plan from start to exam", () => {
        const pace = planPace([], { ...plan, today: "2026-10-30" });
        expect(pace.total).toBe(0);
        expect(pace.series).toHaveLength(6);
    });
});
