# Night Desk · R2 A (Refined)

This version keeps the same world as the baseline (`app/design-lab/night-desk/impeccable/`) and refines the craft. It
uses the same fonts, Young Serif and Hanken Grotesk, and the same lamp SVG. The copy is unchanged; the only additions
are whitespace inside accessible names.

Issue numbers refer to `design-lab/round-2/night-desk-critique.md`.

## Fixes to the critique issues

- **#1 Hierarchy: the light lands on the lit row**
    - The beam gradient is inverted. It is faint at the shade (0.05–0.06 alpha) and builds to its brightest at the lit
      row (0.17).
    - The desk pool is now a tight ellipse centred on row 1.5.
    - Unlit rows are pushed back: names at 0.74 opacity, meters at 0.6, scores dimmed.
    - The lit row gets full cream, weight 600, an amber code and a dark chip behind "weak".
    - On mobile the lit row lands in the first screen (y 697–765 at 390×844; it was 810–886). The Next-up line starts at
      the fold (y 833).
        - Rows were restacked to put the name on line 1 and the meter and score on line 2, at 68px per row.
        - The lamp is 120px.
        - The desk rises beside "Browse the syllabus".
        - Hero spacing is tighter.
- **#2 Colour: amber is reserved for the lamp's job**
    - Amber is now used only by the CTAs, the brand mark, the lit row with its Next-up line, the step 3 disc and the
      closing lamp mark.
    - Stats, step numbers 1–2, `WPH11` and the check icons moved to cream or muted.
    - "Developing" is a dimmer ochre (`#c0915a`), so the mastery ramp reads by brightness (cream → ochre → ember) rather
      than as brand amber.
- **#3 Typography: fewer roles for the serif**
    - Young Serif is now only used for the brand, the h1, the h2s, the closing line, the unit name and the subject names.
      Stats and step numbers moved to Hanken.
    - The two h3 styles are unified (Hanken 600, 1.125rem) for both steps and features.
    - Subject names dropped from 38.4px to 26px, giving an h2-to-row ratio of 1.77.
    - Small labels are now at least 0.875rem; the level words were 12.8px.
    - Type roles are tokens (`--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-small`).
- **#4 Spacing**
    - The hero is centre-aligned, and the lamp overhangs the scene by 0.8× its width instead of reserving 1.02×. On
      desktop the h1 moved from y=261 to y=168.
    - Stats are one left-aligned sentence (175 specification topics · 114 practice questions · Free to use) instead of
      `space-between` across 1120px.
    - Section rhythm comes from one `--section` token, with a tighter step for the band's inner padding. The dead space
      before the closing section shrank (it was 144px margin plus 112px padding).
    - Features and Subjects share one split layout, with the heading on the left and the content on the right.
    - In subject rows the unit count now sits right after the name (`auto 1fr auto`), so it is no longer about 900px
      away.
- **#5 Mood**
    - The four amber box-shadow glows (buttons and the step 3 disc) are now dark contact shadows. The pills stay amber.
    - The floating `.closingGlow` haze is gone. A small lamp mark now hangs over the closing line and casts a clipped
      cone onto it, so the light has a visible source.
    - The ground is deeper (`#140d09`), surfaces are lifted (`#2a1d14`/`#33251a`), and a soft edge vignette is baked into
      the page background.

## Audit fixes

- Accessible-name run-ons are fixed by whitespace between spans (topic rows, stats and subject links).
- Nav links, the brand link and the mobile "Get started" button now have a 44px minimum height.
- The ghost-link underline is now 35% cream, up from `--line` (1.44:1).
- Reduced motion no longer uses a global kill. It removes only the beam flicker and the transforms; colour feedback
  stays.
- `--faint` was raised to `#b09479`, which holds at least 5.3:1 on the desk surface.
- Literal amber rgba values became `color-mix()` on tokens. Scrollbar colours are themed.

## Audit status

- Impeccable detector URL scans at 1440×900, 820×1180, 390×844 and 375×812 found **0 findings**.
- The source scan is clean.
- `scrollWidth` equals the viewport at 390, 820 and 1440, and at 375 too.

## Left as is

- The desktop nav "Get started" is 40px tall. That is above 24px (WCAG 2.5.8) but under 44px; it is a mouse context.
- The cone still passes over rows 1.1 and 1.3 on its way down, as a real beam would. They are dimmer than the lit row.
- Between 961 and 1100px wide the panel column is narrow, so long topic names wrap to two lines inside the fixed 72px
  rows. They stay legible but the rows are tight.
- The chip behind the lit "weak" label is solid `#1a110b`. A translucent chip read 4.4:1 in a pixel scan.
