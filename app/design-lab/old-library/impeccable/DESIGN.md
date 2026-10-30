# DESIGN — Old Library · Impeccable

Recorded from the built page (`page.tsx`, `page.module.css`). Scope: this design-lab variant only.

## World

A bookbinder's volume rather than a printed page. Forest-green bookcloth is the ground, gilt (brass) tooling does the
ruling, raised bands divide sections, and oxblood leather plus a silk ribbon mark the one thing to do next. There is no
paper, ruled lines or handwriting.

## Colour tokens (on `.page`)

| Token | Hex | Role |
| --- | --- | --- |
| `--ol-ground` | `#16301f` | page bookcloth |
| `--ol-ground-deep` | `#0f2317` | masthead, raised-band strip, holders, closing panel |
| `--ol-cloth-a` / `-b` / `-c` / `-d` / `-navy` | `#23452f` / `#2c3f27` / `#1d3b37` / `#3a2f1f` / `#22324a` | book and spine cloths (a = strong, b = developing) |
| `--ol-oxblood` | `#6c2023` | **reserved**: the next-up / weak topic only |
| `--ol-ribbon` | `#9b3233` | ribbon marker |
| `--ol-cream` | `#f1e8d0` | primary text |
| `--ol-cream-dim` | `#cdc4a5` | secondary text (8.1:1 on ground) |
| `--ol-gilt` | `#d6b46c` | gilt: numerals, accents, focus ring (7.2:1 on ground) |
| `--ol-gilt-deep` | `#a8874a` | brass shadows, decorative only |
| `--ol-gilt-ink` | `#10231a` | text on gilt plates |
| `--ol-rule` / `--ol-hair` | gilt at 55% / 28% | fillets and hairlines |

`--ol-grain` is the bookcloth texture: SVG fractal noise stretched along the weave. Stripe gradients are avoided.

## Type

- **Castoro** (display, roman and italic): headlines, topic names, numerals, feature titles in italic.
- **Castoro Titling** (gilt-stamped caps): brand, nav, buttons, spine titles, mastery level words. Never use it for
  digits in codes, because its "1" reads as "I".
- **Alegreya** (reading text) with lining numerals.
- Headline uses `clamp(2.7rem, 6.4vw, 5.6rem)` and tracking -0.018em. The final word is gilt and upright.

## Components

- **Plate** (`.plate`): the gilt-stamped primary action. A brass gradient with an inset bevel and dark ink, it lifts 1px
  on hover and presses on active. Every sign-up CTA uses it.
- **Tooled** (`.tooled`): the secondary action. A blind-tooled double gilt frame on cloth.
- **Book stack** (`.stack` / `.book`): one horizontal spine per topic, with raised-band fillets at both ends.
  - Code in the left compartment, then name plus gauge, then % and level in the right compartment.
  - Gauge fill encodes level: solid gilt for strong, dotted gilt for developing, cream on oxblood for weak.
  - The weak book is oxblood, pulled out of the stack, and carries a ribbon that falls past the brass shelf. The next-up
    line sits in an enamel holder below.
- **Spines** (`.spine`): standing subject links. Height is proportional to unit count. Each has a gilt band at the top,
  a vertical Titling name, and an "N units" plate that turns gilt on hover and on focus.
- **Raised-band strip** (`.bands`): stats in three compartments.
- **Tooled panel** (`.panel`): the closing panel. A double gilt frame with authored corner fleurons.
- **Tool glyph** (`Tool`): a lozenge between two dots. Use it only in the brand, the imprint and the closing points.

## Layout and motion

- Max width is 1240px. Gutter is `clamp(16px, 4.2vw, 56px)`.
- The hero is two columns at 1000px and up. Below that it is one column; under 560px the imprint moves after the stack.
- Features and Subjects use a 4/8 split at 1000px and up. Chapters go to three columns at 1100px and up, with roman
  numerals hung in a margin column.
- Motion is one authored moment: the weak book slides out (`ol-pull`, 1.1s expo-out) and then the ribbon unfurls
  (`ol-ribbon`). Under reduced motion both settle straight into their final state, and transitions are removed.
- Focus is a 2px gilt outline with 4px offset. Selection is gilt on ink. The scrollbar is brass on deep cloth.
