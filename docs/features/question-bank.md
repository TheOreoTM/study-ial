# Question bank: Chemistry, Biology, Mathematics, Further Mathematics

## User problem
Only Physics has questions (114). A Chemistry, Biology or Maths student who picks their units sees "Questions coming
soon" on every topic. Their dashboard has no weak topics to show, so the core loop never starts.

## Connection to mastery and the dashboard
Mastery comes only from attempts on published questions, and the dashboard's "Revise next" only lists topics that have
published questions (`practisable` in `app/(app)/dashboard/page.tsx`). Every topic needs at least one MCQ and one
written question before it can produce an honest mastery score. Once an admin publishes a topic's drafts, it joins
weak-topic practice, plans and the dashboard automatically. No code path changes are needed for that.

## Content
- Files: `prisma/seed-data/questions/{chemistry,biology,mathematics-pure,mathematics-applied,further-mathematics}.ts`,
  in the same `SeedQuestion` format and house style as `questions/physics.ts`.
- Coverage over volume: **at least 2 per topic** (1 MCQ + 1 SHORT/CALCULATION, with mark schemes and explanations)
  across all 141 topics in these subjects. Practical units (WCH13/16, WBI13/16) get practical-skills questions.
- All original; no Pearson past-paper text.

## Schema changes
None. `SeedQuestion` gains an optional `status` ("DRAFT" | "PUBLISHED", default PUBLISHED for the existing Physics bank).

## Seed behaviour (the review gate)
- New questions are **created as DRAFT**. The seed never publishes them.
- On re-seed, a DRAFT seed question is only updated while it is still DRAFT in the DB. Once an admin publishes it (or
  edits and publishes it), the DB copy is the source of truth and the seed leaves it alone. This keeps an admin's
  corrections and decisions from being silently overwritten.
- Physics keeps its current behaviour.

## Routes
None new. Review happens in the existing `/admin` (draft counts per unit/topic) and `/admin/questions` (filter by
status, edit, publish).

## Non-AI fallback
Not applicable: the content is static seed data and needs no AI at runtime.

## Done means
- `prisma/seed-data/seed-data.test.ts` passes: unique keys, real topics, every question passes the admin editor's
  `checkQuestion` rules, and every non-Physics question is DRAFT.
- Every Chemistry/Biology/Maths/Further Maths topic has ≥ 2 questions.
- `pnpm db:seed` runs cleanly and `/admin` shows the drafts. Practice and the dashboard still show only published
  questions.
