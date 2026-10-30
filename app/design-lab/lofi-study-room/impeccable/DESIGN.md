---
name: Lo-fi Study Room
description: The room you revise in at dusk; a unit's topics as a tracklist, the weakest one cued next.
colors:
  wall: "#2a1d2e"
  wall-deep: "#1f1523"
  wall-high: "#352539"
  plum: "#4b3150"
  plum-soft: "#3a2740"
  shelf-board: "#5a3b5e"
  terracotta: "#d0714f"
  terracotta-deep: "#a9502f"
  mustard: "#e2ae4a"
  mustard-light: "#f0c66e"
  sage: "#94b59e"
  rose: "#d495a5"
  teal: "#7fa9ac"
  light: "#f5e7d6"
  light-bright: "#fff1e0"
  muted: "#cdb7bd"
  ink: "#24161f"
  lamp: "rgb(255 214 150)"
typography:
  display:
    fontFamily: "Fredoka, ui-rounded, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.6vw, 5.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fredoka, ui-rounded, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fredoka, ui-rounded, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "M PLUS Rounded 1c, ui-rounded, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "M PLUS Rounded 1c, ui-rounded, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  meter: "3px"
  spine: "0.6rem"
  track: "0.9rem"
  jcard: "1.25rem"
  deck: "1.75rem"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  max: "78rem"
  section: "clamp(3rem, 7vw, 6rem)"
  gap-sm: "0.75rem"
components:
  button-primary:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.mustard-light}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.light}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.light}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
  deck-card:
    backgroundColor: "{colors.plum-soft}"
    rounded: "{rounded.deck}"
    padding: "clamp(1rem, 2.4vw, 1.5rem)"
  track-row:
    textColor: "{colors.light}"
    rounded: "{rounded.track}"
    padding: "0.55rem 0.75rem"
  countdown-chip:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.8rem"
  subject-spine:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.ink}"
    rounded: "{rounded.spine}"
    padding: "0.75rem 1rem 0.75rem 0.75rem"
---

# Design System: Lo-fi Study Room

## Overview

**Creative North Star: "The Room at Dusk"**

A dim plum study room lit by one warm lamp, a window of terracotta-to-mustard sky, and a tape deck on the desk. Product proof is rendered as tape objects: a unit is a cassette, its topics a tracklist, mastery a segmented level meter, subjects a stack of cassette cases on a shelf. Everything is soft and rounded; nothing is glossy or clinical.

Density is calm: generous section padding, short measures (34-38ch body), and one focal light per view. Depth comes from warm, soft, downward-offset ambient shadows and lamp glow rather than borders or cards.

**Key Characteristics:**
- Dark plum ground, cream text, warm dusk accents.
- Tape vocabulary: reels, J-card inserts, dotted fold rules, cassette spines.
- Segmented 10-step level meters for mastery.
- The brightest light is spent on exactly one element: the cued (next-up) track.
- Slow ambient motion (turning reels, breathing lamp) that stops under reduced motion.

## Colors

Dusk plum neutrals carry the room; terracotta, mustard and sage are the warm light and the mastery scale.

### Primary
- **Lamp Mustard** (mustard): primary CTA pills, countdown chip, selection, "developing" mastery. Hover lifts to **Lit Mustard** (mustard-light), which also colours deck codes, step numerals and feature titles.

### Secondary
- **Dusk Terracotta** (terracotta): "weak" mastery meters, nav link hover underline, next-up dot, the foot of the sunset gradient.
- **Window Sage** (sage): "strong" mastery.

### Tertiary
- **Rose** and **Sea Teal** (rose, teal): subject spine tones only, alongside terracotta, mustard and sage.

### Neutral
- **Dusk Plum Wall** (wall): page ground. **Night Wall** (wall-deep): footer. **Plum** / **Soft Plum** (plum, plum-soft): deck card, J-card, reel rings. **Shelf Board** (shelf-board): the shelf plank.
- **Cream Light** (light): body and UI text. **Warm White** (light-bright): headlines and cued-track text. **Dusty Mauve** (muted): secondary copy and labels.
- **Ink** (ink): text on mustard and spine fills; the ink button.
- **Lamp** (lamp): used only as translucent glow (rgb(var(--lamp) / alpha)).

### Named Rules
**The One Lamp Rule.** The lamp-light glow at full strength belongs to the single cued track; the hero lamp pool stays at ≤12% alpha.
**The Meter Scale Rule.** Mastery is always sage strong, mustard developing, terracotta weak, as a 10-segment meter with unlit segments at cream 12%.

## Typography

**Display Font:** Fredoka (with ui-rounded, sans-serif)
**Body Font:** M PLUS Rounded 1c (with ui-rounded, system-ui, sans-serif)

