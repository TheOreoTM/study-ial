# Lo-fi Study Room × Impeccable — round 2 critique

Baseline: `/design-lab/lofi-study-room/impeccable` (`app/design-lab/lofi-study-room/impeccable/`). Mode: Persuade.
Context: PRODUCT.md + the style brief (warm dusk, lamp glow, muted terracotta/plum/mustard, rounded friendly type,
calm and cozy). Copy is fixed (`design-lab/content.ts`).

Method: Impeccable `critique` + `audit`. Assessment A (design review) ran in the parent context. Assessment B
(the `impeccable detect` file and URL scans, plus browser measurements) ran in a separate subagent. A was written
before B's results were read. Screenshots were taken at 1440×900 and 390×844 (DPR 2), first screen and full page:
`/tmp/claude-1000/-home-oreo-code-study-ial/bb5da8fd-72db-45c3-acc0-509152607fc6/scratchpad/r2/lofi-study-room/`.

Heuristic score: 26/32 (81%, Good). Heuristics 7 and 10 are n/a for a landing page.
Audit score: 15/20 (Good).

## Top 5 weaknesses

### 1. Hierarchy: the product proof loses the first screen, and the cued track is not the brightest thing in it

- **Desktop:** the deck runs from y 304 to 904, so it is cut by the 900px fold. Its answer, the "Next up: density,
  upthrust and viscosity. 10 questions." line, sits at about y 838–876, the last thing on screen.
- **Desktop:** the decorative cassette SVG (184px wide, about 120px tall) sits between the deck label and the
  tracklist. It pushes the four tracks down to y 541–802, and it is pure decoration inside the proof.
- **Mobile (390):** the deck starts at y 795, below the 844px first screen. The first track is at y 1070. The first
  screen is lamp, headline, a four-line subtext, two stacked CTAs and the audience line, then the window art begins.
  The proof is never seen without scrolling.
- **Mobile:** the audience line ("Written for Edexcel International A Level", y ≈585) is split from its stats
  (y ≈1600, after the deck). The stats strip then floats between the deck and "How it works" with no context.
- **The One Lamp Rule is broken in practice.** In the desktop first viewport, five surfaces compete with the cued row:
  the mustard nav pill, the mustard countdown chip, the mustard CTA, the 84px warm-white headline and the sunset
  window.
  - The cued row is a 30%→12% lamp wash with a 1.5px ring. It reads as a selected row, not as the lit spot in the
    room.
- **Fix direction:**
  - Remove or shrink the cassette from inside the deck (it could become the reel motif in the deck label), so all
    four tracks and the next-up line sit well above the fold.
  - On mobile, cut the window band to a short strip and pull the deck up directly under the CTAs.
  - Keep the audience line and stats together.
  - Make the cued row the brightest object on the page: a stronger lamp pool behind it, and less mustard elsewhere in
    the hero.

### 2. Colour / mood: the dusk lives only in the hero window and the closing band; the middle of the page is one flat plum field

- From "How it works" down to "Subjects" (desktop y 968–2733, about 1,765px; mobile y 1716–3995, about 2,280px), the
  ground is a flat `#2a1d2e` with no lamp light, window light or gradient.
- The warm light that makes the hero cozy disappears, and those sections read as a generic dark-mode site.
- Mustard is the only warm accent left in the middle. It is spread thin across 6 feature titles, 3 step numerals and
  the spine palette, so it reads as "the accent colour", not as lamplight.
- The steps tape is set to `opacity: 0.55`, which mutes the one warm continuous element in that stretch.
- **Fix direction:**
  - Carry the light down the page. Let the lamp pool or window glow bleed into "How it works", and give the
    features/J-card area a warm pool of its own.
  - Let the background deepen from dusk to night towards the closing sunset band, so scrolling feels like time passing
    in the room.
  - Spend mustard deliberately: CTA, countdown and cued track. Give feature titles a quieter warm cream.

### 3. Typography: the rounded body face reads thin and spindly against the chunky Fredoka display, and small labels are too small

- **Weight mismatch:**
  - Fredoka 600 is set at 84px (desktop h1) and 52px (h2).
  - Body is M PLUS Rounded 1c 400 at 17px in muted `#cdb7bd`. At reading size it looks light and wide-tracked
    (see the mobile hero subtext: four lines, with "dates." left alone on the last line, which the detector also
    flagged as a straggler).
  - The jump from heavy display to thin body skips a middle weight, so the hierarchy feels like two unrelated
    families.
- **Small mastery labels:** the level labels ("strong", "developing", "weak") are 0.8125rem (13px), and the stat
  labels on mobile are 14px. The level word is the key meaning in the tracklist, and at 13px it is the
  smallest text on the page.
