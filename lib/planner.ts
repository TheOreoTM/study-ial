// Study plan scheduler: a pure, deterministic function from (units, exam dates, mastery, time budget) to a dated
// list of tasks. No DB, no AI, no clock — `today` is an input. All dates are whole UTC days.
//
// Shape of a plan, per unit:
//   • Phase 1 (start → ~3 weeks before the exam): cover every topic, weakest first (spec order breaks ties).
//     New/weak topics get LEARN then PRACTICE; developing topics a longer PRACTICE; strong topics a short PRACTICE.
//     Each topic's first PRACTICE spawns spaced REVIEWs ~3 and ~10 days later.
//     If phase 1 finishes early (long windows) the remaining days get lighter "revisit" sessions that cycle
//     through the topics again, weakest first, rather than leaving gaps or packing every day full.
//   • Final phase (last ~3 weeks, or ~30% of a short window): timed PAST_PAPER sessions every few days,
//     interleaved with exam-style PRACTICE on the weakest topics.
// Several units share each day via smooth weighted round-robin, weighted toward the nearer exam.

import { revisionPriority, type Mastery, type MasteryLevel } from "@/lib/mastery";

export type PlanTaskType = "LEARN" | "PRACTICE" | "REVIEW" | "PAST_PAPER";

export type PlannerTopic = { id: string; name: string; order: number; mastery: Mastery };

export type PlannerUnit = { id: string; code: string; examDate: Date; topics: PlannerTopic[] };

/** Work already done in an existing plan (used when rescheduling). */
export type CompletedWork = { topicId: string; type: PlanTaskType; date: Date };

export type PlannerInput = {
    startDate: Date;
    /** "Now" for the planner: nothing is scheduled before this day. */
    today: Date;
    units: PlannerUnit[];
    minutesPerDay: number;
    /** Days of the week to study, 0 = Sunday … 6 = Saturday (UTC). */
    studyDays: number[];
    /** Already-completed tasks: covered topics are not re-taught; their outstanding reviews are kept. */
    completed?: CompletedWork[];
    /** Minutes already used on given days, keyed YYYY-MM-DD (e.g. tasks ticked off earlier today). */
    usedMinutes?: Record<string, number>;
};

export type PlannedTask = {
    date: Date;
    /** Position within the day, from 0. */
    order: number;
    type: PlanTaskType;
    topicId: string | null;
    unitId: string;
    title: string;
    minutes: number;
};

export class PlannerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PlannerError";
    }
}

// ─── Tunables ────────────────────────────────────────────────────────────────

export const MIN_MINUTES_PER_DAY = 20;
export const MAX_MINUTES_PER_DAY = 600;
export const MAX_WINDOW_DAYS = 400;
export const FINAL_PHASE_DAYS = 21;
export const REVIEW_OFFSETS = [3, 10] as const;
export const PAST_PAPER_MINUTES = 90;
/** Minimum days between the starts of two past papers for the same unit. */
export const PAST_PAPER_GAP_DAYS = 3;

/** base = preferred length; min = shortest useful length when squeezing into the end of a day. */
type Duration = { base: number; min: number };
const LEARN: Duration = { base: 40, min: 25 };
const PRACTICE: Duration = { base: 35, min: 20 };
const PRACTICE_DEVELOPING: Duration = { base: 40, min: 20 };
const PRACTICE_STRONG: Duration = { base: 25, min: 20 };
const REVIEW: Duration = { base: 20, min: 15 };
const DRILL: Duration = { base: 35, min: 20 };
const REVISIT: Duration = { base: 30, min: 20 };

// ─── Date helpers (UTC day numbers) ─────────────────────────────────────────

const DAY_MS = 86_400_000;
export const toDayNumber = (d: Date) => Math.floor(d.getTime() / DAY_MS);
export const fromDayNumber = (n: number) => new Date(n * DAY_MS);
/** YYYY-MM-DD for a date's UTC day. */
export const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const weekday = (day: number) => fromDayNumber(day).getUTCDay();
const fmt = (day: number) =>
    fromDayNumber(day).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// ─── Internal state ─────────────────────────────────────────────────────────

