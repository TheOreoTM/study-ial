# Night Desk × Impeccable: round 2 critique (step 1)

Baseline: `/design-lab/night-desk/impeccable` (`app/design-lab/night-desk/impeccable/`). This is a review only, and no
page or CSS was changed.

**Method.** Impeccable `critique` and `audit` (v4.8.0). Assessment A, the design review, ran inline in the critique
agent from source and screenshots. Assessment B, the detector, ran in an isolated sub-agent: a source scan plus a URL
scan at 1280×800. No user was available, so PRODUCT.md and the Night Desk brief serve as the confirmed context, and
`.impeccable/` snapshots were skipped.

**Screenshots** were taken with Chromium at 1440×900 at 1× and at 390×844 at 2×, each as a first screen and a full
page. They are in `/tmp/claude-1000/-home-oreo-code-study-ial/bb5da8fd-72db-45c3-acc0-509152607fc6/scratchpad/r2/night-desk/`
(`desktop-first.png`, `desktop-full.png`, `mobile-first.png`, `mobile-full.png`, plus crops `m-crop-desk.png` and
`m-crop-stats.png`). The Next.js dev badge (bottom-left) is a dev-only artefact and is ignored.

**Mode:** Persuade, on a homepage. The brief asks for a warm, cozy dark page in espresso and amber that is not techy,
with no navy and no neon. Copy is fixed.

---

## Top 5 weaknesses

### 1. Hierarchy: the lamp does not actually light the topic it points at

- **Evidence**
  - The beam gradient (`.beam > span`) is brightest at the shade and fades as it falls. It runs from
    `rgba(255,214,150,.30)` at the top to `.10` at 45%, `.08` at 80% and `.02` at the bottom, where row 1.5 sits.
  - The desk's own radial pool is centred at `var(--head) + var(--row) * 2.5`. That is the line between 1.3 and 1.5,
    not the middle of 1.5.
  - In both screenshots, rows 1.1 and 1.3 sit inside the brightest part of the cone. On mobile
    (`mobile-first.png`) they are visibly washed brighter than the lit row.
  - The lit row is set apart only by a background at 0.20 alpha, font-weight 600, an amber code and two amber hairlines
    at 0.25 alpha.
  - The direction contract promised that "the weakest topic row is the brightest thing on the page after the CTA". It
    is not.
- **Mobile makes it worse.**
  - At 390×844 the lit row starts at y=810, so only 34px of it is above the fold. "Next up…" starts at y=962 and is off
    screen.
  - The two-row nav costs roughly 50px.
  - "Browse the syllabus" sits on its own line under the CTA.
  - DESIGN.md claims "the lit row lands in the first phone viewport". It barely does, and its payoff line does not.
- **Fix direction**
  - Invert the light so it builds up where it lands: the beam is faint near the shade, and the pool's peak sits on the
    centre of row 1.5.
  - Push the unlit rows further into the dark, with lower name opacity and dimmer bars, so 1.5 is the clear brightest
    element after the CTA.
  - On mobile, recover about 120px so that row 1.5 and the Next-up line both sit above 844px. Options: a one-row nav,
    a tighter subtext and CTA block, and less space between the lamp and the desk.

### 2. Colour: amber is spent everywhere, so "amber means look here" no longer holds

