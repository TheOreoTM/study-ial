import { describe, expect, it } from "vitest";
import type { Mastery } from "./mastery";
import { coverage, nextStep, phaseFor, type ReadinessInput, type ReadinessTopic } from "./readiness";

const now = new Date("2026-11-05T12:00:00Z");
const m = (score: number | null, level: Mastery["level"], attempts = 4): Mastery => ({
    score,
    level,
    attempts: score === null ? 0 : attempts,
    lastPracticedAt: score === null ? null : new Date("2026-11-01T12:00:00Z"),
});
const topic = (id: string, order: number, mastery: Mastery, hasQuestions = true): ReadinessTopic => ({
    id,
    name: `Topic ${id}`,
    order,
    href: `/t/${id}`,
    hasQuestions,
    mastery,
});

function input(over: Partial<ReadinessInput> = {}): ReadinessInput {
    return {
        unitId: "u",
        daysLeft: 90,
        topics: [topic("a", 0, m(0.9, "strong")), topic("b", 1, m(0.4, "weak")), topic("c", 2, m(0.6, "developing"))],
        openMistakes: 0,
        daysSinceMock: null,
        mockAvailable: true,
        ...over,
    };
}

describe("phaseFor", () => {
    it("names the stretch before the exam", () => {
        expect(phaseFor(-1)).toBe("passed");
        expect(phaseFor(0)).toBe("exam-week");
        expect(phaseFor(7)).toBe("exam-week");
        expect(phaseFor(21)).toBe("final-stretch");
        expect(phaseFor(60)).toBe("revision");
        expect(phaseFor(61)).toBe("early");
    });
});

describe("coverage", () => {
    it("counts tried, strong and untried practisable topics", () => {
        const c = coverage([
            topic("a", 0, m(0.9, "strong")),
            topic("b", 1, m(null, "new")),
            topic("c", 2, m(null, "new"), false),
        ]);
        expect(c).toEqual({ total: 3, practisable: 2, tried: 1, strong: 1, untried: 1 });
    });
});

describe("nextStep", () => {
    it("starts untried topics first while there's time, in spec order", () => {
        const step = nextStep(
            input({ topics: [topic("z", 3, m(null, "new")), topic("y", 1, m(null, "new")), topic("a", 0, m(0.2, "weak"))] }),
            now,
        );
        expect(step).toMatchObject({ kind: "start", href: "/practice?topic=y" });
    });

    it("practises the weakest topic once everything is tried", () => {
        expect(nextStep(input(), now)).toMatchObject({ kind: "practise", href: "/practice?topic=b" });
    });

    it("sends you to your mistakes when there are plenty", () => {
        expect(nextStep(input({ openMistakes: 6 }), now)).toMatchObject({
            kind: "mistakes",
            href: "/practice?mode=mistakes&unit=u",
        });
    });

    it("suggests a first mock in revision time once every topic is tried", () => {
        expect(nextStep(input({ daysLeft: 40 }), now)).toMatchObject({ kind: "mock" });
        expect(nextStep(input({ daysLeft: 40, daysSinceMock: 3 }), now)).toMatchObject({ kind: "practise" });
    });

    it("puts timed papers first in the final stretch", () => {
        expect(nextStep(input({ daysLeft: 10, openMistakes: 3 }), now)).toMatchObject({ kind: "mock" });
        expect(nextStep(input({ daysLeft: 10, openMistakes: 3, daysSinceMock: 2 }), now)).toMatchObject({
            kind: "mistakes",
        });
    });

    it("late on, many untried topics give way to papers", () => {
        const topics = [topic("a", 0, m(null, "new")), topic("b", 1, m(null, "new")), topic("c", 2, m(null, "new"))];
        expect(nextStep(input({ daysLeft: 5, topics }), now)).toMatchObject({ kind: "mock" });
        expect(nextStep(input({ daysLeft: 5, topics: topics.slice(0, 2) }), now)).toMatchObject({ kind: "start" });
    });

    it("suggests a full paper when everything is strong", () => {
        const topics = [topic("a", 0, m(0.9, "strong")), topic("b", 1, m(0.8, "strong"))];
        expect(nextStep(input({ topics }), now)).toMatchObject({ kind: "full-mock" });
        expect(nextStep(input({ topics, mockAvailable: false }), now)).toMatchObject({ kind: "practise" });
    });

    it("points to Settings after the exam", () => {
        expect(nextStep(input({ daysLeft: -3 }), now)).toMatchObject({ kind: "none", href: "/settings" });
    });

    it("handles units with no questions yet", () => {
        const topics = [topic("a", 0, m(null, "new"), false)];
        expect(nextStep(input({ topics }), now)).toMatchObject({ kind: "none", href: "/t/a" });
    });

    it("treats a missing exam date like plenty of time", () => {
        expect(nextStep(input({ daysLeft: null, openMistakes: 2 }), now)).toMatchObject({ kind: "practise" });
    });
});
