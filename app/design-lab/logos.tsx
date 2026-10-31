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

/** Bar stairs: the bars pushed together into a staircase on the orange tile, with the cream dot on top. */
export function BarStairsMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-tangerine" />
            <path d={stepBar(8, 24, 7.5, 32)} className="fill-mastery-weak" />
            <path d={stepBar(16.25, 18.5, 7.5, 32)} className="fill-mastery-developing" />
            <path d={stepBar(24.5, 13, 7.5, 32)} className="fill-mastery-strong" />
            <rect x="7" y="31" width="26" height="2.5" rx="1.25" className="fill-ink" />
            <circle cx="28.25" cy="7.5" r="3.5" className="fill-cream" />
        </svg>
    );
}

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
