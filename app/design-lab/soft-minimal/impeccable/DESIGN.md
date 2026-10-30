# Soft Minimal · Impeccable — DESIGN.md

Scope: the `/design-lab/soft-minimal/impeccable` homepage variant only. Derived from the shipped build
(`page.tsx`, `page.module.css`).

## Idea

The homepage is a **product label**: it says what the thing is in a few quiet, exact lines, the way Japanese
stationery labels do. The WPH11 mastery example is the label's specification panel, and the feature list is a second
panel of the same kind. One soft indigo accent appears only where the page answers "what should I revise next?".

## Colour (all on `.page`, light only)

| Token           | Hex       | Role                                                   |
| --------------- | --------- | ------------------------------------------------------ |
| `--ground`      | `#eceae6` | Warm grey page ground                                  |
| `--panel`       | `#f6f5f2` | Unbleached label panels (mastery strip, features)      |
| `--ink`         | `#2a2825` | Graphite text, primary button fill                     |
| `--ink-2`       | `#5f5a53` | Secondary text (AA on ground and panel)                |
| `--line`        | `#d3cec6` | Hairlines, meter track                                 |
| `--line-strong` | `#bdb7ad` | Stronger hairlines, link underline, separators         |
| `--accent`      | `#3d5677` | Ai-iro indigo: next-up meter, step numerals, focus ring |
| `--accent-wash` | `#dfe4ea` | Next-up topic cell, text selection                     |
| `--accent-ink`  | `#2f4561` | Text on wash, button hover                             |
| `--strong`      | `#57524b` | Meter fill, strong topics                              |
| `--developing`  | `#948d83` | Meter fill, developing topics                          |

Rule: the accent never decorates. It marks the next-up topic, the step order, check marks and focus.

## Type

Zen Kaku Gothic New (next/font, weights 300/400/500/700). Display is light 300 with slight negative tracking
(headline clamp 2.75–5.75rem, closing 2.25–4.25rem, h2 1.875–2.75rem). Labels and titles 500. Body 400 at ~1rem,
line-height 1.7–1.8, measure ≤ 52ch. Numbers use tabular figures.

## Components

- **Label panel**: `--panel` fill, 1px `--line` border, 3px radius, one soft lift
  (`0 18px 40px -28px rgb(42 40 37 / .28)`). Cells divided by hairlines, never separate cards.
- **Meter**: 3px track, fill scaled by score; the next-up topic uses the accent.
- **Primary button**: graphite fill, 2px radius, 44–48px tall, arrow nudges on hover; hover shifts to `--accent-ink`.
- **Text link**: 1px underline in `--line-strong`, offset 6px, turns accent on hover.
- **Index rows** (steps, subjects): hairline-separated rows, ≥ 64px tall for subjects, arrow moves on hover/focus.

## Layout and rhythm

Max content 1240px, gutter clamp(20px, 5vw, 64px). Section padding clamp(64px, 8vw, 112px); the closing gets 1.4×.
At ≥ 960px, split sections put a sticky h2 at left (4fr) and content right (7fr). The mastery strip shows four columns
at ≥ 860px and stacked rows below. Stats are one inline spec line, stacked under 560px.

## Motion

One authored moment: the meters fill once (1.4s, expo-out, staggered), then the next-up cell washes in and its dot
appears. Disabled entirely under `prefers-reduced-motion`; the default state is the final state.

## Don'ts

No ruled lines, paper sheets or handwriting. No cream and serif. No eyebrow kickers, no icon-card grids, no big-number
stat blocks, no shadows beyond the label lift, no second accent colour.
