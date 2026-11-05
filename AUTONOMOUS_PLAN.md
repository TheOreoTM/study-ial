# Autonomous plan

Branch: `claude/study-ial-autonomous-sbvmoe`. Written after a Playwright walkthrough of every main route as the demo
user (1440px and 375px, light and dark) with a few weeks of generated history (`pnpm demo:activity`).

## What the walkthrough showed

- The core loop is solid and polished: no console errors, no horizontal overflow at 375px, dark mode holds up.
- **Wrong answers vanish.** After a session there's no way back to the questions you got wrong, except the last 8
  attempts on a topic page. Revising your own mistakes is the highest-yield thing an IAL student can do.
- **No exam rehearsal.** Everything is untimed and gives feedback after each question. Nothing feels like sitting
  WPH11 against a clock, and nothing says "this would be roughly a B".
- **Mastery is the only self-knowledge signal.** Students revise from the spec ("I can…"), but can't record how
  confident they feel about each spec point, or see where that confidence doesn't match their marks.
- **No search.** 280+ topics across six subjects and no way to type "projectile" and get there.
- **Progress shows 7 days of activity at most.** No long view of consistency.
- `robots.ts` doesn't disallow `/flashcards`; the public curriculum pages have no structured data.
- Phones: on the dashboard "Revise next" rows the code tile stretches to the full row height.

## Ranked work

### 1. Mistake notebook and "redo my mistakes" — [x]
**Why:** going back over what you got wrong is the most effective revision there is, and right now wrong answers
disappear once a session ends.
**Scope:** `/mistakes` lists every question whose *latest* attempt lost marks, grouped by subject → topic, with
the last score and how often it's been missed. A question leaves the notebook once you get full marks on it. A
`mode=mistakes` practice session (optionally per unit or topic) redoes them, oldest mistakes first. Entry points:
dashboard line, practice summary ("Redo the ones you missed"), topic page, nav. Pure logic in `lib/mistakes.ts`.
- [x] `lib/mistakes.ts` + tests (latest attempt per question, ordering, grouping)
- [x] Query + `/mistakes` page with empty/loading states
- [x] `mode=mistakes` practice mode (with unit/topic scope)
- [x] Entry points: nav, dashboard, practice summary, topic page
- [x] Screenshots, review, fixes

### 2. Timed mock papers with indicative grades — [x]
**Why:** IAL papers are sat against a clock with no feedback until the end. Rehearsing that, and seeing an
indicative grade, is what students do in the last weeks before an exam.
**Scope:** `/mock` lists your units; start a mock of a chosen length (short ~20 marks, half ~40, full ~80 where the
bank allows). Questions are chosen to cover the unit's topics. A countdown timer (time per mark based on the real
paper), no feedback while sitting. At the end: MCQs auto-marked, written answers self-marked against the mark
scheme, then a result page with score, an *indicative* grade (UMS-style 80/70/60/50/40 thresholds, clearly
labelled as an estimate) and a per-topic breakdown. Attempts feed mastery like any other attempt. Schema:
`MockExam` (+ `Attempt.mockExamId`). Pure logic in `lib/mock-exam.ts`.
- [x] `lib/mock-exam.ts` + tests (paper assembly, timing, grade estimate)
- [x] Schema + migration
- [x] Actions: start, submit answers, self-mark, finish (assertUser, zod, ownership)
- [x] UI: `/mock`, `/mock/[id]` (sit, mark, result), history
- [x] Screenshots, review, fixes

### 3. Spec checklist with confidence ratings — [ ]
**Why:** IAL students revise from the specification. Rating each "I can…" point red/amber/green and seeing where
confidence and marks disagree ("you rated this green but score 35%") is a classic, effective method.
**Scope:** on each topic page, every spec point gets a three-way confidence control. A unit-level checklist page
(`/subjects/[s]/[u]/checklist`) shows all points with ratings, plus topic mastery, and flags mismatches. Ratings
never change mastery (honest progress). Schema `SpecPointRating`. Pure mismatch logic in `lib/checklist.ts`.
- [ ] `lib/checklist.ts` + tests
- [ ] Schema + migration
- [ ] Action (assertUser, zod, topic/point validation)
- [ ] Topic page control + unit checklist page + print styles
- [ ] Screenshots, review, fixes

