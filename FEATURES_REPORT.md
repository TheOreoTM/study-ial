# Features report

All six planned features are built on `rewrite`. Each one got a spec (`docs/features/*.md`), unit tests for its pure
logic, light/dark × 1440/375 screenshots as the demo user, a commit, and a review by a fresh subagent whose findings
were fixed in a follow-up commit. Nothing was pushed (see decisions). Final checks: see the end.

## Look at these first

1. **/admin** (as demo, an admin): 395 new **draft** questions across Chemistry, Biology, Maths and Further Maths.
   They're not live until you publish them. Start with the "check first" lists below.
2. **/admin/flashcards**: 748 draft flashcards (all five subjects). Locally I published only the Physics deck so I
   could test reviewing; in any other database they're all drafts.
3. **/subjects/physics/wph11/motion**: the topic page now has the "Stuck on something?" tutor and a Flashcards panel.
4. **/flashcards** → **Review**: the spaced-repetition session (Space to reveal, 1/2/3 to grade).
5. **/progress**: plan pace chart, accuracy by topic, focus time by subject, and the Milestones grid at the bottom.
6. **/plans/community**: share a plan from its page ("Share"), then "Use this plan" as another student.

## What was built

| Feature | Where | Spec |
|---|---|---|
| Question bank: 395 original draft questions (an MCQ and a written question with a mark scheme for every one of 141 topics), plus flashcard content | `prisma/seed-data/questions/*`, `flashcards/*` | [question-bank](docs/features/question-bank.md) |
| Flashcards with spaced repetition: topic decks, own cards, SM-2-style Again/Good/Easy, 10 new cards a day from your weakest topics, due count on the dashboard and topic pages | `/flashcards`, `lib/srs.ts` | [flashcards](docs/features/flashcards.md) |
| Analytics on /progress: plan pace (scheduled vs done), weekly accuracy per topic (slipping first), focus time per subject, all in Maldives days | `lib/analytics.ts`, `components/analytics` | [analytics](docs/features/analytics.md) |
| AI topic tutor: pick a spec point (or the whole topic) on topic pages; "explain this question" after marking. Quota'd, cached and shared, with a question-bank fallback | `app/(app)/tutor/actions.ts`, `lib/tutor.ts` | [ai-tutor](docs/features/ai-tutor.md) |
| Milestones: ten calm, earned-once milestones; one dismissible dashboard line that points to the next topic; grid on /progress | `lib/milestones.ts` | [milestones](docs/features/milestones.md) |
| Community plans: share a plan as a template; "Use this plan" re-plans from your own marks and exam dates | `/plans/community` | [community-plans](docs/features/community-plans.md) |

New tables: `Flashcard`, `FlashcardReview`, `SeedTombstone`, `TutorExplanation`, `UserMilestone`, and
`StudyPlan.isPublic / sharedAt / clonedFromId`. Six migrations, all applied to the local DB only.

## Decisions made for you

**Process**
- **Not pushed.** Your memory says "always push", but this task said "don't push", and the task wins. Everything is a
  local commit on `rewrite`.
- **I restarted your dev server** several times, because schema changes need a restart (CLAUDE.md). The current one
  runs in the background, with its log in my session scratchpad. Restart it from your own terminal whenever you like.
- **Local test data**: I created a second student, `peer@study-ial.test` / `peer-password-123`, to test cloning. I
  also shared the demo user's plan; the peer has cloned it. The demo user has some flashcard reviews and a dismissed
  milestone. None of this is in the seed.

**Content**
- **Every generated item is a draft.** Questions *and* flashcards, Physics flashcards included. The seed creates
  drafts and then never overwrites them: once content is in the DB, it's yours to edit.
  `SEED_REFRESH_DRAFTS=1 pnpm db:seed` deliberately rewrites anything still in draft. Deleting seeded content in
  admin records a tombstone, so the seed won't bring it back.
- **MCQ answer letters were rebalanced** (the reviewer found guessing "B" won about 45% of the time). A test keeps
  each letter between 15% and 35% per subject.
- **Physics gap I didn't fill:** WPH16 "core practicals" has written questions but no MCQ. It was outside this
  task's subjects.

**Features**
- **Flashcards don't change mastery.** Mastery stays "your recent marks on questions" (Honest progress).
  Flashcards point the same way by introducing new cards from your weakest topics first.
