import "server-only";
import { db } from "@/lib/db";
import { planTemplate, planWeeks } from "@/lib/community-plans";

/**
 * Shared plans, newest first. By default only plans that cover at least one of the student's units. Nothing about
 * the author is selected, only whether it's the viewer's own.
 */
export async function listCommunityPlans(userId: string, { all = false }: { all?: boolean } = {}) {
    const plans = await db.studyPlan.findMany({
        where: {
            isPublic: true,
            ...(all ? {} : { units: { some: { unit: { students: { some: { userId } } } } } }),
        },
        orderBy: { sharedAt: "desc" },
        take: 50,
        select: {
            id: true,
            userId: true,
            title: true,
            minutesPerDay: true,
            studyDays: true,
            startDate: true,
            examDate: true,
            units: { select: { unit: { select: { code: true } } }, orderBy: { unit: { order: "asc" } } },
            _count: { select: { tasks: true, clones: true } },
        },
    });
    return plans.map(({ userId: owner, units, _count, ...p }) => ({
        ...p,
        mine: owner === userId,
        unitCodes: units.map((u) => u.unit.code).sort(),
        weeks: planWeeks(p.startDate, p.examDate),
        taskCount: _count.tasks,
        uses: _count.clones,
    }));
}

export type CommunityPlanListItem = Awaited<ReturnType<typeof listCommunityPlans>>[number];

/** One shared plan as a template (or the viewer's own plan, shared or not). */
export async function getCommunityPlan(userId: string, id: string) {
    const plan = await db.studyPlan.findFirst({
        where: { id, OR: [{ isPublic: true }, { userId }] },
        select: {
            id: true,
            userId: true,
            isPublic: true,
            title: true,
            minutesPerDay: true,
            studyDays: true,
            startDate: true,
            examDate: true,
            units: {
                select: { unit: { select: { id: true, code: true, name: true } } },
                orderBy: { unit: { order: "asc" } },
            },
            tasks: {
                select: {
                    date: true,
                    type: true,
                    minutes: true,
                    topic: { select: { unit: { select: { code: true } } } },
                },
            },
            _count: { select: { clones: true } },
        },
    });
    if (!plan) return null;
    const studied = await db.userUnit.findMany({
        where: { userId, unitId: { in: plan.units.map((u) => u.unit.id) } },
        select: { unitId: true },
    });
    const have = new Set(studied.map((u) => u.unitId));
    return {
        id: plan.id,
        mine: plan.userId === userId,
        isPublic: plan.isPublic,
        title: plan.title,
        minutesPerDay: plan.minutesPerDay,
        studyDays: plan.studyDays,
        units: plan.units.map((u) => ({ ...u.unit, studied: have.has(u.unit.id) })),
        uses: plan._count.clones,
        template: planTemplate({
            startDate: plan.startDate,
            examDate: plan.examDate,
            tasks: plan.tasks.map((t) => ({
                date: t.date,
                type: t.type,
                minutes: t.minutes,
                unitCode: t.topic?.unit.code ?? null,
            })),
        }),
    };
}
