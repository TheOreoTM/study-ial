import { describe, expect, it } from "vitest";
import { cloneExamDates, MIN_CLONE_DAYS, planTemplate } from "./community-plans";

const d = (k: string) => new Date(`${k}T00:00:00Z`);

describe("planTemplate", () => {
    const plan = {
        startDate: d("2026-11-02"),
        examDate: d("2026-11-20"),
        tasks: [
            { date: d("2026-11-02"), type: "LEARN" as const, minutes: 40, unitCode: "WPH11" },
            { date: d("2026-11-03"), type: "PRACTICE" as const, minutes: 30, unitCode: "WPH12" },
            { date: d("2026-11-09"), type: "PRACTICE" as const, minutes: 30, unitCode: "WPH11" },
            { date: d("2026-11-19"), type: "PAST_PAPER" as const, minutes: 90, unitCode: null },
        ],
    };

    it("counts weeks from start to exam inclusive and the task mix", () => {
        const t = planTemplate(plan);
        expect(t.weeks).toBe(3);
        expect(t.taskCount).toBe(4);
        expect(t.mix).toEqual({ LEARN: 1, PRACTICE: 2, REVIEW: 0, PAST_PAPER: 1 });
    });

    it("outlines each week with counts, minutes and sorted unit codes", () => {
        const [w1, w2, w3] = planTemplate(plan).outline;
        expect(w1).toEqual({
            week: 1,
            counts: { LEARN: 1, PRACTICE: 1, REVIEW: 0, PAST_PAPER: 0 },
            minutes: 70,
            units: ["WPH11", "WPH12"],
        });
        expect(w2.units).toEqual(["WPH11"]);
        expect(w3).toMatchObject({ minutes: 90, units: [] });
    });

    it("keeps out-of-range tasks inside the outline", () => {
        const t = planTemplate({
            ...plan,
            tasks: [{ date: d("2026-12-30"), type: "REVIEW", minutes: 20, unitCode: "WPH11" }],
        });
        expect(t.outline.at(-1)!.counts.REVIEW).toBe(1);
    });

    it("never exposes task titles, notes or status", () => {
        const json = JSON.stringify(planTemplate(plan));
        expect(json).not.toMatch(/title|notes|status|DONE|PENDING/);
    });
});

describe("cloneExamDates", () => {
    const template = {
        startDate: d("2026-09-01"),
        units: [
            { unitId: "u1", examDate: d("2026-11-01") }, // 61-day runway
            { unitId: "u2", examDate: d("2026-09-05") }, // 4-day runway
        ],
    };
    const today = d("2026-10-31");

    it("uses the student's own upcoming exam date", () => {
        expect(cloneExamDates(template, new Map([["u1", d("2027-01-15")]]), today)[0]).toEqual({
            unitId: "u1",
            examDate: d("2027-01-15"),
        });
    });

    it("treats an exam today as upcoming", () => {
        expect(cloneExamDates(template, new Map([["u1", today]]), today)[0].examDate).toEqual(today);
    });

    it("falls back to the template's runway from today, ignoring past dates", () => {
        const [u1, u2] = cloneExamDates(template, new Map([["u1", d("2026-06-01")]]), today);
        expect(u1.examDate).toEqual(d("2026-12-31"));
        // A very short runway is stretched to the minimum.
        expect(u2.examDate).toEqual(new Date(today.getTime() + MIN_CLONE_DAYS * 86_400_000));
    });
});
