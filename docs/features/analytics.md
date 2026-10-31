# Analytics on /progress

## User problem
"Am I actually improving, and am I on track for the exam?" Mastery tells a student where they stand today. It doesn't
show whether a topic is trending up, where their study time actually goes, or whether their plan is keeping pace with
the exam date.

## What it shows (three panels, added to /progress below the totals)
1. **Time per subject**: focus minutes over the last 28 local days, per subject, from `FocusSession` (topic, or the
   linked plan task's topic). Minutes with no topic show as "Not linked to a topic". Horizontal bars in the progress
   colour (purple), with values as text so it's readable without colour.
2. **Accuracy trend per topic**: for the topics practised in the last 6 local weeks, weekly accuracy (marks ÷ max
   marks), drawn as a small line per topic, plus the change from the first to the last week that has data. Sorted with
   the topics that are slipping first, since those are the next useful thing.
3. **Plan pace**: for the active plan, tasks finished vs tasks scheduled up to today (expected), and days left to the
   exam. Drawn as a cumulative line chart from plan start to exam date (scheduled vs done), with a plain sentence
   ("3 tasks behind, 24 days to go") and a "Reschedule missed tasks" link when behind.

All day/week bucketing uses `lib/time.ts` (`localDayKey`) and the `addDays`/`lastNDays` helpers; weeks are 7-day
windows ending today (not calendar weeks), so "this week" always includes today.

## Connection to mastery and the dashboard
Analytics never invents a score. Accuracy is raw marks per week, labelled as such. Mastery stays the recency-weighted
level. The slipping-topics ordering and the plan-pace "behind" sentence both end in a link to practise or reschedule.
The dashboard doesn't change (it stays focused on today).

## Schema changes
None.

## Code
- `lib/analytics.ts` (pure, tested): `minutesBySubject`, `weeklyAccuracy`, `accuracyTrend`, `planPace`.
- `lib/queries/analytics.ts` (server-only): fetches the 28-day focus sessions with topic → unit → subject, attempts
  over the last 42 days with topic, and the active plan's tasks.
- `components/analytics/*`: small inline-SVG charts (no chart library). They use token colours, have `role="img"` and
  an `aria-label`, and include a visually hidden data table.

## Non-AI fallback
Not applicable (no AI).

## Done means
- Tests for bucketing across the Maldives day boundary (a 23:30 UTC attempt counts on the next local day), empty data,
  weeks with no attempts (gaps, not zeros), and plan pace before start, mid-plan and after the exam.
- /progress renders with and without each data source; screenshots in light/dark at 1440/375.
