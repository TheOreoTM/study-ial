# Lo-fi Study Room · R2 C — Alive

C is version A (the baseline plus all five critique fixes, refined) with motion and delight added through the
Impeccable `animate` and `delight` passes, then a `polish` pass. The copy is unchanged.

## Fixes from the critique (shared with A)

- **#1 Hierarchy:**
  - The cassette now sits on the deck label instead of between the label and the tracklist.
  - On desktop the deck is above the fold (y 288–749). On mobile it starts at y ≈620.
  - The audience line and stats stay together, after the deck.
  - The cued track is the brightest object on the page.
  - Solid mustard belongs only to the hero CTA.
- **#2 Colour and mood:**
  - The page background goes from dusk to night.
  - The steps tape is at full strength.
  - Feature titles and step numbers are warm white instead of mustard.
- **#3 Typography:**
  - Body text is at weight 500.
  - The level labels are 14px / 700.
  - There is one title role.
  - `text-wrap: pretty` / `balance` is set on the long lines.
  - Only the font weights in use are loaded.
- **#4 Spacing and rhythm:**
  - The lamp hangs in the gap between the copy and the window.
  - Section padding varies.
  - The Subjects shelf has a plant and a full-width board.
  - The mobile J-card is a tight list.
- **#5 Mood:**
  - The closing sun sets into a sea that fades into the footer.
  - The spines are dusted toward a warm grey.
- **Audit fixes:** the same as A.
  - The ghost button ring is 4.1:1.
  - Unlit meter segments are at 20%.
  - Every target is at least 44px.
  - Colour values are tokens.
  - The deck figure is labelled with the unit code and name.

## Motion thesis: one authored moment

"The room comes on, and the tape plays when you reach it."

### Hero entrance

- **Type:** the headline, subtext and CTAs rise 14px and fade in. Each takes 560ms on `cubic-bezier(0.16, 1, 0.3, 1)`,
  with 0, 70 and 140ms staggers.
- **Scene:** the window and deck scene follows after 180ms, over 600ms.
- **Lamp:** at 260ms it switches on. The glow and the bulb fade up with a small flicker (0 → 0.7 → 0.35 → 1) over
  520ms.
- **No JS needed:** this is pure CSS, so it runs without JS.

### The deck plays

- **Trigger:** `play.tsx` is a small client component with an `IntersectionObserver` at 40% visibility. It runs once,
  then disconnects.
- **Sequence:**
  - Each meter fills track by track. The segments grow from the bottom (`scaleY` 0.15 → 1, opacity 0.2 → 1) over
    380ms, staggered 70ms per track and 18ms per segment.
  - The cassette reels turn once (600ms).
  - The next-up dot pops in (300ms, at 700ms).
  - The cued track's lamp glow fades in last (480ms, at 560ms). It lands on the weakest topic, which is the product's
    point.
- **Timing by device:**
  - On desktop the deck is in the first screen, so it plays right after load.
  - On mobile it plays when you scroll to it.

### Micro-interactions

All of these animate transform and opacity only, over 100–450ms on custom curves:

- **Nav links:** the underline draws in from the left (200ms) on hover and focus.
- **Buttons:** they lift on hover (220ms) and press down to `scale(0.97)` on click (100ms).
- **Subject cases:** they slide 0.5rem out of the stack on hover and on keyboard focus (240ms). The J-card band
  brightens and the case shadow deepens.
- **Deck hover:** hovering the deck nudges both reels a third of a turn (450ms).

### Loops removed

There are no infinite loops. The baseline's ever-spinning reels, breathing lamp and pulsing cued meter are gone. This
was verified in the browser: zero running animations 2.5s after load.

## Safety

- **Reduced motion:**
  - The entrance, the meter fill, the reel spin, the pop and the lift/slide transforms are all off.
  - The nav underline swaps to an instant opacity change, so hover feedback still shows.
  - The client component marks the deck as played immediately.
  - Verified: 0 animations; meters and headline are at full opacity.
- **Without JS:**
  - The "not yet played" state only applies under `@media (scripting: enabled)`.
  - With JS off, the meters render full. Verified: segment opacity 1.
  - With JS on but hydration failing, the meters would stay at their dim starting state. Scores and level words are
    always shown as text, so no information is lost.
- **Animated properties:** only transform and opacity animate. The cued glow was moved to a `::after` pseudo-element so
  it fades by opacity rather than by animating `box-shadow`.

## Fonts and colours

These are the same as A. No changes.

## Audit status

- **Contrast:** all text is AA, the same values as A.
  - Warm white on the cued row: 4.9:1.
  - Ink on the spines: 5.3:1 or better.
  - Countdown chip: 5.6:1.
  - Closing text: 5.3:1 or better.
- **Overflow:** no horizontal overflow at 390, 820 or 1440.
- **Console:** no console errors.
- **Touch targets:** every interactive element is at least 44px.
- **Detector:** `impeccable detect` finds 0 issues in this folder. The URL scan has 1 advisory: the window SVG is a
  scene assembled from basic shapes, which is intentional for a code-drawn illustration.

## Left imperfect

- **Mid-play screenshots.** On mobile, a screenshot taken mid-scroll can catch the meters half-filled. This is by design.
- **Repeat playback.** The meter fill plays once per page load. Scrolling back up does not replay it, which is
  intentional so it does not get tiring.
