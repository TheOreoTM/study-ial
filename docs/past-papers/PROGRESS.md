# Past Papers — progress

Last updated 2026-11-06. Plan: [PLAN.md](PLAN.md). Every judgement call: [DECISIONS.md](DECISIONS.md).

## What's built

| Milestone | State | Where |
| --- | --- | --- |
| 1. Index & ingestion | ✅ | `lib/papers/{config,filename,keys,access,http,ingest}.ts`, `lib/papers/sources/`, `lib/storage/`, `scripts/ingest-papers.ts`, `scripts/check-paper-links.ts` |
| 2. Index UI & "Add to my papers" | ✅ | `/past-papers`, `/past-papers/[unit]`, `/papers`, `/papers/[id]` (QP beside MS/ER, pdf.js), `app/api/papers/files/[paperId]` |
| 3. Upload & parsing | ✅ (vision engine untested live: no API key here) | `/papers/upload`, `app/api/papers/uploads`, `lib/papers/parse/`, `lib/papers/jobs.ts`, `/papers/[id]/review` |
| 4. Attempt, mark, explain | ✅ (AI paths untested live) | `/papers/[id]/attempt`, `app/(app)/papers/attempt-actions.ts`, `lib/papers/mark.ts`, `lib/papers/context.ts` |
| 5. Original question bank | ✅ (generation untested live) | `/admin/generate`, `lib/generate.ts`, sample questions on public topic pages |
| 6. Extras | ✅ | topic tagging (`lib/papers/tagging.ts`), `/papers/topics/[id]`, `/papers/review` (spaced repetition), timed exam `/papers/[id]/exam`, grade boundaries, progress section, examiner-report notes, `/admin/papers`, `/admin/ai` |

### Copyright rules, and where they're enforced and tested

