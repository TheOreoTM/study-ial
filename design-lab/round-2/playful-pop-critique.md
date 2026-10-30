# Playful Pop × Impeccable: round 2 critique (step 1)

Baseline: `/design-lab/playful-pop/impeccable` (`app/design-lab/playful-pop/impeccable/`). No code was changed.

How this was assessed: Impeccable `critique` with two isolated sub-agents (A: design review, B: detector plus browser evidence), followed by `audit`. Screenshots are in the scratchpad `r2/playful-pop/` folder:

- `desktop-first.png` and `desktop-full.png` (1440×900)
- `mobile-first.png` and `mobile-full.png` (390×844)
- section crops

The `.impeccable/` snapshot was not written; the brief asked for that.

**Verdict:** the top of the page is specific to the product and the bottom is generic. The hero mastery board is authored for this product and could only belong to Study-IAL. From "How it works" down, the page falls into a stock edtech template, and the candy colours stop meaning anything.

**Heuristics:** 24/32, which is 75% and falls in the Good band. Heuristics 7 and 10 are n/a for a landing page. The weakest is heuristic 8 (aesthetic and minimalist) at 2/4, because of hero overload.

**Cognitive load:** 3 of 8 checks fail:

- **Single focus:** the hero splits attention across the CTAs, the stickers and the board.
- **Chunking:** the bento has 6 tiles and the subject row has 5.
- **Choices:** there are 5 visible actions in the hero, 2 of which duplicate others.

## Top 5 weaknesses

### 1. The mobile hero buries the proof (hierarchy, P1)

**Evidence:**
- At 390px the orange hero is **1364px tall**, which is 1.6 screens.
- The WPH11 board, the one element that shows the product, starts at **y≈759**, and only its header shows above the 844px fold.
- Above the board, the following are stacked:
  - a nav that wraps to two rows and takes about 120px
  - a 3-line H1 at 46px
  - a 4-line subtext
  - **two full-width 56px pill buttons**
  - the audience chip
  - **three tilted sticker pills** at y 625–739
- On desktop, the three 124px sticker discs at 1440 form a third focal cluster. They compete with the CTAs and the board, and the lower-left of the hero is a dead orange patch.

**Fix direction:**
- On small screens, make the board the second thing a visitor sees, directly after the H1 and subtext and before the stickers.
- Collapse the stats into one inline row, or move them into the board or the closing band.
- Demote "Browse the syllabus" to a text link on mobile.
- Aim for the board's top edge to sit at about 600px or less at 390px.
- On desktop, merge the stickers into the board composition (for example, as tabs or badges stuck to its edge) so the hero has two masses, copy and board, instead of three.

### 2. The middle of the page goes flat and template-like (mood / spacing, P1)

**Evidence:**
- After the hero, no section shows the product again. The middle is a mint "How it works" band followed by a cream bento.
- **How it works** is **653px tall** at 1440 for three 2-line sentences.
  - The steps descend in a diagonal staircase (h3 y 1257 → 1313 → 1369).
  - They are joined by dotted connectors that link three numbered badges and carry no content.
- **Features** is **1215px** on desktop and **1731px** on mobile, where it is a single column of six equal tiles.
- The detector confirms this. The URL scan returned **icon-tile-stack ×6**: the same 52px white icon tile sits above the h3 in every feature tile (`page.tsx` around lines 206–211).
- Peak-end: the peak is the hero and the end is the closing band. The roughly 1900px between them carries the visitor's attention on decoration alone.

**Fix direction:**
- Carry the board's grammar down the page so each section shows a fragment of the real product instead of an icon square:
  - **Pick your units**: unit chips such as WPH11 and WCH11, with an exam-session date.
  - **Practise by topic**: a question card with a mark-scheme tick.
  - **Fix what's weak**: a mastery bar moving from WEAK to DEVELOPING.
- Drop the generic icon tiles, or keep at most one.
- Cut the How section to about 420–480px, and on mobile give the features a two-column or horizontally scrolling arrangement instead of a 1731px stack.

### 3. The colours have no system, and the mastery colours are reused as decoration (colour, P2)

**Evidence:**
- About nine fully saturated hues appear at equal weight: tangerine, mint, cream, sun, lagoon, gum, grape, lime and plum.
- The board defines a meaning for three of them: **lagoon = strong, sun = developing, gum = weak**.
- The rest of the page then reuses those same three colours with no meaning:
  - step badges are sun, gum and lagoon
  - the stickers are sun, lagoon and white
  - Physics is lagoon and Chemistry is sun
  - **Further Mathematics is gum, which reads as "weak"**
- The bento adds grape, lime-pale and gum-pale tints.
- Nothing tells the eye which colour matters, so the energy reads as confetti rather than as a game with rules.

**Fix direction:**
- Reserve lagoon, sun and gum for mastery states everywhere.
- Give subjects their own fixed identity colours that never collide with mastery: grape, tangerine-deep, lime, sky, and plum on cream.
- Use those identity colours consistently: on the subject card, in the board's unit chip, and so on.
- Limit each section to one saturated field plus ink, so that saturation is a reward rather than wallpaper.

### 4. The type scale has gaps and the middle tiers are timid (typography, P2)

