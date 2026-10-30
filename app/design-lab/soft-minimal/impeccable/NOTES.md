# Soft Minimal · Impeccable — working notes

Development-only. Not imported by the page.

## Shape brief (/impeccable shape)

No user was available; the lab brief and the shared PRODUCT.md stand in as the confirmed interview answers.
Assumptions are marked (A).

1. **Job and audience.** IAL students (16–19, Maldives) landing on the homepage, often on a phone in the evening,
   deciding whether this is worth signing up for. Mode: **Persuade**.
2. **Outcome and proof.** Primary action: "Start practising free" (sign-up). Proof is the product mechanism itself:
   the WPH11 unit with four topic mastery scores, the weakest flagged as next up. Real numbers only (175 / 114 / Free).
3. **Selected direction.** Brief-pinned: Soft Minimal (Muji / Japanese stationery calm, warm greys, one soft accent).
   Pinned direction beats the roll, so no concept-seed round (A); also keeps `.impeccable/` out of the shared repo root.
   Thesis: the homepage is a **product label** — the way a Muji item states what it is in a few quiet, exact lines.
   The mastery example is the label's specification panel.
4. **Scope.** Static single route, all copy from `design-lab/content.ts` verbatim. Anti-goals: notebook/paper/ruled
   lines, handwriting, cream + serif display, terracotta accent, icon-card feature grids, hero-metric stat blocks,
   eyebrow kickers.
5. **States.** Static; links have hover + focus-visible. Mastery bars draw once on load (skipped under reduced motion).
6. **Layout.** Hero: headline large at left, subtext + CTAs at right baseline; the WPH11 label spans below as a
   horizontal specification strip (four topic columns on desktop, rows on phone). Stats as one quiet spec line.
   How it works / features as spec-sheet definition rows on hairlines; subjects as a large-type index; quiet close.
7. **Constraints.** 390–1440+, no overflow, AA contrast, focus rings themed, reduced motion, fonts via next/font.

## Direction contract

THESIS: The page is a product label, not a pitch. Refuses the split hero with a floating dashboard card and the
icon-card grid; information is set the way stationery labels set specifications — few lines, exact, generous air.

OWN-WORLD: Warm grey ground (#ECEAE6), lighter unbleached label panel (#F6F5F2), graphite ink (#2A2825), warm grey
secondary (#625D56), hairlines (#D3CEC6). One soft accent: ai-iro indigo (#3D5677) with a pale wash (#DFE4EA), used only
for "what to revise next". Zen Kaku Gothic New throughout: light 300 for display, 400/500 for text. Square-ish corners
(2px), no shadows beyond one soft lift on the label.

STORY: Visitor reads "Know exactly what to revise next.", sees a real unit label whose weakest topic is already chosen
for them, trusts the calm specificity, presses "Start practising free".

FIRST VIEWPORT: Slim nav. Headline at ~5.5rem light weight spanning left 7/12; subtext, CTAs and audience line in the
right 4/12 aligned to the headline's last line. Below, full-width WPH11 label strip with four topic columns, the 1.5
column washed indigo; the stats spec line under it.

FORM: Product label / specification sheet (brief-pinned). seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and
every shipping raster carrying its provenance
