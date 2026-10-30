---
name: Study-IAL
description: Topic-by-topic IAL practice. One playful component set in two tiers — bold marketing, calm app.
colors:
  ink: "#2b1240"
  ink-soft: "#4d335f"
  cream: "#fffaf4"
  sand: "#f7f0e8"
  white: "#ffffff"
  tangerine: "#ff7a3d"
  tangerine-hover: "#f2672b"
  tangerine-press: "#e85a1f"
  tangerine-pale: "#ffe6d6"
  grape: "#6a45f5"
  grape-deep: "#5532d6"
  lilac-pale: "#f1ebff"
  sun: "#ffd23f"
  sky: "#5cc8ff"
  lime: "#b8e94a"
  lilac: "#c7b6ff"
  mastery-strong: "#2ec4b6"
  mastery-developing: "#ffd23f"
  mastery-weak: "#ff8fb8"
  mastery-strong-ink: "#0e766d"
  mastery-developing-ink: "#8a5a00"
  mastery-weak-ink: "#b0124f"
  mastery-strong-pale: "#e2f6f3"
  mastery-weak-pale: "#ffe9f1"
  app-text-muted: "#6b5579"
  app-border: "#ebe1d6"
  app-border-strong: "#8f7f9c"
  app-track: "#ece3d9"
typography:
  display:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.1
  app-title:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  app-section:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.2
  question:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: 1.55
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    letterSpacing: "0.05em"
rounded:
  sm: "14px"
  md: "20px"
  lg: "28px"
  xl: "36px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "64px"
components:
  button-primary-marketing:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "56px"
    padding: "0 26px"
  button-primary-app:
    backgroundColor: "{colors.tangerine}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 22px"
  button-primary-app-hover:
    backgroundColor: "{colors.tangerine-hover}"
    textColor: "{colors.ink}"
  button-primary-app-active:
    backgroundColor: "{colors.tangerine-press}"
    textColor: "{colors.ink}"
  button-secondary-app:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
  button-sun-marketing:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "56px"
  chip-unit-marketing:
    backgroundColor: "{colors.grape}"
    textColor: "{colors.white}"
    rounded: "12px"
  chip-unit-app:
    backgroundColor: "{colors.lilac-pale}"
    textColor: "{colors.grape-deep}"
    rounded: "12px"
  chip-neutral-app:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  answer-option-selected:
    backgroundColor: "{colors.lilac-pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  answer-option-correct:
    backgroundColor: "{colors.mastery-strong-pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  answer-option-wrong:
    backgroundColor: "{colors.mastery-weak-pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
---

# Design System: Study-IAL

## Overview

**Creative North Star: "The Scoreboard Study Room"**

Marketing is the loud scoreboard that shows the game; the app is the quiet room where you play it. The mastery bar is the thread between them: the same chunky row, with its coloured code tile, score and level word, appears on the tangerine hero and in the product's side rail. A student should recognise it instantly in both places.

There is one component set and one type pairing, delivered in two tiers. The **marketing tier** (Persuade) is bold: tangerine fields with a dot grid, rising-bar skylines, ink type, purple and yellow accents, springy hovers. The **app tier** (Operate) is calm: a cream page, white panels and ink text. Colour appears only where it means something: orange for the action, purple for progress and "where you are", and the three mastery colours where a mastery level is shown. Everything else is neutral, because the product is used under exam pressure and has to stay calm.

Components are **chunky and friendly, never fussy**: big rounded pills and tiles, heavy display numbers, clear state colours. They are playful in marketing and steady in the app.

The reference implementation lives in `app/design-lab/system/`: tokens (`tokens.module.css`), shared components (`ui.tsx`), the marketing homepage (`marketing/`), the app-tier practice screen (`practice/`), and a specimen page that renders the same components in both tiers (`/design-lab/system`). The production app still uses the earlier shadcn theme; it should migrate to these tokens.

**Key Characteristics:**
- Two tiers, one system: the tier is a class on the page root (`.marketing` or `.app`); components read only semantic tokens.
- Mastery colours (teal, sun, bubblegum) mean strong, developing and weak, and nothing else, in both tiers.
- Baloo 2 (heavy, rounded) carries headings, numbers and buttons; Figtree carries everything people read.
- Text on orange is always ink.

## Colors

### Primary
- **Tangerine** (`tangerine`): the brand field in marketing (hero background, cards) and the *action* colour in the app (the primary button). Hover `tangerine-hover`, pressed `tangerine-press`. **Tangerine Pale** marks the "next up" topic row in the app.
- **Ink Plum** (`ink`): all body text, headings, and every label that sits on orange. It is also the marketing primary button. **Soft Plum** (`ink-soft`) is for secondary text on cream and white only.

### Secondary
- **Grape** (`grape`) and **Deep Grape** (`grape-deep`): progress and selection. In the app this covers the current nav section, the selected answer, the "on screen now" segment of session progress, progress bars and the focus ring. In marketing, Grape fills the unit chip. **Lilac Pale** is the selected and current ground behind Deep Grape text.

