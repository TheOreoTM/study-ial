# Playful Pop · R2 B (Pushed)

Starts from the baseline (`app/design-lab/playful-pop/impeccable`). It applies the same five critique fixes as R2 A, then runs bolder and colorize, then polish. Fonts are unchanged (Baloo 2 800 + Figtree), and the copy is verbatim.

## Critique fixes (shared with A)

All five issues, **#1 to #5**, are fixed the same way as in A:

- Phone hero order: the board comes straight after the CTAs, at y≈547 at 390px (was 759). On phones "Browse the syllabus" becomes a text link, and the stats become a plain row placed after the board.
- Each step has a product fragment. The features use inline icons with a plum "Mastery you can see" lead tile (icon-tile-stack ×6 → 0).
- Mastery colours (lagoon, sun, gum) are reserved for mastery data. Subjects have their own identity colours.
- A 4-role type scale, `text-wrap: pretty`, and a 2-line features H2.
- No infinite loops, no cropped circles, and no subject stagger.

## The pushed layer (bolder + colorize)

The idea: amplify the motif the brand already owns, which is the logo's rising bars (= mastery), plus a game-board dot grid.

- **Hero**:
  - A dot-grid texture over the tangerine.
  - A "skyline" of 12 rising rounded bars in two deeper tangerines (`#f2672b`, `#e85a1f`) along the bottom. It reads as a mastery chart climbing left to right, behind the board.
  - A hand-drawn cream underline under "next." The headline text is unchanged; the last word is wrapped in a span.
  - Bigger stat numerals, up to 48px.
- **How it works**:
  - Now a full **grape field** with a white dot grid, which makes it the second saturated peak of the scroll.
  - The steps form a **level path**: 64px white level nodes (grape numerals) on a chunky 12px track. The track is horizontal from 720px and vertical on phones.
  - The fragment cards tilt like dealt cards on desktop (flat on phones).
  - All text on grape is white (≥5.8:1).
- **Features**: a faint ink dot grid on the cream ground. The lead tile title goes up to 48px, with thicker mastery bars.
- **Subjects**:
  - Each card has an oversized glyph of its subject icon (168px, 13% opacity) bleeding off the bottom-right corner. It straightens from -12° on hover.
  - A row of **unit pips** (one per unit: 6, 6, 6, 9, 5) shows the unit count as data.
- **Closing**: the cropped grape circle is replaced by three huge rising bars in **weak → developing → strong** colours (gum, sun, lagoon). This is the logo's motif used for its real meaning, "closer than it looks". Shown from 720px up.
- **New colour tokens**: `--tangerine-deep #f2672b`, `--tangerine-deeper #e85a1f` and `--grape-deep #5532d6`, used for the node numerals. Everything else comes from A's palette.

## Audit (1440 / 820 / 390)

- **Overflow**: scrollWidth equals the viewport at all three widths. The bars and glyphs sit in `overflow: hidden` sections.
- **Contrast**: 0 AA failures at 1440 and 390.
- **Tap targets**: none under 44px.
- **Focus**: unchanged from A.
- **Reduced motion**: 0 animations under `prefers-reduced-motion`.
- **Performance**: LCP is the H1, at 220ms on desktop and 204ms on mobile (dev server). CLS is 0.
- **Detector**: URL scan finds only `bounce-easing` (advisory). This is the intentional hover and press spring.

## Left open

- On phones the hero skyline is mostly hidden behind the board, and the closing bars are hidden below 720px to avoid colliding with the CTA. On mobile the pushed identity therefore rests on the dot grid, the grape level path and the subject cards.
- The mobile features section is a single column (about 1500px).
