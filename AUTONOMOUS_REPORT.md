# Autonomous report

Branch `claude/study-ial-autonomous-sbvmoe`, pushed, no pull request. The plan, with every item ticked, is in
`AUTONOMOUS_PLAN.md`. Each feature has a short "why it helps a student revising for IAL" there. Screenshots are in
`screenshots/autonomous/`, at 2× in light and dark, 1440px and 375px.

To see everything populated locally:

```bash
pnpm db:seed
```

```bash
pnpm demo:activity
```

Then sign in as `demo@study-ial.test` / `demo-password`.

## Look at these first

1. **Timed mock papers: `/mock`, then `/mock/[id]`.** Pick a unit and a length (quick, half or full). Sit it against a
   clock set from the real papers' minutes per mark, with no feedback until you hand it in. Multiple choice is
   auto-marked. You then self-mark the written answers (AI can pre-tick the points when it's configured). The result
   page shows an indicative grade, the marks needed for the next grade and a per-topic breakdown.
   - Answers autosave and survive Back/Forward and phone locks.
   - Questions on a running paper are locked everywhere else in the app.
   - Screenshots: `mock-sitting-1440-light.png`, `mock-sitting-375-dark.png`, `mock-result-1440-light.png`,
     `mock-result-375-dark.png`.
2. **Mistake notebook: `/mistakes`.** Every question whose latest attempt lost marks, grouped by topic and filterable
   by unit. Each one opens to show your answer, the correct option or mark scheme, and the explanation. From there you
   can redo them (oldest first), one topic at a time, or turn one into a flashcard in a tap.
   - Screenshots: `mistakes-1440-light.png`, `mistakes-375-dark.png`, `mistakes-redo-1440-light.png`,
     `mistakes-flashcard-1440-light.png`.
3. **Spec checklist: `/subjects/physics/wph12/checklist`, plus every topic page.** Rate each specification point
   "Not yet / Shaky / Got it". The checklist sits beside your mastery and flags topics where how you feel and your
   marks disagree. It prints cleanly, or saves as a PDF, with the unit's key equations on their own page.
   - Screenshots: `checklist-1440-light.png`, `checklist-375-dark.png`, `key-equations-1440-light.png`,
     `key-formulae-wma13-1440-light.png`.
4. **Exam countdown: `/exams`, plus the new dashboard panel.** One card per paper: days to go, phase, topics strong,
   untried topics, open mistakes, last mock grade, and one suggested next step. The dashboard shows the same step for
   your nearest exam.
   - Screenshots: `exams-1440-light.png`, `exams-375-dark.png`, `dashboard-exam-nudge-1440-light.png`.
5. **Parent/teacher link: Settings → "Share your progress", which opens `/share/[token]`.** A revocable, read-only
   summary that needs no account. It shows first name, units, mastery by topic, mock grades and the study calendar.
   It never shows the email or any answers.
   - Screenshots: `share-settings-1440-light.png`, `share-page-1440-light.png`, `share-page-375-dark.png`.

## Everything that was built

- **Mistake notebook** (`/mistakes`, `lib/mistakes.ts`): practice `?mode=mistakes`, entry points on the nav,
  dashboard, topic page and practice summary.
- **Make a flashcard from a mistake** (`lib/card-from-question.ts`): clips to the card limits without breaking a
  formula; no duplicates.
- **Timed mock papers** (`/mock`, `lib/mock-exam.ts`, `MockExam` table):
  - assembly spreads questions across topics;
  - real minutes per mark and UMS-style indicative grades;
  - autosave and a clock corrected for device skew;
  - hand-in is safe against double submits and enforced after the deadline;
  - abandon; expired papers are handed in automatically.
- **Optional AI mark suggestions in mock self-marking**: uses the existing quota, never for Dhivehi, AI-off fallback.
- **Spec-point confidence ratings and printable unit checklist** (`lib/checklist.ts`, `SpecPointRating` table):
  mismatch flags; ratings never touch mastery.
- **Print stylesheet**: dark tokens are screen-only, so pages always print light, and the app bar is hidden.
- **Curriculum search** (`/search`, `lib/search.ts`): word-start matching and highlights, a "/" shortcut, and a
  search button in the app bar. Question stems are never searched.
- **Study calendar heatmap** on `/progress` (`lib/heatmap.ts`): a year on desktop, 26 weeks on phones, a
  screen-reader table, and Maldives days throughout.
- **Exam countdown** (`/exams`, `lib/readiness.ts`) and the **dashboard next-exam panel**.
- **Read-only progress link** (`/share/[token]`, `lib/share.ts`, `ProgressShare` table): token hashed, noindex,
  no-referrer.
- **Key equations** for Physics (WPH11/12/14/15), Chemistry (WCH11/12/14/15) and Biology (WBI12/14/15), and **key
  formulae** for Maths (WMA11–14, WME01, WST01), on unit pages and the checklist (`lib/key-equations.ts`).
- **Admin coverage table** shows which units can fill a quick, half or full mock paper.
- **17 draft questions for the practical papers** WPH13 and WPH16, including the first WPH16 core-practical MCQs.
- **Past-paper plan tasks** now open that unit's mock papers.
- **Practice keyboard shortcuts**: A–D or 1–4 to choose, Enter to check or continue (`lib/shortcuts.ts`).
- **SEO**: JSON-LD BreadcrumbList on curriculum pages and Course on subjects and units (`lib/structured-data.ts`);
  robots and the proxy cover the new private routes.
- **Offline fallback page** via a minimal service worker (`public/sw.js`). It never caches app HTML.
- **Loading skeletons** for every new route.
- **Accessibility**:
  - an axe-core audit (WCAG 2.2 AA plus best practice) of every route, both themes, both widths;
  - label-in-name fixes (account menu, Revise-next rows, day buttons, mock buttons);
  - heading order, and `EmptyState` now takes `headingLevel`;
  - practice empty states get an `h1`.
- **Polish**: dashboard code tiles no longer stretch on phones; nav pills tighten so nine items fit at 1024px;
  "Study plans" is shortened to "Plans".
- **Dev tooling**: `pnpm demo:activity [--reset]` (local database only).
- **Docs**: README, CLAUDE.md, PRODUCT.md and the landing feature tile describe the new features.

## Decisions I made for you

**Product**
- **Grades are always labelled as estimates.** They use the IAL's uniform-mark thresholds (A 80, B 70, C 60, D 50,
  E 40%), because real raw boundaries change by paper and these are original questions. The copy says so on every
  result.
