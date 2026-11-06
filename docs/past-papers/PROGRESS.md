# Past Papers — progress

## Status

| Milestone | State |
| --- | --- |
| 1. Index & ingestion | ✅ Done. Pearson discovery via Algolia, filters, polite fetcher, storage adapters, ingest + link checker. |
| 2. Index UI & workspace | ✅ Done. `/past-papers`, `/past-papers/[unit]`, `/papers`, `/papers/[id]` side-by-side viewer, file route. |
| 3. Upload & parsing | ⏳ Next |
| 4. Attempt, mark, explain | — |
| 5. Original question bank | — |
| 6. Extras | — |

## Ingest results

- Storage: **local filesystem** (`.storage/`). R2 credentials are not configured in this environment, so everything
  was built and tested against the local adapter; the R2 adapter is covered by type checks and the factory test only.
- WMA11 end-to-end (2026-11-06): 68 files discovered and stored (23 sittings × QP/MS/ER; June 2021 has no examiner
  report on Pearson's site), 136 requests, re-run stored 0 and made 0 requests.
- Restricted window: 139 files on `/content/dam/secure/…` paths skipped without being requested (January and June
  2026 plus a few 2024 re-issues).

## Known issues

- R2 bucket needs a CORS rule for `GET` from the app origin (the pdf.js viewer fetches signed URLs from the browser).
