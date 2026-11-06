# Study-IAL

Topic-by-topic practice for **Pearson Edexcel International A Level** students — built first for students in the
Maldives.

Students pick the units they're sitting, practise questions tagged to specification topics, and get a per-topic
**mastery score** from their marks. The dashboard and study plans then push them toward their weakest topics before
their exam dates.

## Features

- **Curriculum browser** — subject → unit → topic, with specification points. Public, so it's indexable.
- **Practice sessions** — by topic, by unit, or "weak topics". MCQs auto-mark; written answers are self-marked against
  the mark scheme, or AI-marked point by point (optional).
- **Mastery & progress** — recency-weighted score per topic; weakest topics surfaced everywhere.
- **Study plans** — deterministic scheduler covers every topic before the exam, adds spaced review and past-paper
  practice near the exam, and reschedules missed work in one click. AI adds an optional personalised summary.
- **Focus timer** — Pomodoro linked to plan tasks; logs focus time and powers the study streak.
- **Mistake notebook** — every question whose latest attempt lost marks, with your answer, the mark scheme and a
  "redo my mistakes" session; one tap turns a mistake into a flashcard.
- **Mock papers** — timed papers per unit (quick, half or full) at the real papers' minutes per mark, self-marked at the
  end, with an indicative grade and a per-topic breakdown.
- **Spec checklist** — rate every specification point "Not yet / Shaky / Got it"; a printable unit checklist flags
  where confidence and marks disagree. Physics units also list their key equations.
- **Exams** — a countdown per paper with plain readiness facts and one suggested next step.
- **Search, study calendar, sharing** — curriculum search (press `/`), a year-long study heatmap on Progress, and a
  revocable read-only progress link for a parent or teacher.
- **Offline page** — a minimal service worker shows a friendly page instead of a browser error with no connection.
- **Admin** — question bank editor with live Markdown/LaTeX preview, bulk JSON import, content-gap overview.
- **Past papers** — an index of open-access Edexcel IAL papers (Maths, Further Maths, Physics, Chemistry, Biology),
  "Add to my papers", question paper beside mark scheme, uploads (PDF or phone photos), parsing into questions, attempts
  marked against the scheme (self or AI), explanations, timed exams with estimated grades, spaced review of dropped
  marks. See [docs/past-papers](docs/past-papers/PROGRESS.md).

## Stack

Next.js 16 · React 19 · TypeScript · Prisma 7 + Postgres (Neon) · Better Auth · Vercel AI SDK + OpenRouter ·
Tailwind v4 + shadcn/ui · Vitest

## Local development

Requires Node 22+ and pnpm.

```bash
pnpm install
cp .env.example .env                       # then fill in BETTER_AUTH_SECRET (openssl rand -base64 32)

# Local Postgres via Prisma's dev server (no Docker needed).
pnpm db:dev -n study-ial-dev --detach      # prints the connection URLs — put them in DATABASE_URL / SHADOW_DATABASE_URL
pnpm db:migrate                            # apply migrations
pnpm db:seed                               # curriculum, practice questions, demo user

pnpm dev                                   # http://localhost:3000
```

Demo account (created by the seed outside production, has admin rights): `demo@study-ial.test` / `demo-password`.
To see populated dashboards locally, `pnpm demo:activity` gives it a few weeks of practice and focus history
(`--reset` to start over; local database only).

Without `RESEND_API_KEY`, emails (verification, password reset) are printed to the server console and email
verification is not required. Without `OPENROUTER_API_KEY`, AI features hide themselves and everything else works.

### Checks

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Deploying (Vercel + Neon)

1. Create a Neon project and copy its **pooled** connection string.
2. Import the repo into Vercel. Set the environment variables from `.env.example`:
   - `DATABASE_URL` (Neon), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` (your production URL)
   - Optional: `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (redirect URI `https://<domain>/api/auth/callback/google`),
     `RESEND_API_KEY` + `EMAIL_FROM`, `OPENROUTER_API_KEY`, `ADMIN_EMAILS`
   - Admin access: add your email to `ADMIN_EMAILS`, then sign in with Google (or a verified email). The role is
     only granted to verified addresses, so configure Google or Resend in production.
3. The `vercel-build` script runs migrations before building. Seed the curriculum once:
   `DATABASE_URL=<neon url> NODE_ENV=production pnpm db:seed` (the demo user is skipped in production).

## Past papers

```bash
pnpm papers:ingest --subject mathematics --units WMA11   # discover → filter → download → hash → store → upsert
pnpm papers:parse --unit WMA11                           # read questions, mark schemes, examiner reports
pnpm papers:grade-boundaries                             # Pearson's published unit grade boundaries
pnpm papers:check-links                                  # verify stored source URLs
```

Files go to Cloudflare R2 when `R2_*` is set, otherwise to `.storage/`. Papers are © Pearson and only ever shown to
signed-in students for personal study; see [docs/past-papers/DECISIONS.md](docs/past-papers/DECISIONS.md).

## Content

Curriculum and the starter question bank live in `prisma/seed-data/` as typed TypeScript. All seeded questions are
original, written in the style of IAL papers. Pearson past papers live in the separate, private past-papers workspace
(never in the public question bank).

Study-IAL is not affiliated with or endorsed by Pearson Edexcel.
