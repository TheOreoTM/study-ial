# Decisions: making Study-IAL feel fast, premium and "magical"

Agreed with the product owner on 6 Nov 2026 (interview in the Claude Code session). Each decision lists what we
chose, why, and what it means for the code. Status: **Decided** = agreed and binding; **Building** = in progress;
**Later** = agreed direction, not scheduled.

## Measured starting point

- Whole curriculum as a search index (327 subjects/units/topics with every spec point): 97 KB JSON, **25 KB gzipped**.
- Full search over it: **~2 ms** per query on a laptop (Node), with no precomputation.
- Every request does **2 database round trips** just to resolve the session (Better Auth has no cookie cache).
- Functions already run in Singapore (`sin1`) next to the Neon database; students are in the Maldives (~60–100 ms
  away).
- No view transitions; 2 font families, 8 weights.

## 1. Live search — Building

- **Command palette + live /search page.** ⌘K / Ctrl+K or `/` opens a search overlay anywhere in the app; results
  update on every keystroke; ↑↓ + Enter to open; ⌘/Ctrl+Enter for a topic's quick action (Practise). `/search` is
  live too and keeps a shareable URL (updated with `replaceState`, no navigation).
- **It runs in the browser.** The curriculum index is served once from a CDN-cached route (`/api/search/index`) and
  prefetched when the browser is idle; every keystroke is answered locally. No request per keystroke.
- **Scope:** curriculum (subjects, units, topics, spec points), **pages & actions** ("mock", "settings", "practise weak
  topics"), and, when signed in, **questions you've attempted** (only those, never unseen stems or drafts) and **your
  mock papers**. Personal results come from `/api/search/personal` (private, no-store), fetched when the palette opens.
  Questions on a mock paper you're sitting are excluded (`getLockedQuestionIds`).
- **Signed-in results carry your data:** topic rows show your mastery tile/score and a "Practise" quick action.
- **Empty state:** your recent picks (stored on this device only) and "jump back in" (topics you practised most
  recently).
- **Past papers:** not in this round — the owner has a separate idea for past papers. The design leaves room for a
  `paper` result kind.

## 2. Sessions — Decided, Later

Turn on Better Auth's **cookie cache for 5 minutes** (`session.cookieCache`), so pages skip the session lookup.
Trade-off accepted: a sign-out elsewhere takes up to 5 minutes to apply on other devices. Role changes
(`ADMIN_EMAILS`) still come from the fresh `user` row in `getUser()`.

## 3. Rendering: Cache Components (Partial Prerendering) — Decided, staged, Later

Enable `cacheComponents` and migrate route by route, measuring each step:
1. Public curriculum pages (`/subjects/**`, `/search` shell): static shell from the CDN, personal bits streamed.
2. Dashboard, then practice, then the rest of the signed-in app.
Every page's data boundary gets reviewed; anything personal moves behind `<Suspense>`.

## 4. Motion — Decided, Later

**Subtle transitions:** cross-fade between pages (View Transitions), the palette and dialogs ease in, mastery bars
animate when they change. All ≤ ~200 ms on `cubic-bezier(0.16, 1, 0.3, 1)`, and none for `prefers-reduced-motion`.
DESIGN.md's "state changes only" rule is relaxed to allow page transitions; no looping or decorative animation.

## 5. Measuring — Decided, Later

**Our own web-vitals table:** a tiny beacon sends LCP, INP and CLS per route to Postgres; an admin page shows p75 by
route and device class. No third party, no keys.

## 6. Baseline — Decided

**Laptops first** (most revision happens on school/home laptops), phones a close second. Budgets for a mid laptop on
home broadband to Singapore: interactions under 100 ms, navigations show content (or a skeleton) under 200 ms, search
results under 16 ms per keystroke. Every screen must still work and look right at 375 px.

## 7. Hosting plans — Open

Not decided yet. We design for the free tiers (Vercel Hobby, Neon Free, which suspends the database after ~5 min idle,
adding 0.5–1 s to the first request after a quiet spell). What paid plans would buy: an always-on production database
(no cold starts) and Vercel's own analytics. CDN caching (search index, then Cache Components) is what keeps the free
tier feeling fast.