- **Step titles are weak:** h3 (22px) against body (17px) is a ratio of only 1.29.
- **Next-up line wraps badly:** on desktop it wraps as "…10 / questions." inside the 552px deck.
- **Fix direction:**
  - Set body at weight 500 (or 17–18px at 500), and use `text-wrap: pretty`/`balance` on the subtext and next-up line.
  - Raise level labels to 14–15px, weight 600–700.
  - Widen the h3/body ratio (h3 about 1.5rem), or set step titles in the mustard-light cream used for the deck code.

### 4. Spacing / rhythm: uniform section padding and half-empty columns leave dead bands; mobile's J-card becomes a long monotone list

- Every section pads clamp(3rem, 7vw, 6rem), which is 96px top and bottom on desktop. That gives the same cadence
  everywhere, with no tightening or opening for emphasis.
- **Hero:**
  - The hero copy has `padding-top: clamp(6.5rem, 9vw, 8.5rem)` for the lamp, so the h1 starts at y 234. About 150px
    of the first screen goes to a hanging lamp.
  - The stats strip ends at about y 845, while the deck goes to 904. The two columns do not resolve to a shared
    baseline.
- **Subjects (desktop):**
  - The h2 "Subjects" sits alone in a 443px left column.
  - The 5 spines fill a 1.4fr right column, about 330px tall, so roughly 300px of empty plum sits under the heading.
  - The shelf section's bottom padding is 7rem, which leaves another blank band before the closing band.
- **Mobile features:**
  - The J-card is one column of 6 panels and 1,163px tall, the longest section on the phone.
  - The panels are identical (title, 3–4 lines, dotted rule), so it reads as a scroll of list items.
- **Fix direction:**
  - Vary the rhythm: tighter between hero and steps, more air before the closing band.
  - Reduce the lamp's vertical footprint (hang it beside the headline, not above it).
  - Fill the Subjects left column (heading + a short line or the shelf's "board" anchoring), or centre the shelf
    under the heading.
  - On mobile, use a 2-column J-card at ≥360px, or a compact title-led list with the body text shortened visually.

### 5. Mood: the room metaphor stops after the hero; features and steps are generic structures, and the closing band ends abruptly

- **The room is only in the hero.** The brief's "calm and cozy room at dusk" is fully present there (lamp, window,
  deck) and in the closing sunset. Nothing in between belongs to the room.
- **The features read as a card grid.**
  - "Everything revision needs" is a 3×2 grid of equal panels with dotted dividers on a plum card.
  - The brief's anti-goals list "identical icon cards as the whole structure", and this is the same structure without
    the icons. The J-card fold idea is not visible: no fold proportions, no insert shape, no spine strip.
- **The steps are only a line.** "How it works" is three columns joined by a 6px gradient line. The reel numerals
  are nice, but the tape reads as a progress bar.
- **The closing band ends abruptly.**
  - It cuts hard into the footer: a top-rounded band with a flat bottom edge, and the sun is half-clipped (it sits
    9rem below the box).
  - It ends at a dark `#1f1523` slab, so the emotional "end" of the page is a seam.
- **The spines are saturated slabs.** They are fully saturated flat fills at about 60px tall each. They read louder
  than the "muted" brief asks, especially the mustard and teal, next to the deck.
- **Fix direction:**
  - Make the features J-card read as a real folded insert: a tall narrow panel strip with fold widths, a spine edge,
    and tracklisted feature titles.
  - Give the steps the cassette tape path the brief promised, with reels at each step.
  - Fade the closing band into the footer as the sea/horizon, with the sun setting into it, not clipped.
  - Mute the spine tones about 10–15%, with a subtle top highlight so they feel like plastic cases.

## What already works and must be kept

- **The tracklist deck as product proof:**
  - WPH11 code in mustard-light Fredoka, the 4 real topic codes, and the 10-segment meters with the
    sage/mustard/terracotta scale.
  - The cued 1.5 row with its play icon and an sr-only "(next up)".
  - The next-up line with the terracotta play dot.
  - This is the most product-specific idea across the lab. Keep its data model, order and meter discipline.
- **The palette tokens:** wall `#2a1d2e`, plum-soft `#3a2740`, terracotta `#d0714f`, mustard `#e2ae4a`, sage
  `#94b59e`, cream `#f5e7d6`, warm white `#fff1e0`, ink `#24161f`. They match the brief exactly, and all text pairs
  pass AA (lowest measured: the weak-level label on the cued row, about 4.6:1).
- **Fredoka + rounded body pairing as a direction.** Only the body weight and small sizes need to change. The headline
  "Know exactly what to revise next." at Fredoka 600 with −0.025em tracking is warm and confident.
