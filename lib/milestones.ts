// Milestones: a small, calm set of achievements tied to mastery and steady habits (no XP, levels or streak-loss).
// Pure rules (unit-tested); lib/queries/milestones.ts gathers the facts and stores what's been earned.
import { computeMastery, type AttemptLike } from "@/lib/mastery";

export type UnitFacts = {
    code: string;
    name: string;
    /** Topics in the unit with at least one published question */
    practisable: number;
    /** Of those, topics attempted at least once */
    attempted: number;
    /** Of those, topics at mastery level "strong" */
    strong: number;
};

export type MilestoneFacts = {
    attempts: number;
    strongTopics: number;
    /** A topic that was weak on earlier evidence and is strong now, if any */
    turnaround: string | null;
    units: UnitFacts[];
    /** Local days with any study activity among the last 7 (including today) */
    activeDaysLast7: number;
    focusMinutes: number;
    /** The current plan's task counts, if there is one */
    plan: { done: number; pendingBeforeToday: number; dueBeforeToday: number } | null;
};

export type MilestoneKey =
    | "first-answer"
    | "first-strong"
    | "strong-5"
    | "strong-15"
    | "turnaround"
    | "unit-covered"
    | "unit-strong"
    | "steady-week"
    | "focus-10h"
    | "plan-on-track";

export type MilestoneStatus = {
    key: MilestoneKey;
    title: string;
    description: string;
    earned: boolean;
    /** Honest progress towards an unearned milestone */
    progress: { value: number; target: number; label: string } | null;
    /** What earned it (e.g. the topic or unit), when that's useful to show */
    detail: string | null;
};

const progress = (value: number, target: number, label: string) => ({
    value: Math.min(value, target),
    target,
    label,
});

/** Every milestone with whether the facts earn it right now. Earned milestones are kept once stored. */
export function evaluateMilestones(f: MilestoneFacts): MilestoneStatus[] {
    const unitCovered = f.units.find((u) => u.practisable > 0 && u.attempted === u.practisable) ?? null;
    const unitStrong = f.units.find((u) => u.practisable > 0 && u.strong === u.practisable) ?? null;
    const bestCovered = [...f.units]
        .filter((u) => u.practisable > 0)
        .sort((a, b) => b.attempted / b.practisable - a.attempted / a.practisable)[0];
    const bestStrong = [...f.units]
        .filter((u) => u.practisable > 0)
        .sort((a, b) => b.strong / b.practisable - a.strong / a.practisable)[0];
    const planOnTrack = !!f.plan && f.plan.done >= 7 && f.plan.dueBeforeToday > 0 && f.plan.pendingBeforeToday === 0;

    return [
        {
            key: "first-answer",
            title: "First answer",
            description: "You answered your first question. Every mastery score starts here.",
            earned: f.attempts >= 1,
            progress: null,
            detail: null,
        },
        {
            key: "first-strong",
            title: "First strong topic",
            description: "A topic reached Strong: 75% or more on your recent answers.",
            earned: f.strongTopics >= 1,
            progress: null,
            detail: null,
        },
        {
            key: "strong-5",
            title: "Five strong topics",
            description: "Five topics at Strong at the same time.",
            earned: f.strongTopics >= 5,
            progress: progress(f.strongTopics, 5, "strong topics"),
            detail: null,
        },
        {
            key: "strong-15",
            title: "Fifteen strong topics",
            description: "Fifteen topics at Strong at the same time.",
            earned: f.strongTopics >= 15,
            progress: progress(f.strongTopics, 15, "strong topics"),
            detail: null,
        },
        {
            key: "turnaround",
            title: "Turned it around",
            description: "A topic that needed work is now Strong.",
            earned: f.turnaround !== null,
            progress: null,
            detail: f.turnaround,
        },
        {
            key: "unit-covered",
            title: "Every topic tried",
            description: "You've answered questions in every topic of a unit.",
            earned: unitCovered !== null,
            progress:
                !unitCovered && bestCovered
                    ? progress(bestCovered.attempted, bestCovered.practisable, `topics tried in ${bestCovered.code}`)
                    : null,
            detail: unitCovered?.code ?? null,
        },
        {
            key: "unit-strong",
            title: "Unit secure",
            description: "Every topic in a unit is Strong.",
            earned: unitStrong !== null,
            progress:
                !unitStrong && bestStrong
                    ? progress(bestStrong.strong, bestStrong.practisable, `strong topics in ${bestStrong.code}`)
                    : null,
            detail: unitStrong?.code ?? null,
        },
        {
            key: "steady-week",
            title: "A steady week",
            description: "You studied on five of the last seven days. Missing a day doesn't reset anything.",
            earned: f.activeDaysLast7 >= 5,
            progress: progress(f.activeDaysLast7, 5, "days this week"),
            detail: null,
        },
        {
            key: "focus-10h",
            title: "Ten focused hours",
            description: "Ten hours of focus sessions in total.",
            earned: f.focusMinutes >= 600,
            progress: progress(Math.floor(f.focusMinutes / 60), 10, "hours"),
            detail: null,
        },
        {
            key: "plan-on-track",
            title: "On track",
            description: "Seven plan tasks done, with nothing left behind from earlier days.",
            earned: planOnTrack,
            progress: f.plan && !planOnTrack ? progress(f.plan.done, 7, "plan tasks done") : null,
            detail: null,
        },
    ];
}

/** Newer attempts needed after the starting evidence before a turnaround can count. */
export const TURNAROUND_RECENT = 3;
/** How many of the oldest attempts make up the "starting point". */
const TURNAROUND_START = 3;

/**
 * True when a topic is strong now but the student's starting point on it (their first three attempts, with at least
 * TURNAROUND_RECENT newer ones since) was under 50%, i.e. it was weak and they fixed it.
 */
export function isTurnaround(attempts: AttemptLike[]): boolean {
    if (computeMastery(attempts).level !== "strong") return false;
    const oldestFirst = [...attempts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const start = oldestFirst.slice(0, Math.min(TURNAROUND_START, oldestFirst.length - TURNAROUND_RECENT));
    if (start.length < 3) return false;
    const before = computeMastery(start);
    return before.score !== null && before.score < 0.5;
}