type WorkItem = { type: "LEARN" | "PRACTICE"; topic: PlannerTopic; duration: Duration; title: string };

type UnitState = {
    unit: PlannerUnit;
    index: number;
    examDay: number;
    finalStart: number;
    queue: WorkItem[];
    ranked: PlannerTopic[];
    weakest: PlannerTopic[];
    drillIdx: number;
    revisitIdx: number;
    lastPaperDay: number | null;
    papers: number;
    paperParts: { part: number; total: number; minutes: number; n: number }[];
    credit: number;
};

type PendingReview = { unit: UnitState; topic: PlannerTopic; due: number };

function practiceDuration(level: MasteryLevel): Duration {
    if (level === "strong") return PRACTICE_STRONG;
    if (level === "developing") return PRACTICE_DEVELOPING;
    return PRACTICE;
}

/** Splits a past paper into near-equal parts no longer than a day's budget. */
function paperSplit(minutesPerDay: number): number[] {
    if (minutesPerDay >= PAST_PAPER_MINUTES) return [PAST_PAPER_MINUTES];
    const parts = Math.ceil(PAST_PAPER_MINUTES / minutesPerDay);
    const size = Math.ceil(PAST_PAPER_MINUTES / parts);
    return Array.from({ length: parts }, (_, i) => (i < parts - 1 ? size : PAST_PAPER_MINUTES - size * (parts - 1)));
}

// ─── Scheduler ──────────────────────────────────────────────────────────────

