import "server-only";
import { lastNDays } from "@/components/focus/stats-math";
import { db } from "@/lib/db";
import {
    evaluateMilestones,
    isTurnaround,
    type MilestoneFacts,
    type MilestoneKey,
    type MilestoneStatus,
} from "@/lib/milestones";
import { getQuestionCounts } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { findCurrentPlan } from "@/lib/queries/plans";
import { APP_TIME_ZONE, localDay, localDayKey } from "@/lib/time";

const DAY = 86_400_000;

/** Gathers what the milestone rules need. Queries run one after another (the dashboard already runs several). */
async function gatherFacts(userId: string, now: Date): Promise<MilestoneFacts> {
    const userUnits = await db.userUnit.findMany({
        where: { userId },
        select: { unit: { select: { code: true, name: true, topics: { select: { id: true, name: true } } } } },
    });
    const topics = userUnits.flatMap((uu) => uu.unit.topics);
    const topicIds = topics.map((t) => t.id);
    const mastery = await getTopicMastery(userId, topicIds);
    const questionCounts = await getQuestionCounts(topicIds);

    const units = userUnits.map(({ unit }) => {
        const practisable = unit.topics.filter((t) => (questionCounts.get(t.id) ?? 0) > 0);
        return {
            code: unit.code,
            name: unit.name,
            practisable: practisable.length,
            attempted: practisable.filter((t) => (mastery.get(t.id)?.attempts ?? 0) > 0).length,
            strong: practisable.filter((t) => mastery.get(t.id)?.level === "strong").length,
        };
    });
    const strong = topics.filter((t) => mastery.get(t.id)?.level === "strong");

    // Turnaround: among strong topics, the most recently practised one whose starting point was weak.
    let turnaround: string | null = null;
    if (strong.length > 0) {
        const rows = await db.attempt.findMany({
            where: { userId, question: { topicId: { in: strong.map((t) => t.id) } } },
            select: { marksAwarded: true, maxMarks: true, createdAt: true, question: { select: { topicId: true } } },
            orderBy: { createdAt: "asc" },
            take: 5000,
        });
        const byTopic = new Map<string, typeof rows>();
        for (const r of rows) byTopic.set(r.question.topicId, [...(byTopic.get(r.question.topicId) ?? []), r]);
        const recent = [...strong].sort(
            (a, b) =>
                (mastery.get(b.id)?.lastPracticedAt?.getTime() ?? 0) -
                (mastery.get(a.id)?.lastPracticedAt?.getTime() ?? 0),
        );
        turnaround = recent.find((t) => isTurnaround(byTopic.get(t.id) ?? []))?.name ?? null;
    }

    const attempts = await db.attempt.count({ where: { userId } });
    const focus = await db.focusSession.aggregate({ where: { userId }, _sum: { minutes: true } });

    // Distinct local days with any activity in the last week (same sources as the streak).
    const since = new Date(now.getTime() - 8 * DAY);
    const days = await db.$queryRaw<{ day: string }[]>`
        SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${APP_TIME_ZONE}, 'YYYY-MM-DD') AS day
          FROM "Attempt" WHERE "userId" = ${userId} AND "createdAt" >= ${since}
        UNION
        SELECT to_char(("endedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${APP_TIME_ZONE}, 'YYYY-MM-DD')
          FROM "FocusSession" WHERE "userId" = ${userId} AND "endedAt" >= ${since}
        UNION
        SELECT to_char((t."completedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${APP_TIME_ZONE}, 'YYYY-MM-DD')
          FROM "StudyPlanTask" t JOIN "StudyPlan" p ON p.id = t."planId"
         WHERE p."userId" = ${userId} AND t.status = 'DONE' AND t."completedAt" >= ${since}`;
    const week = new Set(lastNDays(localDayKey(now), 7));
    const activeDaysLast7 = days.filter((d) => week.has(d.day)).length;

    const current = await findCurrentPlan(userId, now);
    let plan: MilestoneFacts["plan"] = null;
    if (current) {
        const today = localDay(now);
        const [done, pendingBeforeToday, dueBeforeToday] = [
            await db.studyPlanTask.count({ where: { planId: current.id, status: "DONE" } }),
            await db.studyPlanTask.count({ where: { planId: current.id, status: "PENDING", date: { lt: today } } }),
            await db.studyPlanTask.count({ where: { planId: current.id, date: { lt: today } } }),
        ];
        plan = { done, pendingBeforeToday, dueBeforeToday };
    }

    return {
        attempts,
        strongTopics: strong.length,
        turnaround,
        units,
        activeDaysLast7,
        focusMinutes: focus._sum.minutes ?? 0,
        plan,
    };
}

export type MilestoneView = MilestoneStatus & { earnedAt: Date | null; seenAt: Date | null };

/**
 * Re-evaluates the rules, stores newly earned milestones (once; they're never taken away) and returns every
 * milestone with its stored state. Unseen ones are newest first.
 */
export async function syncMilestones(userId: string, now = new Date()) {
    const statuses = evaluateMilestones(await gatherFacts(userId, now));
    const stored = await db.userMilestone.findMany({ where: { userId } });
    const have = new Set(stored.map((m) => m.key));
    const fresh = statuses.filter((m) => m.earned && !have.has(m.key));
    if (fresh.length) {
        await db.userMilestone.createMany({
            data: fresh.map((m) => ({ userId, key: m.key, detail: m.detail, earnedAt: now })),
            skipDuplicates: true,
        });
    }
    const byKey = new Map<string, { earnedAt: Date; seenAt: Date | null; detail: string | null }>(
        stored.map((m) => [m.key, m]),
    );
    for (const m of fresh) byKey.set(m.key, { earnedAt: now, seenAt: null, detail: m.detail });

    const milestones: MilestoneView[] = statuses.map((m) => {
        const s = byKey.get(m.key as MilestoneKey);
        return s
            ? {
                  ...m,
                  earned: true,
                  progress: null,
                  detail: s.detail ?? m.detail,
                  earnedAt: s.earnedAt,
                  seenAt: s.seenAt,
              }
            : { ...m, earnedAt: null, seenAt: null };
    });
    const unseen = milestones
        .filter((m) => m.earnedAt && !m.seenAt)
        .sort((a, b) => b.earnedAt!.getTime() - a.earnedAt!.getTime());
    return { milestones, unseen };
}
