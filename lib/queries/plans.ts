import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { fromDayNumber, toDayNumber } from "@/lib/planner";

/** Fields every task view needs, including what's required to build topic/practice links. */
export const planTaskSelect = {
    id: true,
    planId: true,
    date: true,
    order: true,
    type: true,
    title: true,
    notes: true,
    minutes: true,
    status: true,
    topic: {
        select: {
            id: true,
            name: true,
            slug: true,
            unit: { select: { code: true, name: true, subject: { select: { slug: true, name: true } } } },
        },
    },
} satisfies Prisma.StudyPlanTaskSelect;

export type PlanTaskView = Prisma.StudyPlanTaskGetPayload<{ select: typeof planTaskSelect }>;
export type TodayTask = PlanTaskView & { planTitle: string };

/** The current UTC day as a Date at 00:00Z (task dates are stored as whole days). */
export const utcToday = (now = new Date()) => fromDayNumber(toDayNumber(now));

/** Whole days from today until `date` (0 = today, negative = past). */
export const daysUntil = (date: Date, now = new Date()) => toDayNumber(date) - toDayNumber(now);

/** Share of non-skipped tasks that are done, 0–100. */
export function percentDone(done: number, total: number, skipped = 0) {
    const denom = total - skipped;
    return denom > 0 ? Math.round((done / denom) * 100) : total > 0 ? 100 : 0;
}

/** Tasks dated today across the student's ACTIVE plans, nearest exam first. */
export async function getTodayTasks(userId: string, now = new Date()): Promise<TodayTask[]> {
    const tasks = await db.studyPlanTask.findMany({
        where: { date: utcToday(now), plan: { userId, status: "ACTIVE" } },
        select: { ...planTaskSelect, plan: { select: { title: true } } },
        orderBy: [{ plan: { examDate: "asc" } }, { planId: "asc" }, { order: "asc" }],
    });
    return tasks.map(({ plan, ...t }) => ({ ...t, planTitle: plan.title }));
}

export type ActivePlanSummary = {
    id: string;
    title: string;
    examDate: Date;
    daysLeft: number;
    totalTasks: number;
    doneTasks: number;
    skippedTasks: number;
    percentDone: number;
    /** PENDING tasks dated before today. */
    overdueTasks: number;
};

/** The active plan with the soonest upcoming exam (or the newest active plan if all exams have passed). */
export async function getActivePlanSummary(userId: string, now = new Date()): Promise<ActivePlanSummary | null> {
    const today = utcToday(now);
    const plan =
        (await db.studyPlan.findFirst({
            where: { userId, status: "ACTIVE", examDate: { gte: today } },
            orderBy: [{ examDate: "asc" }, { createdAt: "desc" }],
        })) ??
        (await db.studyPlan.findFirst({ where: { userId, status: "ACTIVE" }, orderBy: { createdAt: "desc" } }));
    if (!plan) return null;

    // Sequential on purpose: the dashboard already runs several queries in parallel and the local
    // Prisma dev Postgres drops connections beyond ~5 concurrent ones.
    const counts = await db.studyPlanTask.groupBy({ by: ["status"], where: { planId: plan.id }, _count: { _all: true } });
    const overdueTasks = await db.studyPlanTask.count({ where: { planId: plan.id, status: "PENDING", date: { lt: today } } });
    const count = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
    const totalTasks = counts.reduce((s, c) => s + c._count._all, 0);
    const doneTasks = count("DONE");
    const skippedTasks = count("SKIPPED");

    return {
        id: plan.id,
        title: plan.title,
        examDate: plan.examDate,
        daysLeft: daysUntil(plan.examDate, now),
        totalTasks,
        doneTasks,
        skippedTasks,
        percentDone: percentDone(doneTasks, totalTasks, skippedTasks),
        overdueTasks,
    };
}

export type PlanListItem = Awaited<ReturnType<typeof getPlans>>[number];

/** All of a student's plans (active first, then archived) with progress counts. */
export async function getPlans(userId: string, now = new Date()) {
    const plans = await db.studyPlan.findMany({
        where: { userId },
        orderBy: [{ status: "asc" }, { examDate: "asc" }, { createdAt: "desc" }],
    });
    if (plans.length === 0) return [];
    const today = utcToday(now);
    const [counts, todays] = await Promise.all([
        db.studyPlanTask.groupBy({
            by: ["planId", "status"],
            where: { planId: { in: plans.map((p) => p.id) } },
            _count: { _all: true },
        }),
        db.studyPlanTask.groupBy({
            by: ["planId"],
            where: { planId: { in: plans.map((p) => p.id) }, date: today },
            _sum: { minutes: true },
            _count: { _all: true },
        }),
    ]);

    return plans.map((p) => {
        const mine = counts.filter((c) => c.planId === p.id);
        const n = (s: string) => mine.find((c) => c.status === s)?._count._all ?? 0;
        const totalTasks = mine.reduce((s, c) => s + c._count._all, 0);
        const today = todays.find((t) => t.planId === p.id);
        return {
            ...p,
            totalTasks,
            doneTasks: n("DONE"),
            skippedTasks: n("SKIPPED"),
            percentDone: percentDone(n("DONE"), totalTasks, n("SKIPPED")),
            daysLeft: daysUntil(p.examDate, now),
            todayTasks: today?._count._all ?? 0,
            todayMinutes: today?._sum.minutes ?? 0,
        };
    });
}

/** One plan with all its tasks, or null if it doesn't exist or isn't the student's. */
export async function getPlan(userId: string, planId: string) {
    return db.studyPlan.findFirst({
        where: { id: planId, userId },
        include: { tasks: { select: planTaskSelect, orderBy: [{ date: "asc" }, { order: "asc" }] } },
    });
}

export type PlanDetail = NonNullable<Awaited<ReturnType<typeof getPlan>>>;

/** The student's units for the plan form, in curriculum order, with topic counts and exam dates. */
export async function getPlannableUnits(userId: string) {
    const rows = await db.userUnit.findMany({
        where: { userId },
        include: {
            unit: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                    order: true,
                    subject: { select: { name: true, order: true } },
                    _count: { select: { topics: true } },
                },
            },
        },
    });
    return rows
        .sort((a, b) => a.unit.subject.order - b.unit.subject.order || a.unit.order - b.unit.order)
        .map((r) => ({
            unitId: r.unit.id,
            code: r.unit.code,
            name: r.unit.name,
            subjectName: r.unit.subject.name,
            topicCount: r.unit._count.topics,
            examDate: r.examDate,
        }));
}

export type PlannableUnit = Awaited<ReturnType<typeof getPlannableUnits>>[number];
