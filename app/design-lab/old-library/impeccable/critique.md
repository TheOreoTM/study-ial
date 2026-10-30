# Critique snapshot — Old Library · Impeccable

Method: dual-agent (A: design review sub-agent · B: detector + Playwright sub-agent). Kept in this folder instead of
`.impeccable/critique/` because the repo is shared by several agents. Questions skipped: no user available in this run;
all P1–P3 findings were taken as in scope.

## Score

Nielsen 25/32 (7 and 10 n/a for a landing page): Good band (78%).
Status 3 · Real world 4 · Control 3 · Consistency 3 · Error prevention 3 · Recognition 3 · Aesthetic 3 · Recovery 3.

## Specificity

Authored, not interchangeable: the weakest topic is a pulled-out oxblood book with a ribbon falling to the next-up label.
Pulled back toward template by the gilt-italic last word of the headline (the detector also flagged
`italic-serif-display`) and by the gilt tool glyph repeated about 12 times.

## Detector (B)

- Source scan: clean.
- URL scan: `italic-serif-display` on the h1 (it is really only the italic span "next."); `straggler` on chapter III's body
  and on the "Built for IAL" body; `repeating-stripes-gradient` (the intentional bookcloth weave).
- Browser: no overflow at 390/768/1024/1440/1920. Focus ring visible on all 12 stops. Heading order sane. Contrast passes
  (the plate failures are false positives from gradient backgrounds). Touch targets under 44px at 390: brand, nav links,
  nav plate. The ribbon tip overlaps the next-up holder's border by 3px at 390.

## Priority issues

1. [P1] Oxblood has two meanings: next-up topic in the hero, Chemistry on the shelf. Reserve it for next-up.
2. [P1] Mastery level isn't encoded: arbitrary cloth colours, and the "developing" gauge is the same gilt at 0.72 opacity.
   The level word is tiny italic.
3. [P2] Subjects at 1440: the heading is bottom-aligned, with an empty field above it. Spines have no resting affordance
   that says they are links.
4. [P2] The roman numerals sit above the chapter titles like a kicker. Hang them in a margin instead.
5. [P3] Ornament fatigue (tool glyph on every feature) and the italic-accent headline.
6. [P3] Mobile: two-row masthead, small nav tap targets, stack below the fold, ribbon touching the holder.

Minor: oldstyle numerals make codes such as "WPH11" and "10 questions" uneven. The 820 layout stretches the books. The
gauge stops short of the raised band. Zero-blur 0 3px 0 shadows are used for the double fillets.