- **The AI tutor has no free-text box.** Students pick a spec point, so answers stay grounded and no personal text
  can reach the model. It's told never to solve the bank's questions, and the fallback only shows worked
  explanations for questions the student has answered.
- **Tutor explanations are cached for 30 days and shared across students**, since they depend only on curriculum
  content. Admin edits and every re-seed clear the relevant cache.
- **Practice hides "Explain this question" when AI is off**, because the explanation and mark scheme it would fall
  back to are already on screen.
- **Community plans are templates, not copies.** Copying someone's task list would ignore your own weak topics. Using
  one copies their rhythm (units, minutes, days, length) and plans the topics from your marks. Author names are
  never shown; the share dialog warns that the title becomes public. Signed-in only.
- **Milestones are deliberately not gamified.** There's no XP, no levels, and no streak that breaks ("a steady
  week" is 5 of 7 days). Each one is earned once and kept. A student's first sync with existing history records
  past milestones silently instead of announcing them.
- **Analytics weeks are rolling 7-day windows ending today**, so "this week" always includes today. Skipped plan
  tasks drop out of the "scheduled" line.

## Content to check first (from the writers and reviewers)

Every number in the drafts was re-checked with Python or sympy by the writers, and a reviewer independently
re-derived 34 of them and found no errors. These are judgement calls rather than mistakes:
- **Chemistry**
  - `che-wch12-energetics-003`: the bond enthalpies given in the stem may not match the current data booklet.
  - `che-wch14-entropy-energetics-003`: sig-fig policy (1110 K vs 1106 K).
  - Check that the iodoform test, Grignard reagents, and alkene → diol with KMnO₄ are on the current spec.
- **Biology**
  - `bio-wbi15-muscles-exercise-002`: ATP's role in the power stroke.
  - `bio-wbi13-practical-techniques-003`: HCl "fixes" cells.
  - CVS/amniocentesis week ranges; the ice-core isotope used.
- **Maths**
  - `mat-wdm11-algorithms-001`: binary-search rounding convention.
  - `mat-wst02-hypothesis-tests-003`: "less than 0.025" tail rule.
  - `mat-wdm11-graphs-networks-2-003`: the explanation reveals the optimal tour.
  - Several answers quote both 2 and 3 s.f.
- **Further Maths**
  - Statistical table values (χ², z).
  - "awrt" conventions.
  - The WME03 cone toppling condition.
- **Physics flashcards**
  - Uncertainty-propagation conventions.
  - Core Practical 16 set-up.
  - A few cards go slightly beyond spec wording ($P = Fv$, $T^2 \propto r^3$, 931 MeV/u).

## Not verified / blocked

- **The live AI path never ran.** There's no `OPENROUTER_API_KEY` locally. The tutor's prompt building, quota/refund
  logic and cache path are unit-tested or tested in the browser, and the fallback was exercised end to end, but no
  real model output has been seen. Try a few explanations once the key is set.
- Nothing is BLOCKED.

## Known limitations

- Community plan outlines are built from the plan's tasks. A rescheduled plan's early weeks can look thinner than
  they were, which is an indirect hint of missed sessions (low severity; noted in the spec).
- The community library shows the newest 50 plans with no pagination yet. Sharing needs a verified email and is
  capped at 5 plans per student; admins can unshare from a plan's page, but there's no review queue.
- Milestones and flashcard summaries are computed when the page loads, so the dashboard does a few more queries
  than before. Earned milestones skip their queries.

## Final checks

Run on the final commit (`bf4d4c1` plus this report):
- `pnpm typecheck`: passes
- `pnpm lint`: passes, no warnings
- `pnpm test`: 177 tests in 16 files pass
- Screenshots (light/dark × 1440/375) for every new page and a regression sweep of the landing page, subjects, unit,
  focus, settings, plans, practice and admin pages: no page errors, no console errors and no horizontal overflow.

## Commits

`0538762` specs → `638657d`/`964cbd9` question bank → `8a61285`/`ed64566` flashcards → `e520f5a`/`45bd9cd`
analytics → `a5c8244`/`6629aef` tutor → `e0e14a4`/`cdd9cfc` milestones → `f90dd7e`/`bf4d4c1` community plans.
Each feature is a `feat` commit followed by a `fix` commit for its reviewer's findings.
