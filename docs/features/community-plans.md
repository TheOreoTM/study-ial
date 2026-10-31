# Community plans

## User problem
Making a plan from scratch is daunting. "How much a day? Which days? How long before the exam should I start?" Seeing
how other students set up a plan for the same units, and starting from that, gets a hesitant student going.

## Reshaped to fit the product
Plans here are generated from the owner's **own mastery** (weakest topics first). Copying someone else's literal task
list would ignore your weak topics, which breaks "Always point to the next useful thing". So a shared plan is a
**template**: its units, minutes per day, study days, length and task mix. **Cloning it runs the planner on that
template against your own marks and your own exam dates.** You get their rhythm and your priorities.

## Privacy
- Sharing is opt-in per plan and can be undone at any time.
- Public view shows the title, units, minutes per day, study days, length in weeks, task-type mix, a week-by-week
  outline of task types and unit codes, and "Used by N students". It **never** shows the author's name, task progress
  (done/skipped), notes or mastery.
- The share dialog warns that the title becomes public. Admins can unshare any plan.

## Schema changes
`StudyPlan`: `isPublic Boolean @default(false)`, `sharedAt DateTime?`, `clonedFromId String?` (→ StudyPlan,
`onDelete: SetNull`), `@@index([isPublic, sharedAt])`.

## Routes
- `/plans/community`: shared plans (signed-in only), filter chips "For my units" (default) / "All", newest first,
  each card showing units, minutes per day, weeks and uses.
- `/plans/community/[id]`: the template view, with one primary action "Use this plan".
- `/plans/[id]`: owner's share toggle in the plan actions menu.

## Server actions (`app/(app)/plans/actions.ts`)
- `setPlanShared(planId, shared)`: `assertUser`, ownership via `ownPlan`, zod, revalidates `/plans`,
  `/plans/community`, `/plans/[id]`.
- `clonePlan(planId)`: `assertUser`, zod. The source must be `isPublic` (or owned). Units missing from the user's list
  are added (exam date = the student's existing date or the template's length from today). Exam dates come from
  `UserUnit` when set, otherwise today + the template's length. Calls the existing `createPlanForUser` (so the existing
  AI-notes path with its quota and non-AI fallback applies). Sets `clonedFromId` and redirects to the new plan.
- `adminUnsharePlan(planId)`: `assertAdmin`.

## Non-AI fallback
Cloning uses the deterministic planner. The AI plan notes are optional, just as they are today.

## Done means
Pure `templateFromPlan(plan)` (task mix, weekly outline, weeks) is tested, and so is `cloneExamDates` (start/exam date
maths using `localDay`). Share → appears in community → clone as another user → new plan built from that user's
mastery. Screenshots in light/dark at 1440/375.
