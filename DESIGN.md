---
name: Study-IAL
description: Topic-by-topic IAL practice. One playful component set in two tiers — bold marketing, calm app.
colors:
  ink: "#2b1240"
  cream: "#fffaf4"
  sand: "#f7f0e8"
  white: "#ffffff"
  tangerine: "#ff7a3d"
  tangerine-hover: "#f2672b"
  tangerine-press: "#e85a1f"
  tangerine-pale: "#ffe6d6"
  grape: "#6a45f5"
  grape-deep: "#5532d6"
  lilac: "#c7b6ff"
  lilac-pale: "#f1ebff"
  sun: "#ffd23f"
  sky: "#5cc8ff"
  lime: "#b8e94a"
  mastery-strong: "#2ec4b6"
  mastery-developing: "#ffd23f"
  mastery-weak: "#ff8fb8"
  mastery-strong-text: "#0e766d"
  mastery-developing-text: "#8a5a00"
  mastery-weak-text: "#b0124f"
  mastery-strong-pale: "#e2f6f3"
  mastery-developing-pale: "#fff5d1"
  mastery-weak-pale: "#ffe9f1"
  muted-foreground: "#6b5579"
  border: "#ebe1d6"
  border-strong: "#8f7f9c"
  track: "#ece3d9"
  destructive: "#c0262d"
  dark-background: "#1b1026"
  dark-card: "#261835"
  dark-popover: "#2c1d3d"
  dark-foreground: "#fbf4ec"
  dark-muted: "#2f2041"
  dark-accent: "#36264a"
  dark-muted-foreground: "#c2b2d0"
  dark-primary-hover: "#ff8c57"
  dark-primary-soft: "#4a2238"
  dark-selected: "#352a5e"
  dark-selected-foreground: "#d4c7ff"
  dark-progress: "#a58bff"
  dark-border: "#3b2b4f"
  dark-border-strong: "#8a76a3"
  dark-destructive: "#ff7373"
  dark-mastery-strong-pale: "#173a3e"
  dark-mastery-developing-pale: "#3a3226"
  dark-mastery-weak-pale: "#42213a"
typography:
  display:
    fontFamily: "Baloo 2, Figtree, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Baloo 2, Figtree, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  page-title:
    fontFamily: "Baloo 2, Figtree, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  section-title:
    fontFamily: "Baloo 2, Figtree, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.25
  card-title:
    fontFamily: "Baloo 2, Figtree, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.25
  question:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    letterSpacing: "0.05em"
  number:
    fontFamily: "Baloo 2, Figtree, system-ui, sans-serif"
    fontWeight: 800
    fontFeature: "tnum"
rounded:
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  2xl: "36px"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
components:
  button-primary:
    backgroundColor: "{colors.tangerine}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.tangerine-hover}"
    textColor: "{colors.ink}"
  button-primary-active:
    backgroundColor: "{colors.tangerine-press}"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "44px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 14px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  panel-tonal:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "20px"
  nav-item-current:
    backgroundColor: "{colors.lilac-pale}"
    textColor: "{colors.grape-deep}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 16px"
  chip-unit:
    backgroundColor: "{colors.lilac-pale}"
    textColor: "{colors.grape-deep}"
    rounded: "{rounded.sm}"
    height: "28px"
    padding: "0 10px"
  mastery-badge-strong:
    backgroundColor: "{colors.mastery-strong-pale}"
    textColor: "{colors.mastery-strong-text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  mastery-tile-weak:
    backgroundColor: "{colors.mastery-weak}"
    textColor: "{colors.ink}"
    typography: "{typography.number}"
    rounded: "12px"
    size: "44px"
  row-next-up:
    backgroundColor: "{colors.tangerine-pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  answer-option-selected:
    backgroundColor: "{colors.lilac-pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "60px"
  answer-option-correct:
    backgroundColor: "{colors.mastery-strong-pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  answer-option-wrong:
    backgroundColor: "{colors.mastery-weak-pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  button-primary-marketing:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "56px"
    padding: "0 26px"
  button-sun-marketing:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "56px"
---

# Design System: Study-IAL

## Overview

**Creative North Star: "The Scoreboard Study Room"**

