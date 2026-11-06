# Past Papers — decisions

Decisions made while building without stopping to ask. Newest at the bottom of each section.

## Process

- **Branch.** Work happens on `feat/past-papers`, cut from `claude/dazzling-turing-v5nswx` (identical to `main` at the
  time: the redesign had already been merged). The PR targets `main`.
- **Local database.** Tested against a local Postgres 16 (`postgresql://study:study@localhost/study_ial`), the same
  migrations Neon runs in production.

## Discovery & ingestion

- **Pearson discovery uses Algolia, not HTML.** The course-materials page (`…/mathematics-2018.coursematerials.html`)
  is an Angular app whose `courseMaterials` controller reads three hidden inputs (`algoliaAppId`, `algoliaAPIKey`,
  `algoliaIndexName`) and calls Algolia's `browse` API with filters such as
  `category:"Pearson-UK:Specification-Code/ial18-mathematics" AND category:"Pearson-UK:Category/Exam-materials" AND type:"dam:Asset"`.
  That JSON is the listing. The ingest script reads the app id, search-only key and index name **from the public page
  at run time** (so a key rotation doesn't break it) and calls the same endpoint the browser calls.
- **Series comes from the listing.** Each record carries `Pearson-UK:Exam-Series/October-2023`, which is the sitting.
  The filename date (`…-rms-20230112.pdf`) is the publication date and is stored separately (`publishedAt`). If a
  record has no series facet, the title ("… - October 2023") is used, then the PDF cover page text.
- **Restricted window.** Pearson moves the newest sittings to `/content/dam/secure/silver/…` (centre login). On
  2026-11-06 that was exactly January 2026 and June 2026, plus a handful of re-issued 2024 files. Rules, all applied:
  skip any URL containing `/secure/` (robots.txt also disallows `*/secure/*` and `*/silver/*`), skip any sitting that
  ended less than `PAPERS_RESTRICTED_MONTHS` (default 12) months ago, and reject any download that isn't
  `application/pdf` starting with `%PDF-` (missing files redirect to an HTML 404 page). Restricted URLs are never
  requested at all, not even with HEAD.
- **The `secure-content/silver` category tag is not used as the access signal.** Almost every record carries it,
  including files under the open `/content/dam/pdf/` path that download without a login. The URL path is what
  decides.
- **Paper variants.** Filenames like `wma11-01a-que-…` (alternative timezone paper) and `wma12-01r-…` (re-issued
  paper) are separate sittings with paper codes `01a` / `01r`, so each has its own QP/MS/ER and its own storage key.
- **Modified papers** (`Modified-question-paper`, zip files of enlarged/braille-ready papers) are skipped: they are
  zips, duplicate the standard paper, and are accessibility materials.
- **User-Agent** is `StudyIAL-PaperIndexer/1.0 (+https://study.oreotm.xyz/takedown)` — descriptive, links to the
  takedown page, no personal email.
- **PMT is fallback only** and is only consulted for (unit, paper, sitting, type) combinations Pearson's open listing
  doesn't have. For the 2018 Maths spec Pearson hosts every sitting from January 2019 to October 2025, so PMT adds
  nothing there yet; the adapter exists for subjects/sittings Pearson has dropped.

## Storage & serving

- **Signed URL lifetime: 5 minutes**, issued per request by `/api/papers/files/[paperId]` after the session and
  access check. Local storage streams the bytes through the same route instead (no public directory).
- **Serve mode per subject** (`serve: "storage" | "source"` in `lib/papers/config.ts`). In `source` mode the route
  redirects the signed-in user to the stored `sourceUrl` instead of our copy; nothing else changes.
- **Public index is `noindex` and not in the sitemap.** The brief allows metadata on the public index; keeping it out of
  search results as well is the conservative reading of "nothing Pearson-owned on SEO pages".
- **Subject in storage keys follows Pearson's grouping.** Pearson lists Mechanics (WME), Statistics (WST) and
  Decision (WDM) under Mathematics, so their keys sit under `ial/mathematics/…` even though the curriculum seed files
  WME03/WST03 under Further Mathematics. The browse UI groups a sitting by its linked curriculum unit's subject, so
  students see it where they expect; keys never move once written.
- **Unused papers** (prepared for the cancelled January 2022 sitting, `…_UNUSED.pdf`) are skipped: they have no real
  sitting, grade boundaries or examiner report.
- **Corrected re-issues** (`…-updated.pdf`, "(Updated)" in the title) win over the original file for the same slot.
- **Downloads are cached on disk** (`.cache/http/`, gitignored) as well as listings, so a run that fails after
  downloading never requests the same file twice.
- **PMT discovery is manifest-driven** (`data/papers/pmt-manifest.json`). PMT's paper pages render their link lists
  client-side and its sitemaps only expose revision pages, so there's no stable listing to crawl politely. The
  manifest is empty today because Pearson's open listing covers every IAL sitting we index.

## Index UI & workspace

- **Routes.** `/past-papers` (public, `noindex`, metadata only) → `/past-papers/[unit]` (sittings by year, series
  filter). `/papers` is the signed-in workspace and `/papers/[id]` the viewer; `/papers` is in the proxy's protected
  list and disallowed in robots.txt. Nav gets one "Papers" item.
- **"Add to my papers" saves the sitting**, so the question paper, its mark scheme and its examiner report come
  together and stay linked. Any signed-in student can open any public-index sitting; saving is a bookmark plus the
  home for attempts.
- **PDFs are drawn with pdf.js on a canvas**, not embedded with `<iframe>`: Chrome on Android and other mobile
  browsers can't render embedded PDFs, and the canvas renderer behaves the same everywhere. Pages render lazily as
  they scroll into view. "Open in new tab" is always offered.
- **R2 needs a CORS rule** allowing `GET` from the site's origin, because the viewer fetches the 5-minute signed URL
  from the browser. Documented in PROGRESS.md.
- **Someone else's private upload returns 404, not 403**, so ids can't be probed.

## Parsing

- **Two engines, one schema.** Pearson's PDFs are born-digital, so a deterministic **layout engine** reads the text
  layer: question numbers at the left margin in sequence, part labels nested by indentation (so `4(i)(a)` and
  `5(a)(i)` both come out right), marks `(n)` at the right margin, printed totals, "Figure n" captions and each
  part's page region. It costs nothing, needs no API key and is exact on structure: all 23 WMA11 papers parse to
  75 marks matching every printed question total. Typeset maths comes out jumbled in any PDF text layer, so its stems
  are plain text; the **vision engine** (OpenRouter, `AI_MODEL_VISION`, default Gemini 2.5 Flash) produces LaTeX
  stems and figure boxes from page images, using the layout result as a hint and keeping the layout's exact page
  regions and totals. Photos and scans (no text layer) need the vision engine.
- **The real paper is always shown.** Every part keeps its page region, and attempt/review screens show that crop of
  the rendered page beside the extracted text. A garbled stem never stands alone, and diagrams are never redrawn.
  Figures are cropped server-side from our page images and stored under `derived/{sha256}/figures/…`.
- **Marks printed once for a group** ("(i) … (ii) … (iii) … (3)") belong to the parent part, not the last sub-part.
- **Mark schemes are parsed into per-part entries** (mark codes `M1 A1 dM1 B1ft…`, printed part marks, scheme text,
  page regions) plus the examiner guidance under each table. Matching uses the question paper as the truth: exact
  numbers first, then deeper scheme rows folded into the paper's part, then parts borrowing their nearest ancestor's
  entry. AI marking gets crops of the scheme rows, not just their jumbled text.
- **Examiner reports** are split by "Question n" headings and attached to the whole question.
- **Parse cache by file hash** (`PaperParse`, keyed by `sha256 + docType`): each unique file is parsed once; a
  student uploading a copy of an indexed paper gets the indexed sitting itself.
- **Status.** Indexed papers whose parse validates cleanly are `READY`; anything with validation issues, and every
  student upload, is `NEEDS_REVIEW` until someone checks it on the review screen.
- **Background jobs without new infrastructure.** A `PaperJob` table claimed with `FOR UPDATE SKIP LOCKED`, retried
  with backoff (3 attempts), stale locks reclaimed after 10 minutes. Runners: `after()` right after an upload, the
  paper page's status poll, a daily Vercel Cron sweep (Hobby plans only allow daily crons), and
  `pnpm papers:parse` locally. Each run has a 45–50 s budget so it fits the 60 s function limit.
- **Uploads go through a route handler, capped at 4 MB** (Vercel's request body limit is 4.5 MB). Phone photos are
  shrunk to 2,000 px JPEGs in the browser first, so a whole paper of photos fits. Server-side they're re-encoded,
  which also strips EXIF (location) data. HEIC is rejected with instructions. Direct-to-R2 presigned uploads would
  lift the cap and are listed as a next step.
- **Limits** (env-configurable): 4 MB per upload, 60 PDF pages, 30 photos, 10 uploads per student per Maldives day.

## Attempt, mark, explain

- **One part at a time** (`/papers/[id]/attempt?part=…`), with the question's earlier parts shown above as context
  and a navigator of every part coloured by the student's latest score (teal full, sun partial, bubblegum none, the
  same scheme as practice sessions). The whole paper in one sitting is the timed exam mode.
- **Answers**: typed (Markdown with `$LaTeX$`, live KaTeX preview) and/or up to 3 photos of handwritten working, which
  are re-encoded server-side and stored privately under `attempts/{userId}/…`; only their owner can fetch them.
- **AI marking sends images, not just text**: crops of the printed part (with its context) and of the matched
  mark-scheme rows, plus the parsed mark codes and examiner guidance, to the vision model. The model returns marks per
  code with a comment, a justification and feedback; the total is recomputed from its own ticks when they disagree.
  Without a matched scheme the marks are labelled **AI-estimated** (`AI_ESTIMATED`).
- **Self-marking without AI** shows the cropped scheme rows and lets the student tick the M/A/B codes they earned (or
  slide a score when no codes were parsed).
- **Explain / hints / similar question** use the same images. Without AI, "explain" and "hints" fall back to a summary
  of what the scheme awards plus the examiner report's commentary; "similar question" needs AI.
- **Every attempt is stored** (`PaperAttempt`: answer, photo keys, marks, method, feedback JSON, timestamp). Parts
  answered below full marks enter the student's spaced-repetition queue (`PaperQuestionReview`, the flashcards'
  SM-2 scheduler).

## Original question bank

- **Reuses the existing `Question` model and review flow** (`source: ORIGINAL`, DRAFT → PUBLISHED by an admin) with a
  new `generation` JSON column: model, expected answer, self-check result, closest past paper, and issues.
- **Generation** uses the smart model (`AI_MODEL_SMART`) with the topic's spec points and up to three of the bank's
  published questions as house-style examples, under an explicit "original, not a paraphrase" instruction. Questions
  are text-only (no diagrams), so they can be public.
- **Self-check is an independent solve**: a second call (the fast model) solves the question without seeing the
  answer; numbers are compared to 2% (unit powers like `m s^-1` ignored), MCQ letters exactly, otherwise it's
  "unclear" for the reviewer. The scheme's marks must add up to the question's.
- **Copyright guard**: every draft is compared (word-trigram Jaccard) with the unit's parsed past-paper parts; at 35%
  overlap or more it's flagged "too close to WMA11 Jan 2025 Q3(b)". Flagged drafts need an explicit confirm to publish.
- **Public SEO**: topic pages now show up to three published original questions (with the mark scheme behind a
  disclosure). Past-paper content never appears there.
- Admin-only, quota `generate` (60 calls/day by default).
