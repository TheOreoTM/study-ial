import "server-only";
import { db } from "@/lib/db";
import { buildHeatmap, type DayActivity } from "@/lib/heatmap";
import { APP_TIME_ZONE, localDayKey } from "@/lib/time";

const DAY = 86_400_000;

/** Questions answered and focus minutes per local day, as a heatmap of the last `weeks` weeks. */
export async function getStudyHeatmap(userId: string, { weeks = 26, now = new Date() } = {}) {
    // A week of slack: the grid starts on a Sunday up to six days before `weeks` whole weeks ago.
    const since = new Date(now.getTime() - (weeks * 7 + 8) * DAY);
    const rows = await db.$queryRaw<{ day: string; questions: bigint; minutes: bigint }[]>`
        SELECT day, SUM(questions) AS questions, SUM(minutes) AS minutes FROM (
            SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${APP_TIME_ZONE}, 'YYYY-MM-DD') AS day,
                   1 AS questions, 0 AS minutes
              FROM "Attempt" WHERE "userId" = ${userId} AND "createdAt" >= ${since}
            UNION ALL
            SELECT to_char(("endedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${APP_TIME_ZONE}, 'YYYY-MM-DD'),
                   0, minutes
              FROM "FocusSession" WHERE "userId" = ${userId} AND "endedAt" >= ${since}
        ) a
        GROUP BY day`;
    const activity = new Map<string, DayActivity>(
        rows.map((r) => [r.day, { questions: Number(r.questions), minutes: Number(r.minutes) }]),
    );
    return buildHeatmap(localDayKey(now), activity, weeks);
}