Marketing is the loud scoreboard that shows the game; the app is the quiet room where you play it. The mastery row is the thread between them: the same chunky row, with its coloured code tile, score, bar and level word, appears on the ink board in the tangerine hero and on every progress, subject and practice screen in the product. A student should recognise it instantly in both places.

There is one component set and one type pairing, delivered in two tiers. The **app tier** (Operate) is the default token set in `app/globals.css`: a cream page, white cards, ink text, and a plum dark theme. Colour appears only where it means something: orange for the action, purple for progress and "where you are", and the three mastery colours where a mastery level is shown. Everything else is neutral, because the product is used under exam pressure and has to stay calm. The **marketing tier** (Persuade) is the landing page only, built in `components/landing/landing.module.css` from the brand colours: tangerine dot-grid fields, rising-bar skylines, a grape level path, subject identity colours, springy hovers.

Components are **chunky and friendly, never fussy**: pill buttons in Baloo, rounded-square tiles, heavy display numbers, clear state colours. `app/design-lab/system/` remains as the original reference the production app was migrated from; the shipped code is now the source of truth.

**Key Characteristics:**
- App tier is the default; the marketing tier lives only in the landing CSS module.
- Mastery colours (teal, sun, bubblegum) mean strong, developing and weak, and nothing else.
- Baloo 2 carries headings, numbers, buttons and nav; Figtree carries everything people read.
- Text on orange is always ink.
- Every screen works in light and plum dark, and at 375px wide.

## Colors

A warm cream-and-plum neutral base, one orange for action, one purple for progress, and three reserved mastery colours.

### Primary
- **Tangerine** (`tangerine`): the action colour. In the app it fills the primary button (`tangerine-hover` on hover, `tangerine-press` when pressed); in marketing it is the hero field and the auth panel. **Tangerine Pale** (`tangerine-pale`, token `primary-soft`) is the "next up" ground: the topic or task to do next.
- **Ink Plum** (`ink`): all text and headings in light mode, every label on orange, the brand mark tile, the marketing primary button, the mastery board and the closing band.

### Secondary
- **Grape** (`grape`) and **Deep Grape** (`grape-deep`): progress and selection. Deep Grape is the `progress` and `ring` token: progress bars, checked checkboxes, radios, switches and slider, the on-screen session segment, the selected answer, and every focus outline. **Lilac Pale** (`lilac-pale`, token `selected`) is the ground for the current nav item, unit chips, the avatar, "Studying" pills and text selection, always with Deep Grape text. Grape itself fills the marketing level path and unit chip.

### Tertiary
- **Mastery set**: `mastery-strong` (teal), `mastery-developing` (sun) and `mastery-weak` (bubblegum) fill code tiles, bars, breakdown segments and session segments, with Ink text on them (`on-mastery`). On light grounds mastery *text* uses `mastery-*-text` (5.5–6.9:1 on white), because teal as text is 2.17:1. `mastery-*-pale` grounds the level badge and marked answers. In dark mode the fills double as text and the pales become deep tints.
- **Marketing identity colours**: Grape, `sky`, `lime`, Tangerine and `lilac` give each subject card on the landing page its own field. They never reuse a mastery colour and never appear in the app tier; in the app, subject monograms are neutral (an ink tile with cream letters, or a sand tile for local subjects).
- **Danger** (`destructive`): a true red, deliberately distinct from mastery raspberry and bubblegum, so "you will lose data" never reads as "weak topic". White text on it in light mode; in dark it lifts to `dark-destructive` with Ink text. Destructive alerts use a 40% red border on an 8% red tint. `success` and `warning` reuse the strong and developing text tones.

### Neutral
- **Cream** (`cream`): the page. **White**: cards, popovers, inputs, the app bar. **Sand** (`sand`, tokens `secondary`/`muted`/`accent`): tonal panels (practice rail, feedback, mark scheme, empty states), neutral chips and the hover ground of ghost controls.
- `muted-foreground` for secondary text (at least 5.8:1 on cream, sand and white); `border` for hairlines; `border-strong` for control outlines, input borders and skipped segments; `track` for empty bars and disabled buttons.

