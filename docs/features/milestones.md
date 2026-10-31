# Milestones

## User problem
Progress in revision is slow and easy to miss. A student who has turned a weak topic into a strong one deserves to
notice it, and to be pointed at what to do next. They don't need points, levels or a streak that guilt-trips them.

## Principles (why not "gamification")
"Calm under exam pressure" rules out XP, levels, leaderboards, confetti, loss-framed streak warnings and badges for
raw volume ("answer 500 questions"). Every milestone here must:
1. mark something that is **actually useful for the exam** (mastery or steady habits);
2. come from the student's **own marks or activity**, recomputed honestly (Honest progress);
3. **point to the next useful thing** when it's shown.

## The set (rules are pure functions in `lib/milestones.ts`)
| key | title | rule |
|---|---|---|
| `first-answer` | First answer | ≥ 1 attempt |
| `first-strong` | First strong topic | ≥ 1 topic at level strong |
| `strong-5` | Five strong topics | ≥ 5 strong topics |
| `strong-15` | Fifteen strong topics | ≥ 15 strong topics |
| `turnaround` | Turned it around | a topic whose starting point was weak (its first 3 attempts scored < 0.5, with ≥ 3 attempts since) is now strong |
| `unit-covered` | Every topic tried | every practisable topic in one of your units has ≥ 1 attempt |
| `unit-strong` | Unit secure | every practisable topic in one of your units is strong |
| `steady-week` | A steady week | activity on ≥ 5 of the last 7 local days (any day, not consecutive: missing one day costs nothing) |
| `focus-10h` | Ten focused hours | ≥ 600 focus minutes in total |
| `plan-on-track` | On track | an active plan with every task up to yesterday done or skipped, and ≥ 7 tasks done |

Each milestone is earned once and is never taken away, even if mastery later drops. It records a moment, it isn't a
status.

## Storage
```prisma
model UserMilestone { userId → User (cascade), key String, earnedAt DateTime @default(now()), seenAt DateTime?
  @@id([userId, key]) }
```
A student's first sync with existing history records everything earned so far as already seen (past achievements
aren't news). Milestones already earned skip their queries, and the turnaround check reads only each strong topic's
first three attempts.

Evaluated lazily by `syncMilestones(userId)` when /dashboard or /progress loads: one small set of queries, inserts
newly earned keys with `createMany({ skipDuplicates: true })`.

## UI
- **Dashboard**: when there are unseen milestones, one quiet line above the grid (a tonal panel, not a modal or
  toast): "Milestone: Turned it around: Motion and kinematics is now strong. Next up: Forces." with "Dismiss" (marks
  seen). Only the newest is shown, with "+2 more" linking to /progress#milestones.
- **/progress#milestones**: a grid of all ten. Earned ones show the date, unearned ones show honest progress
  ("3 of 5 strong topics"). Neutral styling, with purple (progress colour) on the earned icon tile. No mastery colours
  (they mean mastery levels only) and no orange.

## Server actions
`dismissMilestones({ upTo })` in `app/(app)/progress/actions.ts`: calls `assertUser()`, validates `upTo` (when the
notice was rendered) with zod, sets `seenAt` on the student's milestones earned up to then (so one earned in another
tab isn't silently dismissed), and revalidates /dashboard and /progress.

## Non-AI fallback
Not applicable (no AI).

## Done means
Rule tests for every milestone, including the edges: strong needs ≥ 3 attempts, turnaround needs earlier evidence,
steady-week counts across the Maldives day boundary, and topics without questions don't block unit milestones.
Screenshots of the dashboard notice and the /progress section, in light/dark at 1440/375.