**Character:** Two rounded faces, a chunky friendly display and a soft legible text face, so the whole room reads as hand-held, not technical.

### Hierarchy
- **Display** (600, clamp to 5.25rem, 1): hero headline; closing headline at up to 4.25rem / 1.02.
- **Headline** (600, clamp to 3.25rem, 1.08): section headings, balanced.
- **Title** (600, 1.3125-1.375rem, 1.2): step and feature titles, brand, spine names; stat values at 2rem tabular.
- **Body** (400, 1.0625rem, 1.6): copy in muted, max 34-38ch.
- **Label** (700, 0.8125-0.9375rem): chips, track codes, spine unit counts; level text at 500.

### Named Rules
**The Tabular Numbers Rule.** Scores, stats and codes use tabular-nums.

## Layout

Centered column at 78rem max with a fluid gutter (clamp 1rem-3.5rem); sections pad clamp(3rem, 7vw, 6rem). Hero is a two-column grid (1fr / 1.08fr) with the dusk window and overlapping deck card on the right; at 960px it stacks copy, audience, scene, stats. Steps run three across joined by a gradient tape (terracotta to mustard to sage) that turns vertical at 720px. Features share one J-card in a 3/2/1 column grid. The shelf stacks spines with hand-placed uneven insets that flatten at 720px.

## Elevation & Depth

Soft, downward-offset, warm-dark ambient shadows with negative spread; never hard offset. Raised tape objects get a faint top inner highlight. Light, not shadow, marks focus: the cued track glows.

### Shadow Vocabulary
- **Deck lift** (`0 30px 60px -24px rgb(10 4 12 / 0.75), 0 2px 0 rgb(255 255 255 / 0.06) inset`): deck card and J-card.
- **Pill lift** (`0 10px 22px -10px rgb(12 5 14 / 0.7), inset 0 -3px 0 rgb(0 0 0 / 0.14)`): primary buttons; deepens on hover.
- **Case shadow** (`0 10px 18px -12px rgb(0 0 0 / 0.7)`): subject spines.
- **Cued glow** (`inset 0 0 0 1.5px rgb(lamp / 0.6), 0 12px 28px -12px rgb(lamp / 0.5)`): the cued track only.

## Shapes

Everything is rounded: pills (999px) for buttons and chips, 1.75rem deck, 1.25rem J-card, 0.9rem track rows, 0.6rem spines, 3px meter segments, circles for reels and dots. Divisions are 2px dotted cream rules at 14-20% (J-card folds, deck label, stats rule), never solid hairlines. Closing band has top-only rounded corners.

## Components

### Buttons
- **Shape:** full pill (999px), min-height 3rem (2.5rem small, no outer shadow).
- **Primary:** mustard on ink, Fredoka 600; hover to mustard-light, lift 2px, 220ms ease-out (cubic-bezier(0.16, 1, 0.3, 1)).
- **Ghost:** transparent with a 2px inset cream ring at 35%, 60% on hover.
- **Ink:** ink fill with cream text, used on the sunset band.
- **Focus:** 3px mustard-light outline, 3px offset.

### Chips
- **Countdown:** mustard pill, ink 700 label with an icon. **Unit count:** ink pill on a spine.

### Cards / Containers
- **Deck card:** plum gradient (#44304a to plum-soft), 1.75rem, deck lift, dotted label rule.
- **J-card:** plum-soft, 1.25rem, panels divided by dotted fold rules.

### Navigation
- Fredoka brand with a reel mark; text links in cream 500 with a 2px terracotta underline on hover; small mustard pill CTA. Reel mark hides at 480px.

### Tracklist (signature)
Rows of code / name + level / 10-segment meter / score. The cued row gets the lamp glow, warm-white bold text, and a breathing meter; a next-up line with a terracotta play dot follows.

### Cassette Spine (signature)
Subject links as flat cassette cases in a tone, with an ink J-card band and unit pill; slide 0.5rem right on hover; rest on a shelf board.

## Do's and Don'ts

### Do:
- **Do** express product data as tape objects: tracklists, reels, meters, spines.
- **Do** keep the 10-segment meter and its sage/mustard/terracotta scale for mastery.
- **Do** reserve the full lamp glow for one focused element per view.
- **Do** use dotted cream rules (2px, 14-20%) for divisions.
- **Do** stop reels, lamp breathing, meter pulse and hover lifts under prefers-reduced-motion.

### Don't:
- **Don't** use hard offset or black-edged shadows; shadows are soft, warm and negatively spread.
- **Don't** use square corners or solid hairline dividers.
- **Don't** spread lamp-strength glow across multiple items.
- **Don't** add eyebrow or kicker labels above headings.