export function buildPlan(input: PlannerInput): PlannedTask[] {
    const { minutesPerDay } = input;
    if (!Number.isFinite(minutesPerDay) || minutesPerDay < MIN_MINUTES_PER_DAY || minutesPerDay > MAX_MINUTES_PER_DAY)
        throw new PlannerError(
            `Minutes per day must be between ${MIN_MINUTES_PER_DAY} and ${MAX_MINUTES_PER_DAY}.`,
        );
    const studyDays = new Set(input.studyDays.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6));
    if (studyDays.size === 0) throw new PlannerError("Pick at least one study day.");
    if (input.units.length === 0) throw new PlannerError("Choose at least one unit.");

    const startDay = Math.max(toDayNumber(input.startDate), toDayNumber(input.today));
    const now = fromDayNumber(toDayNumber(input.today));

    // Completed work, per topic.
    const done = new Map<string, { learned: boolean; practicedDay: number | null; reviews: number }>();
    for (const c of input.completed ?? []) {
        const d = done.get(c.topicId) ?? { learned: false, practicedDay: null, reviews: 0 };
        const day = toDayNumber(c.date);
        if (c.type === "LEARN") d.learned = true;
        if (c.type === "PRACTICE") d.practicedDay = d.practicedDay === null ? day : Math.min(d.practicedDay, day);
        if (c.type === "REVIEW") d.reviews++;
        done.set(c.topicId, d);
    }

    const reviews: PendingReview[] = [];

    const units: UnitState[] = input.units.map((unit, index) => {
        const examDay = toDayNumber(unit.examDate);
        if (examDay < startDay)
            throw new PlannerError(`The ${unit.code} exam date (${fmt(examDay)}) has already passed. Update it first.`);
        if (examDay === startDay)
            throw new PlannerError(`The ${unit.code} exam is on ${fmt(examDay)}, so there's no time left to plan for it.`);
        if (examDay - startDay > MAX_WINDOW_DAYS)
            throw new PlannerError(`The ${unit.code} exam is more than a year away. Plan closer to the date.`);

        const window = examDay - startDay;
        const finalLen = Math.min(FINAL_PHASE_DAYS, Math.max(1, Math.floor(window * 0.3)));

        // Weakest first; spec order breaks ties (priorities compared with a small tolerance).
        const ranked = [...unit.topics].sort((a, b) => {
            const diff = revisionPriority(b.mastery, now) - revisionPriority(a.mastery, now);
            return Math.abs(diff) > 1e-9 ? diff : a.order - b.order;
        });

        const state: UnitState = {
            unit,
            index,
            examDay,
            finalStart: examDay - finalLen,
            queue: [],
            ranked,
            weakest: ranked.slice(0, Math.max(3, Math.ceil(ranked.length / 2))),
            drillIdx: 0,
            revisitIdx: 0,
            lastPaperDay: null,
            papers: 0,
            paperParts: [],
            credit: 0,
        };

        for (const topic of ranked) {
            const prior = done.get(topic.id);
            if (prior?.practicedDay != null) {
                // Already practised in this plan: keep its outstanding spaced reviews only.
                for (const offset of REVIEW_OFFSETS.slice(prior.reviews)) {
                    const due = Math.max(prior.practicedDay + offset, startDay);
                    if (due < examDay) reviews.push({ unit: state, topic, due });
                }
                continue;
            }
            const level = topic.mastery.level;
            if ((level === "new" || level === "weak") && !prior?.learned)
                state.queue.push({ type: "LEARN", topic, duration: LEARN, title: `Learn: ${topic.name}` });
            state.queue.push({
                type: "PRACTICE",
                topic,
                duration: practiceDuration(level),
                title: `Practise: ${topic.name}`,
            });
        }
        return state;
    });

    const lastExam = Math.max(...units.map((u) => u.examDay));
    const tasks: PlannedTask[] = [];
    const paperParts = paperSplit(minutesPerDay);
    const reviewBudget = Math.max(REVIEW.base, Math.floor(minutesPerDay / 2));
    const revisitBudget = Math.max(REVISIT.base, Math.ceil(minutesPerDay / 2));
    let anyStudyDay = false;

    for (let day = startDay; day < lastExam; day++) {
        if (!studyDays.has(weekday(day))) continue;
        const active = units.filter((u) => day < u.examDay);
        if (active.length === 0) continue;
        anyStudyDay = true;

        const date = fromDayNumber(day);
        let cap = Math.max(0, minutesPerDay - (input.usedMinutes?.[dayKey(date)] ?? 0));
        const dayTasks: PlannedTask[] = [];
        const topicsToday = new Set<string>();

        const add = (u: UnitState, type: PlanTaskType, topic: PlannerTopic | null, title: string, minutes: number) => {
            dayTasks.push({ date, order: dayTasks.length, type, topicId: topic?.id ?? null, unitId: u.unit.id, title, minutes });
            if (topic) topicsToday.add(topic.id);
            cap -= minutes;
        };
        const fits = (d: Duration) => cap >= d.min;
        const take = (d: Duration) => Math.min(d.base, cap);

        // 1. Continue a past paper that was split across days.
        for (const u of active) {
            const next = u.paperParts[0];
            if (next && cap >= next.minutes) {
                u.paperParts.shift();
                add(u, "PAST_PAPER", null, `${u.unit.code} past paper #${next.n} (part ${next.part} of ${next.total})`, next.minutes);
            }
        }

        // 2. Start a past paper for units in their final phase (nearest exam first).
        for (const u of [...active].sort((a, b) => a.examDay - b.examDay || a.index - b.index)) {
            if (day < u.finalStart || u.paperParts.length > 0) continue;
            if (u.lastPaperDay !== null && day - u.lastPaperDay < PAST_PAPER_GAP_DAYS) continue;
            if (cap < paperParts[0]) continue;
            u.papers++;
            u.lastPaperDay = day;
            if (paperParts.length === 1) {
                add(u, "PAST_PAPER", null, `${u.unit.code} timed past paper #${u.papers}`, paperParts[0]);
            } else {
                const total = paperParts.length;
                add(u, "PAST_PAPER", null, `${u.unit.code} past paper #${u.papers} (part 1 of ${total})`, paperParts[0]);
                u.paperParts = paperParts.slice(1).map((minutes, i) => ({ part: i + 2, total, minutes, n: u.papers }));
            }
        }

        // 3. Spaced reviews that are due (oldest first), using at most about half the day.
        let reviewMinutes = 0;
        const due = reviews
            .filter((r) => r.due <= day && day < r.unit.examDay)
            .sort((a, b) => a.due - b.due || a.unit.examDay - b.unit.examDay || a.topic.order - b.topic.order);
        for (const r of due) {
            if (!fits(REVIEW) || reviewMinutes >= reviewBudget || topicsToday.has(r.topic.id)) continue;
            const minutes = take(REVIEW);
            add(r.unit, "REVIEW", r.topic, `Review: ${r.topic.name}`, minutes);
            reviewMinutes += minutes;
            reviews.splice(reviews.indexOf(r), 1);
        }
        // Reviews whose exam has passed can never be scheduled.
        for (let i = reviews.length - 1; i >= 0; i--) if (reviews[i].due >= reviews[i].unit.examDay) reviews.splice(i, 1);

        // 4. Main work, shared between units by smooth weighted round-robin. A unit that has finished phase 1
        //    early offers lighter "revisit" sessions (low weight, only until about half the day is used) so that
        //    long windows get a calm cycle of re-practice instead of empty or over-packed days.
        const dayMinutes = () => dayTasks.reduce((s, t) => s + t.minutes, 0);
        const rotate = (list: PlannerTopic[], from: number) =>
            Array.from({ length: list.length }, (_, i) => list[(from + i) % list.length]).find((t) => !topicsToday.has(t.id));

        const nextItem = (u: UnitState): (WorkItem & { kind: "queue" | "drill" | "revisit" }) | null => {
            if (day >= u.finalStart) {
                // Final phase: exam-style practice rotating through the weakest topics.
                const topic = rotate(u.weakest, u.drillIdx);
                return topic
                    ? { kind: "drill", type: "PRACTICE", topic, duration: DRILL, title: `Exam-style practice: ${topic.name}` }
                    : null;
            }
            if (u.queue.length > 0) return { kind: "queue", ...u.queue[0] };
            if (dayMinutes() >= revisitBudget) return null;
            const topic = rotate(u.ranked, u.revisitIdx);
            return topic
                ? { kind: "revisit", type: "PRACTICE", topic, duration: REVISIT, title: `Revisit: ${topic.name}` }
                : null;
        };

        for (;;) {
            const candidates = active.flatMap((u) => {
                const item = nextItem(u);
                return item && fits(item.duration) ? [{ u, item }] : [];
            });
            if (candidates.length === 0) break;

            let total = 0;
            for (const c of candidates) {
                const phase = c.item.kind === "drill" ? 2 : c.item.kind === "revisit" ? 0.5 : 1;
                const weight = phase / Math.max(1, c.u.examDay - day);
                c.u.credit += weight;
                total += weight;
            }
            const pick = candidates.reduce((best, c) =>
                c.u.credit > best.u.credit + 1e-12 ||
                (Math.abs(c.u.credit - best.u.credit) <= 1e-12 && c.u.examDay < best.u.examDay)
                    ? c
                    : best,
            );
            pick.u.credit -= total;

            const { u, item } = pick;
            if (item.kind === "drill") u.drillIdx = (u.weakest.indexOf(item.topic) + 1) % u.weakest.length;
            else if (item.kind === "revisit") u.revisitIdx = (u.ranked.indexOf(item.topic) + 1) % u.ranked.length;
            else u.queue.shift();
            add(u, item.type, item.topic, item.title, take(item.duration));

            if (item.kind === "queue" && item.type === "PRACTICE") {
                for (const offset of REVIEW_OFFSETS) {
                    if (day + offset < u.examDay) reviews.push({ unit: u, topic: item.topic, due: day + offset });
                }
            }
        }

        tasks.push(...dayTasks);
    }

    if (!anyStudyDay) {
        throw new PlannerError("None of your study days fall before the exam. Add more study days or move the start date.");
    }
    return tasks;
}

/** Topic ids from `units` that get at least one LEARN or PRACTICE task in `tasks`. */
export function coveredTopicIds(tasks: PlannedTask[]): Set<string> {
    return new Set(tasks.filter((t) => t.topicId && (t.type === "LEARN" || t.type === "PRACTICE")).map((t) => t.topicId!));
}
