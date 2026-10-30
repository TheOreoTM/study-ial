# Morning report: Playful Pop B redesign

Branch `rewrite`, not pushed. Every checklist item in `REDESIGN_PLAN.md` is done and nothing was blocked. On the final
state, `pnpm typecheck` is clean, `pnpm lint` has 0 errors (the 14 warnings were there before), and `pnpm test` passes
109/109. No server actions, queries, auth, schema, migrations or `.env` were touched. I diffed every `actions.ts`,
`service.ts`, `session.ts`, `select.ts`, `lib/*` and timer/stats logic file, and the client components with handlers
only changed in markup.

Final screenshots (120 PNGs) are in `screenshots/final/`. They cover every route in light and dark at 1440px and 375px,
plus onboarding steps, practice marked states, the session summary and the running focus timer.

## Five pages to look at first

1. **`/`** (landing): `screenshots/final/landing-*.png`. This is the marketing tier, ported from the R2 B direction:
   a tangerine hero with dot grid, skyline and mastery board, a grape level path, subject cards and a plum closing band.
   Also check it in dark mode.
2. **`/practice?topic=…`** (practice session): `practice-mcq-wrong-*`, `practice-written-self-*`, `practice-summary-*`.
   It's the product's most important screen, ported from `design-lab/system/practice`: answer cards, session progress
   segments and the mastery rail.
3. **`/dashboard`**: `dashboard-*`. I made a judgement call on which action gets the one orange button (details under
   "Decisions").
4. **`/subjects/physics/wph11`** (unit page): `unit-*`. The signature Mastery Row and the "next up" topic are both here.
5. **`/sign-in`**: `sign-in-*`. This is the threshold between the two tiers: an app-tier form with a tangerine brand
   panel from 1024px up.

## What was done (commits, oldest first)

| Commit | What |
|---|---|
| `4106fe1` | Snapshot of your uncommitted design-lab work (see Decisions) |
| `9c5c2b3` | Design tokens in `app/globals.css` (light and a matching plum `.dark`), Baloo 2 + Figtree, `masteryTone`, theme colours, manifest |
| `4be146c` | All `components/ui/*` restyled: pill Baloo buttons, 44px controls, 28px cards, grape for selection and progress |
| `e78ee79` | Shell: white top app bar with pill nav and avatar menu, the rising-bars logo, `PageHeader`, `EmptyState` |
| `9b2931d` | Mastery badge, bar and breakdown, plus a new `MasteryTile` code tile |
| `04b27f0` | Landing page (marketing tier) |
| `b7abc46` | Auth pages, onboarding, unit pickers, 404 and error page |
| `57f7477` | Admin (overview, questions table, editor, import) |
| `3ca9e9a` | Dashboard and plans (list, new, detail) |
| `82b6a04` | Progress and focus |
| `e47c784` | Subjects, all four levels |
| `140c169` | Shared fixes after reviewing the route work |
| `621ecea` | Practice session, rail and summary |
| `ea0d3d6` | Accessibility fixes from the audit |
| `44f423c` | Final screenshots |
| `13155af` | `DESIGN.md` + `.impeccable/design.json` refreshed via `/impeccable document`. It keeps your North Star and named rules, now describes the shipped tokens, the plum dark theme and the components, and adds a "One Orange Rule" |

The route groups ran as six parallel subagents after the design system and shared UI were in place. I reviewed every
group's screenshots before ticking it.

## Audit summary (`/impeccable audit`)

I ran axe-core (WCAG 2.0/2.1/2.2 AA and best practice) on every page, signed in and signed out, in light and dark at
1440px and 375px. I also ran a touch-target (<24px) and horizontal-overflow check, the impeccable URL detector on public
pages, and the source detector on `app/`, `components/` and `lib/`.

| Dimension | Score | Notes |
|---|---|---|
| Accessibility | 3/4 | No contrast failures in either theme. I fixed an unnamed slider, an unlabelled file input, unfocusable scroll regions, a missing `<main>` on auth pages and a heading-order skip. 20px checkboxes remain, each with a clickable label (spacing exception). |
| Performance | 3/4 | `next/font` loads 2 families and 8 weights. No layout-property animation. Not profiled beyond that. |
| Theming | 4/4 | Tokens only. The only hex in TS/TSX is in metadata (`themeColor`, manifest), which can't take CSS variables, and the Google logo SVG. Dark mode was checked on every page. |
| Responsive | 3/4 | No page-level horizontal scroll at 375px anywhere. Some phone pages are long (see rough edges). |
| Implementation integrity | 3/4 | The source detector found nothing outside `app/design-lab/`. The URL detector flags only `cream-palette`, which your brief requires (false positive). |
| **Total** | **16/20** | Good |

## Decisions I made on your behalf

**Repo housekeeping**
- Your uncommitted work (the design lab, the "notebook" landing experiment in `app/page.tsx` and `globals.css`,
  `DESIGN.md`, `PRODUCT.md`, `.impeccable/`, `public/design-lab/`) is committed as `4106fe1` before the redesign, so
  nothing was lost. That includes about 21MB of design-lab images in `public/design-lab/`. Drop or squash that commit
  if you don't want them in history. `.claude/` stays untracked.
- `components/landing/ink.tsx` and `notebook-page.tsx` (from the notebook experiment) are no longer imported but were
  not deleted.
- The final screenshots (about 18MB) are committed in `screenshots/final/`, as asked.

**Design system**
- "Playful Pop B" means `app/design-lab/r2/playful-pop/b`. Its codified form, `app/design-lab/system/`, plus the existing
  DESIGN.md were the spec.