### Dark theme
The same plum, lit from below: Ink becomes the room (`dark-background`), cards and popovers step up in lightness (`dark-card`, `dark-popover`), and cream becomes the text (`dark-foreground`). Tangerine stays tangerine with Ink text; next-up becomes a tangerine glow on plum (`dark-primary-soft`). Progress and focus lighten to `dark-progress`; selection to `dark-selected` with `dark-selected-foreground`. Shadows switch to black. On the landing page the tangerine hero and grape path stay as brand fields; ink panels get a lifted ground and a hairline. The brand mark gains a hairline ring so the ink tile doesn't vanish into the page.

### Named Rules
**The Ink-on-Orange Rule.** Text on any orange (tangerine, its hover and pressed shades, the skyline bars, the auth panel) is full Ink, never white and never a lighter plum. White on tangerine is 2.59:1. Hierarchy on orange comes from size and weight.

**The Colour Has a Job Rule.** In the app, orange means "do this", purple means "progress or where you are", the mastery colours mean a mastery level, and red means danger. If a coloured element does none of those, it is neutral.

**The One Orange Rule.** Each app view has one tangerine action; everything else is outline, secondary or ghost. When a page has a next task, that task's button is the orange one and the page header's action falls back to outline (the dashboard does exactly this). Signed-out, the app bar's "Create free account" is outline because the page owns the orange.

**The Mastery Monopoly Rule.** Teal, sun and bubblegum are reserved for mastery states in both tiers: tiles, bars, badges, session segments (sun = part marks), and the bubblegum next-up flag. The brand mark's three rising bars use them because they depict the three levels. No decoration, subject identity or illustration may.

## Typography

**Display Font:** Baloo 2 (600–800), falling back to Figtree then system sans.
**Body Font:** Figtree (400–800), with a system sans fallback.

**Character:** Baloo's round, heavy letterforms carry the game: scores, buttons, nav, headings. Figtree is a clear, even workhorse for everything students read: question stems, explanations, labels and forms.

### Hierarchy
- **Display** (Baloo 800, fluid 3rem–6rem, 0.95, -0.03em): the marketing hero headline only.
- **Headline** (Baloo 800, fluid 2.25rem–3.5rem, 1): marketing section headings; marketing card titles step down to fluid 1.5rem–1.875rem.
- **Page Title** (Baloo 800, 1.75rem, 2.125rem from 640px, 1.1, -0.01em): the `PageHeader` h1 and auth cards. Practice uses 1.625rem / 2rem.
- **Section Title** (Baloo 800, 1.25rem): page sections, subject card names, empty-state titles.
- **Card Title** (Baloo 800, 1.125rem): card and panel headings, the rail heading, "Mark scheme".
- **Question** (Figtree 600, 1.125rem, 1.25rem from 640px, max 62ch): practice question stems, with KaTeX inline.
- **Body** (Figtree 500, 1rem): everything else. Page descriptions and lead text are 1.0625rem in muted foreground.
- **Label** (Figtree 800, 0.6875–0.8125rem, +0.05em, uppercase): mastery level words and the "Up next" state only.
- **Number** (Baloo 800, tabular figures, the `num` utility): scores, stats, counts, code tiles and mark chips.

Headings (h1–h3) are Baloo 800 with balanced wrapping by default; paragraphs wrap pretty.

### Named Rules
**The Fixed Scale in the App Rule.** Marketing type is fluid (clamp). App type uses fixed rem steps with a single step-up at 640px. Product screens don't need headings that grow and shrink with the window.

**The Numbers Are Display Rule.** Scores, stats and code tiles use Baloo 2 with tabular figures. Prose never does.

## Layout

- **App:** a 1180px column with 16px gutters (24px from 640px) and 24px top padding (40px from 1024px). A sticky white app bar (64px, hairline below, slight blur) holds the logo, the pill nav and the avatar menu from 1024px; below that the nav moves into a left slide-in sheet opened from a menu button.
- **Practice:** two columns from 960px (question card, plus a sticky 380px rail for topic mastery), one column below with the rail after the question. The finished summary narrows to 768px.
- **Grids:** subject cards are one column, two from 640px, three from 1280px. Grid children may shrink below content width so nothing widens the page at 375px.
- **Auth:** a centred 1040px split from 1024px: a tangerine panel (headline, rising bars) beside a 440px form card; phones get the logo above the card.
- **Marketing:** full-bleed fields with a 1240px column and fluid gutters (16–56px); sections are 64–112px apart. Phones stack headline, copy, CTA and then the board.
- **Spacing:** Tailwind's 4px scale. Related items group at 8–12px, card content at 20–24px, panels and sections at 24–32px.
- **Targets:** every control is at least 44px tall (buttons, inputs, nav items, icon buttons). Inline breadcrumb links are at least 24px.

