# Playful Pop · Impeccable — shape brief and direction contract

Development-only. Not imported by the page.

## Shape brief (assumptions: no user available; the lab brief + PRODUCT.md are the confirmed answers)

- **Job and audience:** IAL students (16–19, Maldives), often on a phone in the evening, deciding whether this is worth
  signing up for. Mode: Persuade.
- **Outcome and proof:** start practising free. The proof is the product mechanism itself: a unit's topics with mastery
  scores and the weakest one flagged as "next up". Real numbers only (175 / 114 / Free); no invented claims.
- **Direction (pinned by the lab brief):** Playful Pop — warm bright light theme, chunky rounded type, colourful subject
  cards, energetic. Not paper/notebook. Do not copy Duolingo/Brilliant branding (no green owl palette, no 3D ledge
  buttons).
- **Scope:** one static homepage at `/design-lab/playful-pop/impeccable`; every line of `content.ts` verbatim; no
  data, no auth.
- **Constraints:** 390–1440+, no horizontal overflow, WCAG AA, visible focus, reduced motion respected,
  self-contained fonts/colours/CSS module.

## Direction contract

THESIS: Revision as a colourful game board where the mastery card is the hero object: the weakest topic glows and
bobs, so "what to revise next" is answered before any copy is read. Refuses the split hero with a device mockup and a
row of equal feature cards.

OWN-WORLD: Drenched tangerine hero field over a warm white ground; deep plum ink; lagoon (Maldivian turquoise),
sunshine, bubblegum, grape and lime as flat, fully committed fields. Chunky Baloo 2 ExtraBold display, Figtree body.
Fat pill controls, big-radius blobs, soft tinted drop shadows (offset + blur, never zero-blur blocks), sticker-like
stat badges slightly rotated.

STORY: Visitor reads the promise, sees their own kind of unit (WPH11) scored topic by topic with one flagged, learns
the three-step loop, scans features, finds their subject, and signs up.

FIRST VIEWPORT: Nav on tangerine. Giant left-aligned headline across ~70% width; subtext and two pill CTAs below;
audience line as a small badge. The WPH11 board (plum card, chunky mastery bars) sits beside/below, tilted slightly,
with three stat stickers orbiting it. Primary CTA plum pill, high in the viewport.

FORM: Game-board / level-map grammar (pinned by brief, no roll). seed: none (unavailable)

SIGNATURE INTERACTION: mastery bars fill on load; the "next up" row bobs and its pill pulses; subject cards tilt and
lift on hover/focus. All disabled under prefers-reduced-motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and
every shipping raster carrying its provenance

## Critique (dual-agent; snapshot not persisted, to keep .impeccable/ out of the shared repo root)

The design review scored 21/28 across 7 heuristics, with 7, 9 and 10 marked n/a. Its verdict was "specific above the fold, generic below".

Fixes applied in the polish pass:

- **P1 Sticker overlap:** the stat stickers covered the weak score, the countdown and the next-up line. They now sit in the hero copy column and never overlap the board.
- **P1 Dotted path:** the path cut through the step text. It is replaced by per-step connectors that run badge to badge.
- **P2 Step badges:** removed the corner icons on the badges, which also cleared the detector's icon-tile-stack finding.
- **P2 Bento hierarchy:** the feature bento now has one saturated lead tile (sun, larger title), with tints for the quieter tiles.
- **Contrast:** the closing CTA was white on sun at 1.44:1. It is now plum on sun. The cause was `.page a` beating `.btnSun` on specificity.
- **h2 margins:** these were zeroed by the `.page h2` reset (same specificity cause) and are now restored.
- **Mobile nav:** the 390px nav had hidden the Subjects link. The nav now wraps to two rows, and every nav target is at least 44px.
- **Smaller fixes:** the ghost button's focus offset is larger, the weak row no longer has a pink glow, the raw hex is now a token, and the dead hero spacing is gone.

Left open on purpose:

- The bounce-easing advisory stays. It is a deliberate spring, used only on hover and press.