### Tertiary
- **Mastery set**: `mastery-strong` (teal), `mastery-developing` (sun) and `mastery-weak` (bubblegum) fill code tiles, bars and answer badges. On light grounds the *text* uses the deep partners `mastery-strong-ink`, `mastery-developing-ink` and `mastery-weak-ink`, because the fills fail as text on white (teal is 2.17:1). `mastery-*-pale` tint marked answers.
- **Marketing identity colours**: `sun`, `sky`, `lime` and `lilac`, plus Grape and Tangerine, are subject colours on marketing cards only. They never reuse a mastery colour, and they never appear in the app tier.

### Neutral
- **Cream** (`cream`): the page ground in both tiers. **Sand** (`sand`): the app's second neutral layer (side rail, chips, sunken panels). **White**: app panels and cards.
- App-only: `app-text-muted` for secondary text (at least 5.8:1 on cream, sand and white), `app-border` for hairlines, `app-border-strong` for control outlines and hover, and `app-track` for empty bars.

### Named Rules
**The Ink-on-Orange Rule.** Text on any orange (tangerine, its hover and pressed shades, or the deeper skyline bars) is full Ink, never white and never a lighter plum. White on tangerine is 2.59:1, Soft Plum is 4.15:1, and only Ink clears AA on the deepest bar orange (4.68:1). Hierarchy on orange comes from size and weight.

**The Colour Has a Job Rule (app tier).** In the app, orange means "do this", purple means "progress or where you are", and the mastery colours mean a mastery level. If a coloured element does none of those, it should be neutral.

**The Mastery Monopoly Rule.** Teal, sun and bubblegum are reserved for mastery states in both tiers. No decoration, subject identity or illustration may use them.

## Typography

**Display Font:** Baloo 2 (700, 800), with a system sans fallback.
**Body Font:** Figtree (500–800), with a system sans fallback.

**Character:** Baloo's round, heavy letterforms carry the game feel: scores, buttons and headlines. Figtree is a clear, even workhorse for everything students read: question stems, explanations and labels.

### Hierarchy
- **Display** (800, fluid 3rem–6rem, line-height 0.95, -0.03em): marketing hero headline only.
- **Headline** (800, fluid 2.25rem–3.5rem, line-height 1): marketing section headings.
- **Title** (800, fluid 1.5rem–1.875rem, 1.1): marketing step and feature titles.
- **App Title** (800, fixed 2rem, 1.625rem below 720px): the app page heading, such as a topic name.
- **App Section** (800, 1.125rem): app panel headings.
- **Question** (Figtree 600, 1.25rem, line-height 1.5, max 62ch): practice question stems. Maths renders with KaTeX inline.
- **Body** (Figtree 500, 1.0625rem marketing / 1rem app, 1.55).
- **Label** (Figtree 800, 0.8125rem, +0.05em, uppercase): mastery level words only.

### Named Rules
**The Fixed Scale in the App Rule.** Marketing type is fluid (clamp). App type uses fixed rem steps at about a 1.2 ratio. Product screens don't need headings that grow and shrink with the window.

**The Numbers Are Display Rule.** Scores, stats and code tiles use Baloo 2 with tabular figures. Prose never does.

## Layout

- **Marketing:** full-bleed coloured sections with a 1240px content column and fluid gutters (16–56px). Sections are spaced 64–112px apart. The hero stacks headline, copy, CTA and then the mastery board on phones, so the board rises into the first screen.
- **App:** a 1180px column. A white app bar holds the brand and section nav; below 720px the nav becomes a horizontally scrolling row with a faded trailing edge. Practice uses a two-column grid at 960px and up (question card, plus a sticky 380px rail for mastery and the rest of the unit). It is one column below that, with the rail after the question.
- **Spacing:** a 4px-based scale (4, 8, 12, 16, 24, 32, 48, 64). Related items are grouped tightly (8–12px), and panels and sections are separated generously (24–32px).
- **Targets:** every control is at least 44px tall. Inline breadcrumb links are at least 24px (WCAG 2.2 target size).

## Elevation & Depth

Soft, offset shadows tinted with Ink are the only depth. Nothing has zero-offset glows or hard block shadows.

### Shadow Vocabulary
- **Marketing lift** (`0 10px 22px -8px` ink at 60%): primary buttons and the mastery board. These are lifted, toy-like objects on a coloured field.
- **App card** (`0 1px 2px` ink at 4%, plus `0 12px 32px -20px` ink at 25%): the question card. It is barely raised; content leads.
- **Next-up row** (`0 12px 22px -14px` ink at 55%): the topic to revise next sits slightly forward of its neighbours in both tiers.

### Named Rules
**The Flat Rail Rule.** In the app, secondary panels (the rail, feedback) are tonal: Sand on Cream, with no shadow. Only the primary task surface is raised.

## Shapes

