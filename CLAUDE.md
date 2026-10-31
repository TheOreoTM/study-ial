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
pnpm dev                                 # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm test
```

Demo login (seeded, non-production only, has ADMIN role): `demo@study-ial.test` / `demo-password`.

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
  (app)/progress           mastery breakdown, analytics (focus time, accuracy trends, plan pace), milestones
  (app)/flashcards         topic decks with spaced repetition (review, own cards); admin review at (app)/admin/flashcards
  (app)/plans              study plans (generator + task list); /plans/community shares plans as templates
  (app)/tutor/actions.ts   AI "explain this" for topic and practice pages (no route; cached, with bank fallback)
  (app)/focus              pomodoro timer, logs FocusSession
  (app)/settings           profile, units, account deletion
  (app)/admin              question bank management (ADMIN only)
lib/
  db.ts  auth.ts  auth-client.ts  session.ts  ai.ts  email.ts  site.ts  utils.ts
  mastery.ts               pure mastery maths (tested)
  srs.ts analytics.ts milestones.ts tutor.ts community-plans.ts   pure feature logic (tested)
  queries/*.ts             server-only read helpers
prisma/
  schema.prisma  seed.ts  seed-data/   (curriculum, original questions + flashcards as TS data; non-Physics content
                                        is seeded as DRAFT and never overwritten once in the DB — SEED_REFRESH_DRAFTS=1
                                        rewrites drafts; deleted seed content is remembered in SeedTombstone)
```

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
- **Redirect targets** from query params go through `safeRedirect` (`lib/safe-redirect.ts`).
- **Admins**: `ADMIN_EMAILS` are promoted lazily in `getUser()` only when `emailVerified` is true. Never grant roles
  from unverified input.
- After a schema change, restart `pnpm dev` — the Prisma client is cached on `globalThis` across hot reloads.
- Formatting: 4-space indent, double quotes, 120 cols (see `.prettierrc`).
