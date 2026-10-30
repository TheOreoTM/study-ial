# Night Desk · Impeccable — design system

Scope: the design-lab homepage variant in this folder only. It is derived from the built page (`page.tsx`,
`night-desk.module.css`, `icons.tsx`), not from intentions.

## World

A desk at night with one clip-on lamp. The page is warm espresso dark; the only saturated colour is the lamp's amber,
and amber means "look here": the primary actions, the lit next-up topic, the last how-it-works step, and the stat values.
No blue, no neon, no paper or notebook surfaces.

## Colour tokens (CSS custom properties on `.page`)

| Token          | Hex       | Role                                               |
| -------------- | --------- | -------------------------------------------------- |
| `--bg`         | `#17100b` | page ground (espresso)                             |
| `--bg-2`       | `#1d140e` | mid-page ground in the vertical gradient           |
| `--surface`    | `#241911` | desk panel base, step discs                        |
| `--surface-2`  | `#2d2016` | desk panel top                                     |
| `--line`       | `#3f2d20` | hairlines, panel border                            |
| `--line-soft`  | `#2f2219` | row dividers, footer rule                          |
| `--cream`      | `#f4e7d4` | primary text                                       |
| `--muted`      | `#c7b096` | body and secondary text (8.4:1 on ground)          |
| `--faint`      | `#b39c83` | indices, audience line, footer (6:1 on surfaces)   |
| `--amber`      | `#f4a640` | the lamp: primary buttons, stat values, accents    |
| `--amber-hi`   | `#ffc874` | hover, focus ring, next-up text                    |
| `--amber-deep` | `#dc9a45` | "developing" mastery tone                          |
| `--ember`      | `#f08355` | "weak" mastery tone                                |
| `--on-amber`   | `#1f140b` | text on amber (8.9:1)                              |

The mastery tones are strong `#e8d2ae`, developing `--amber-deep` and weak `--ember`. Brightness carries the ranking,
and the level word is always printed beside the bar.

## Type

- Display: **Young Serif** 400 (`--nd-display`), used for headlines, h2s, feature titles, subject names, stat values and
  the brand. Tracking runs from -0.01em to -0.025em, and stat values use lining figures.
- Text: **Hanken Grotesk** (`--nd-text`), used for body, UI, numbers (tabular) and labels.
- Scale: h1 `clamp(2.6rem, 5.4vw, 4.6rem)`, h2 `clamp(2rem, 3.6vw, 3rem)`, closing h2 up to 4rem, body 1rem at a 1.6
  line-height.

## Light

- **Lamp:** an authored SVG with a clamp, two arms, a spring and a shade. It is clamped to the desk panel's top-right
  corner, sized by `--lamp-w` (200px, or 140px at 560px and below).
- **Beam:** a 4-point clip-path trapezoid inside the lit row. A blurred wrapper with `mix-blend-mode: screen` softens
  its edges. Its tip is computed from `--lamp-w` so it always meets the shade. It switches on once with a short flicker
  (`lampOn`), and the flicker is removed under reduced motion.
- **Pools:** the same amber light falls as a radial pool on the lit row, on how-it-works step 3, at the top-left of the
  features band, and above the closing headline. Each one is a light source, never a decorative halo.

## Components

- **Buttons:** amber pill with a soft amber drop shadow. On hover it lifts by 1px and the colour moves to `--amber-hi`.
  The secondary action is a text link with a 2px underline that turns amber on hover.
- **Desk panel:** the WPH11 example. It has a fixed header height (`--head`) and fixed row heights (`--row`) so the beam
  geometry holds at every size.
- **Lists, not cards:** features and subjects are separated by hairlines. Subject rows warm from the left on
  hover/focus.
- **Focus:** a 2px `--amber-hi` outline with a 3px offset. Text selection is amber with `--on-amber` text.

## Layout

- The content column is at most 76rem wide, with a `clamp(1rem, 4vw, 3rem)` gutter.
- The hero has two columns down to 960px. Below that it becomes a single column: the lamp rises into the space beside
  "Browse the syllabus", and the audience line moves below the desk so the lit row lands in the first phone viewport.
- At 420px and below, the nav becomes two rows: the brand and "Get started" on the first, and "Subjects" and "Sign in"
  on the second.