- **Blank answers on a mock score 0 for that paper but record no attempt**, so they don't change mastery. That keeps
  "Honest progress": mastery comes from answers you actually gave.
- **Confidence ratings never change mastery.** They're shown beside it, and the useful part is the disagreement
  ("you feel confident but score 36%").
- **Confidence uses words and neutral/lilac styling, not red/amber/green.** Teal, sun and bubblegum are reserved for
  mastery (DESIGN.md's Mastery Monopoly rule).
- **No made-up "readiness score" on /exams.** Plain facts and one next step, chosen by phase.
- **Nav**: "Mistakes" and "Exams" join the bar; "Exams" covers both `/exams` and `/mock`.
- **Sharing**:
  - Only a hash of the token is stored, so the full link is shown once. Losing it means making a new one, which also
    revokes the old one.
  - The shared page shows the first name only.

**Content**
- **The 17 new practical-paper questions are DRAFT.** They need an admin to publish them, even though they're
  Physics. I wrote them, and Physics was published by default only because it's the hand-checked bank.
- **Key equations aren't questions, so they live in code and aren't in the DB.** The panel tells students to check
  their official booklet for which ones are given, instead of me guessing which formulae the data sheet includes.
- **Biology gets only a short key-equations list.** Hardy–Weinberg is left out because I'm not certain it's on this
  specification.

**Engineering**
- **The mistake notebook is computed from attempt history** (latest attempt per question) instead of a new table, so
  it can't drift out of sync with mastery.
- **While a mock paper is running, its questions are locked in practice, the tutor and the notebook.** Otherwise a
  second tab gives the answers away.
- **`next.config.ts` now sets headers for `/sw.js`** (no-cache and a same-origin CSP, from the Next.js PWA guide).
  `vercel.json` is untouched.
- **`/screenshots/` is still gitignored**, except `screenshots/autonomous/`, which you asked me to commit.
- **No new dependencies.** axe-core for the audit was the copy already in the pnpm store, and prettier ran through
  `npx` on one file. Neither was added to `package.json`.
- **Only the local database was used.** `.env` points at the local `prisma dev` server. `DIRECT_URL` was never used;
  every DB command ran with it unset.

## Not verified, blocked, and known limitations

- **The live AI paths never ran**, because there's no `OPENROUTER_API_KEY` here. That covers mock mark suggestions
  and, as before, practice marking and the tutor. The AI-off fallback for the mock suggestions was checked.
- **Draft content needs a human check before publishing**:
  - the 17 practical questions, which I checked by re-deriving every number;
  - the key equations (standard results, read twice).
- **A not-found shared link returns HTTP 200 with a noindex page instead of 404.** This is how Next streams
  `notFound()` once a loading boundary has started. The existing `(app)` pages behave the same way.
- **Mock papers are only as good as the bank.** Outside Physics everything is still DRAFT, so other subjects can't
  have mocks until an admin publishes questions. Full papers need 50+ published marks.
- **Mock self-marking is done in one go.** If the student leaves mid-marking, the ticks aren't saved, though the
  paper stays "Waiting to be marked".
- **The notebook shows the newest 60 mistakes per view**, with a note when there are more. Redoing some brings older
  ones into view.
- **Locking is not complete.** While a paper runs, a flashcard the student made earlier from one of its questions
  still shows its answer in flashcard review. It's the student's own note, so I left it.
- **Back/Forward on a mock.** If the fresh-state fetch also fails (offline) after a restore, the clock can show
  slightly too much time. The server still enforces the real deadline.
- **Local test data**: the demo user has generated history, a few mock papers, ratings, own flashcards, and a WPH12
  exam date moved to 12 days out. None of that is in the seed. `pnpm demo:activity --reset` clears the history.

## Reviews

Two independent reviewers, fresh subagents given the diff but not my conclusions, went through the branch:

1. **After rounds 1–2: eleven findings, all fixed** in `fix(mock): review findings` and
   `fix(mistakes,practice): review findings`. The important ones:
   - Back/Forward restored a mock with stale answers and a stale clock.
   - Answers to a running paper could be read through practice and the notebook.
   - A failed hand-in retried every second.
   - `Attempt.mockExamId` had no index.
2. **After rounds 3–4: no high-severity findings.** The share link, service worker, ownership checks and AI rules
   were confirmed sound, and all 17 new questions and every key equation were independently re-derived. Five
   medium/low findings were fixed in `fix(mock,mistakes,share): second review findings`:
   - clipping inside `$$…$$`;
   - an older mock result revealing answers for a question on the current paper;
   - AI ticks matched by position;
   - the dashboard count including locked questions;
   - the share "last opened" update not keyed to the token.

I also ran axe-core over every route. Findings were fixed in `fix(a11y): …`, and it's clean now.

## Final checks

Run on the final commit:
- `pnpm typecheck`: passes (exit 0).
- `pnpm lint`: passes, no warnings.
- `pnpm test`: 310 tests in 30 files pass, up from 186 in 17 at the start of the run.
- **Browser**: Playwright sweep of every main route as the demo user, plus the public pages signed out, at 1440 and
  375px in light and dark. No page errors, no console errors, no horizontal overflow.
- **Offline**: checked against a production build (`pnpm build` + `next start`) with Playwright's offline mode.
- **axe-core** (WCAG 2.2 AA + best practice): no violations on any audited route.

## Ideas I didn't get to, ranked

1. **Publish workflow for drafts.** A one-click "publish all reviewed in this topic" in admin, plus a per-unit
   "mock-ready" indicator showing which units can fill quick, half and full papers.
2. **Save self-marking progress on mock papers**, so leaving mid-marking keeps the ticks.
3. **Revision reminders.** An email digest via the existing Resend path ("WPH12 in 10 days; 23 mistakes to redo").
   It needs a scheduled job, which means a Vercel cron, and I didn't touch deploy settings.
4. **Spec-point-level practice.** Tag questions to spec points so "Not yet" ratings can drive practice directly.
5. **Mock papers across several units**, for students sitting two papers in one session.
6. **Teacher class view.** Several students sharing to one teacher dashboard (needs accounts and consent design).
7. **Further Maths key formulae**, and Physics practical-paper "skills" cards.

## Commits

`git log --oneline main..HEAD` before this report's own commit (newest first):

```
a86770d fix(mock,mistakes,share): second review findings
545ab19 feat(content): key equations for Biology WBI12, WBI14 and WBI15
34e870d feat(admin): coverage table shows which units can fill a mock paper
b40b262 fix(a11y): practice empty states get a page heading
b58cf35 feat(mock): optional AI suggestions while self-marking written answers
16790a2 feat(content): key equations for Chemistry, key formulae for Maths
d4ddfe7 feat(content): 17 draft questions for the Physics practical papers (WPH13, WPH16)
c9c550e fix(a11y): axe audit findings (label in name, heading order)
a7377ee docs: README, CLAUDE.md, PRODUCT.md and the landing page cover the new features
275ad95 feat(dashboard): next-exam nudge with one step for that paper
ef043a7 feat(mistakes): make a flashcard from any mistake in one tap
af7d3c4 feat(plans): past-paper tasks open that unit's timed mock papers
3013b73 feat(pwa): offline fallback page via a minimal service worker
883c557 feat(content): key equations for WPH11, WPH12, WPH14 and WPH15
620a895 fix(mistakes,practice): review findings
f35cdc8 fix(mock): review findings
0c9e059 docs: plan ticked for sharing
b6f91d6 feat(share): read-only progress link for a parent or teacher
dcbaa84 feat(share): ProgressShare schema and token helpers
07f3153 feat(ui): loading skeletons for mock, exams, search and the checklist
9e60b97 feat(practice): A–D / 1–4 pick an option and Enter checks it
1c4677d feat(seo): JSON-LD breadcrumbs on curriculum pages, Course on subjects and units
b96ea89 feat(exams): exam countdown with readiness facts and one next step per paper
83c5e84 feat(progress): study calendar heatmap of the last year
d75b7cd docs: plan ticked for search
f557a70 feat(search): /search page and an app-bar search button ('/' opens it)
a675da6 feat(search): pure curriculum search with word-start matching and highlights
cdbb408 docs: checklist screenshots, plan ticked
5d3baee feat(print): print stylesheet: light tokens on paper, no app bar
60e73db feat(checklist): rate spec points on topic pages and a printable unit checklist
318be33 feat(checklist): confidence ratings per spec point, schema and pure logic
63f3900 fix(mock): review findings
c826cb3 feat(mock): sit, self-mark and review timed mock papers
55664b5 feat(mock): MockExam schema and start/save/submit/mark actions
c5b7bbf feat(mock): paper assembly, real-paper timing and indicative grades
6636a69 fix(mistakes): review findings
44b9a4e feat(mistakes): /mistakes notebook with answers, mark schemes and redo links
c890213 feat(practice): mode=mistakes redoes open mistakes, oldest first
66c2abb feat(mistakes): pure mistake-notebook logic and history query
b89c860 chore(dev): demo:activity script gives the demo user weeks of local history
0e016de docs: autonomous plan from the walkthrough
```
