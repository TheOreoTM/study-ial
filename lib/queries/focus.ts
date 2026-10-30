import "server-only";
import { db } from "@/lib/db";
import { bucketMinutes, countStreak, dayKey, DEFAULT_TIME_ZONE, lastNDays } from "@/components/focus/stats-math";

export type FocusStats = {
    /** Focus minutes logged today */
    todayMinutes: number;
    /** Oldest first, 7 entries ending today; `date` is "YYYY-MM-DD" */
    last7Days: { date: string; minutes: number }[];
    /** Consecutive days (ending today or yesterday) with any study activity: an Attempt, FocusSession or completed task */
    streakDays: number;
};

const DAY = 86_400_000;
/** How far back we look for the streak. */
const STREAK_LOOKBACK_DAYS = 400;

/**
 * Focus totals and the study streak for the dashboard and /focus. Day boundaries use `timeZone`
 * (Maldives by default, since that's where students are).
 */
export async function getFocusStats(
    userId: string,
    { now = new Date(), timeZone = DEFAULT_TIME_ZONE }: { now?: Date; timeZone?: string } = {},
): Promise<FocusStats> {
    const today = dayKey(now, timeZone);
    const days = lastNDays(today, 7);
    const since = new Date(now.getTime() - 8 * DAY);
    const streakSince = new Date(now.getTime() - STREAK_LOOKBACK_DAYS * DAY);

    const [sessions, activeRows] = await Promise.all([
        db.focusSession.findMany({
            where: { userId, endedAt: { gte: since } },
            select: { endedAt: true, minutes: true },
        }),
        // Distinct local days with any activity. Timestamps are stored as UTC `timestamp without time zone`.
        db.$queryRaw<{ day: string }[]>`
            SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone}, 'YYYY-MM-DD') AS day
              FROM "Attempt" WHERE "userId" = ${userId} AND "createdAt" >= ${streakSince}
            UNION
            SELECT to_char(("endedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone}, 'YYYY-MM-DD')
              FROM "FocusSession" WHERE "userId" = ${userId} AND "endedAt" >= ${streakSince}
            UNION
            SELECT to_char((t."completedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone}, 'YYYY-MM-DD')
              FROM "StudyPlanTask" t JOIN "StudyPlan" p ON p.id = t."planId"
             WHERE p."userId" = ${userId} AND t.status = 'DONE' AND t."completedAt" >= ${streakSince}
        `,
    ]);

    const last7Days = bucketMinutes(sessions, days, timeZone);
    return {
        todayMinutes: last7Days[last7Days.length - 1].minutes,
        last7Days,
        streakDays: countStreak(
            activeRows.map((r) => r.day),
            today,
        ),
    };
}
