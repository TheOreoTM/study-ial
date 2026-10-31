// Community plans: a shared plan is a template (units, pace, length, task mix), never the author's progress.
// Pure helpers (unit-tested); DB access lives in lib/queries/community-plans.ts and app/(app)/plans/actions.ts.

export const TASK_TYPES = ["LEARN", "PRACTICE", "REVIEW", "PAST_PAPER"] as const;
export type TaskTypeName = (typeof TASK_TYPES)[number];

export const TASK_TYPE_LABEL: Record<TaskTypeName, string> = {
    LEARN: "Learn",
    PRACTICE: "Practice",
    REVIEW: "Review",
    PAST_PAPER: "Past paper",
};

const DAY = 86_400_000;
/** Day numbers for `@db.Date`-style dates (UTC midnight of a local day). */
const dayNumber = (d: Date) => Math.floor(d.getTime() / DAY);

export type TemplateWeek = { week: number; counts: Record<TaskTypeName, number>; minutes: number; units: string[] };

export type PlanTemplate = {
    weeks: number;
    taskCount: number;
    mix: Record<TaskTypeName, number>;
    /** Week-by-week outline from the plan's start (week 1 = its first 7 days) */
    outline: TemplateWeek[];
};

/** Calendar weeks a plan spans, counting its start and exam days. */
export function planWeeks(startDate: Date, examDate: Date) {
    return Math.max(1, Math.ceil((dayNumber(examDate) - dayNumber(startDate) + 1) / 7));
}

const emptyCounts = (): Record<TaskTypeName, number> => ({ LEARN: 0, PRACTICE: 0, REVIEW: 0, PAST_PAPER: 0 });

/** The shareable shape of a plan. Task status, notes and titles are deliberately not part of it. */
export function planTemplate(plan: {
    startDate: Date;
    examDate: Date;
    tasks: { date: Date; type: TaskTypeName; minutes: number; unitCode: string | null }[];
}): PlanTemplate {
    const start = dayNumber(plan.startDate);
    const weeks = planWeeks(plan.startDate, plan.examDate);
    const mix = emptyCounts();
    const outline: TemplateWeek[] = Array.from({ length: weeks }, (_, i) => ({
        week: i + 1,
        counts: emptyCounts(),
        minutes: 0,
        units: [],
    }));
    for (const t of plan.tasks) {
        mix[t.type]++;
        const i = Math.min(weeks - 1, Math.max(0, Math.floor((dayNumber(t.date) - start) / 7)));
        const w = outline[i];
        w.counts[t.type]++;
        w.minutes += t.minutes;
        if (t.unitCode && !w.units.includes(t.unitCode)) w.units.push(t.unitCode);
    }
    for (const w of outline) w.units.sort();
    return { weeks, taskCount: plan.tasks.length, mix, outline };
}

/** Shortest runway a cloned plan gets for a unit without an upcoming exam date. */
export const MIN_CLONE_DAYS = 14;

/**
 * Exam dates for a clone, starting `today`: the student's own upcoming exam date for each unit when they have one,
 * otherwise the template's own runway for that unit (its exam date minus the plan's start), at least MIN_CLONE_DAYS.
 */
export function cloneExamDates(
    template: { startDate: Date; units: { unitId: string; examDate: Date }[] },
    studentDates: Map<string, Date | null>,
    today: Date,
): { unitId: string; examDate: Date }[] {
    const t = dayNumber(today);
    const start = dayNumber(template.startDate);
    return template.units.map((u) => {
        const own = studentDates.get(u.unitId);
        if (own && dayNumber(own) >= t) return { unitId: u.unitId, examDate: own };
        const runway = Math.max(MIN_CLONE_DAYS, dayNumber(u.examDate) - start);
        return { unitId: u.unitId, examDate: new Date((t + runway) * DAY) };
    });
}