- I kept shadcn's token names and mapped them onto the Playful Pop palette:
  - `primary` = tangerine, with **ink** text.
  - `accent` = sand (hover ground).
  - New tokens: `selected`/`selected-foreground` (lilac/grape), `progress`, `track`, `border-strong`, `primary-soft`
    ("next up" ground), `mastery-*` fill/text/pale, `on-mastery`, and `shadow-card/raised/action`.
- **Dark theme** (DESIGN.md had none): deep plum page (#1b1026) and cards (#261835), cream text. Mastery text uses the
  bright fills. Orange buttons keep ink text.
- **Danger colour**: a red (#c0262d light / #ff7373 dark), deliberately distinct from the mastery raspberry and
  bubblegum, so "delete" never reads as "weak topic". `success` = deep teal and `warning` = deep amber.
- **Fonts**: Baloo 2 is applied to h1–h3 globally, plus buttons and numbers through a new `num` utility. Figtree is the
  body font at weight 500.
- **Reduced motion**: a global rule sets animations and transitions to near-zero. The audit guidance prefers per-component
  alternatives; state changes still show instantly, so I kept it.
- **Icons**: app icon and favicon PNGs were not redrawn. The in-app logo is the new SVG rising-bars mark. A matching
  `icon.png` is worth making.

**Shell and navigation**
- The left sidebar is replaced by a **white top app bar with pill nav**, following DESIGN.md and the reference practice
  screen.
- On desktop, **Settings moved into the avatar menu** to keep the bar to the core loop. It's still in the mobile menu.
- Phones keep the existing slide-in menu rather than the horizontally scrolling nav row DESIGN.md sketches.
- Signed out, the bar shows "Sign in", plus an outline "Create free account" from 640px up. It's outline so each page
  owns its single orange action.

**One orange per view (applied everywhere)**
- **Dashboard**: the orange button is the **first unfinished task in today's plan** (marked "Up next"). The header's
  "Practise weak topics" becomes outline while such a task exists and turns orange otherwise.
- **Subjects pages**: "Practise unit" is outline. The topic page's duplicate "Start practice" was removed; the header one
  stays.
- **Practice**: with AI off, "Mark it myself" is the orange action. With AI on, the original arrangement returns. The AI
  path was not tested, because there's no `OPENROUTER_API_KEY` locally.
- **Focus**: Start/Pause is the only orange button; "Finished this task?" is outline.
- **Plans/new**: selected units and study days are lilac/grape (selection), not orange.

**Colour roles**
- Subject identity colours (grape, sky, lime, tangerine, lilac) appear **only on the landing page**. In the app, subject
  monograms are neutral.
- `app/(app)/subjects/_components/accent.ts` (raw Tailwind palette colours) was deleted, so `Subject.color` from the DB is
  no longer used anywhere in the app.
- Task types (Learn/Practice/Review/Past paper), question difficulty and admin statuses use neutral or semantic chips,
  never mastery colours.
- The practice progress strip adds a **sun "partial marks" segment** between teal (full) and bubblegum (none), for
  written answers.

**Small additions and copy**
- New copy (light, clearly presentational):
  - Auth panel: "Practise a topic. Watch your bar rise."
  - Focus break: "Step away from the screen".
  - Practice rail: "Mastery comes from your last 10 answers in each topic and updates as you go."
  - "Revise next" label on the next-up topic.
  - Practice marks counter: "x of y marks" (was "x/y marks").
- **Practice header**: new "End session" link to the existing back destination. Attempts save per question, so nothing is
  lost by leaving.
- **Dashboard rows**: "Revise next" rows are now whole-row links to the same practice URL; before, only an inner button was
  a link.
- **Reset password**: with no token, the page now gives a "Request a new link" button (same destination as the old
  inline link).
- **Settings**: kept its structure. Its look comes from the shared components.

## Blocked

Nothing.

## Known rough edges

- **Bug found, not fixed (out of scope)**: `/progress` builds its 7-day activity window from UTC days, not `lib/time.ts`.
  "Today" can be wrong near midnight Maldives time. This predates the redesign.
- **404 page**: shows "Go to today" (to `/dashboard`) even when signed out, which then redirects to sign-in. Same as
  before.
- **Onboarding**: the "Pick at least one unit to continue" error stays visible after picking a unit until you press
  Continue again (existing behaviour).
- **Phone layout**:
  - Unit-page topic rows and the unit-mode practice rail make long pages.
  - The unit page's two header buttons stack.
  - The admin question editor's Type select truncates "Multiple choice", and its save bar wraps to two rows.
- **Landing**: on phones the hero skyline mostly hides behind the board, and the closing bars only appear from 720px
  (same as the reference).
- **Dark mode**: the "next up" tangerine-tinted ground reads a little brown. I nudged it rosier, but it's the hardest
  colour to get right on plum.
- **`.prose-study`**: its CSS in `globals.css` is unlayered, so it beats Tailwind utilities on the same element. Practice
  uses `!` overrides. Moving it into `@layer components` would be cleaner.
- **Dev data**: the demo user has many extra practice attempts from the click-throughs, which shifted its mastery scores.
  A throwaway account `onboard-test-<timestamp>@example.com` (not onboarded) is in the dev DB. Re-run `pnpm db:seed` or
  delete it if you care.
- **Dev server**: after changing fonts in `app/layout.tsx` it served a stale layout until restarted (CLAUDE.md already
  mentions this for schema changes; it applies to the root layout too).
- **Formatting**: prettier isn't installed, so new files were hand-formatted to the 4-space/120-col style. Run prettier
  once it's available. `app/(app)/settings/password-form.tsx` already failed prettier before this work.
