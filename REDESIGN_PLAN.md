# Redesign plan: Playful Pop B

Source of truth: `app/design-lab/r2/playful-pop/b` (the chosen direction) and its codified system in
`app/design-lab/system/` (tokens, components, marketing page, practice screen). Two tiers: bold marketing on the
landing page, calm app tier everywhere else (cream/white, colour only for actions, progress and mastery).

Every item: change → `pnpm typecheck && pnpm lint && pnpm test` → Playwright screenshots (light + dark, 1440 + 375,
demo user for app pages) → fix what's broken → commit → tick.

## Design system

- [ ] Tokens in `app/globals.css` (light + matching `.dark`), Baloo 2 + Figtree in `app/layout.tsx`, `masteryTone` in
      `lib/mastery.ts`, `themeColor` and `app/manifest.ts`

## Shared UI

- [ ] `components/ui/*` (button, card, input, badge, tabs, dialog, etc.) restyled to the app tier
- [ ] `components/shell/*` + app layout (top app bar, pill nav, mobile menu), `Logo`, `PageHeader`, `EmptyState`
- [ ] `components/mastery/*` (badge, bar, breakdown) in the mastery colours

## Landing

- [ ] Landing page (`app/page.tsx`): bold tangerine/grape marketing tier from Playful Pop B

## Route groups (app tier)

- [ ] Auth pages: sign-in, sign-up, forgot-password, reset-password
- [ ] Onboarding
- [ ] Dashboard
- [ ] Subjects: index, subject, unit, topic
- [ ] Practice
- [ ] Progress
- [ ] Plans: list, new, detail
- [ ] Focus
- [ ] Settings
- [ ] Admin: overview, questions list, question editor (new/edit), import
- [ ] Not-found and error pages

## Final pass

- [ ] `/impeccable audit` on every page and fix issues
- [ ] `/impeccable document` to rewrite `DESIGN.md` from the shipped app
- [ ] Final screenshots in `screenshots/final/`
- [ ] `MORNING_REPORT.md`
