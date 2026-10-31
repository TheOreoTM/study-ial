import "server-only";
import { db } from "@/lib/db";
import { minutesBySubject, planPace, topicTrends, windowDays } from "@/lib/analytics";
import { findCurrentPlan } from "@/lib/queries/plans";
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
    const [sessions, attempts] = await Promise.all([
        db.focusSession.findMany({
            where: { userId, endedAt: { gte: focusSince } },
            select: { endedAt: true, minutes: true, topic: topicSubject, task: { select: { topic: topicSubject } } },
        }),
        db.attempt.findMany({
            where: { userId, createdAt: { gte: attemptsSince } },
            select: {
                createdAt: true,
                marksAwarded: true,
                maxMarks: true,
                question: {
                    select: {
                        topicId: true,
                        topic: { select: { id: true, code: true, name: true, unit: { select: { code: true } } } },
                    },
                },
            },
        }),
    ]);
    // The same plan the dashboard shows. Sequential: the local dev Postgres drops connections beyond ~5 concurrent.
    const current = await findCurrentPlan(userId, now);
    const plan = current
        ? {
              ...current,
              tasks: await db.studyPlanTask.findMany({
                  where: { planId: current.id },
                  select: { date: true, status: true, completedAt: true },
              }),
          }
        : null;

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
    const topicById = new Map(attempts.map((a) => [a.question.topicId, a.question.topic]));

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