### 4. Search across the curriculum — [ ]
**Why:** "Where is projectile motion?" should take one keystroke, not four clicks through units.
**Scope:** public `/search?q=` over subjects, units, topics and spec points, ranked (name > code > summary > spec
point), with highlighted matches. Search box in the app bar (desktop) and mobile sheet. No question stems (they'd
leak practice content and DRAFTs). Pure ranking in `lib/search.ts`.
- [ ] `lib/search.ts` + tests
- [ ] `/search` page + header search field
- [ ] Screenshots, review, fixes

### 5. Study calendar heatmap on /progress — [ ]
**Why:** a long view of consistency is motivating and honest; the dashboard only shows a streak and 7 days.
**Scope:** last 26 weeks of activity (questions answered + focus minutes) by Maldives day, as a GitHub-style grid
with an accessible table fallback. Pure grid builder in `lib/heatmap.ts`.
- [ ] `lib/heatmap.ts` + tests
- [ ] Query + component on /progress
- [ ] Screenshots, review, fixes

### 6. Exam countdown page — [ ]
**Why:** before an exam session, the question is "how ready am I for each paper, and how many days are left?"
**Scope:** `/exams` lists your units by exam date with days left, topic coverage (tried/strong), confidence
ratings, open mistakes and a single "do this next" per paper; links to mock, mistakes and practice. Pure readiness
summary in `lib/readiness.ts`.
- [ ] `lib/readiness.ts` + tests
- [ ] Page + dashboard link
- [ ] Screenshots, review, fixes

### 7. Printable unit revision sheet — [ ]
**Why:** many students still revise on paper; a one-page sheet of the unit's spec points with their own mastery
and confidence is handy to print or save as PDF.
**Scope:** print stylesheet for the unit checklist page (no extra dependency), "Print" button, light-only print
colours.
- [ ] Print CSS + button, verified via Playwright `page.pdf()`

### 8. SEO and crawl hygiene on public pages — [ ]
**Why:** students find revision resources through search; the curriculum pages are the public face.
**Scope:** JSON-LD `BreadcrumbList` (+ `Course` on subject pages), robots disallows for the private routes added
since, `/search` noindex for empty queries.
- [ ] JSON-LD helper + tests
- [ ] Robots update

### 9. Practice keyboard shortcuts — [ ]
**Why:** answering 30 MCQs with a mouse is slow; A–D and Enter are how people drill.
**Scope:** A–D/1–4 to pick an option, Enter to check/continue, with a visible hint (hidden on touch devices).
- [ ] Pure key mapping + tests, wired into the question view

### 10. Dev tooling: demo activity — [x]
**Why:** lets anyone see populated dashboards locally.
**Scope:** `pnpm demo:activity [--reset]`, local DB only, refuses production.
- [x] Script

### 11. Polish from the walkthrough — [ ]
- [x] Dashboard "Revise next" code tile stretching on phones
- [ ] Loading states for new routes

## Round 2

Added after walking the app again once round 1 was done.

### 12. Parent/teacher read-only progress link — [ ]
**Why:** families and teachers in the Maldives often follow a student's revision; a revocable read-only link means
no extra account and no password sharing.
**Scope:** settings toggle to create/revoke a secret link; `/share/[token]` shows mastery per unit, the heatmap and
upcoming exams, no email, no answers, `noindex`. Schema `ProgressShare`.
- [ ] Schema + migration, token logic tested
- [ ] Settings control + public page
- [ ] Screenshots, review, fixes

### 13. Key equations for Physics units — [ ]
**Why:** the formulae students must recall vs. those given; an original per-unit "key equations" list helps.
**Scope:** original, short per-unit key-equation lists for WPH11/12/14/15 rendered with KaTeX on the unit page.
- [ ] Content (original) + tests that every unit code exists
- [ ] Unit page panel

### 14. Offline fallback (PWA) — [ ]
**Why:** phones on patchy island connections; an installable app with a friendly offline page is better than a
browser error.
**Scope:** minimal service worker that caches the offline page and static assets only (never authenticated HTML),
registered in production only.
- [ ] `public/sw.js` + offline page + registration
