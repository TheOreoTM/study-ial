import "server-only";
import { db } from "@/lib/db";
import { minutesBySubject, planPace, topicTrends, windowDays } from "@/lib/analytics";
import { localDayKey } from "@/lib/time";

const DAY = 86_400_000;
export const FOCUS_WINDOW_DAYS = 28;
export const TREND_WEEKS = 6;

/** Everything the /progress analytics panels need, computed in local (Maldives) days. */
export async function getProgressAnalytics(userId: string, now = new Date()) {
    const today = localDayKey(now);
    // A day of slack on each window so the oldest local day is fully covered; the pure helpers trim to local days.
    const focusSince = new Date(now.getTime() - (FOCUS_WINDOW_DAYS + 1) * DAY);
    const attemptsSince = new Date(now.getTime() - (TREND_WEEKS * 7 + 1) * DAY);

    const topicSubject = { select: { unit: { select: { subject: { select: { slug: true, name: true } } } } } };
    const [sessions, attempts, plan] = await Promise.all([
        db.focusSession.findMany({
            where: { userId, endedAt: { gte: focusSince } },
            select: { endedAt: true, minutes: true, topic: topicSubject, task: { select: { topic: topicSubject } } },
        }),
        db.attempt.findMany({
            where: { userId, createdAt: { gte: attemptsSince } },
            select: { createdAt: true, marksAwarded: true, maxMarks: true, question: { select: { topicId: true } } },
        }),
        db.studyPlan.findFirst({
            where: { userId, status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                startDate: true,
                examDate: true,
                tasks: { select: { date: true, status: true, completedAt: true } },
            },
        }),
    ]);

    const focus = minutesBySubject(
        sessions.map((s) => ({
            endedAt: s.endedAt,
            minutes: s.minutes,
            subject: (s.topic ?? s.task?.topic)?.unit.subject ?? null,
        })),
        windowDays(today, FOCUS_WINDOW_DAYS),
    );

    const trends = topicTrends(
        attempts.map((a) => ({ ...a, topicId: a.question.topicId })),
        today,
        TREND_WEEKS,
    );
    const trendTopics = await db.topic.findMany({
        where: { id: { in: trends.map((t) => t.topicId) } },
        select: { id: true, code: true, name: true, unit: { select: { code: true } } },
    });
    const topicById = new Map(trendTopics.map((t) => [t.id, t]));

    return {
        today,
        focus,
        trends: trends.flatMap((t) => {
            const topic = topicById.get(t.topicId);
            return topic ? [{ ...t, topic }] : [];
        }),
        plan: plan
            ? {
                  id: plan.id,
                  title: plan.title,
                  pace: planPace(plan.tasks, { startDate: plan.startDate, examDate: plan.examDate, today }),
              }
            : null,
    };
}

export type ProgressAnalytics = Awaited<ReturnType<typeof getProgressAnalytics>>;