- **The dusk window** (terracotta-to-mustard sky, palm, moon, sea): a Maldives cue without cliché.
- **The pendant lamp with its breathing glow,** and the closing sunset band gradient (`#4e2c48` → terracotta) with the
  ink pill CTA.
- **The cassette-spine subject shelf:** subjects as cases with an ink J-card band and unit pill, the hand-stacked
  offsets on desktop, and the slide-on-hover. It flattens cleanly at 720px.
- **The step reels with the gradient tape,** which turns vertical on mobile (reads well at 390).
- **Dotted cream rules (14–20%) instead of hairlines,** soft negative-spread warm shadows and pill buttons. These are
  the material language.
- **Accessibility groundwork:**
  - Skip link, a 3px mustard-light focus ring, and aria-hidden decorative SVGs.
  - `prefers-reduced-motion` stops the reels, the lamp breathing, the meter pulse and the hover lifts.
  - No horizontal overflow at 390 or 1440.

## Audit results (compact)

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 3 | All text passes AA; some non-text contrast falls under 3:1 |
| Performance | 3 | Light page; unused font weights; several infinite animations (reduced-motion safe) |
| Theming | 3 | Tokens on `.room`; about 10 raw hex values outside tokens; dark-only by design |
| Responsive | 3 | No overflow; proof pushed below the mobile first screen; nav targets 35–43px |
| Implementation integrity | 3 | Coherent own system; detector flags are mostly intentional |
| **Total** | **15/20** | **Good** |

**Contrast** (computed against the solid grounds):

| Pair | Ratio |
|---|---|
| Cream on wall | 13.2:1 |
| Muted on wall | 8.5:1 |
| Muted on plum-soft | 7.2:1 |
| Muted on deck top | 6.3:1 |
| Sage level label | 6.1:1 |
| Mustard level label | 6.7:1 |
| Ink on mustard | 8.6:1 |
| Ink on terracotta | 5.1:1 |
| Ink on sage | 7.7:1 |
| Ink on rose | 7.1:1 |
| Ink on teal | 6.8:1 |
| Warm white on the cued row | about 5.2:1 |
| `#fde0d2` weak label on the cued row | about 4.6:1 |
| Closing text on the band, top to 72% | 10.6 to 5.3:1 |

No text failures.

**Findings by severity:**

- **[P2] Non-text contrast:**
  - The ghost button ring (cream at 35%) is 2.84:1 against the wall, under WCAG 1.4.11's 3:1. Raise it to about 45%.
  - Unlit meter segments are 1.39:1 against the card, and the weak meter's unlit-vs-lit contrast is 2.86:1. This is
    mitigated because the score and level are also given as text; still, raise unlit segments to about 20%.
- **[P2] Responsive: the first mobile screen has no proof.** The deck is at y 795 on a 844px screen. Stats are split
  from the audience line.
- **[P2] Typography: small labels.** Level labels are 13px and mobile stat labels are 14px. The subtext straggler
  ("dates.") at 390 was flagged by the detector.
- **[P3] Touch targets:** nav links measure Subjects 73×37, Sign in 60×37, brand 79×29 and Get started 99×40. They
  pass WCAG 2.5.8 (≥24px) but are under 44px. All page controls are 44px or more.
- **[P3] Performance:** Fredoka loads 400/500/600, but only 600 is used. Drop 400/500.
  - There are three infinite animations: a 46×34rem lamp glow opacity, the reel rotation and the meter pulse. They are
    opacity/transform only and stop under reduced motion.
  - The large `drop-shadow(0 30px 60px)` filter on the window SVG is static.
- **[P3] Theming:** raw hex values sit outside the token block: `#fff1e0` ×5, `#ef9a7a`, `#fde0d2`, `#44304a`,
  `#3a2433`, `#5a3b5e`, the closing gradient stops and the sun colours. Promote them to tokens. Dark-only is
  intentional for this style.
- **[P3] Semantics:** the deck `figure` is labelled only by "WPH11". Consider labelling it by the code and name
  together.

**Detector (`impeccable detect`):**

- **Source scan of page.tsx and scene.tsx:** 0 findings.
- **URL scan:** 3 findings at 1440 and 4 at 390.
  - `dark-glow` on `.trackCued` (the lamp-colour box-shadow): intentional, as the One Lamp Rule. Keep it, but it
    should be the only glow.
  - `radial-halo` on the `.closingSun` gradient: a false positive. It is the setting sun, not a page halo.
  - `shape-assembled-illustration` on the window SVG (14 primitives, 10 fills): accurate. It is acceptable for a
    code-led scene, but it is the reason the art feels flat-vector. Light/texture (grain, a soft glow on the sea) would
    help the mood.
  - `straggler` on the mobile subtext: a true positive.
- **Browser checks:** no console errors, and no horizontal overflow at either width.
