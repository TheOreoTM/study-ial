// Exam readiness per unit for the countdown page. Pure functions (unit-tested). No made-up composite score: the page
// shows plain facts (days left, topics strong, mistakes, last mock) and one suggested next step.

import type { Mastery } from "@/lib/mastery";
import { revisionPriority } from "@/lib/mastery";

export type Phase = "passed" | "exam-week" | "final-stretch" | "revision" | "early";

export function phaseFor(daysLeft: number): Phase {
    if (daysLeft < 0) return "passed";
    if (daysLeft <= 7) return "exam-week";
    if (daysLeft <= 21) return "final-stretch";
    if (daysLeft <= 60) return "revision";
    return "early";
}

export const phaseLabel: Record<Phase, string> = {
    passed: "Exam passed",
    "exam-week": "Exam week",
    "final-stretch": "Final stretch",
    revision: "Revision time",
    early: "Plenty of time",
};

export const phaseHint: Record<Phase, string> = {
    passed: "Hope it went well. Update your exam dates in Settings when you know your next session.",
    "exam-week": "Keep it light: redo mistakes and short papers, and sleep well.",
    "final-stretch": "Timed papers and your mistakes matter most now.",
    revision: "Close the gaps: weakest topics first, then a mock paper.",
    early: "Build coverage: try every topic at least once.",
};

export type ReadinessTopic = {
    id: string;
    name: string;
    order: number;
    href: string;
    hasQuestions: boolean;
    mastery: Mastery;
};

export type ReadinessInput = {
    unitId: string;
    daysLeft: number | null;
    topics: ReadinessTopic[];
    openMistakes: number;
    /** Days since the last finished mock paper for this unit, or null if none */
    daysSinceMock: number | null;
    /** Whether the bank can fill a (quick) mock paper for this unit */
    mockAvailable: boolean;
    /** Whether it can fill a full paper; defaults to `mockAvailable` */
    fullMockAvailable?: boolean;
};

export type NextStep = { kind: "start" | "mistakes" | "mock" | "practise" | "full-mock" | "none"; label: string; href: string };

export function coverage(topics: ReadinessTopic[]) {
    const practisable = topics.filter((t) => t.hasQuestions);
    return {
        total: topics.length,
        practisable: practisable.length,
        tried: topics.filter((t) => t.mastery.attempts > 0).length,
        strong: topics.filter((t) => t.mastery.level === "strong").length,
        untried: practisable.filter((t) => t.mastery.attempts === 0).length,
    };
}

/** One suggested next step, in priority order for the phase the student is in. */
export function nextStep(input: ReadinessInput, now = new Date()): NextStep {
    const { unitId, daysLeft, topics, openMistakes, daysSinceMock, mockAvailable } = input;
    const phase = daysLeft === null ? "early" : phaseFor(daysLeft);
    if (phase === "passed") return { kind: "none", label: "Update exam dates", href: "/settings" };

    const practisable = topics.filter((t) => t.hasQuestions);
    if (practisable.length === 0) return { kind: "none", label: "Browse the unit", href: topics[0]?.href ?? "/subjects" };

    const untried = [...practisable].filter((t) => t.mastery.attempts === 0).sort((a, b) => a.order - b.order);
    const late = phase === "exam-week" || phase === "final-stretch";
    const mockDue = mockAvailable && (daysSinceMock === null || daysSinceMock > 7);

    // Early on, coverage first; late on, untried topics still beat mocks but only when few are left.
    if (untried.length > 0 && (!late || untried.length <= 2)) {
        return { kind: "start", label: `Start ${untried[0].name}`, href: `/practice?topic=${untried[0].id}` };
    }
    if (late && mockDue) return { kind: "mock", label: "Sit a timed paper", href: "/mock" };
    if (openMistakes >= (late ? 1 : 5)) {
        return {
            kind: "mistakes",
            label: `Redo ${openMistakes} mistake${openMistakes === 1 ? "" : "s"}`,
            href: `/practice?mode=mistakes&unit=${unitId}`,
        };
    }
    const notStrong = practisable.filter((t) => t.mastery.level !== "strong");
    if (notStrong.length === 0) {
        return (input.fullMockAvailable ?? mockAvailable)
            ? { kind: "full-mock", label: "Sit a full paper", href: "/mock" }
            : mockAvailable
              ? { kind: "mock", label: "Sit a timed paper", href: "/mock" }
            : { kind: "practise", label: "Keep it fresh", href: `/practice?unit=${unitId}` };
    }
    const weakest = [...notStrong].sort((a, b) => revisionPriority(b.mastery, now) - revisionPriority(a.mastery, now))[0];
    if (!late && mockDue && phase === "revision" && coverage(topics).untried === 0 && daysSinceMock === null) {
        return { kind: "mock", label: "Sit your first mock paper", href: "/mock" };
    }
    return { kind: "practise", label: `Practise ${weakest.name}`, href: `/practice?topic=${weakest.id}` };
}