- Private storage, files only through authenticated routes with `no-store`/`noindex` headers →
  `app/api/papers/**`, tests in `app/api/papers/files/[paperId]/route.test.ts` and `app/api/papers/routes-auth.test.ts`
  (401 signed out, 404 for another student's upload, strict attempt-photo keys).
- Never the restricted window, never `/secure/`, robots.txt respected → `lib/papers/access.ts` (+ tests). Restricted
  files are skipped before any request is made (175 Maths/Further Maths files on 2026-11-06).
- Subject allowlist → `lib/papers/config.ts`.
- Nothing Pearson-owned on public pages or the sitemap → `/past-papers` is metadata-only and `noindex`; `app/sitemap.test.ts`
  checks no paper/API URL is listed and robots disallows `/papers` and `/api/`. Topic pages only mention past-paper
  parts to signed-in students.
- Source URL per file + per-subject `serve: "source"` switch → `Paper.sourceUrl`, `lib/papers/serve.ts`.
- PDFs untouched (bytes stored as downloaded, SHA-256 recorded). Takedown page `/takedown`, © notes on every paper page.

## Results from this run

Environment: local Postgres 16, **local filesystem storage** (no R2 credentials here), **no `OPENROUTER_API_KEY`**.

### Ingest (Pearson only; PMT manifest empty because Pearson's open listing covers every indexed sitting)

| Subject | Sittings | QP | MS | ER |
| --- | ---: | ---: | ---: | ---: |
| Mathematics (WMA, WME, WST, WDM; 2018 + 2013 specs) | 325 | 309 | 322 | 314 |
| Further Mathematics (WFM) | 62 | 59 | 62 | 59 |
| Physics | 207 | 194 | 207 | 197 |
| Chemistry | 210 | 205 | 208 | 203 |
| Biology | still running at the time of writing; re-run `pnpm papers:ingest --subject biology` to finish (it resumes) | | | |

- WMA11 end-to-end first: 68 files, 23 sittings (January 2019 → October 2025). A re-run made **0 requests** and stored
  0 (idempotent by URL, then content hash).
- Maths + Further Maths: 1,125 files, 0 errors, 175 restricted files skipped unrequested, 8 skipped as not real
  sittings ("unused" January 2022 papers, a typo'd duplicate).
- Link checker: 12 sampled Maths source URLs, 0 broken.
- Grade boundaries: 974 unit boundaries from 34 Pearson documents (21 of 23 WMA11 sittings have them).
- About 1.9 GB of PDFs; the HTTP cache (`.cache/http`) keeps a second copy so interrupted runs never re-download.

### Parsing (layout engine; text layer, no AI)

| Unit | Question papers | Valid, marks = printed totals | Leaf parts | Matched to mark scheme | Topic-tagged |
| --- | ---: | ---: | ---: | ---: | ---: |
| WMA11 | 23 | 23 (all 75/75) | 604 | 541 (90%) | 62% |
| WPH11 | 21 | 18 (3 need review) | 626 | 560 (89%) | 77% |

Examiner-report comments were attached to 91% of WMA11 questions. Spot checks on WMA01/02, WME01 and WMA11
2019/2023 papers also validated with every printed question total matching.

### Accuracy issues seen

- **Maths text is jumbled in any PDF text layer** (`∫(8x³ − 6√x − 2/5x³)dx` reads as `8x3 6 x 52x3 dx`). The UI
  always shows the crop of the printed page as the question, with the text version collapsed and labelled. Running
  the vision engine (`pnpm papers:parse --unit WMA11 --vision`) produces LaTeX stems; that hasn't been run here.
- Mark-scheme rows sometimes merge or split: e.g. WMA11 June 2023 8(a)/8(b), a WME02 2017 scheme with an unusual
  layout read as one entry, and alternative methods doubling the mark codes of a part (4(a) in WME01 Jan 2016 lists
  8 codes for 4 marks). Matching treats the question paper as the truth and falls back to the parent's entry; AI
  marking sees the scheme crops, so it isn't misled by the codes.
- "(3)" printed once after (i), (ii), (iii) is attached to the parent part (correct per Pearson's style), so those
  sub-parts carry no marks of their own and are marked together through the last one.
- Topic tags come from words, so maths parts whose wording is mostly symbols go untagged, and a few are wrong (e.g.
  "find f(x)" from f′(x) tagged Differentiation instead of Integration).
- Figure crops are full-width boxes from the last prose line down to the "Figure n" caption; diagrams without captions
  aren't cropped separately but are always inside the part's page crop.

## Running it locally

```bash
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm papers:ingest --subject mathematics --units WMA11     # add --dry-run to see what it would fetch
pnpm papers:parse --unit WMA11                              # queue + run parse jobs (QP, MS, ER)
pnpm papers:grade-boundaries
pnpm papers:check-links --subject mathematics --limit 50
pnpm dev                                                    # /past-papers, sign in as demo@study-ial.test
```

Other commands: `pnpm papers:parse --unit WMA11 --fresh` (ignore the parse cache), `--vision` (re-read with the
vision model), `pnpm papers:tag` (re-tag topics). Reports from ingest runs go to `.cache/ingest/`.

### Environment variables (all in `.env.example`)

| Variable | Needed for |
| --- | --- |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Production storage. Without them, `.storage/` is used (doesn't persist on Vercel). |
| `STORAGE_LOCAL_DIR` | Optional local storage path. |
| `OPENROUTER_API_KEY`, `AI_MODEL_VISION`, `AI_MODEL_SMART`, `AI_MODEL_FAST` | Vision parsing of scans/photos, AI marking, explanations, similar questions, generation. Everything else works without. |
| `AI_DAILY_LIMIT_MARKING`, `_TUTOR`, `_PARSE`, `_GENERATE` | Per-student daily caps. |
| `PAPERS_RESTRICTED_MONTHS` | Restricted window (minimum and default 12). |
| `PAPERS_UPLOAD_MAX_MB`, `_MAX_PAGES`, `_MAX_IMAGES`, `PAPERS_UPLOADS_PER_DAY` | Upload limits. |
| `CRON_SECRET` | Protects the daily parse-queue sweep at `/api/papers/jobs`. |
| `NEXT_PUBLIC_TAKEDOWN_EMAIL` | Shown on `/takedown`. |

### Deploying

1. Create a **private** R2 bucket (no public access, no custom domain). Add a CORS rule allowing `GET` from the app's
   origin: the pdf.js viewer fetches the 5-minute signed URLs from the browser.
2. Set the variables above in Vercel. `vercel-build` runs the two new migrations.
3. Run ingest, parse and grade boundaries **from a machine with the production `DATABASE_URL` and `R2_*`** (they're
   scripts, not Vercel functions). Ingest is resumable, so it can be stopped and restarted.
4. `vercel.json` adds a daily cron (`/api/papers/jobs`), which is fine on the Hobby plan.

## Known issues

- No live test of anything needing `OPENROUTER_API_KEY`: vision parsing, AI marking, explanations, "similar
  question", question generation and its self-check. Their prompts, schemas, normalisation and fallbacks are unit-tested,
  and the non-AI paths (layout parse, self-marking, scheme/examiner fallbacks) were exercised end-to-end in a browser.
- No live R2 test (the adapter is type-checked and covered by the factory test only).
- Photo uploads can't be read into questions without AI: they upload, display and can be viewed, but show "reading it
  needs AI".
- Uploads are capped at 4 MB per request (Vercel's body limit); photos are shrunk in the browser first.
- Page images render on demand the first time they're requested, which costs CPU on cold pages; there's no per-user
  rate limit on the page-image route yet.
- The 2013-spec (legacy) papers and Chemistry/Biology haven't been bulk-parsed yet; their formats are the same
  families as the ones tested, but expect more papers to land in "needs review".
- `pdfjs-dist` triggers a harmless Turbopack warning ("can't be external") from the browser-only worker URL.

## Next three things

1. **Turn on AI and R2 in production and measure.** Set `OPENROUTER_API_KEY` and the R2 variables, run
   `pnpm papers:parse --unit WMA11 --vision` on two or three papers, compare the LaTeX stems and figure boxes with the
   layout result on the review screen, and mark a few real answers to calibrate AI marking against the scheme.
2. **Parse everything and clear the review queue.** Run `pnpm papers:parse --unit <all units>`, then work through
   `/admin/papers` → NEEDS_REVIEW (most fixes are a mark or a crop). Consider an admin bulk-review view and an
   AI tagger for the parts the heuristic leaves untagged.
3. **Direct-to-R2 uploads and rate limits.** Presigned PUT uploads lift the 4 MB cap for big PDFs; add a per-user rate
   limit on page-image rendering and attempt-photo uploads.
