@AGENTS.md

# Study-IAL

Topic-by-topic practice for Pearson Edexcel International A Level (IAL) students, aimed first at students in the
Maldives. The core loop is: browse the curriculum (subject → unit → topic) → practise questions on a topic → marks feed a
per-topic **mastery** score → the dashboard and study plans push you toward your weakest topics before your exam dates.

## Stack

- Next.js 16 (App Router, `proxy.ts` instead of middleware), React 19, TypeScript strict
- Prisma 7 (`prisma-client` generator → `lib/generated/prisma`, `@prisma/adapter-pg`), Postgres (Neon in prod)
- Better Auth (email/password + Google), Prisma adapter — `lib/auth.ts`, client in `lib/auth-client.ts`
- Vercel AI SDK v7 + OpenRouter — `lib/ai.ts`. Structured output is `generateText({ output: Output.object({ schema }) })`
  (there is no `generateObject` in v7). Docs: `node_modules/ai/docs/`.
- Tailwind v4 + shadcn/ui (new-york, `radix-ui` package) in `components/ui`. Icons: `lucide-react`.
- Vitest for unit tests (`*.test.ts` next to the code).

## Commands

```bash
pnpm db:dev -n study-ial-dev --detach   # local Postgres (Prisma dev server); URLs are in .env
pnpm db:migrate                          # prisma migrate dev
pnpm db:seed                             # idempotent: curriculum, questions, demo user
pnpm demo:activity                       # local only: weeks of practice/focus history for the demo user
pnpm dev                                 # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm test
```

Demo login (seeded, non-production only, has ADMIN role): `demo@study-ial.test` / `demo-password`.

Local setup gotchas (all hit in practice):
- `.env` needs `DATABASE_URL` **and** `SHADOW_DATABASE_URL` on two *different* local ports (prisma dev prints the main
  TCP port; the shadow is usually the next one up). Never point the shadow at the main DB (Prisma refuses: P3025), and
  never at production — migrate dev resets its shadow.
- After `pnpm db:migrate`, run `npx prisma generate` (Prisma 7's migrate doesn't regenerate) and restart `pnpm dev`.
- Open the app on exactly `BETTER_AUTH_URL` (default `http://localhost:3000`). Another host or port makes Better Auth
  reject sign-in with 403 "Invalid origin".
- Production migrations run in Vercel's build via `prisma migrate deploy`. Never run `migrate dev`/`db:seed` against a
  remote database; `PROD_*` variables in a local `.env` aren't read by any tooling.

## Layout

```
app/
  page.tsx                 landing (public)
  (auth)/                  sign-in, sign-up, forgot/reset password
  onboarding/              pick units + exam dates (sets user.onboardedAt)
  (app)/layout.tsx         app shell: sticky top app bar (logo, pill nav, avatar menu with Settings) from
                           1024px, menu button + slide-in sheet below; parts in components/shell/.
                           Works signed-in or out
  (app)/dashboard          today: plan tasks, weak topics, streak
  (app)/subjects/...       curriculum browser — PUBLIC (SEO); practice CTAs need sign-in
  (app)/practice           practice session (topic / unit / weak-topics modes)
  (app)/progress           mastery breakdown, study calendar heatmap, analytics (focus time, accuracy trends, plan
                           pace), milestones
  (app)/mistakes           mistake notebook (latest attempt lost marks); practice ?mode=mistakes redoes them
  (app)/mock               timed mock papers: sit (autosave, clock), self-mark, result with indicative grade.
                           Questions on a running paper are locked everywhere else (getLockedQuestionIds)
  (app)/exams              countdown per unit with readiness facts and one next step (lib/readiness.ts)
  (app)/search             public curriculum search (subjects, units, topics, spec points; never question stems)
  (app)/subjects/[s]/[u]/checklist   spec-point confidence ratings + printable unit checklist and key equations
  (app)/flashcards         topic decks with spaced repetition (review, own cards); admin review at (app)/admin/flashcards
  (app)/plans              study plans (generator + task list); /plans/community shares plans as templates
  (app)/tutor/actions.ts   AI "explain this" for topic and practice pages (no route; cached, with bank fallback)
  (app)/focus              pomodoro timer, logs FocusSession
  (app)/settings           profile, units, read-only progress link, account deletion
  share/[token]            read-only progress for a parent/teacher (token hashed in ProgressShare; noindex)
  (app)/admin              question bank management (ADMIN only)
lib/
  db.ts  auth.ts  auth-client.ts  session.ts  ai.ts  email.ts  site.ts  utils.ts
  mastery.ts               pure mastery maths (tested)
  srs.ts analytics.ts milestones.ts tutor.ts community-plans.ts   pure feature logic (tested)
  mistakes.ts mock-exam.ts checklist.ts search.ts heatmap.ts readiness.ts share.ts shortcuts.ts
  key-equations.ts card-from-question.ts structured-data.ts         pure feature logic (tested)
  queries/*.ts             server-only read helpers
prisma/
  schema.prisma  seed.ts  seed-data/   (curriculum, original questions + flashcards as TS data; non-Physics content
                                        is seeded as DRAFT and never overwritten once in the DB — SEED_REFRESH_DRAFTS=1
                                        rewrites drafts; deleted seed content is remembered in SeedTombstone)
```

