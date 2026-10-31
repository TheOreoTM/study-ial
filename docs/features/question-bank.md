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
`SeedTombstone` (see below). `SeedQuestion` gains an optional `status` ("DRAFT" | "PUBLISHED", default PUBLISHED for the existing Physics bank).

## Seed behaviour (the review gate)
- New questions are **created as DRAFT**. The seed never publishes them.
- Once a seeded draft exists in the DB it belongs to the admins: re-seeding **never overwrites it**, published or not,
  so their edits survive. `SEED_REFRESH_DRAFTS=1 pnpm db:seed` deliberately rewrites seeded content that is *still a
  draft* (e.g. after fixing a mistake in the seed files).
- Deleting a seeded question (or shared flashcard) in admin records a `SeedTombstone`, so the seed doesn't bring it
  back.
- MCQ options are synced exactly (stale labels are removed), inside a transaction per question.
- Physics keeps being refreshed from its seed file, but the seed no longer re-publishes a question an admin unpublished.

**Schema:** `SeedTombstone { seedKey @id, deletedAt }`.

## Routes
None new. Review happens in the existing `/admin` (draft counts per unit/topic) and `/admin/questions` (filter by
status, edit, publish).

## Non-AI fallback
Not applicable: the content is static seed data and needs no AI at runtime.

## Done means
- `prisma/seed-data/seed-data.test.ts` passes: unique keys, real topics, every question passes the admin editor's
  `checkQuestion` rules, every non-Physics question is DRAFT, every topic has an MCQ and a written question, MCQ
  answers are spread across A–D (15–35% each per subject), and all maths parses in KaTeX.
- Every Chemistry/Biology/Maths/Further Maths topic has ≥ 2 questions.
- `pnpm db:seed` runs cleanly and `/admin` shows the drafts. Practice and the dashboard still show only published
  questions.