- **Evidence**
  - There are about 17 amber placements: the brand mark, nav button, hero CTA, `WPH11` code, lit code, Next-up text and
    icon, the three stat values, step numbers 1 and 2 (amber text), step 3 (a filled amber disc with a glow), the band's
    top highlight line, two check icons, the closing hairline and the closing CTA.
  - The stat values are the largest amber mass on the page: Young Serif at 56px on desktop and 36px on mobile, three
    times over. Just below the hero they outshout the lit topic.
  - `--amber-deep` (#dc9a45, "developing") is almost the same hue as brand `--amber` (#f4a640). The 64% "developing"
    bar therefore reads as a brand-coloured bar rather than as a mastery level.
- **Fix direction**
  - Reserve amber for the lamp's job: the primary CTAs, the lit row with its Next-up line, and step 3 ("Fix what's
    weak").
  - Set the stat values and step numbers 1 and 2 in cream or muted, so the numbers carry weight through size rather
    than colour.
  - Pull "developing" away from brand amber, towards a dimmer, browner ochre, so the strong, developing and weak bars
    read as a brightness ramp and not as an accent.

### 3. Typography: the display serif has too many jobs and the scale is flat in the middle

- **Evidence**
  - Young Serif 400 does 8 jobs: the h1, the h2s, feature titles, subject names, stat values, the brand, the unit name
    and the step numbers. Because it is everywhere, it stops marking importance.
  - Subject names are 38.4px against a 48px "Subjects" h2, a ratio of only 1.25. The list rows are nearly as loud as
    the section headings, and on the full-page shot the subjects list is the heaviest typographic block after the hero.
  - There are two h3 systems:
    - How-it-works titles are Hanken 600 at 18.4px.
    - Feature titles are Young Serif 400 at about 23px.
    - Both are `<h3>` and do the same job.
  - At 1440px the features h2 is capped at `14ch` and breaks into five ragged lines ("Everything / revision / needs, /
    nothing / it doesn't"). The comma lands at the end of a line.
  - Small UI text is very small: the level words and `WPH11` are 12.8px, and `WPH11` adds 0.08em tracking.
- **Fix direction**
  - Keep Young Serif for the h1, h2s, the closing line and the brand. Move it off at least two other roles; good
    candidates are the stats and the step numbers.
  - Unify h3 into one style.
  - Bring the subject names down to about 1.5–1.75rem so the h2-to-row ratio is at least 1.6.
  - Widen the features heading to about 18–20ch so it sets in three lines.
  - Raise the level words to at least 0.875rem.

### 4. Spacing: an empty hero top, scattered stats and an even rhythm below the fold

- **Evidence**
  - On desktop the nav ends at about y=79 and the h1 starts at y=261, leaving about 180px of empty dark above the
    headline.
    - The cause: the hero uses `align-items: end`, and the scene reserves `padding-top: calc(var(--lamp-w) * 1.02)`
      (204px) for the lamp. The copy column is pushed to the bottom to line up with the desk.
  - The stats strip uses `justify-content: space-between` across 1120px. "175", "114" and "Free" float about 470px
    apart, with "Free to use" pinned to the far right edge.
    - `content.ts` describes the stats as "shown together, e.g. a sentence". This layout reads as three unrelated
      KPIs.
  - Every section opens with the same `clamp(4.5rem, 10vw, 8rem)` (128px) top padding. There is no tight or loose
    rhythm to group related material.
  - The closing section adds a 144px margin plus 112px of padding, so on desktop about 256px of empty space separates
    the subjects list from the closing headline.
  - Subject rows run the full 1120px. The name sits at the left and "6 units" with its arrow sits about 900px away at
    the right, so each row is mostly empty band.
- **Fix direction**
  - Start the hero copy higher: align to start or centre, or let the lamp overhang the nav gutter instead of reserving
    a full lamp height.
  - Set the stats as one cluster that reads like a sentence (175 topics · 114 questions · free), left-aligned with
    normal gaps.
  - Vary the section rhythm: tighter between how-it-works and features, generous only before the closing line.
  - Cap the subject list at about 40–48rem, or set it as two columns, so the name and unit count read as one row.

### 5. Mood: the cozy desk stops at the hero, and the rest is a generic dark landing page

- **Evidence**
  - Below the first viewport the structure is the stock template: a stats strip, three numbered steps on a connector
    line, a 2×3 feature grid, a link list, and a centred CTA under a radial glow.
  - The lamp, the desk and the light-as-pointer idea do not appear again. The later "pools" are faint, 0.10–0.20 alpha
    radials that read as decorative halos, not lamplight.
  - The detector agrees. It flagged `dark-glow` four times (the amber box-shadow glow on the nav button, the hero CTA,
    step 3's disc and the closing CTA). It flagged `radial-spotlight-glow` twice (the desk pool and `.closingGlow`). The
    closing glow and the glow on step 3 are the clearest "AI dark-mode" tells.
  - Surfaces barely separate from the ground. `--surface` #241911 on `--bg` #17100b is about 1.1:1, and the
    features-band gradient (#211710 → #1b130d) is just as close. Below the hero the page reads as one flat espresso
    sheet, with no falloff, vignette or material. It comes across as dark mode with an orange accent rather than a room
    lit by one lamp.
- **Fix direction**
  - Keep one light source and let it travel. Each section should have one lit thing, such as step 3 or the closing CTA,
    while the rest falls off into a deeper dark at the edges of the viewport, for example a warm vignette.
  - Swap the coloured box-shadow glows for dark, neutral drop shadows. The pills stay amber; only the amber halo goes.
  - Drop the floating closing haze, or tie it to a visible source.
  - Add warmth through materials the brief allows: a very fine grain, deeper contrast between the lit and unlit areas,
    and a slightly warmer cream in the pools. Do not use paper or notebook surfaces.

---

## What already works and must be kept

- **The concept and the lamp itself.**
  - The authored SVG clip-on lamp is clamped to the desk's top-right corner.
  - The beam tip is computed from `--lamp-w`, so the geometry holds at 200px and at 140px.
  - The one-time `lampOn` flicker is removed under reduced motion.
  - This is the page's signature and it is specific to the product. Keep the geometry and fix only the light falloff.
- **The WPH11 desk panel as hero proof.**
  - It uses real IAL vocabulary: unit code, topic numbers and the exam countdown.
  - The level word is always printed beside the bar, so meaning does not rely on colour.
  - Rows have fixed heights (`--head`, `--row`), which keeps the beam aligned.
  - The screen-reader-only "(next up)" label is on the lit row.
- **The palette tokens and their contrast.**
  - The palette is espresso, cream and amber, with no blue and no neon, which matches the brief.
  - Measured contrast:
    - Cream on ground: 15.5:1.
    - `--muted`: 9.0:1.
    - `--faint`: 7.2:1 on ground and at least 6.0:1 on surfaces.
    - `--ember` "weak" on the desk: at least 6.1:1.
    - Amber on ground: 9.3:1.
    - Text on amber: 8.9:1.
  - Every text pair passes AA with a wide margin.
- **The type pairing.** Young Serif and Hanken Grotesk give a soft, round, bedtime-warm feel without looking techy. The
  h1 at 73.6px, line-height 1.04 and -0.025em tracking is a strong first read. Stats use lining tabular figures.
- **Lists, not cards.** Features and subjects are split by hairlines rather than boxed in cards. Subject rows warm from
  the left on hover and focus, with the arrow nudging 4px. This is the right interaction language; it only needs better
  proportions.
- **Mobile choreography.** Below 960px the lamp rises into the space beside "Browse the syllabus" and the audience line
  moves below the desk. There is no horizontal overflow at 390px (scrollWidth is 390).
- **Accessibility groundwork.** It has a skip link, a `main` landmark and a clean h1 → h2 → h3 order. The amber-hi focus
  ring is 2px with a 3px offset, text selection is styled, and `aria-hidden` is set on all decorative SVG and light
  layers.

---

## Audit results (Impeccable `audit`)

| # | Dimension | Score | Key finding |
| - | --- | --- | --- |
| 1 | Accessibility | 3 | All text passes AA comfortably. Minor issues are accessible-name run-ons and small level text. |
| 2 | Performance | 3 | Static RSC page using next/font. The only heavy effect is a blurred `mix-blend-mode: screen` beam. |
| 3 | Theming | 3 | Tokens are defined, but about 20 raw `rgba(244,166,64,…)` literals plus off-token band and strong-tone colours. |
| 4 | Responsive | 3 | No overflow at 390px. The fold misses the lit row on phones, and the nav button is 39px tall. |
| 5 | Implementation integrity | 2 | Strong product-specific hero, but generic template structure and glow tells after the hero. |
| **Total** | | **14/20** | **Good**: address integrity and the fold |

**Detector.**

- The source scan (`page.tsx` and the folder) is clean, with 0 findings.
- The URL scan at 1280×800 returned 6 warnings, all in the slop category:
  - `dark-glow` × 4: nav button, hero CTA, step 3 disc, closing CTA.
  - `radial-spotlight-glow` × 2: `figure.desk` and `.closingGlow`.
- The desk pool (#3) is an intentional lamp pool, so it counts as a false positive, though its peak is misplaced (see
  weakness 1). The closing glow (#5) and all four `dark-glow` findings are real.

**Findings by severity**

- **[P1] The payoff misses the phone fold.** The lit row is only 34px into the viewport at 390×844, and Next-up is at
  y=962. Responsive and hierarchy. (`night-desk.module.css` 857–1026.) Suggested command: `/impeccable adapt`, then
  `/impeccable layout`.
- **[P1] The beam's light falloff is inverted.** The brightest light lands on the wrong rows. Integrity. (Lines
  446–474, 272.) Suggested command: `/impeccable polish`.
- **[P2] Coloured glow shadows.** Found on `.btn`, `.btnLarge` and `.step:last-child .stepNum`, plus the floating
  `.closingGlow`. These are AI dark-mode tells. Integrity. (Lines 150–163, 645, 784–807.) Suggested command:
  `/impeccable quieter`.
- **[P2] Accessible-name run-ons.**
  - Subject links read as "Physics6 units".
  - The score reads as "38%weak".
  - The stats read as "175specification topics".
  - Adjacent spans have no whitespace between them. Screen-reader output depends on the engine; add a space or a
    visually hidden separator. Accessibility. (`page.tsx` 89, 120, 168.) Suggested command: `/impeccable harden`.
- **[P2] Touch target below 44px.** The nav "Get started" button is 106×39px on mobile. It still passes 2.5.8's 24px
  minimum. The brand link is 31px tall. Responsive. Suggested command: `/impeccable adapt`.
- **[P3] Reduced motion is a global kill.**
  - `prefers-reduced-motion` sets `transition: none !important` on everything.
  - State still changes, so hover feedback survives without motion. That is acceptable, but blunt.
  - Accessibility.
- **[P3] Hard-coded colour literals.**
  - About 20 `rgba(244,166,64,…)` and `rgba(255,200,116,…)` values.
  - Band colours `#211710` and `#1b130d`.
  - Strong tone `#e8d2ae` is not a token.
  - Theming. Suggested command: `/impeccable polish`.
- **[P3] Performance: blurred screen-blended beam.**
  - `filter: blur(5px)` plus `mix-blend-mode: screen` on the absolutely positioned beam, which is about 520×500px.
  - It is one layer and composites once. Fine on modest phones but worth keeping single.
- **[P3] Low-contrast secondary-link underline.** The ghost link's underline uses `--line`, which is 1.44:1 against
  the ground. The cream text carries the affordance, but the underline is nearly invisible at rest.

**Heuristics (critique).** Persuade surface, so heuristics 5, 7, 9 and 10 are scored n/a on a static homepage.

| # | Heuristic | Score | Key issue |
| - | --- | --- | --- |
| 1 | Visibility of system status | 3 | The countdown and Next-up show product status well |
| 2 | Match with the real world | 4 | IAL vocabulary throughout: WPH11, topic codes, exam sessions |
| 3 | User control and freedom | 3 | Clear primary and secondary paths |
| 4 | Consistency and standards | 2 | Two h3 styles, and amber means "look here" and "decoration" at once |
| 6 | Recognition rather than recall | 3 | The example teaches the mastery idea without text |
| 8 | Aesthetic and minimalist design | 2 | Strong hero; generic, evenly weighted remainder |
| **Total** | | **17/24** | **Good** |

Questions skipped: no user available (subagent run). The step 2 brief stands in.
