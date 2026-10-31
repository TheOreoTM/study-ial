import "server-only";
import { lastNDays } from "@/components/focus/stats-math";
import { db } from "@/lib/db";
import {
    evaluateMilestones,
    isTurnaround,
    TURNAROUND_START,
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
async function gatherFacts(userId: string, now: Date, earned: Set<string>): Promise<MilestoneFacts> {
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

    // Turnaround: among strong topics, the most recently practised one whose first three attempts were weak.
    // Skipped once earned; otherwise only each strong topic's first few attempts are read.
    let turnaround: string | null = null;
    if (strong.length > 0 && !earned.has("turnaround")) {
        const rows = await db.$queryRaw<{ topicId: string; marksAwarded: number; maxMarks: number; createdAt: Date }[]>`
            SELECT "topicId", "marksAwarded", "maxMarks", "createdAt"
              FROM (
                    SELECT q."topicId", a."marksAwarded", a."maxMarks", a."createdAt",
                           ROW_NUMBER() OVER (PARTITION BY q."topicId" ORDER BY a."createdAt" ASC) AS rn
                      FROM "Attempt" a
                      JOIN "Question" q ON q.id = a."questionId"
                     WHERE a."userId" = ${userId} AND q."topicId" = ANY(${strong.map((t) => t.id)})
                   ) ranked
             WHERE rn <= ${TURNAROUND_START}`;
        const firsts = new Map<string, typeof rows>();
        for (const r of rows) firsts.set(r.topicId, [...(firsts.get(r.topicId) ?? []), r]);
        const recent = [...strong].sort(
            (a, b) =>
                (mastery.get(b.id)?.lastPracticedAt?.getTime() ?? 0) -
                (mastery.get(a.id)?.lastPracticedAt?.getTime() ?? 0),
        );
        turnaround =
            recent.find((t) => {
                const m = mastery.get(t.id)!;
                return isTurnaround({ level: m.level, total: m.attempts, firstAttempts: firsts.get(t.id) ?? [] });
            })?.name ?? null;
    }

    const attempts = await db.attempt.count({ where: { userId } });
    const focus = earned.has("focus-10h")
        ? null
        : await db.focusSession.aggregate({ where: { userId }, _sum: { minutes: true } });

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

    const current = earned.has("plan-on-track") ? null : await findCurrentPlan(userId, now);
    let plan: MilestoneFacts["plan"] = null;
    if (current) {
        const today = localDay(now);
        const rows = await db.studyPlanTask.groupBy({
            by: ["status"],
            where: { planId: current.id, OR: [{ status: "DONE" }, { date: { lt: today } }] },
            _count: { _all: true },
        });
        const before = await db.studyPlanTask.groupBy({
            by: ["status"],
            where: { planId: current.id, date: { lt: today } },
            _count: { _all: true },
        });
        const n = (list: typeof rows, status?: string) =>
            list.filter((r) => !status || r.status === status).reduce((sum, r) => sum + r._count._all, 0);
        plan = { done: n(rows, "DONE"), pendingBeforeToday: n(before, "PENDING"), dueBeforeToday: n(before) };
    }

    return {
        attempts,
        strongTopics: strong.length,
        turnaround,
        units,
        activeDaysLast7,
        focusMinutes: focus ? (focus._sum.minutes ?? 0) : 600,
        plan,
    };
}

export type MilestoneView = MilestoneStatus & { earnedAt: Date | null; seenAt: Date | null };

/**
 * Re-evaluates the rules, stores newly earned milestones (once; they're never taken away) and returns every
 * milestone with its stored state. Unseen ones are newest first.
 */
export async function syncMilestones(userId: string, now = new Date()) {
    const stored = await db.userMilestone.findMany({ where: { userId } });
    const have = new Set(stored.map((m) => m.key));
    const statuses = evaluateMilestones(await gatherFacts(userId, now, have));
    const fresh = statuses.filter((m) => m.earned && !have.has(m.key));
    // A first sync for a student with history earns several at once; those are past achievements, not news, so
    // they're recorded as already seen rather than announced.
    const seenAt = stored.length === 0 && fresh.length > 1 ? now : null;
    if (fresh.length) {
        await db.userMilestone.createMany({
            data: fresh.map((m) => ({ userId, key: m.key, detail: m.detail, earnedAt: now, seenAt })),
            skipDuplicates: true,
        });
    }
    const byKey = new Map<string, { earnedAt: Date; seenAt: Date | null; detail: string | null }>(
        stored.map((m) => [m.key, m]),
    );
    for (const m of fresh) byKey.set(m.key, { earnedAt: now, seenAt, detail: m.detail });

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
