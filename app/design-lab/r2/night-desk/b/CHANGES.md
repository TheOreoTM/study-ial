# Night Desk · R2 B (Pushed)

B starts from the baseline (`app/design-lab/night-desk/impeccable/`) with all five critique fixes. Those fixes are the
same as A's (see `../a/CHANGES.md`); B was built from A's fixed files.

On top of that, B amplifies the world the page already owns: a desk at night under one lamp. It uses the same fonts and
the same amber, and the copy is unchanged. The headline's last word is wrapped in a span for colour only.

Issue numbers refer to `design-lab/round-2/night-desk-critique.md`.

## Fixes carried from A

- **#1 Hierarchy**
    - The beam gets brighter as it falls, so row 1.5 is the brightest thing on the desk. A dark chip sits behind "weak".
    - Unlit rows are dimmed.
    - On mobile the lit row lands in the first screen at y 697–765 of 844.
- **#2 Colour**
    - Amber is used only on the CTAs, the lit row with its Next-up line, step 3, the brand mark and the closing light.
    - Stats and step numbers are cream or muted.
    - "Developing" is a dimmer ochre, `#c0915a`.
- **#3 Typography**
    - Young Serif no longer sets the stats or step numbers.
    - The two h3 styles are unified (Hanken 600).
    - Subject names are about 26px.
    - Labels are at least 0.875rem.
- **#4 Spacing**
    - The hero is centre-aligned with the lamp overhanging, so the top of the hero is no longer empty.
    - Stats read as one line.
    - Section rhythm comes from tokens.
    - Features and Subjects share a split layout.
    - The unit count sits right after the subject name.
- **#5 Mood**
    - Coloured glows were replaced by dark contact shadows.
    - The floating closing haze is gone.
    - The ground is deeper and a vignette was added.

## What B pushes (bolder + colorize)

- **A real desk.**
    - A full-bleed walnut desk top runs across the room under the hero. The WPH11 panel sits on it, and the lamp's light
      spills onto the wood.
    - The wood grain is SVG `feTurbulence` stretched along x. It is not repeating stripes; the detector flagged those as
      slop and they were removed.
    - The desk has a lit top edge, a dark front lip and a cast shadow.
- **A mug of tea.**
    - It is an authored SVG (`Mug`): a walnut-brown mug with tea, a lamp-side highlight and two faint steam wisps.
    - On desktop it sits in front of the panel's corner; in one column it sits on the desk beside the audience line.
    - It is decorative and `aria-hidden`.
- **The lamp lights the headline's last word.** "next." is set in `--amber-hi`, which ties the headline to the lit
  row. The display size went up to `clamp(2.75rem, 5.3vw, 4.875rem)`, and the hero copy column is wider
  (`1.1fr / 1fr`) so the headline holds three lines.
- **A pendant over the close.**
    - An authored SVG pendant lamp (`Pendant`) hangs on a cord at the top of the closing section.
    - A clipped, blurred cone falls from its mouth through the headline, and a light pool lands under the CTA.
    - The closing headline is up to 4.5rem.
- **Texture and colour.**
    - A fine warm grain (SVG noise at about 7% alpha) covers the page, the desk and the features wall.
    - Colour owns two regions:
        - the walnut desk ramp (`--walnut #3a2416` → `--walnut-mid #2b1a10` → `--walnut-dark #1c100a`);
        - the lamplit closing region.
    - The features band is a warmer study wall (`#24160e` → `#1c120b`) with the lamp's spill at its top-left.
- **Type size.** The h2s are up to 3.375rem, and the lamp is 230px on desktop (it was 200px).

## Fonts and colours

- Fonts are unchanged: Young Serif and Hanken Grotesk.
- New colour tokens: `--walnut`, `--walnut-mid`, `--walnut-dark`, `--wood`, `--grain`.
- Mastery and ink tokens are the same as A's. The chip behind the lit "weak" is solid `#1a110b`.

## Audit status

- Impeccable detector URL scans at 1440×900, 820×1180, 390×844 and 375×812 found **0 findings**. Along the way they
  fixed a 4.4:1 contrast reading on the lit "weak" label, a straggler on the audience line at 375px, and the
  repeating-stripes finding.
- `scrollWidth` equals the viewport at 375, 390, 820 and 1440.

## Left as is

- The mug overlaps about 20px of the panel's bottom-left padding on desktop. This is intended: it is in front of the
  panel on the desk.
- The desk strip's top is placed relative to the panel's bottom (`100% - 3rem`). At unusual widths, between about 961
  and 1100px, the audience line may sit close to the desk edge.
- The desktop nav "Get started" is 40px tall, which is above WCAG 2.5.8's 24px minimum.
