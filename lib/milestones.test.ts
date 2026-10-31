import { describe, expect, it } from "vitest";
import { evaluateMilestones, isTurnaround, type MilestoneFacts } from "./milestones";

const none: MilestoneFacts = {
    attempts: 0,
    strongTopics: 0,
    turnaround: null,
    units: [],
    activeDaysLast7: 0,
    focusMinutes: 0,
    plan: null,
};
const earned = (f: Partial<MilestoneFacts>) =>
    evaluateMilestones({ ...none, ...f })
        .filter((m) => m.earned)
        .map((m) => m.key);
const status = (f: Partial<MilestoneFacts>, key: string) =>
    evaluateMilestones({ ...none, ...f }).find((m) => m.key === key)!;

describe("evaluateMilestones", () => {
    it("earns nothing for a brand-new student", () => {
        expect(earned({})).toEqual([]);
    });

    it("counts strong topics against 1, 5 and 15", () => {
        expect(earned({ attempts: 30, strongTopics: 5 })).toEqual(["first-answer", "first-strong", "strong-5"]);
        expect(status({ strongTopics: 7 }, "strong-15").progress).toEqual({
            value: 7,
            target: 15,
            label: "strong topics",
        });
    });

    it("needs every practisable topic of a unit, ignoring topics without questions", () => {
        const unit = { code: "WPH11", name: "Mechanics", practisable: 4, attempted: 4, strong: 3 };
        expect(earned({ units: [unit] })).toEqual(["unit-covered"]);
        expect(status({ units: [unit] }, "unit-covered").detail).toBe("WPH11");
        expect(status({ units: [unit] }, "unit-strong").progress).toEqual({
            value: 3,
            target: 4,
            label: "strong topics in WPH11",
        });
        // A unit with no questions yet can't be "covered" by default.
        expect(earned({ units: [{ ...unit, practisable: 0, attempted: 0, strong: 0 }] })).toEqual([]);
    });

    it("shows progress for the unit closest to being covered", () => {
        const s = status(
            {
                units: [
                    { code: "WPH11", name: "", practisable: 6, attempted: 2, strong: 0 },
                    { code: "WPH12", name: "", practisable: 4, attempted: 3, strong: 0 },
                ],
            },
            "unit-covered",
        );
        expect(s.progress?.label).toBe("topics tried in WPH12");
    });

    it("rewards five active days in any order, not a streak", () => {
        expect(earned({ activeDaysLast7: 4 })).toEqual([]);
        expect(earned({ activeDaysLast7: 5 })).toEqual(["steady-week"]);
    });

    it("converts focus minutes to hours", () => {
        expect(status({ focusMinutes: 599 }, "focus-10h")).toMatchObject({
            earned: false,
            progress: { value: 9, target: 10 },
        });
        expect(status({ focusMinutes: 600 }, "focus-10h").earned).toBe(true);
    });

    it("needs seven plan tasks done and nothing overdue", () => {
        expect(earned({ plan: { done: 7, pendingBeforeToday: 0, dueBeforeToday: 7 } })).toEqual(["plan-on-track"]);
        expect(earned({ plan: { done: 7, pendingBeforeToday: 1, dueBeforeToday: 8 } })).toEqual([]);
        expect(earned({ plan: { done: 6, pendingBeforeToday: 0, dueBeforeToday: 6 } })).toEqual([]);
        expect(status({}, "plan-on-track").progress).toBeNull();
    });

    it("names the turnaround topic", () => {
        expect(status({ turnaround: "Momentum" }, "turnaround")).toMatchObject({ earned: true, detail: "Momentum" });
    });
});

describe("isTurnaround", () => {
    const at = (daysAgo: number, marks: number, max = 4) => ({
        createdAt: new Date(Date.UTC(2026, 9, 31) - daysAgo * 86_400_000),
        marksAwarded: marks,
        maxMarks: max,
    });
    const weakStart = [at(9, 1), at(10, 0), at(8, 1)];

    it("spots a weak start on a topic that is now strong", () => {
        expect(isTurnaround({ level: "strong", total: 8, firstAttempts: weakStart })).toBe(true);
    });

    it("needs newer evidence after the start", () => {
        expect(isTurnaround({ level: "strong", total: 5, firstAttempts: weakStart })).toBe(false);
        expect(isTurnaround({ level: "strong", total: 8, firstAttempts: weakStart.slice(0, 2) })).toBe(false);
    });

    it("ignores topics that started well or aren't strong now", () => {
        expect(isTurnaround({ level: "strong", total: 8, firstAttempts: [at(10, 4), at(9, 3), at(8, 4)] })).toBe(false);
        expect(isTurnaround({ level: "developing", total: 8, firstAttempts: weakStart })).toBe(false);
    });
});
