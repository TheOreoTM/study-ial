# Playful Pop · R2 C (Alive)

Built on the finished **R2 A**: the same five critique fixes and the same typeset, layout and polish work. Fonts and colours are unchanged from A (Baloo 2 800 + Figtree; mastery colours are reserved; subjects have their own identity colours). Then animate, delight, and polish passes. Copy is verbatim.

## Critique fixes (inherited from A)

All five issues, **#1 to #5**, are fixed:

- On phones the hero shows the board directly after the primary CTA, at y≈547 at 390px.
- Product fragments replace the bare step numbers, and the icon-tile features are gone.
- Mastery colours are used only for mastery data.
- A 4-role type scale.
- The infinite loops are removed, and so are the cropped circles and the subject stagger. **#5** is resolved more fully here, because motion is now a single authored sequence.

## Motion thesis

**Focal moment**: the board "scores" the unit:

1. The headline, copy and stats rise in: 520–560ms, ease-out `cubic-bezier(.16,1,.3,1)`, staggered 60/160/260ms.
2. The board settles in from 3° extra tilt: 600ms.
3. The four mastery bars fill: 600ms ease-out-quart, staggered 90ms.
4. The weak row lifts once: 420ms.
5. The next-up play button pulses once: 600ms.

Nothing loops.

**Fill on view**: `fill-on-view.tsx` is a small client component using IntersectionObserver.

- It covers the step fragments and the "Mastery you can see" strip.
- **It arms only when the block starts below the fold**, so the server HTML always shows the finished state, with no flash.
- Once armed, it sets `data-fill="in"` the first time the block is 45% visible, then disconnects.

**Delight, specific to the product**:

- Step 2: the five marks land one by one, like answers being marked (opacity plus scale, 110ms apart).
- Step 3: the weak bar fills to 38%. Then a dashed "where practice takes you next" run draws in with `clip-path`, and the trend arrow pops in.
- The mastery strip fills row by row.

**Hover and press**:

- All UI transitions are 150–240ms: nav pills 150ms, buttons 200ms, subject cards 240ms.
- The subject glyph tilts and scales on hover and focus.
- The existing lift, tilt and arrow nudges stay, and press is scale 0.98.
- The overshoot spring is used only for hover, press and pop-ins.

**Material**: transform, opacity and clip-path only. No layout properties are animated.

**Reduced motion**: every animation and transition is off, and FillOnView does not arm. Without JS everything is visible in its final state; I verified this at 1440 with JS disabled and with reduce emulated. Both runs showed no armed blocks and full bars.

## Audit (1440 / 820 / 390)

- **Overflow**: scrollWidth equals the viewport at all three widths.
- **Contrast**: 0 AA failures.
- **Tap targets**: none under 44px.
- **Focus**: unchanged from A (visible 3px, plum or sun).
- **Reduced motion**: 0 animations under reduce.
- **Console**: no errors. `tsc` is clean.
- **Detector**: `bounce-easing` only (advisory, hover/press spring, accepted).

## Left open

- LCP rises to about 424ms on desktop and 380ms on mobile (dev server), from about 296ms in A, because the H1 fades in. Drop the opacity on `.headline`'s `rise` if LCP matters more than the entrance.
- The hero bars still fill on load rather than on view, because they are in view at load on desktop. On a 390px phone the lower two rows finish filling before they scroll into sight.
- The mobile features section is still a single column of about 1500px (inherited from A).