## Speed and feel

The product should feel instant and calm. Decisions and budgets are in `docs/decisions/2026-11-premium-feel.md`.
- **Budgets (laptops first, 375 px must still work):** interactions < 100 ms, navigation shows content or a skeleton
  < 200 ms, search < 16 ms per keystroke. Every route has a `loading.tsx`.
- **Search is client-side.** The curriculum index comes from `/api/search/index` (CDN-cached, ~25 KB gzipped) and the
  signed-in extras from `/api/search/personal` (private). Keystrokes never hit the network. Ranking lives in
  `lib/search.ts`; prepare an index once (`prepareDocs`) and search the prepared form.
- **No request per keystroke, no spinner for local work**, optimistic UI for writes the user expects to succeed.
- **Motion:** state changes and page transitions only, ≤ ~200 ms, off for reduced motion. Nothing loops.
- **Client JS stays lean:** Markdown/KaTeX render on the server; add a client dependency only when a server-rendered
  alternative can't do the job, and justify it in the commit.
- Personal data never goes into CDN-cached responses (search index, public pages); send it with `Cache-Control:
  private, no-store`.

## Conventions

- **Server Components by default.** Client components only for interactivity; keep them small and pass data as props.
- **Reads**: query Prisma directly in server components or via `lib/queries/*`. **Writes**: server actions in an
  `actions.ts` file colocated with the route (`"use server"`). Every action starts with `assertUser()` /
  `assertAdmin()` from `lib/session.ts`, validates input with zod, checks ownership (`where: { id, userId }`), and
  returns `{ ok: true, ... } | { ok: false, error: string }` rather than throwing for expected failures. Call
  `revalidatePath` for affected routes.
- **Pages** that need a user call `requireUser()` (redirects to /sign-in, and to /onboarding until onboarded).
- **Dynamic route params are Promises** in Next 16: `({ params }: { params: Promise<{ id: string }> })`.
- URL scheme for curriculum: `/subjects/[subject-slug]/[unit-code-lowercase]/[topic-slug]`, e.g.
  `/subjects/physics/wph11/motion`.
- **AI is optional.** Check `aiEnabled` from `lib/ai.ts`; every AI feature must have a non-AI fallback and must call
  `consumeAiQuota(userId, feature)` before spending tokens. Never send user emails/PII to the model.
- Markdown content (question stems, mark schemes, feedback) renders through `components/markdown.tsx` (GFM + KaTeX).
- UI: use `PageHeader`, `EmptyState`, shadcn `Card`, etc. Colour tokens only (`bg-primary`, `text-muted-foreground`,
  `text-success`, `text-warning`, `text-destructive`) — no raw hex. Must look right in dark mode and at 375px wide.
- AI quotas per feature live in `lib/ai.ts` (`marking`, `plan`, `tutor`); add new features there.
- Mastery levels/colours come from `lib/mastery.ts` (`masteryLabel`, `masteryTone`) — don't reinvent them.
- **Dates**: calendar-day logic ("today", plan task dates, streaks, countdowns) uses `lib/time.ts`
  (`localDay`, `localDayKey`, Maldives time zone) — never raw UTC days or the server's local time.
- **Dhivehi**: `Markdown` switches to right-to-left whenever text contains Thaana (`hasThaana` in `lib/dhivehi.ts`).
  Dhivehi questions are self-marked with reviewed English in `stemEn`/`markSchemeEn`; AI marking and the tutor stay off
  for them, on the server as well as in the UI.
- **Redirect targets** from query params go through `safeRedirect` (`lib/safe-redirect.ts`).
- **Admins**: `ADMIN_EMAILS` are promoted lazily in `getUser()` only when `emailVerified` is true. Never grant roles
  from unverified input.
- Printing: dark tokens apply on screen only, so pages print light; use `print:` variants for print layout.
- `public/sw.js` only serves the offline page; never make it cache app HTML or responses (they're personal).
- After a schema change, restart `pnpm dev` — the Prisma client is cached on `globalThis` across hot reloads.
- Formatting: 4-space indent, double quotes, 120 cols (see `.prettierrc`).
