# Redesign plan: Playful Pop B

Source of truth: `app/design-lab/r2/playful-pop/b` (the chosen direction) and its codified system in
`app/design-lab/system/` (tokens, components, marketing page, practice screen). Two tiers: bold marketing on the
landing page, calm app tier everywhere else (cream/white, colour only for actions, progress and mastery).

Every item: change → `pnpm typecheck && pnpm lint && pnpm test` → Playwright screenshots (light + dark, 1440 + 375,
demo user for app pages) → fix what's broken → commit → tick.

## Design system

- [x] Tokens in `app/globals.css` (light + matching `.dark`), Baloo 2 + Figtree in `app/layout.tsx`, `masteryTone` in
      `lib/mastery.ts`, `themeColor` and `app/manifest.ts`

## Shared UI

- [x] `components/ui/*` (button, card, input, badge, tabs, dialog, etc.) restyled to the app tier
- [x] `components/shell/*` + app layout (top app bar, pill nav, mobile menu), `Logo`, `PageHeader`, `EmptyState`
- [x] `components/mastery/*` (badge, bar, breakdown) in the mastery colours

## Landing

- [x] Landing page (`app/page.tsx`): bold tangerine/grape marketing tier from Playful Pop B

## Route groups (app tier)

- [x] Auth pages: sign-in, sign-up, forgot-password, reset-password
- [x] Onboarding
- [x] Dashboard
- [x] Subjects: index, subject, unit, topic
- [x] Practice
- [x] Progress
- [x] Plans: list, new, detail
- [x] Focus
- [x] Settings
- [x] Admin: overview, questions list, question editor (new/edit), import
- [x] Not-found and error pages

## Final pass

- [x] `/impeccable audit` on every page and fix issues
- [x] `/impeccable document` to rewrite `DESIGN.md` from the shipped app
- [x] Final screenshots in `screenshots/final/`
- [x] `MORNING_REPORT.md`
