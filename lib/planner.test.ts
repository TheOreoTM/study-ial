import { describe, expect, it } from "vitest";
import type { Mastery, MasteryLevel } from "@/lib/mastery";
import {
    buildPlan,
    coveredTopicIds,
    dayKey,
    FINAL_PHASE_DAYS,
    PAST_PAPER_MINUTES,
    PlannerError,
    toDayNumber,
    type PlannedTask,
    type PlannerInput,
    type PlannerTopic,
    type PlannerUnit,
} from "@/lib/planner";

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);
const TODAY = d("2026-11-02"); // a Monday

function mastery(level: MasteryLevel): Mastery {
    const score = { new: null, weak: 0.3, developing: 0.6, strong: 0.9 }[level];
    return {
        score,
        level,
        attempts: level === "new" ? 0 : 5,
        lastPracticedAt: level === "new" ? null : d("2026-10-30"),
    };
}

function topics(prefix: string, levels: MasteryLevel[]): PlannerTopic[] {
    return levels.map((level, i) => ({ id: `${prefix}-t${i + 1}`, name: `${prefix} topic ${i + 1}`, order: i, mastery: mastery(level) }));
}

function unit(code: string, examDate: string, levels: MasteryLevel[]): PlannerUnit {
    return { id: code, code, examDate: d(examDate), topics: topics(code, levels) };
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];
const mixed: MasteryLevel[] = ["strong", "weak", "new", "developing", "weak", "new", "strong", "developing"];

function base(overrides: Partial<PlannerInput> = {}): PlannerInput {
    return {
        startDate: TODAY,
        today: TODAY,
        units: [unit("WPH11", "2027-01-15", mixed)],
        minutesPerDay: 90,
        studyDays: WEEKDAYS,
        ...overrides,
    };
}

function minutesByDay(tasks: PlannedTask[]) {
    const m = new Map<string, number>();
    for (const t of tasks) m.set(dayKey(t.date), (m.get(dayKey(t.date)) ?? 0) + t.minutes);
    return m;
}

/** Invariants every plan must satisfy. */
function checkInvariants(input: PlannerInput, tasks: PlannedTask[]) {
    const exam = new Map(input.units.map((u) => [u.id, toDayNumber(u.examDate)]));
    const start = Math.max(toDayNumber(input.startDate), toDayNumber(input.today));
    for (const t of tasks) {
        expect(input.studyDays).toContain(t.date.getUTCDay());
        expect(toDayNumber(t.date)).toBeGreaterThanOrEqual(start);
        expect(toDayNumber(t.date)).toBeLessThan(exam.get(t.unitId)!);
        expect(t.date.getTime() % 86_400_000).toBe(0);
        expect(t.minutes).toBeGreaterThan(0);
        if (t.type === "PAST_PAPER") expect(t.topicId).toBeNull();
        else expect(t.topicId).not.toBeNull();
    }
    for (const [, minutes] of minutesByDay(tasks)) expect(minutes).toBeLessThanOrEqual(input.minutesPerDay);

    // Sorted by date, then order 0..n-1 within each day.
    for (let i = 1; i < tasks.length; i++) {
        expect(tasks[i].date.getTime()).toBeGreaterThanOrEqual(tasks[i - 1].date.getTime());
    }
    const byDay = new Map<string, number[]>();
    for (const t of tasks) byDay.set(dayKey(t.date), [...(byDay.get(dayKey(t.date)) ?? []), t.order]);
    for (const [, orders] of byDay) expect(orders).toEqual(orders.map((_, i) => i));
}

