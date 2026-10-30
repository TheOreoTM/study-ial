# Night Desk · Impeccable — shape brief and direction contract

Development notes only; never rendered. Assumptions are taken from the design-lab brief and PRODUCT.md
(no user available to interview; the brief stands in as confirmed answers).

## Shape brief

- **Job and audience:** IAL students (16–19, Maldives) landing on the homepage, usually in the evening, often on a
  phone. Visitor mode: Persuade. They decide whether this is worth signing up for.
- **Outcome and proof:** primary action "Start practising free". Proof is the WPH11 mastery example: the product
  picks the weakest topic (1.5, 38%) and says what to do next. Stats 175 / 114 / Free are the only numbers; no
  testimonials, no invented claims. Copy is fixed (design-lab/content.ts).
- **Selected direction (pinned by brief):** Night Desk — warm dark, espresso browns, amber lamp light. Cozy, not techy.
  No navy/blue/neon, no paper/notebook motifs.
- **Scope:** one static homepage at /design-lab/night-desk/impeccable; no data, no client JS required.
- **States:** links only; hover, focus-visible, reduced motion. 390 → 1440+.

## Direction contract

THESIS: The lamp decides what you look at. A desk lamp leans over the first viewport and its pool of light lands on the
one topic you should revise next; everything else sits in the warm dark. Refuses the category default of a headline
over a screenshot in a device frame and a row of equal feature cards.

OWN-WORLD: Espresso ground (#17100b → #21160f), roasted-brown surfaces, a single amber light (#f4a640) that is the only
saturated colour; cream text (#f4e7d4). Young Serif for display (soft, round, bedtime-warm), Hanken Grotesk for
reading and tabular numbers. Authored SVG desk lamp with a cone of light. Hairlines in burnt umber, no cards-with-icons.

STORY: Headline → the lit topic proves it → stats as one sentence → how it works → what's included → subjects → close.

FIRST VIEWPORT: headline left, lamp + WPH11 "desk" right, light cone falling on row 1.5 with its next-up line; primary
CTA in amber.

SIGNATURE: the lamp switches on (cone fades/warms in once on load; skipped under reduced motion). The weakest topic row
is the brightest thing on the page after the CTA.

RISK: lamplight is a known AI-warmth prior; mitigated by making the light a functional pointer (it marks "next"), not
ambience.
