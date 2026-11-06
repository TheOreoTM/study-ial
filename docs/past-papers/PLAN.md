# Past Papers — plan

Students browse an index of open-access IAL past papers, add them to a private workspace, upload their own papers,
have them parsed into structured questions, attempt them, get marked against the mark scheme and ask for
explanations. Original AI-written questions extend the existing public question bank.

Everything is built on the existing stack (Next 16 App Router, Prisma 7 + Postgres, Better Auth, Vercel AI SDK +
OpenRouter, Tailwind/shadcn). No new framework. Decisions and trade-offs are logged in [DECISIONS.md](DECISIONS.md);
status in [PROGRESS.md](PROGRESS.md).

## Copyright & safety rails (apply to every milestone)

| Rule | Where it is enforced |
| --- | --- |
| Private storage, no public URLs | `lib/storage/*` (R2 bucket is private; local files live outside `public/`). Files only leave through `app/api/papers/**` route handlers, which check the session and redirect to a 5-minute signed URL or stream the bytes. |
| Open-access only | `lib/papers/access.ts`: skip `/secure/` paths, skip anything robots.txt disallows, skip sittings inside the restricted window (default 12 months), and reject downloads that aren't a real PDF (Pearson answers a missing/locked file with an HTML page). |
| Subject allowlist (no third-party extracts) | `lib/papers/config.ts`: Maths, Further Maths, Physics, Chemistry, Biology. Anything else is never discovered. |
| PDFs untouched | Bytes are stored exactly as downloaded (SHA-256 recorded and re-checked); page images are derived copies used only for parsing/cropping. |
| Nothing Pearson-owned on public/SEO pages | `/past-papers` (public) shows metadata only and is `noindex`; not in the sitemap; robots disallows `/papers` and `/api`. Parsed question text, files, page images and figure crops all require sign-in. Tests assert this. |
| Source URL per file + serve-from-source switch | `Paper.sourceUrl` (full URL, never reconstructed) and `serve: "storage" \| "source"` per subject in config. |
| Takedown + © notice | Footer line on paper pages and the landing page, `/takedown` contact page. |
| Free | No paywall anywhere near Pearson content. AI features are quota-limited, not paid. |

## Architecture

```
scripts/ingest-papers.ts      discover → filter → download → hash → store → upsert (resumable, idempotent)
scripts/check-paper-links.ts  HEAD every stored sourceUrl, report 404s / non-PDF responses
scripts/run-paper-jobs.ts     run queued parse jobs locally (prod: Vercel Cron → /api/papers/jobs)

lib/papers/
  config.ts       subject allowlist, spec codes, unit prefixes, serve mode, restricted window
  filename.ts     parse Pearson/PMT filenames + titles (unit, paper, type, publication date, series)  [tested]
  keys.ts         storage key convention ial/{subject}/{unit}/{year}-{series}/{unit}-{paper}-{qp|ms|er}.pdf [tested]
  access.ts       open-access rules, robots.txt matcher                                                 [tested]
  sources/pearson.ts   discovery via the Algolia index behind the course-materials pages
  sources/pmt.ts       fallback discovery for sittings Pearson no longer hosts
  http.ts         polite fetcher: robots, ≥2s per host, generic UA, on-disk response cache
  pdf.ts          pdfjs-dist + @napi-rs/canvas: page count, text layer, page rendering, crops
  parse/          parse engines (text-layer heuristics, vision model), schema, validation, MS matching   [tested]
  jobs.ts         DB-backed job queue (claim, heartbeat, retry), time-budgeted runner
lib/storage/      StorageAdapter interface; R2 (S3 API, presigned GET) and local filesystem (auto when no R2 env) [tested]
```

### Data model (Prisma)

- `PaperSitting` — one exam sitting: subject, unit code, paper code (`01`, `01a`, `01r`), year, series
  (`JAN|JUN|OCT`), optional link to `Unit`. `ownerId` is null for the public index and set for a student's private
  upload. Links QP ↔ MS ↔ ER: every `Paper` of the sitting.
- `Paper` (`papers` table) — one file: sitting, type (`QP|MS|ER`), storage key, source URL, source
  (`PEARSON|PMT|UPLOAD`), sha256, size, page count, mime, publication date, parse status
  (`NONE|QUEUED|PARSING|NEEDS_REVIEW|READY|FAILED`), last link-check result. Uploaded image sets store one object
  per page.
- `PaperParse` — parse cache keyed by `(sha256, docType)`: engine, model, raw JSON result, validation report. Each unique
  file is parsed once and reused by every `Paper` with that hash. Never exposed publicly.
- `PaperJob` — background job queue (parse, match mark scheme, tag topics) with status, attempts, lock, error.
- `PaperQuestion` — the question → part → subpart tree for a QP (`number` like `3(b)(ii)`, `parentId`, stem Markdown
  with LaTeX, marks, figures `[{page,bbox,key}]`, page region, `dependsOn`), matched mark-scheme points, examiner
  report notes, topic tags.
- `UserPaper` — a sitting in a student's workspace.
- `PaperAttempt` — every attempt: answer text, photo keys, marks, method (`SELF|AI|AI_ESTIMATED`), feedback JSON,
  optional `PaperExamSession` (timed full-paper mode with summary + estimated grade).
- `PaperReview` — spaced repetition state for paper questions the student got wrong (reuses `lib/srs.ts`).
- `GradeBoundary` — per unit/series raw-mark boundaries, with source URL.
- `AiCallLog` — model, feature, tokens, estimated cost per call (admin spend view).

Original questions (milestone 5) reuse the existing `Question` model (`source: ORIGINAL`, DRAFT → PUBLISHED review)
with new generation metadata and a self-check result.

## Milestones

1. **Index & ingestion** — config, filename/series parsing, key convention, storage adapters, polite fetcher, Pearson
   discovery (Algolia), PMT fallback, ingest script, link checker. IAL Maths end-to-end first, then the allowlist.
2. **Index UI & workspace** — `/past-papers` browse (subject → unit → series, QP/MS/ER chips), "Add to my papers",
   `/papers` workspace, authenticated file route with signed URLs, QP | MS side-by-side viewer (stacked on mobile).
3. **Upload & parsing** — PDF / multi-image upload with limits and hash dedupe; job queue; text-layer engine for
   born-digital PDFs and a vision engine (strict JSON schema, retry/repair) for scans; figure crops server-side;
   validation (mark totals, numbering continuity, schema); mark-scheme parsing + matching; review screen.
4. **Attempt, mark, explain** — one-at-a-time and full-paper attempts, typed (LaTeX preview) or photo answers; AI
   marking against matched points (or "AI-estimated" without a mark scheme); explain / hints / similar question.
5. **Original question bank** — generator per topic with worked solution + mark scheme, independent self-check solve,
   admin review queue; published originals appear on the public topic pages.
6. **Extras** — topic tagging + "weak questions on topic X across papers", spaced repetition of wrong answers, timed
   exam mode, paper progress on the progress page, examiner-report insights, grade boundaries, AI spend controls.

Each milestone: typecheck, lint, tests, build → commit → update PROGRESS.md.