## Elevation & Depth

Soft, offset shadows tinted with Ink (black in dark mode) are the only depth. Three steps, each with a job.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgb(43 18 64 / 0.04), 0 12px 32px -20px rgb(43 18 64 / 0.25)`): every `Card`, the question card, subject cards, auth card, and the icon tile in empty states. Barely raised; content leads.
- **Raised** (`box-shadow: 0 12px 22px -14px rgb(43 18 64 / 0.55)`): the next-up mastery row and task, dialogs, sheets, menus and selects, and a hovered subject card.
- **Action** (`box-shadow: 0 6px 14px -8px rgb(43 18 64 / 0.45)`): the tangerine primary button only.
- **Marketing lift** (`0 10px 22px -8px` Ink at 60%, the board deeper): marketing buttons and the board, toy-like objects on a coloured field.

### Named Rules
**The Flat Rail Rule.** Secondary panels (the practice rail, score banner, mark scheme, explanation, empty states) are tonal: Sand on Cream, with no shadow. Only the primary task surface and cards are raised.

## Shapes

Generous, pill-forward rounding: buttons, nav items, tabs, badges, switches and bars are full pills; inputs, selects and menus are 14px; rows, answer options and alerts 20px; cards, panels and dialogs 28px; marketing fields and the board 36px. Code tiles and answer letter badges are rounded squares (12px), subject monograms 14px, unit chips 10px, checkboxes 6–8px. No sharp corners, no coloured side borders. Button and answer-option outlines are inset box-shadows (1.5–2px), so state changes never shift layout.

## Components

### Buttons
Chunky Baloo pills that press back.
- **Shape:** full pill, Baloo 800 at 0.975rem; 44px tall by default (36px small, 48px large), with an optional trailing arrow for forward actions.
- **Primary:** Tangerine with Ink text (6.41:1) and the action shadow. Hover is `tangerine-hover` with a 1px lift; pressed is `tangerine-press` at 98% scale. 200ms on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Outline:** card ground with a 2px inset `border-strong` ring that darkens to full foreground on hover. The default for every non-primary action.
- **Secondary / Ghost:** Sand fill, or transparent with a Sand hover. Ghost is for "View all" and icon buttons.
- **Destructive:** danger red with white text (Ink in dark).
- **Link:** Figtree bold in Deep Grape with a 2px underline.
- **Disabled:** track ground, muted text, no shadow.
- **Focus:** a 3px Deep Grape outline offset 2px, on every interactive element.
- **Marketing:** a 56px Ink pill with white text and a springy lift (`cubic-bezier(0.34, 1.56, 0.64, 1)`); Sun is the yellow variant on the closing band; secondary is a 3px Ink ring.

### Chips
- **Unit chip** (WPH11): Baloo 800 in a 10px rounded square, Lilac Pale with Deep Grape text, 24–28px tall.
- **Neutral chip** (task type, mark counts): a Sand pill with Ink text and an optional 14px icon. Skipped tasks get a track pill.
- **Mastery badge:** an uppercase level word in a pill, the level's pale ground and text tone; "Not started" is Sand and muted.

### Cards / Containers
- **Card:** white, 28px radius, 1px hairline, card shadow, 24px padding (question card 20px, 32px from 640px).
- **Tonal panel:** Sand, 20–28px radius, no shadow, 16–24px padding.
- **Empty state:** a Sand 28px panel with a white 56px icon tile (Deep Grape icon, card shadow), a title, a muted line and one action.

### Inputs / Fields
- **Text inputs, selects, textareas:** white, 14px radius, 1.5px `border-strong` border, 44px tall. Hover darkens the border; focus turns it Deep Grape with a 3px ring at 25%. Invalid turns it red.
- **Checkbox, radio, switch, slider, progress:** Deep Grape when on or filled, on a track or 1.5px `border-strong` outline when off.
- **Answer options:** native radios hidden inside full-width labelled cards (at least 60px tall, 20px radius, 40px letter badge on the left).
  - **Idle:** white with a 1.5px `border` inset; hover darkens it to `border-strong`.
  - **Selected:** Lilac Pale with a 2px Deep Grape inset and a Deep Grape badge.
  - **Correct:** strong-pale ground, 2px `mastery-strong-text` ring and badge, with a check.
  - **Wrong:** weak-pale ground, 2px `mastery-weak-text` ring and badge, with a cross.
  - **Others after marking:** white and muted.
  - **Focus:** the focus outline on the whole card.

### Navigation
- **App bar:** white over Cream with a hairline. The logo (rising-bars mark plus "Study-IAL" in Baloo) leads; section links are Baloo bold pills in muted text, Sand on hover, Lilac Pale with Deep Grape text when current (`aria-current="page"`). Settings lives in the avatar menu on desktop.
- **Account menu:** a Lilac Pale avatar with Deep Grape initials opening a 14px-radius popover.
- **Mobile:** a left sheet with a 28px trailing radius, icon-led nav items and the account menu at the foot.
- **Breadcrumbs:** small muted links underlined in `border-strong`, chevron separators.

### Mastery Row (signature component)
- **Anatomy:** a 44px code tile filled with the level colour (neutral when not started), topic name, score (Baloo 800 in the level's text tone), a 10px bar and the uppercase level word, with an optional trailing action. On phones the level word and score share the bar's line.
- **Next up:** the one topic to revise next sits on Tangerine Pale with the raised shadow and a 28px bubblegum arrow flag overlapping its left edge.
- **Variants:** compact rows in the practice rail; full rows on progress and subject pages, where the whole row can be the link.
- **Marketing:** the same row on the Ink board in translucent white; the next-up row turns white and lifts once on load.

### Plan Task
Rows with a 24px checkbox, a meta line (type pill, unit chip, minutes) and a bold title. The first unfinished task is "Up next": Tangerine Pale, raised, with an uppercase "Up next" label and a full-size primary button; other tasks get small outline buttons. Done tasks lose their ground and strike through.

### Session Progress
One 8px pill segment per question: teal = full marks, sun = part marks, bubblegum = no marks, `border-strong` = skipped, Deep Grape = on screen, track = not reached. A "Question n of N" header with the running score in tabular figures; each segment has a screen-reader label. Continuous progress (plan completion) uses the Progress bar: Deep Grape on track, with a minimum visible sliver.

## Do's and Don'ts

### Do:
- **Do** build app screens from the semantic tokens (`bg-primary`, `bg-selected`, `bg-progress`, `text-muted-foreground`, `bg-mastery-*`) and shared components (`PageHeader`, `EmptyState`, `Card`, the mastery set); never raw hex.
- **Do** use Ink for all text on orange, and size and weight for hierarchy there.
- **Do** keep one tangerine action per app view; demote the rest to outline, secondary or ghost.
- **Do** take mastery colours and labels from `masteryTone` and `masteryLabel`, using the `text` tones for mastery text on light grounds.
- **Do** check every screen in plum dark mode and at 375px.
- **Do** keep app motion to state changes at 150–250ms on `cubic-bezier(0.16, 1, 0.3, 1)`; the global reduced-motion rule turns it all off.

### Don't:
- **Don't** put white or light plum text on tangerine or its darker shades. White on `#ff7a3d` is 2.59:1.
- **Don't** use teal, sun or bubblegum for anything that isn't a mastery state, including subject colours, decoration or illustration.
- **Don't** use mastery bubblegum or raspberry for errors; danger is the red `destructive` token.
- **Don't** bring marketing fields, skylines, dot grids, subject identity colours or springy easing into the app tier.
- **Don't** add looping or decorative animation to product screens. The marketing board's one-time fill and lift is the most motion either tier gets.
- **Don't** use coloured side borders, zero-offset glows or hard block shadows on cards, rows or alerts.
