import { cn } from "@/lib/utils";

/*
 * Logo directions for Study-IAL, all drawn from the Playful Pop palette: ink, tangerine, cream and the three mastery
 * colours (bubblegum = weak, sun = developing, teal = strong). Each mark is a 40×40 SVG so it can become the favicon
 * and app icon as-is. The combinations mix the three favourites from the first round: rising bars, climb and ring.
 */

type MarkProps = { className?: string };

const markBase = "size-10 shrink-0";

const masteryStroke = ["stroke-mastery-weak", "stroke-mastery-developing", "stroke-mastery-strong"] as const;

/** Arcs of a ring, as percentages of the circumference starting from 12 o'clock. */
function RingArcs({
    r,
    width,
    arcs,
}: {
    r: number;
    width: number | readonly number[];
    arcs: readonly (readonly [start: number, length: number])[];
}) {
    return arcs.map(([start, length], i) => (
        <circle
            key={start}
            cx="20"
            cy="20"
            r={r}
            fill="none"
            strokeWidth={typeof width === "number" ? width : width[i]}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${length} ${100 - length}`}
            strokeDashoffset={-start}
            transform="rotate(-90 20 20)"
            className={masteryStroke[i]}
        />
    ));
}

/** A bar with rounded top corners and a square foot, so bars can stand side by side as steps. */
function stepBar(x: number, top: number, width: number, bottom: number, r = 2.5) {
    return `M${x} ${bottom}V${top + r}Q${x} ${top} ${x + r} ${top}H${x + width - r}Q${x + width} ${top} ${x + width} ${top + r}V${bottom}Z`;
}

/* ---------- Round 1 favourites ---------- */

/** Rising bars: three bars climb weak → developing → strong on a plum tile. */
export function RisingBarsMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <rect x="9" y="22" width="6" height="9" rx="3" className="fill-mastery-weak" />
            <rect x="17" y="16" width="6" height="15" rx="3" className="fill-mastery-developing" />
            <rect x="25" y="9" width="6" height="22" rx="3" className="fill-mastery-strong" />
        </svg>
    );
}

/** Climb: a staircase of topics with you (the cream dot) standing on the top step. */
export function ClimbMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-tangerine" />
            <path d="M8 32V26H16V20H24V14H32V32Z" strokeWidth="3" strokeLinejoin="round" className="fill-ink stroke-ink" />
            <circle cx="28" cy="8.5" r="3.5" className="fill-cream" />
        </svg>
    );
}

/** Mastery ring: a progress ring in the three mastery colours, still filling, around an orange "next" dot. */
export function RingMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <circle cx="20" cy="20" r="11" fill="none" strokeWidth="5" className="stroke-ink-soft" />
            <RingArcs r={11} width={5} arcs={[[0, 18], [28, 18], [56, 24]]} />
            <circle cx="20" cy="20" r="4" className="fill-tangerine" />
        </svg>
    );
}

/* ---------- Combinations ---------- */

/** Bars + climb: the rising bars with the orange "you" dot hopping onto the tallest one. */
export function BarsDotMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <rect x="9" y="24" width="6" height="8" rx="3" className="fill-mastery-weak" />
            <rect x="17" y="19" width="6" height="13" rx="3" className="fill-mastery-developing" />
            <rect x="25" y="14.5" width="6" height="17.5" rx="3" className="fill-mastery-strong" />
            <circle cx="28" cy="8.5" r="3.5" className="fill-tangerine" />
        </svg>
    );
}

/** Bar stairs: the bars pushed together into a staircase, standing on a baseline, with the "you" dot on top. */
const stairTones = {
    tangerine: { tile: "fill-tangerine", base: "fill-ink", dot: "fill-cream" },
    plum: { tile: "fill-ink", base: "fill-lilac", dot: "fill-tangerine" },
    grape: { tile: "fill-grape", base: "fill-ink", dot: "fill-tangerine" },
    cream: { tile: "fill-white", base: "fill-ink", dot: "fill-tangerine" },
} as const;

const stairBases = {
    lilac: "fill-lilac",
    tangerine: "fill-tangerine",
    cream: "fill-cream",
    soft: "fill-ink-soft",
} as const;

function BarStairs({
    className,
    tone,
    base,
}: MarkProps & { tone: keyof typeof stairTones; base?: keyof typeof stairBases | "none" }) {
    const t = stairTones[tone];
    const baseFill = base === undefined ? t.base : base === "none" ? null : stairBases[base];
    // With no baseline the steps get rounded feet too, so they don't end in a hard edge.
    const bar = (x: number, top: number) =>
        baseFill ? (
            <path d={stepBar(x, top, 7.5, 32)} />
        ) : (
            <rect x={x} y={top} width="7.5" height={32 - top} rx="2.5" />
        );
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            {tone === "cream" ? (
                <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="12.25" strokeWidth="1.5" className="fill-white stroke-border" />
            ) : (
                <rect width="40" height="40" rx="13" className={t.tile} />
            )}
            <g className="fill-mastery-weak">{bar(8, 24)}</g>
            <g className="fill-mastery-developing">{bar(16.25, 18.5)}</g>
            <g className="fill-mastery-strong">{bar(24.5, 13)}</g>
            {baseFill ? <rect x="7" y="31" width="26" height="2.5" rx="1.25" className={baseFill} /> : null}
            <circle cx="28.25" cy="7.5" r="3.5" className={t.dot} />
        </svg>
    );
}

export const BarStairsMark = (p: MarkProps) => <BarStairs {...p} tone="tangerine" />;
export const BarStairsPlumMark = (p: MarkProps) => <BarStairs {...p} tone="plum" />;
export const BarStairsGrapeMark = (p: MarkProps) => <BarStairs {...p} tone="grape" />;
export const BarStairsCreamMark = (p: MarkProps) => <BarStairs {...p} tone="cream" />;
export const PlumNoBaseMark = (p: MarkProps) => <BarStairs {...p} tone="plum" base="none" />;
export const PlumTangerineBaseMark = (p: MarkProps) => <BarStairs {...p} tone="plum" base="tangerine" />;
export const PlumCreamBaseMark = (p: MarkProps) => <BarStairs {...p} tone="plum" base="cream" />;
export const PlumSoftBaseMark = (p: MarkProps) => <BarStairs {...p} tone="plum" base="soft" />;

/** Ring + bars: a thin mastery ring around the rising bars, like a gauge you are filling. */
export function RingBarsMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <circle cx="20" cy="20" r="13" fill="none" strokeWidth="3.5" className="stroke-ink-soft" />
            <RingArcs r={13} width={3.5} arcs={[[0, 16], [23, 18], [48, 27]]} />
            <rect x="13.7" y="21.5" width="3.6" height="5" rx="1.8" className="fill-mastery-weak" />
            <rect x="18.2" y="18.5" width="3.6" height="8" rx="1.8" className="fill-mastery-developing" />
            <rect x="22.7" y="15" width="3.6" height="11.5" rx="1.8" className="fill-mastery-strong" />
        </svg>
    );
}

/** Ring + climb: the mastery ring with a tangerine staircase inside and the cream dot on the top step. */
export function RingClimbMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <circle cx="20" cy="20" r="13" fill="none" strokeWidth="3.5" className="stroke-ink-soft" />
            <RingArcs r={13} width={3.5} arcs={[[0, 16], [23, 18], [48, 27]]} />
            <path
                d="M13.5 26.5V23H17.5V19.5H21.5V16H26.5V26.5Z"
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="fill-tangerine stroke-tangerine"
            />
            <circle cx="24" cy="12.2" r="2.2" className="fill-cream" />
        </svg>
    );
}

/** Rising ring: the ring's three arcs thicken as the level rises, so the ring itself climbs. */
export function RisingRingMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <RingArcs r={11.5} width={[2.5, 4.5, 6.5]} arcs={[[3, 20], [32, 22], [63, 27]]} />
            <circle cx="20" cy="20" r="3.8" className="fill-tangerine" />
        </svg>
    );
}

/** Orange ring: the climb's orange tile carrying the mastery ring on a plum disc. */
export function OrangeRingMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-tangerine" />
            <circle cx="20" cy="20" r="15" className="fill-ink" />
            <RingArcs r={10} width={4.5} arcs={[[0, 18], [28, 18], [56, 24]]} />
            <circle cx="20" cy="20" r="3.5" className="fill-cream" />
        </svg>
    );
}

export type LogoOption = {
    id: string;
    name: string;
    Mark: (props: MarkProps) => React.JSX.Element;
    note: string;
    /** The mark sits on a plum tile, so it needs an outline on plum backgrounds. */
    tileOnDark: boolean;
};

export const combinations: LogoOption[] = [
    {
        id: "bars-dot",
        name: "Bars and dot",
        Mark: BarsDotMark,
        note: "Rising bars + climb. The orange dot is you, about to land on the strong bar. Still crisp at 16px.",
        tileOnDark: true,
    },
    {
        id: "bar-stairs",
        name: "Bar stairs",
        Mark: BarStairsMark,
        note: "Rising bars + climb. The bars close up into steps on the orange tile, with the cream dot on top.",
        tileOnDark: false,
    },
    {
        id: "ring-bars",
        name: "Ring and bars",
        Mark: RingBarsMark,
        note: "Ring + rising bars. A gauge you are filling, with the chart inside. Busiest at small sizes.",
        tileOnDark: true,
    },
    {
        id: "ring-climb",
        name: "Ring and climb",
        Mark: RingClimbMark,
        note: "Ring + climb. An orange staircase inside the mastery ring, cream dot on the top step.",
        tileOnDark: true,
    },
    {
        id: "rising-ring",
        name: "Rising ring",
        Mark: RisingRingMark,
        note: "Ring + rising bars. The arcs thicken weak → strong, so the ring itself climbs. Calmest of the set.",
        tileOnDark: true,
    },
    {
        id: "orange-ring",
        name: "Orange ring",
        Mark: OrangeRingMark,
        note: "Ring + climb's orange tile. The loudest app icon here; the plum disc keeps the mastery colours bright.",
        tileOnDark: false,
    },
];

export const plumBases: LogoOption[] = [
    {
        id: "base-none",
        name: "No baseline",
        Mark: PlumNoBaseMark,
        note: "The bars stand on their own with rounded feet. Simplest, and the cleanest at 16px.",
        tileOnDark: true,
    },
    {
        id: "base-tangerine",
        name: "Orange baseline",
        Mark: PlumTangerineBaseMark,
        note: "The floor matches the orange dot, so the two orange marks frame the climb.",
        tileOnDark: true,
    },
    {
        id: "base-cream",
        name: "Cream baseline",
        Mark: PlumCreamBaseMark,
        note: "A bright cream floor. The strongest line, like the axis of a chart.",
        tileOnDark: true,
    },
    {
        id: "base-soft",
        name: "Quiet baseline",
        Mark: PlumSoftBaseMark,
        note: "A muted plum floor that's there when you look for it and invisible at favicon sizes.",
        tileOnDark: true,
    },
    {
        id: "base-lilac",
        name: "Lilac baseline (current)",
        Mark: BarStairsPlumMark,
        note: "Option 1 as you picked it, for comparison.",
        tileOnDark: true,
    },
];

export const stairBackgrounds: LogoOption[] = [
    {
        id: "stairs-plum",
        name: "Plum",
        Mark: BarStairsPlumMark,
        note: "The app's ink as the tile. All three mastery colours stay bright; orange dot, lilac baseline.",
        tileOnDark: true,
    },
    {
        id: "stairs-grape",
        name: "Grape",
        Mark: BarStairsGrapeMark,
        note: "The progress purple. Stands out on cream and on tangerine; the plum baseline grounds the steps.",
        tileOnDark: false,
    },
    {
        id: "stairs-cream",
        name: "White",
        Mark: BarStairsCreamMark,
        note: "A white tile with a hairline, like the app's cards. Lightest feel, but the pink and yellow steps are paler.",
        tileOnDark: false,
    },
    {
        id: "stairs-tangerine",
        name: "Tangerine (round 2)",
        Mark: BarStairsMark,
        note: "The version you picked, for comparison.",
        tileOnDark: false,
    },
];

export const originals: LogoOption[] = [
    {
        id: "rising-bars",
        name: "Rising bars",
        Mark: RisingBarsMark,
        note: "Round 1, option 1. The current mark.",
        tileOnDark: true,
    },
    { id: "climb", name: "Climb", Mark: ClimbMark, note: "Round 1, option 2.", tileOnDark: false },
    { id: "ring", name: "Mastery ring", Mark: RingMark, note: "Round 1, option 3.", tileOnDark: true },
];
