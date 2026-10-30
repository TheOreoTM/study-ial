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
- **Admin** — question bank editor with live Markdown/LaTeX preview, bulk JSON import, content-gap overview.

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

## Content

Curriculum and the starter question bank live in `prisma/seed-data/` as typed TypeScript. All seeded questions are
original, written in the style of IAL papers. Past-paper questions can be added through **Admin → Import**; Pearson
papers are copyrighted, so link to the official papers (`sourceRef`) rather than re-hosting PDFs.

Study-IAL is not affiliated with or endorsed by Pearson Edexcel.
