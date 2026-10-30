# DESIGN.md: Playful Pop (Impeccable variant)

This file is scoped to `/design-lab/playful-pop/impeccable` only. It is derived from the shipped `page.module.css` and is not the app-wide system.

## World

Revision works like a bright game board. A drenched tangerine hero sits over a warm-white ground. Deep plum is the ink colour, and five candy colours are used as flat, fully committed fields. The hero object is the mastery board: a unit's topics with fat progress bars, where the weakest topic lifts out as a white row and the "next up" strip sits underneath.

## Colour tokens (`.page`)

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#2b1240` | Text, primary buttons, board and closing fields |
| `--ink-soft` | `#5a3f6e` | Secondary body text on light grounds |
| `--ground` | `#fffaf4` | Page ground |
| `--tangerine` | `#ff7a3d` | Hero field (drenched) |
| `--sun` | `#ffd23f` | Developing level, lead feature tile, closing CTA |
| `--gum` | `#ff8fb8` | Weak level, next-up strip, countdown chip |
| `--gum-deep` | `#b0124f` | Weak score text on white |
| `--lagoon` | `#2ec4b6` | Strong level, connectors, wide feature tile |
| `--lagoon-pale` | `#d9f5f1` | "How it works" field |
| `--grape` | `#6a45f5` | Accent tile and subject; carries white text (5.5:1) |
| `--lime` | `#b8e94a` | Biology subject, check marks |
| `--gum-pale` / `--lime-pale` | `#ffe1ec` / `#ecf8cf` | Quiet feature tiles |

Mastery mapping: strong = lagoon, developing = sun, weak = gum. Text on every candy field is plum. White text appears only on plum and grape.

## Type

- Display: **Baloo 2**, weight 800 (`--pp-display`). Used for headlines, numbers, buttons and the unit chip. Tracking is -0.025 to -0.03em, and line-height is 0.95–1.
- Body: **Figtree**, weights 500–800 (`--pp-body`), at 1.0625rem with 1.55 line-height.
- Scale:
  - h1: `clamp(2.9rem, 8.4vw, 6rem)`
  - h2: `clamp(2.2rem, 5vw, 3.75rem)`
  - closing: `clamp(2.5rem, 6.6vw, 5.25rem)`
  - card titles: 1.55–2.4rem
- Scores use `tabular-nums`.

## Shape and depth

- Radii are 36 (board), 28 (tiles and cards), 20 (rows) and 999 (pills and stickers).
- Shadows are soft and tinted plum (`rgb(43 18 64 / …)`), always offset and blurred. There are no zero-blur block shadows.
- Stickers and step badges are rotated -4° to +3° so they feel placed by hand.

## Components

- **Pill buttons**: 56px tall, in Baloo 2. Primary is plum with white text. Ghost is white with a 3px plum inset ring. Closing uses sun with plum text. On hover they lift 3px and tilt 1°; when pressed they drop 1px and scale to 0.98.
- **Stat stickers**: pills on small screens, 124px discs at 1024px and up, in the hero copy column. They never overlap the board.
- **Step badges**: 84px rounded squares holding the step number. A dotted lagoon connector SVG runs from each badge to the next at 720px and up.
- **Feature bento**: a 6-column grid. One saturated lead tile (sun, larger title) is supported by grape, lagoon and quiet tints.
- **Subject cards**: a solid candy colour per subject, with a glyph tile, name, unit count and an arrow. On hover or focus they lift and tilt.

## Motion

- On load, the mastery bars fill (`scaleX`, 1.1s expo-out, staggered by 120ms).
- The next-up row bobs and its play button pulses.
- Hover springs use `cubic-bezier(0.34, 1.56, 0.64, 1)`. This is an intentional overshoot for the playful world, and it is limited to hover and press.
- Everything is disabled under `prefers-reduced-motion`.

## Accessibility

- Focus uses a 3px plum outline with a 3px offset. On dark fields it switches to sun.
- There is a skip link.
- Navigation targets are at least 44px.
- Text contrast meets AA throughout.
- The layout runs from 390px to 1440px+ without horizontal overflow, with breakpoints at 480, 720 and 1024.