**Evidence:**
- Baloo 2 at 800 is spectacular at the extremes: the H1 at 96px/0.95 and the closing headline at 84px.
- Below that the scale collapses:
  - the H2s are 60px
  - then every h3 is **24.8–25.6px**, except one bento lead title at **38.4px**
  - "Topic-level practice" gets that 38.4px even though it is no more important than "Mastery you can see"
- Body copy is 17px everywhere, and the step bodies are a quiet `#5a3f6e` on mint.
- Sticker labels are 13.6px/700, squeezed into 124px discs, where "specification topics" wraps.
- The detector flagged **straggler ×2**: one-word last lines, "behind." and "point.", in the tile bodies.
- The features H2 wraps to **3 lines in a 582px column** with about 760px of empty space beside it.

**Fix direction:**
- Define a deliberate 4-tier display scale (hero, section, card, label) and give the card tier real chunk, about 30–34px, so the playful voice carries below the hero.
- Make the board numbers (86%, 38%) and the subject names the loud elements.
- Set `text-wrap: balance` on headings and `text-wrap: pretty` on body text.
- Let the features H2 run 2 lines wide, or pair it with content.
- Set sticker or stat labels at 15px or larger.

### 5. Motion and decoration add noise, and the play is in the wrong place (mood, P2)

**Evidence:**
- The "next up" row **bobs and its play button pulses forever** (`bob` and `pulse`, 2.8s, infinite). This sits on a page whose product principle is "calm under exam pressure".
- The play is mostly ornamental:
  - the large cropped circles: top-right of the hero, and a grape circle in the closing band cut by the footer rule
  - rotated stickers
  - an arbitrary **32px vertical stagger on the even subject cards** (Chemistry and Mathematics sit lower), which reads as a bug rather than as play
- The game feel (progress, levelling, reward) shows only once, in the board.
- Duolingo and Brilliant get their energy from progress feedback, not from blobs.

**Fix direction:**
- Make motion reward-shaped and finite. The bars fill once, the weak row lifts once, and the next-up button gives a single pulse when it scrolls into view.
- Replace the decorative circles with product-born shapes, such as progress rings or chunky level badges.
- Remove the subject-card stagger. If the cards need variety, encode real data, such as a mini topic-count bar per subject.

## What already works and must be kept

- **The hero mastery board is the core of the page.** Keep:
  - WPH11 with real topic codes and the exam countdown
  - the chunky bars that fill on load
  - **the weak row (1.5, 38%) lifted out as a white row with the gum arrow**
  - the "Next up: density, upthrust and viscosity. 10 questions." strip
- **The type pairing.** Keep Baloo 2 at 800 for display, with tight tracking and line-height around 0.95, plus Figtree for body. It is chunky and friendly without being childish, and is exactly the brief.
- **The drenched tangerine hero with plum ink.** Plum on tangerine is about 6.8:1. It is warm, bright and confident, and it is not Duolingo green.
- **The closing band.** Keep the plum field, the 84px "Your next exam is closer than it looks.", the lime check points and the sun pill CTA. It is the most decisive colour moment and it pays off the countdown.
- **The pill button system.** Keep the 56px pills, the plum primary and the 3px-ring ghost, with lift and tilt on hover and a press-down.
- **The accessibility baseline must survive any redesign:**
  - AA contrast throughout
  - 3px focus rings that switch plum or sun by ground
  - skip link
  - all targets at least 44px
  - correct H1→H2→H3 order
  - full reduced-motion off-switch
  - no overflow from 390 to 1440

## Audit results

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 4 | No contrast failures at 1440 or 390 (all text ≥4.5:1, or ≥3:1 when large). Visible focus on every stop. Reduced motion takes `getAnimations()` from 6 to 0. Landmarks, heading order and skip link are all correct. |
| Performance | 3 | LCP is the H1 at 240ms desktop and 204ms mobile (dev server). CLS is 0. Fonts are 4 files, about 106KB. JS size is a dev bundle and is not meaningful. Infinite animations are cheap (transform only) but always running. |
| Theming | 3 | Tokens live on `.page`. The logo SVG hard-codes three hex fills (`page.tsx` Logo). The page is light-only by brief and has no dark variant; that is acceptable for the lab and must be decided before production. |
| Responsive | 3 | No horizontal overflow and every target is at least 44px. The structural problems are the 1364px mobile hero and the 1731px single-column features section (see weaknesses 1 and 2). |
| Implementation integrity | 2 | Detector URL scan found 9 issues: **icon-tile-stack ×6 (warning)**, **straggler ×2 (advisory)** and **bounce-easing ×1 (advisory, `--ease-spring` at `page.module.css:25`)**. The bounce easing is deliberate and limited to hover and press. The static file scan was clean, so the issues only appear in rendered output. |
| **Total** | **15/20** | **Good** |

The findings by severity:

- **P0 / P1:** none in the technical audit. The P1s above are design issues.
- **P2:**
  - icon-tile-stack ×6
  - the mobile hero length
  - the features stack length on mobile
- **P3:**
  - stragglers ×2
  - the bounce-easing advisory (accepted)
  - logo hex fills
  - the footer has no links, so check whether it should
  - perpetual bob and pulse (P3 for a11y because it is covered by reduced motion; P2 for mood)
