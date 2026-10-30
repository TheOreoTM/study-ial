# Lo-fi Study Room · R2 A — Refined

Same direction and same copy as the baseline (`app/design-lab/lofi-study-room/impeccable/`), redone with tighter
craft. It went through the Impeccable `typeset`, then `layout`, then `polish` passes. No new concept was added.

## Changes from the baseline

### Hierarchy (#1)

- **Cassette moved out of the tracklist.** The 184px cassette that sat between the deck label and the tracklist is now
  a 4.5rem tape on the deck label (3.25rem on mobile).
- **Desktop fold:**
  - The deck now runs from y 288 to 749, and the next-up line sits at y 685–727, both well above the 900px fold.
  - The baseline deck was cut at y 904.
- **Mobile deck position:**
  - The deck now starts at y ≈620 inside the first 844px screen.
  - The window is a short band of sky behind the deck's top.
  - The CTAs are full width.
- **Audience line and stats.** They are now one group, after the deck, on every width. They no longer split around it.
- **One Lamp.** The cued track is the brightest object on the page:
  - a stronger lamp wash (32% → 12%);
  - an 80% lamp ring and an offset warm shadow;
  - warm-white text;
  - lit meter segments in light terracotta.
- **Less mustard.** The countdown became a soft mustard-tinted chip, and the nav "Get started" became a mustard-ringed
  outline pill. Solid mustard now belongs only to the hero CTA.

### Colour and mood (#2)

- **Page background.** The page now goes from a dusk plum at the top (`#31213a`) to a night plum at the bottom
  (`#221726`). The closing sunset now reads as the end of the evening.
- **Steps tape.** It is at full strength (it was at 0.55 opacity) and has a warm shadow underneath.
- **Mustard limited.** Feature titles and step numerals are now warm white instead of mustard. Mustard is kept for the
  CTA, the deck code, the countdown and the "developing" level.

### Typography (#3)

- **Body weight.** Body text is M PLUS Rounded 1c at weight 500 (it was 400), with 1.62 leading and +0.005em
  tracking. It no longer reads thin next to Fredoka 600.
- **Level labels.** The mastery level labels are now their own grid item at 14px / 700 (they were 13px / 500).
- **One title role.** h3 and feature titles now share a single 1.375rem title role.
- **Display scale.** The display tops out at 5rem, h2 at 3.125rem, and there is a named type-role scale in tokens.
- **Line breaks.** `text-wrap: pretty` / `balance` on the subtext, body, next-up line and footer. The next-up line now
  fits on one line on desktop and wraps evenly on mobile.
- **Fonts.** Fonts load only the weights in use: Fredoka 600 (it was 400/500/600) and M PLUS Rounded 500/700 (it was
  400/500/700).

### Spacing and rhythm (#4)

- **Lamp position.** The lamp now hangs in the gap between the copy and the window (on the right on mobile). The h1
  starts at y 190 (it was 234) and the hero top padding dropped about 3rem.
- **Section rhythm.** It is now varied:
  - tight from the hero into "How it works";
  - standard into Features;
  - tight into Subjects;
  - generous before the closing band.
- **Subjects:**
  - The heading sits at the top of the left column.
  - A small potted plant stands on the shelf board at the other end.
  - The board now runs the full row under both. This removes the empty left column.
- **Mobile J-card.** It is a tighter list: about 1.05rem panel padding and a 1.25rem title. The section is about 150px
  shorter.

### Mood (#5)

- **Closing band.** The sun now sits on the horizon, unclipped, with a sea strip and reflection lines in front of it.
  The sea fades into the footer colour, so there is no seam. The footer gets a dotted rule.
- **Subject spines.** They are dusted toward a warm grey (82/18 mix, lower chroma, same lightness) and get a top
  highlight, so they read as plastic cases rather than flat slabs.
- **Not done here.** The J-card itself is structurally unchanged (fold rules only). A deeper reinvention of the insert
  is left to version B, since A adds no new ideas.

### Audit fixes

- **Ghost button ring.** Raised to 48% (4.1:1, it was 2.84:1).
- **Unlit meter segments.** Raised to 20%. On the cued row they are 26%.
- **Nav targets.** Brand, nav links and "Get started" are now at least 44px tall.
- **Raw hex.** Raw hex values were promoted to tokens: `--light-bright`, `--terracotta-light`, `--plum-lift`,
  `--ink-hover`, `--shelf-edge`, `--sun`, `--dust`, and the wall-dusk and wall-night tones.
- **Deck label.** The deck figure is labelled "WPH11 Mechanics and Materials" (it was just "WPH11").

## Fonts and colours

- **Fonts:** the same families, Fredoka and M PLUS Rounded 1c, with fewer weights.
- **Colours:** the same palette, with new derived tokens: wall-dusk `#31213a`, wall-night `#221726` and dust `#bfa7a5`.

## Audit status

- **Contrast:** all text is AA.
  - Warm white on the cued row: 4.9:1.
  - Mustard-light on the countdown chip: 5.6:1.
  - Ink on the dusted spines: 5.3 to 8.4:1.
  - Closing text: 5.3:1 or better.
- **Overflow:** no horizontal overflow at 390, 820 or 1440, and no console errors.
- **Touch targets:** every interactive element is at least 44px.
- **Detector:** `impeccable detect` finds 0 issues in this folder.
- **URL scan:** 2 findings, both intentional:
  - `dark-glow` on the cued track. This is the One Lamp highlight, and it is the only glow on the page.
  - `shape-assembled-illustration` on the window SVG. It is a code-drawn scene by design.
- **Reduced motion:** the reel spin, lamp breathing and cued-meter pulse stop, and hover lifts are removed.

### Left as is

- **Non-text contrast on the meters.** Unlit segments are 1.75:1 against the card. The score and level are always
  given as text, so the meter is redundant.
- **Ambient loops.** The baseline's infinite ambient animations (reels, lamp breathing, meter pulse) are kept in A.
  Version C removes them.
