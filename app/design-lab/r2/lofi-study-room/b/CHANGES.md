# Lo-fi Study Room · R2 B — Pushed

This version starts from the baseline (`app/design-lab/lofi-study-room/impeccable/`) with all five critique fixes from
version A, then turns the room up. It went through the Impeccable `bolder` and `colorize` passes, then `polish`. The
copy is unchanged; the only split is the headline's last word, which is wrapped in its own span for colour.

## Fixes from the critique (shared with A)

- **#1 Hierarchy:**
  - The cassette moved onto the deck label.
  - On desktop the deck now ends at y 811, above the 900px fold. On mobile it starts at y ≈620.
  - The audience line and stats are one group after the deck.
  - The cued track is the brightest object on the page.
  - The countdown chip is soft, and the nav CTA is a ringed outline, so solid mustard belongs only to the hero CTA.
- **#2 Colour and mood:**
  - The page background goes from dusk to night.
  - The steps tape is at full strength.
  - Feature titles and step numbers are now warm white instead of mustard.
- **#3 Typography:**
  - Body text is at weight 500.
  - The 14px / 700 level labels are a grid item of their own.
  - There is one title role and a display scale in tokens.
  - `text-wrap: pretty` / `balance` is set on the long lines.
  - Only the font weights in use are loaded.
- **#4 Spacing and rhythm:**
  - The lamp hangs in the gap between copy and window.
  - Section padding varies.
  - Subjects has a plant on a full-width board.
  - The mobile J-card is a tight list.
- **#5 Mood:** the closing sun sets into a sea that fades into the footer, and the spines are dusted to lower chroma.
- **Audit fixes:**
  - The ghost button ring is now 4.1:1.
  - Unlit meter segments are at 20%.
  - Every target is at least 44px.
  - Raw hex values were moved into tokens.
  - The deck figure is labelled with the unit code and name.

## What B adds

- **Room texture:**
  - A static film-grain layer covers the whole room: an SVG `feTurbulence` tile at 10% opacity in warm cream,
    `pointer-events: none`.
  - Evening light from the window falls through blinds across the hero wall. These are skewed stripes of lamp colour at
    5.5%, masked to fade on all sides.
- **Headline:**
  - It is bigger: up to 5.5rem.
  - The hero grid is 1.14fr / 1fr, so it sets in three lines.
  - "next." is in lamp mustard-light. That is colour emphasis, not gradient text.
- **The desk:**
  - The deck now sits on a desk plank that runs off the right edge of the page.
  - At 1280px and wider, a mustard mug with gently rising steam and two exercise books (teal and rose) sit on the desk
    beside the deck.
  - The props are hidden below 1280px, where they would overlap the deck.
- **Tape run at full volume:**
  - The step reels are bigger (4.5rem), each ringed in its own tape colour: terracotta, mustard, sage.
  - The tape is thicker (8px), horizontal on desktop and vertical on mobile.
- **The J-card is printed in terracotta.** The features insert is now the page's big colour region:
  - ink text on terracotta (5.1:1);
  - dotted ink fold rules;
  - a retro mustard / cream / sage / plum striped spine on the left (a top strip on mobile);
  - a −0.6° tilt on desktop, as if the insert had been dropped on the desk.
- **The shelf has brackets** under the board.
- **The closing sunset** gets a palm on its island silhouetted against the horizon.

## Fonts and colours

- **Fonts:** Fredoka 600 and M PLUS Rounded 1c 500/700 (the baseline loaded more weights).
- **Colours:** the same palette tokens.
  - Terracotta now owns a whole region (the J-card).
  - Mustard-light is used for the headline accent.
  - Teal and rose appear on the desk books.
  - No new hues.

## Audit status

- **Contrast:** all text is AA.
  - Ink on terracotta J-card body text: 5.1:1.
  - Warm white on the cued row: 4.9:1.
  - Ink on the spines: 5.3:1 or better.
  - Closing text: 5.3:1 or better.
  - The grain sits above text at 10% opacity in near-text-coloured specks, with no measurable effect at AA.
- **Overflow:** no horizontal overflow at 390, 820 or 1440.
- **Console:** no console errors.
- **Touch targets:** every interactive element is at least 44px.
- **Detector:** `impeccable detect` finds 0 issues in the source files.
- **URL scan:** 3 findings, all intentional:
  - `dark-glow` on the cued track (the One Lamp highlight).
  - `shape-assembled-illustration` on the window SVG (a code-drawn scene).
  - `repeating-stripes-gradient`, which is the light through the window blinds and is part of the brief's mood.
- **Reduced motion:** the reel spin, lamp breathing, meter pulse and steam all stop, and hover lifts are removed.

## Left imperfect

- **Ambient loops.** Infinite ambient loops remain: reels, lamp breathing, cued-meter pulse and steam. They are slow
  and opacity/transform only.
- **Desk props on smaller screens.** The mug and books only appear at 1280px and wider; below that, only the desk plank
  remains.
- **Blinds legibility.** The blinds pattern sits behind the hero copy. Contrast still passes, but readers sensitive to
  striped backgrounds may notice it.
