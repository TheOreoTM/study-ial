# Features plan

Specs live in `docs/features/`. Each feature: implement → Vitest for pure logic → `pnpm typecheck && pnpm lint &&
pnpm test` → Playwright screenshots (light/dark × 1440/375, as demo@study-ial.test) → fix → commit → fresh reviewer
subagent against spec + diff → fix → tick.

## 1. Question bank: Chemistry, Biology, Mathematics, Further Maths ([spec](docs/features/question-bank.md))
- [x] Seed format: `status` on SeedQuestion, DRAFT-aware upsert in `prisma/seed.ts`
- [x] Content: Chemistry, Biology, Maths (pure + applied), Further Maths questions (≥ 2 per topic, all DRAFT)
- [x] Tests: `prisma/seed-data/seed-data.test.ts` (keys, topics, admin rules, draft gate)
- [x] Seed locally, check /admin draft counts + /admin/questions; screenshots
- [x] Commit
- [x] Review (fresh subagent) and fixes

## 2. Flashcards with spaced repetition ([spec](docs/features/flashcards.md))
- [x] Schema + migration (`Flashcard`, `FlashcardReview`), seed flashcards as DRAFT
- [x] Pure logic: `lib/srs.ts` scheduling + queue building, with tests
- [x] Queries + server actions (grade, own cards CRUD, admin publish)
- [x] UI: /flashcards, /flashcards/review, /flashcards/[topicId], /admin/flashcards, topic page panel, dashboard line, nav
- [x] Checks + screenshots
- [x] Commit
- [x] Review (fresh subagent) and fixes

## 3. Analytics on /progress ([spec](docs/features/analytics.md))
- [x] Pure logic: `lib/analytics.ts` with tests (local-day bucketing, trends, plan pace)
- [x] Queries: `lib/queries/analytics.ts`
- [x] UI: time per subject, accuracy trends, plan pace charts on /progress
- [x] Checks + screenshots
- [x] Commit
- [x] Review (fresh subagent) and fixes

## 4. AI topic tutor ([spec](docs/features/ai-tutor.md))
- [x] Schema + migration (`TutorExplanation`), `tutor` AI feature + quota
- [x] Pure prompt/fallback builders in `lib/tutor.ts` with tests
- [x] Server actions (explainTopic, explainQuestion) with cache, quota, refund, fallback
- [x] UI: topic page panel, practice "Explain this question"
- [x] Checks + screenshots
- [x] Commit
- [ ] Review (fresh subagent) and fixes

## 5. Milestones ([spec](docs/features/milestones.md))
- [ ] Schema + migration (`UserMilestone`)
- [ ] Pure rules `lib/milestones.ts` with tests
- [ ] `syncMilestones` query + dismiss action
- [ ] UI: dashboard notice, /progress milestones section
- [ ] Checks + screenshots
- [ ] Commit
- [ ] Review (fresh subagent) and fixes

## 6. Community plans ([spec](docs/features/community-plans.md))
- [ ] Schema + migration (`isPublic`, `sharedAt`, `clonedFromId`)
- [ ] Pure `templateFromPlan` / clone date maths with tests
- [ ] Actions: share/unshare, clone, admin unshare
- [ ] UI: /plans/community, /plans/community/[id], share toggle on plan page
- [ ] Checks + screenshots
- [ ] Commit
- [ ] Review (fresh subagent) and fixes

## Final
- [ ] Rerun typecheck, lint, test on the final state
- [ ] FEATURES_REPORT.md
