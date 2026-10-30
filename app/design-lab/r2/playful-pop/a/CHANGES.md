# Playful Pop · R2 A (Refined)

Starts from `app/design-lab/playful-pop/impeccable`. Same world, same fonts (Baloo 2 800 + Figtree), same copy. Passes: critique fixes → typeset → layout → polish.

## What changed from baseline

- **Hero order (#1)**: on phones the order is now H1, subtext, primary CTA, then the board. "Browse the syllabus" becomes an underlined text link below 480px. The audience line and stats come after the board. Board top is now at y≈547 at 390px (was 759), and the hero is 1279px tall (was 1364). On desktop, stats and audience sit under the copy column (`copy / meta | board` grid), so the hero has two masses instead of three.
- **Stats (#1, #4)**: the rotated sticker discs are replaced by a plain stats row with Baloo numerals (28–36px) and 16px labels. The baseline labels were 13.6px.
- **Audience chip**: now a solid cream fill. Fixed a specificity bug where `.page p` was zeroing its padding, which made the text look clipped.
- **How it works (#2)**: the staircase and dotted connectors are gone. Each step now opens with a small product fragment drawn from the example unit, all `aria-hidden`:
  - the WPH11 unit chip and countdown
  - topic 1.5 with a row of marks (tick / cross / empty)
  - the 38% weak bar with a dashed run ahead of it
  
  The three steps sit level, each with a small ink number badge inline with its title. The section is 549px tall at 1440 (was 653).
- **Features (#2, #3, #4)**: the icon-tile-above-heading pattern is removed (detector: icon-tile-stack ×6 → 0). Icons now sit inline beside each title. "Mastery you can see" is the lead tile: plum, spanning two rows, and carrying a mini mastery strip in the real level colours. The other tiles are white. The section is 916px tall at 1440 (was 1215) and 1563px at 390 (was 1731).
- **Colour system (#3)**: lagoon, sun and gum now appear only where a mastery level is shown (board, strips, marks, logo bars). Subject cards use identity colours that never collide with mastery: Physics grape, Chemistry sky `#5cc8ff`, Biology lime, Mathematics tangerine, Further Mathematics lilac `#c7b6ff`. Other colour changes:
  - the board's unit chip is grape, matching Physics
  - the countdown chip is cream, no longer weak-pink
  - the How section ground is lilac-pale, no longer lagoon tint
  - the closing sun CTA stays: it is an action on plum, not a mastery state
- **Type scale (#4)**: four display roles as tokens: display `clamp(3rem, 8.2vw, 6rem)`, section `clamp(2.25rem, 4.6vw, 3.5rem)`, card `clamp(1.5rem, 2.1vw, 1.875rem)`, and label 0.8125rem. All card titles now share one size, with only the lead feature larger. Body text has `text-wrap: pretty` (fixes the two stragglers). The features H2 now runs to 2 lines at 24ch (was 3 lines). Step body copy is darker (`#4d335f`).
- **Motion and decoration (#5)**: the infinite `bob` and `pulse` loops are gone. The weak row now lifts once, at 600ms ease-out after the bars fill, and the play button pulses once. The cropped decorative circles (top-right and lower-left of the hero, grape circle in the closing band) are removed, and so is the 32px stagger on even subject cards. The spring easing remains only on hover and press.
- **Spacing**: a 4-based spacing scale (`--s-1` to `--s-8`) and a shared `--section-y`. The logo bars use tokens, not hex.

## Critique issues fixed

All five: #1, #2, #3, #4 and #5.

## Audit (1440 / 820 / 390)

- **Overflow**: scrollWidth equals the viewport at all three widths.
- **Contrast**: 0 AA failures at 1440 and 390.
- **Tap targets**: none under 44px.
- **Focus**: visible 3px focus on every stop (plum, or sun on dark grounds).
- **Structure**: heading order is H1 > H2 > H3, and the header, nav, main and footer landmarks are present.
- **Reduced motion**: 0 animations under `prefers-reduced-motion`.
- **Performance**: LCP is the H1, at 296ms on desktop and 200ms on mobile (dev server). CLS is 0. 4 font files, about 106KB in total.
- **Detector**: URL scan finds only `bounce-easing` (advisory). This is the intentional hover and press spring, and it is accepted.

## Left open

- The mobile features section is still a single column of six tiles (1563px). The copy is fixed, so the length comes from the text itself.
- On mobile the nav still wraps to two rows (brand, then links), because the wordmark plus three nav items do not fit in 358px.
