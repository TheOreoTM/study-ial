# Night Desk · R2 C (Alive)

C starts from the baseline (`app/design-lab/night-desk/impeccable/`) with all five critique fixes. It was built from
A's finished files, so it has the same type, layout, colour and polish (see `../a/CHANGES.md`). On top of that it adds
one authored motion moment and a few quiet micro-interactions. The copy is unchanged, and so are the fonts (Young Serif
and Hanken Grotesk) and the colours.

Issue numbers refer to `design-lab/round-2/night-desk-critique.md`.

## Fixes carried from A

- **#1 Hierarchy**
    - The beam builds to its brightest at row 1.5. Unlit rows are dimmed, and a solid chip sits behind "weak".
    - On mobile the lit row lands in the first screen at y 697–765 of 844.
- **#2 Colour**
    - Amber is used only on the CTAs, the lit row with its Next-up line, step 3, the brand mark and the closing lamp.
    - "Developing" is a dimmer ochre, `#c0915a`.
- **#3 Typography**
    - Young Serif no longer sets the stats or step numbers.
    - The two h3 styles are unified.
    - Subject names are about 26px.
    - Labels are at least 0.875rem.
- **#4 Spacing**
    - The hero is centre-aligned.
    - Stats read as one line.
    - Section rhythm comes from tokens.
    - Features and Subjects share a split layout.
    - The unit count sits right after the subject name.
- **#5 Mood**
    - Dark contact shadows replace the coloured glows.
    - The closing light now comes from a visible lamp mark.
    - The ground is deeper and a vignette was added.

## Motion thesis

The focal moment is the lamp switching on and finding your weakest topic. Everything else is quiet feedback.

- **Hero entrance (CSS only)**
    - The headline, subtext, CTAs and audience line rise 12px and fade in over 560ms, staggered by 70ms.
    - The desk, with its clamped lamp, rises over 600ms starting at 120ms. It arrives dark.
    - The mastery bars fill in order: 800ms each, `cubic-bezier(0.16, 1, 0.3, 1)`, staggered by 110ms.
    - At 1.05s the beam and the lit row's pool flicker on together (700ms `lampOn`).
    - At 1.5s the Next-up line rises in.
    - To make the pool animatable it was moved onto `.lit::before`.
- **Scroll-linked states (`reveal.tsx`, a small client IntersectionObserver)**
    - The mastery bars animate with `transform: scaleX`, never width.
    - The step 3 disc switches from dark to amber, with its light pool, as the steps come into view.
    - The closing lamp mark and its cone switch on when they reach the screen.
    - Each state runs once and then the observer disconnects.
- **Micro-interactions**
    - The CTA has a press state (`scale(0.98)`, 100ms).
    - The arrows nudge on hover.
    - The brand lamp mark gives a single 420ms flicker on hover.
    - Subject names shift 3px on hover, along with the existing warm-from-the-left light.
- **Rules followed**
    - UI transitions run 100–320ms and entrances 420–600ms. The one exception is the bar fill at 800ms (see Left as is).
    - Easing is custom throughout: `cubic-bezier(0.16, 1, 0.3, 1)` and `(0.2, 0, 0, 1)`. Nothing uses default `ease` or
      linear.
    - The bar fill and the lit row's pool swap are opacity or transform; the step 3 disc changes colour.
    - There are no infinite loops.

## Without motion or JS

- All entrance and reveal styles sit inside `@media (prefers-reduced-motion: no-preference)`.
    - Under reduced motion the page renders in its final state immediately. This was verified: h1 opacity is 1 and the
      meters have no transform at 400ms.
- The "before" states that hide content (empty bars, dark step 3, dim closing lamp) also require
  `@media (scripting: enabled)`, plus `data-ready` set by the component on mount.
    - With JS disabled everything is in its final state. This was verified: the meters have no transform and step 3 is
      amber.
    - If the component never hydrates, a 3s CSS safety animation fills the bars.

## Audit status

- Impeccable detector URL scans at 1440×900, 820×1180, 390×844 and 375×812 found **0 findings**. The "weak" chip
  became solid `#1a110b` to clear a 4.4:1 pixel-contrast reading.
- `scrollWidth` equals the viewport at 375, 390, 560, 720, 820, 961, 1024, 1100, 1440 and 1920.
- In a browser with JS on, the observer adds the in-view class: the bars end at `scaleX(1)`, and step 3 is amber
  (`rgb(244,166,64)`) after scrolling.

## Left as is

- The bar fill runs 800ms, which is slightly over the ~600ms entrance guideline. It reads as data loading rather than
  as an entrance.
- The hero CSS entrance and the bar reveal are timed separately, because the bars wait for hydration. In `next dev`,
  hydration can land late and the bars may fill after the lamp switches on. A production build hydrates well before
  1.05s.
- Between 961 and 1100px wide the panel column is narrow, so long topic names wrap to two lines inside the fixed 72px
  rows. This is the same as in A. It stays legible but is tight.