Generous, pill-forward rounding throughout: chips and buttons are full pills, answer options and rows use 20px corners, cards 28px, and marketing fields and the board 36px. Code tiles and answer letter badges are rounded squares (12–14px). There are no sharp corners and no coloured side borders.

## Components

### Buttons
- **Shape:** full pills. Baloo 2 at 800 weight, with an optional trailing arrow for forward actions.
- **Marketing primary:** an Ink pill with white text, 56px tall, with a springy lift on hover (`cubic-bezier(0.34, 1.56, 0.64, 1)`, marketing only). **Sun** is the yellow-on-purple variant for the closing band.
- **App primary:** a Tangerine pill with Ink text (6.41:1), 48px tall. Hover is `tangerine-hover` with a 1px lift; pressed is `tangerine-press` scaled to 98%. All on `cubic-bezier(0.16, 1, 0.3, 1)` at 160–220ms.
- **Secondary:** white with an inset outline (3px Ink in marketing, 2px `app-border-strong` in the app).
- **Disabled:** the track colour with muted text, no shadow, and a `not-allowed` cursor.
- **Focus:** a 3px outline offset by 3px, in Ink (marketing) or Deep Grape (app).

### Chips
- **Unit chip** (such as WPH11): a rounded-square label in Baloo 800. It is Grape with white text in marketing, and Lilac Pale with Deep Grape text in the app.
- **Neutral chip** (such as the exam countdown): a pill with an optional 15–16px icon. It sits on Cream in marketing and Sand in the app.

### Cards / Containers
- **App question card:** white, 28px radius, a 1px hairline and the app card shadow, with 20–36px padding.
- **App rail panels:** Sand, 28px radius, no shadow.
- **Marketing board:** an Ink panel, 36px radius, with the marketing lift.

### Inputs / Fields
- **Answer options:** native radio inputs, visually hidden inside full-width labelled cards (at least 60px tall, 20px radius, letter badge on the left). The states are:
  - **Idle:** 1.5px `app-border` inset.
  - **Hover:** the border darkens to `app-border-strong`.
  - **Selected:** Lilac Pale ground, 2px Deep Grape inset, Deep Grape badge with white letter.
  - **Marked correct:** pale-teal ground, `mastery-strong-ink` ring and badge, with a check icon.
  - **Marked wrong:** pale-pink ground, `mastery-weak-ink` ring and badge, with a cross icon.
  - **Others after marking:** muted text.
  - **Keyboard focus:** the focus ring on the whole card.
- After checking, keyboard focus moves to the next action.

### Navigation
- **App bar:** white on Cream with a hairline. Section links are pills in muted text, Sand on hover, and Lilac Pale with Deep Grape text for the current section (`aria-current="page"`).
- **Breadcrumbs:** small muted links underlined in `app-border-strong`, with chevron separators.

### Mastery Row (signature component)
- **Shared by both tiers.** A grid of code tile (filled with the level colour), topic name, score (Baloo 800, tabular figures, in the level's text colour), bar (fill = level colour) and level word (uppercase label).
- **Tier differences:**
  - **Marketing:** rows sit on the Ink board, bars fill once on load, and the next-up row turns white and lifts.
  - **App:** rows are white on the Sand rail in a compact density, and the next-up row is Tangerine Pale.
- **The next-up row** always carries a bubblegum arrow flag at its left edge.

### Session Progress
- **One segment per question:**
  - Teal = correct.
  - Bubblegum = wrong.
  - `app-border-strong` = skipped.
  - Deep Grape = the question on screen.
  - Track = not started.
- **Header:** "Question n of N" with the running "x of y correct" in tabular figures. Each segment carries a screen-reader label.
- **Continuous progress** (such as plan completion) uses the shared Progress Bar: a Deep Grape fill on the track.

## Do's and Don'ts

### Do:
- **Do** put a tier class (`.marketing` or `.app`) on every page root, and build screens from the shared components and semantic tokens.
- **Do** use Ink for all text on orange, and size and weight for hierarchy there.
- **Do** keep orange for the one primary action per view in the app, and purple for progress, selection and "you are here".
- **Do** show mastery with the Mastery Row and the three mastery colours, and use their deep partners for any mastery text on light grounds.
- **Do** keep app motion to state changes at 150–250ms on `cubic-bezier(0.16, 1, 0.3, 1)`, and turn it off under `prefers-reduced-motion`.

### Don't:
- **Don't** put white or Soft Plum text on tangerine or its darker shades. White on `#ff7a3d` is 2.59:1, and Soft Plum is 4.15:1.
- **Don't** use teal, sun or bubblegum for anything that isn't a mastery state, including subject colours, decoration or illustrations.
- **Don't** bring marketing fields, skylines, dot grids, subject colours or springy easing into the app tier.
- **Don't** add looping or decorative animation to product screens. The marketing board's one-time fill and lift is the most motion either tier gets.
- **Don't** use coloured side borders, zero-offset glows or hard block shadows on cards, rows or alerts.
