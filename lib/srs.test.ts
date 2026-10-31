import { describe, expect, it } from "vitest";
import { buildQueue, daysBetween, MAX_INTERVAL_DAYS, MIN_EASE, scheduleCard, START_EASE, type CardState } from "./srs";

const today = "2026-10-31";

describe("scheduleCard", () => {
    it("schedules a first Good for tomorrow and a first Easy four days out", () => {
        expect(scheduleCard(null, "good", today)).toEqual({
            intervalDays: 1,
            ease: START_EASE,
            reps: 1,
            lapses: 0,
            dueDay: "2026-11-01",
        });
        expect(scheduleCard(null, "easy", today).dueDay).toBe("2026-11-04");
    });

    it("keeps a new card due today on Again without counting a lapse", () => {
        const s = scheduleCard(null, "again", today);
        expect(s).toMatchObject({ intervalDays: 0, reps: 0, lapses: 0, ease: START_EASE, dueDay: today });
    });

    it("grows intervals with ease after the learning steps", () => {
        let s = scheduleCard(null, "good", today); // 1 day
        s = scheduleCard(s, "good", s.dueDay); // 3 days
        expect(s.intervalDays).toBe(3);
        s = scheduleCard(s, "good", s.dueDay); // 3 × 2.5 → 8
        expect(s.intervalDays).toBe(8);
        expect(s.reps).toBe(3);
    });

    it("makes Easy grow faster than Good", () => {
        const learnt: CardState = { intervalDays: 10, ease: 2.5, reps: 3, lapses: 0, dueDay: today };
        expect(scheduleCard(learnt, "easy", today).intervalDays).toBeGreaterThan(
            scheduleCard(learnt, "good", today).intervalDays,
        );
    });

    it("resets a learnt card on Again, lowers ease and counts a lapse", () => {
        const learnt: CardState = { intervalDays: 20, ease: 2.5, reps: 4, lapses: 1, dueDay: today };
        expect(scheduleCard(learnt, "again", today)).toEqual({
            intervalDays: 0,
            ease: 2.3,
            reps: 0,
            lapses: 2,
            dueDay: today,
        });
    });

    it("never drops ease below the floor", () => {
        let s: CardState = { intervalDays: 5, ease: MIN_EASE + 0.05, reps: 3, lapses: 0, dueDay: today };
        s = scheduleCard(s, "again", today);
        expect(s.ease).toBe(MIN_EASE);
    });

    it("caps the interval", () => {
        const s = scheduleCard({ intervalDays: 150, ease: 3, reps: 8, lapses: 0, dueDay: today }, "easy", today);
        expect(s.intervalDays).toBe(MAX_INTERVAL_DAYS);
    });

    it("always moves a passed card forward by at least a day", () => {
        const s = scheduleCard({ intervalDays: 1, ease: MIN_EASE, reps: 2, lapses: 3, dueDay: today }, "good", today);
        expect(s.intervalDays).toBe(2);
    });

    it("does calendar arithmetic across month and year ends", () => {
        expect(scheduleCard(null, "good", "2026-12-31").dueDay).toBe("2027-01-01");
        expect(scheduleCard(null, "easy", "2027-02-26").dueDay).toBe("2027-03-02");
    });
});

describe("buildQueue", () => {
    const priority = new Map([
        ["weak", 0.9],
        ["ok", 0.3],
    ]);

    it("puts due cards first, most overdue first", () => {
        const q = buildQueue({
            due: [
                { id: "b", topicId: "ok", dueDay: "2026-10-30" },
                { id: "a", topicId: "ok", dueDay: "2026-10-20" },
            ],
            unseen: [{ id: "n", topicId: "ok" }],
            topicPriority: priority,
            introducedToday: 0,
        });
        expect(q).toEqual({ due: ["a", "b"], fresh: ["n"] });
    });

    it("introduces new cards from the weakest topics first, keeping deck order within a topic", () => {
        const q = buildQueue({
            due: [],
            unseen: [
                { id: "ok1", topicId: "ok" },
                { id: "weak1", topicId: "weak" },
                { id: "ok2", topicId: "ok" },
                { id: "weak2", topicId: "weak" },
            ],
            topicPriority: priority,
            introducedToday: 0,
            newLimit: 3,
        });
        expect(q.fresh).toEqual(["weak1", "weak2", "ok1"]);
    });

    it("respects the daily new-card cap including cards already started today", () => {
        const unseen = Array.from({ length: 20 }, (_, i) => ({ id: `c${i}`, topicId: "ok" }));
        expect(buildQueue({ due: [], unseen, topicPriority: priority, introducedToday: 7 }).fresh).toHaveLength(3);
        expect(buildQueue({ due: [], unseen, topicPriority: priority, introducedToday: 12 }).fresh).toHaveLength(0);
    });
});

describe("daysBetween", () => {
    it("counts whole days", () => {
        expect(daysBetween("2026-10-31", "2026-11-03")).toBe(3);
        expect(daysBetween("2026-10-31", "2026-10-29")).toBe(-2);
    });
});