describe("buildPlan", () => {
    it("is deterministic", () => {
        const a = buildPlan(base());
        const b = buildPlan(base());
        expect(a).toEqual(b);
        expect(a.length).toBeGreaterThan(0);
    });

    it("respects study days, the exam date and the daily budget", () => {
        for (const studyDays of [WEEKDAYS, [6, 0], [3], ALL_DAYS]) {
            for (const minutesPerDay of [30, 45, 60, 90, 150, 240]) {
                const input = base({ studyDays, minutesPerDay });
                checkInvariants(input, buildPlan(input));
            }
        }
    });

    it("covers every topic in phase 1 when there is time, weakest first with LEARN before PRACTICE", () => {
        const input = base();
        const tasks = buildPlan(input);
        const phase1End = toDayNumber(input.units[0].examDate) - FINAL_PHASE_DAYS;
        const phase1 = tasks.filter((t) => toDayNumber(t.date) < phase1End && !t.title.startsWith("Revisit"));
        for (const t of input.units[0].topics) {
            expect(phase1.some((p) => p.topicId === t.id && p.type === "PRACTICE")).toBe(true);
        }

        // New/weak topics are learned first; developing/strong only practised.
        for (const t of input.units[0].topics) {
            const learn = phase1.findIndex((p) => p.topicId === t.id && p.type === "LEARN");
            const practice = phase1.findIndex((p) => p.topicId === t.id && p.type === "PRACTICE");
            if (t.mastery.level === "new" || t.mastery.level === "weak") {
                expect(learn).toBeGreaterThanOrEqual(0);
                expect(learn).toBeLessThan(practice);
            } else {
                expect(learn).toBe(-1);
            }
        }

        // First practice order follows revisionPriority (never-practised topics carry a staleness nudge, so they
        // edge out recently-practised weak ones): new (3, 6) → weak (2, 5) → developing (4, 8) → strong (1, 7).
        const firstPractice = [...new Set(phase1.filter((p) => p.type === "PRACTICE").map((p) => p.topicId))];
        expect(firstPractice).toEqual(["t3", "t6", "t2", "t5", "t4", "t8", "t1", "t7"].map((s) => `WPH11-${s}`));
    });

    it("keeps spec order as the tiebreak for equal priority", () => {
        const input = base({ units: [unit("WPH11", "2027-01-15", ["new", "new", "new", "new"])] });
        const practice = buildPlan(input).filter((t) => t.type === "LEARN");
        expect(practice.map((t) => t.topicId)).toEqual(["WPH11-t1", "WPH11-t2", "WPH11-t3", "WPH11-t4"]);
    });

    it("schedules spaced reviews ~3 and ~10 days after first practice", () => {
        const tasks = buildPlan(base({ studyDays: ALL_DAYS }));
        const topicId = "WPH11-t2";
        const practice = tasks.find((t) => t.topicId === topicId && t.type === "PRACTICE")!;
        const reviews = tasks.filter((t) => t.topicId === topicId && t.type === "REVIEW");
        expect(reviews).toHaveLength(2);
        expect(toDayNumber(reviews[0].date) - toDayNumber(practice.date)).toBeGreaterThanOrEqual(3);
        expect(toDayNumber(reviews[0].date) - toDayNumber(practice.date)).toBeLessThanOrEqual(5);
        expect(toDayNumber(reviews[1].date) - toDayNumber(practice.date)).toBeGreaterThanOrEqual(10);
        expect(toDayNumber(reviews[1].date) - toDayNumber(practice.date)).toBeLessThanOrEqual(13);
    });

    it("runs timed past papers and weak-topic practice in the final weeks", () => {
        const input = base();
        const tasks = buildPlan(input);
        const finalStart = toDayNumber(input.units[0].examDate) - FINAL_PHASE_DAYS;
        const papers = tasks.filter((t) => t.type === "PAST_PAPER");
        expect(papers.length).toBeGreaterThanOrEqual(3);
        for (const p of papers) {
            expect(toDayNumber(p.date)).toBeGreaterThanOrEqual(finalStart);
            expect(p.minutes).toBe(PAST_PAPER_MINUTES);
            expect(p.title).toMatch(/^WPH11 timed past paper/);
        }
        const drills = tasks.filter((t) => toDayNumber(t.date) >= finalStart && t.title.startsWith("Exam-style"));
        expect(drills.length).toBeGreaterThan(0);
        const strongIds = input.units[0].topics.filter((t) => t.mastery.level === "strong").map((t) => t.id);
        for (const t of drills) expect(strongIds).not.toContain(t.topicId);
    });

    it("splits past papers across days when the daily budget is short", () => {
        const input = base({ minutesPerDay: 45 });
        const tasks = buildPlan(input);
        const papers = tasks.filter((t) => t.type === "PAST_PAPER");
        expect(papers.length).toBeGreaterThan(0);
        expect(papers.every((p) => p.minutes <= 45)).toBe(true);
        expect(papers[0].title).toMatch(/part 1 of 2/);
        expect(papers[1].title).toMatch(/part 2 of 2/);
        const total = papers.filter((p) => p.title.includes("#1 ")).reduce((s, p) => s + p.minutes, 0);
        expect(total).toBe(PAST_PAPER_MINUTES);
        checkInvariants(input, tasks);
    });

    it("interleaves units and weights the nearer exam", () => {
        const input = base({
            minutesPerDay: 120,
            units: [unit("WPH11", "2027-01-10", mixed), unit("WPH12", "2027-02-20", mixed)],
        });
        const tasks = buildPlan(input);
        checkInvariants(input, tasks);
        // In the first two weeks both units appear, the nearer one more often.
        const early = tasks.filter((t) => toDayNumber(t.date) < toDayNumber(TODAY) + 14);
        const a = early.filter((t) => t.unitId === "WPH11").length;
        const b = early.filter((t) => t.unitId === "WPH12").length;
        expect(b).toBeGreaterThan(0);
        expect(a).toBeGreaterThan(b);
        // Both units fully covered.
        const covered = coveredTopicIds(tasks);
        for (const u of input.units) for (const t of u.topics) expect(covered.has(t.id)).toBe(true);
        // Nothing for WPH11 after its exam, but WPH12 continues.
        const after = tasks.filter((t) => toDayNumber(t.date) >= toDayNumber(d("2027-01-10")));
        expect(after.length).toBeGreaterThan(0);
        expect(after.every((t) => t.unitId === "WPH12")).toBe(true);
    });

    it("prioritises the weakest topics when the window is very short", () => {
        const levels: MasteryLevel[] = Array.from({ length: 20 }, (_, i) => (i % 4 === 0 ? "weak" : "strong"));
        const input = base({ units: [unit("WPH11", "2026-11-07", levels)], minutesPerDay: 60, studyDays: ALL_DAYS });
        const tasks = buildPlan(input);
        checkInvariants(input, tasks);
        expect(tasks.length).toBeGreaterThan(0);
        const weakIds = new Set(input.units[0].topics.filter((t) => t.mastery.level === "weak").map((t) => t.id));
        const firstTopics = tasks.filter((t) => t.topicId).slice(0, 4);
        for (const t of firstTopics) expect(weakIds.has(t.topicId!)).toBe(true);
        expect(tasks.some((t) => t.type === "PAST_PAPER")).toBe(true);
    });

    it("plans for a single day before the exam", () => {
        const input = base({ units: [unit("WPH11", "2026-11-03", mixed)], studyDays: ALL_DAYS });
        const tasks = buildPlan(input);
        expect(tasks.length).toBeGreaterThan(0);
        expect(new Set(tasks.map((t) => dayKey(t.date)))).toEqual(new Set(["2026-11-02"]));
    });

    it("does not leave long windows empty, but keeps ahead-of-schedule days lighter", () => {
        const input = base({ units: [unit("WPH11", "2027-06-01", ["weak", "strong", "new"])], minutesPerDay: 120 });
        const tasks = buildPlan(input);
        checkInvariants(input, tasks);
        // Every study day before the final phase has something on it.
        const days = minutesByDay(tasks);
        const finalStart = toDayNumber(d("2027-06-01")) - FINAL_PHASE_DAYS;
        for (let day = toDayNumber(TODAY); day < finalStart; day++) {
            const date = new Date(day * 86_400_000);
            if (!WEEKDAYS.includes(date.getUTCDay())) continue;
            expect(days.get(dayKey(date)) ?? 0).toBeGreaterThan(0);
        }
        // Revisit days use about half the budget.
        const revisitDays = [...new Set(tasks.filter((t) => t.title.startsWith("Revisit")).map((t) => dayKey(t.date)))];
        expect(revisitDays.length).toBeGreaterThan(20);
        const revisitOnly = revisitDays.filter((k) => !tasks.some((t) => dayKey(t.date) === k && t.type === "REVIEW"));
        expect(revisitOnly.length).toBeGreaterThan(10);
        for (const k of revisitOnly) expect(days.get(k)!).toBeLessThanOrEqual(60);
    });

    it("handles units with zero topics (past papers only)", () => {
        const input = base({ units: [{ id: "WPH13", code: "WPH13", examDate: d("2026-12-20"), topics: [] }] });
        const tasks = buildPlan(input);
        checkInvariants(input, tasks);
        expect(tasks.length).toBeGreaterThan(0);
        expect(tasks.every((t) => t.type === "PAST_PAPER")).toBe(true);
    });

    it("starts from today when the start date is in the past", () => {
        const input = base({ startDate: d("2026-10-01") });
        const tasks = buildPlan(input);
        expect(toDayNumber(tasks[0].date)).toBeGreaterThanOrEqual(toDayNumber(TODAY));
    });

    it("starts from a future start date", () => {
        const input = base({ startDate: d("2026-11-16") });
        const tasks = buildPlan(input);
        expect(dayKey(tasks[0].date)).toBe("2026-11-16");
    });

    it("throws clear errors for impossible inputs", () => {
        expect(() => buildPlan(base({ studyDays: [] }))).toThrow(PlannerError);
        expect(() => buildPlan(base({ studyDays: [] }))).toThrow(/study day/);
        expect(() => buildPlan(base({ units: [] }))).toThrow(/at least one unit/);
        expect(() => buildPlan(base({ minutesPerDay: 5 }))).toThrow(/Minutes per day/);
        expect(() => buildPlan(base({ units: [unit("WPH11", "2026-10-01", mixed)] }))).toThrow(/WPH11.*already passed/);
        expect(() => buildPlan(base({ units: [unit("WPH11", "2026-11-02", mixed)] }))).toThrow(/no time left/);
        expect(() => buildPlan(base({ units: [unit("WPH11", "2028-06-01", mixed)] }))).toThrow(/more than a year/);
        // Exam tomorrow (Tuesday) but only studying on Saturdays.
        expect(() => buildPlan(base({ units: [unit("WPH11", "2026-11-03", mixed)], studyDays: [6] }))).toThrow(
            /None of your study days/,
        );
    });

    it("rescheduling skips completed topics and keeps their outstanding reviews", () => {
        const completed = [
            { topicId: "WPH11-t2", type: "LEARN" as const, date: d("2026-10-28") },
            { topicId: "WPH11-t2", type: "PRACTICE" as const, date: d("2026-10-28") },
            { topicId: "WPH11-t3", type: "LEARN" as const, date: d("2026-10-29") },
        ];
        const tasks = buildPlan(base({ completed, studyDays: ALL_DAYS }));
        const t2 = tasks.filter((t) => t.topicId === "WPH11-t2" && toDayNumber(t.date) < toDayNumber(d("2026-12-25")));
        expect(t2.some((t) => t.type === "LEARN" || t.title.startsWith("Practise"))).toBe(false);
        // Review at +3 (Oct 31) is overdue → today; +10 (Nov 7) on time.
        expect(t2.filter((t) => t.type === "REVIEW").map((t) => dayKey(t.date))).toEqual(["2026-11-02", "2026-11-07"]);
        // Learned-but-not-practised topic gets PRACTICE only.
        const t3 = tasks.filter((t) => t.topicId === "WPH11-t3");
        expect(t3.some((t) => t.type === "LEARN")).toBe(false);
        expect(t3.some((t) => t.title.startsWith("Practise"))).toBe(true);
    });

    it("honours minutes already used today", () => {
        const input = base({ usedMinutes: { "2026-11-02": 70 } });
        const today = buildPlan(input).filter((t) => dayKey(t.date) === "2026-11-02");
        expect(today.reduce((s, t) => s + t.minutes, 0)).toBeLessThanOrEqual(20);
    });

    it("never schedules the same topic twice on one day", () => {
        const input = base({ minutesPerDay: 240, studyDays: ALL_DAYS, units: [unit("WPH11", "2026-12-01", ["weak", "new"])] });
        const tasks = buildPlan(input);
        const seen = new Set<string>();
        for (const t of tasks) {
            if (!t.topicId || t.type === "LEARN") continue;
            const key = `${dayKey(t.date)}:${t.topicId}:${t.type}`;
            expect(seen.has(key)).toBe(false);
            seen.add(key);
        }
    });
});
