import { cn } from "@/lib/utils";

/*
 * Five logo directions for Study-IAL, all drawn from the Playful Pop palette: ink, tangerine, grape, cream and the
 * three mastery colours (bubblegum = weak, sun = developing, teal = strong). Each mark is a 40×40 SVG so it can
 * become the favicon and app icon as-is.
 */

type MarkProps = { className?: string };

const markBase = "size-10 shrink-0";

/** 1. Rising bars: the current mark. Three bars climb weak → developing → strong on a plum tile. */
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

/** 2. Climb: a staircase of topics with you (the cream dot) standing on the top step. */
export function ClimbMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-tangerine" />
            <path
                d="M8 32V26H16V20H24V14H32V32Z"
                strokeWidth="3"
                strokeLinejoin="round"
                className="fill-ink stroke-ink"
            />
            <circle cx="28" cy="8.5" r="3.5" className="fill-cream" />
        </svg>
    );
}

/** 3. Mastery ring: a progress ring in the three mastery colours, still filling, around an orange "next" dot. */
export function RingMark({ className }: MarkProps) {
    const segments = [
        { start: 0, length: 18, tone: "stroke-mastery-weak" },
        { start: 28, length: 18, tone: "stroke-mastery-developing" },
        { start: 56, length: 24, tone: "stroke-mastery-strong" },
    ];
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-ink" />
            <circle cx="20" cy="20" r="11" fill="none" strokeWidth="5" className="stroke-ink-soft" />
            {segments.map((s) => (
                <circle
                    key={s.start}
                    cx="20"
                    cy="20"
                    r="11"
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray={`${s.length} ${100 - s.length}`}
                    strokeDashoffset={-s.start}
                    transform="rotate(-90 20 20)"
                    className={s.tone}
                />
            ))}
            <circle cx="20" cy="20" r="4" className="fill-tangerine" />
        </svg>
    );
}

/** 4. Open book: notes on the left page, a rising mastery chart on the right. Revision that shows its working. */
export function BookMark({ className }: MarkProps) {
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <rect width="40" height="40" rx="13" className="fill-grape" />
            <path
                d="M7 12.5Q13.5 10.5 20 13.5Q26.5 10.5 33 12.5V29.5Q26.5 27.5 20 30.5Q13.5 27.5 7 29.5Z"
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="fill-cream stroke-cream"
            />
            <path d="M20 14V29.5" strokeWidth="1.5" strokeLinecap="round" className="stroke-grape-deep" />
            <path
                d="M10.5 17.5H16.5M10.5 21H16.5M10.5 24.5H14.5"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="stroke-ink"
            />
            <rect x="22.5" y="21.5" width="2.6" height="4.5" rx="1.3" className="fill-mastery-weak" />
            <rect x="26" y="18.5" width="2.6" height="7.5" rx="1.3" className="fill-mastery-developing" />
            <rect x="29.5" y="15.5" width="2.6" height="10.5" rx="1.3" className="fill-mastery-strong" />
        </svg>
    );
}

/** 5. A* sticker: the top IAL grade as a tilted tangerine sticker with a cream die-cut edge, the reward every topic is pointing at. */
export function StarStickerMark({ className }: MarkProps) {
    const points = Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const radius = i % 2 === 0 ? 16.5 : 14.3;
        return `${(20 + radius * Math.cos(angle)).toFixed(2)},${(20 + radius * Math.sin(angle)).toFixed(2)}`;
    }).join(" ");
    return (
        <svg viewBox="0 0 40 40" aria-hidden="true" className={cn(markBase, className)}>
            <g transform="rotate(-8 20 20)">
                <polygon points={points} strokeWidth="5" strokeLinejoin="round" className="fill-cream stroke-cream" />
                <polygon points={points} strokeWidth="2" strokeLinejoin="round" className="fill-tangerine stroke-tangerine" />
                <path
                    d="M12.5 27.5L18 12.5L23.5 27.5M14.4 22.5H21.6"
                    fill="none"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-ink"
                />
                <path
                    d="M28 11.5V18.5M25 13.25L31 16.75M25 16.75L31 13.25"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="stroke-ink"
                />
            </g>
        </svg>
    );
}

export const logoOptions = [
    {
        id: "rising-bars",
        name: "Rising bars",
        Mark: RisingBarsMark,
        note: "Today's mark, with the bars in level order: bubblegum, sun, teal. Reads as a chart at any size.",
        tileOnDark: true,
    },
    {
        id: "climb",
        name: "Climb",
        Mark: ClimbMark,
        note: "Topic by topic, step by step. The loudest of the five; the orange tile is unmistakable in a tab bar.",
        tileOnDark: false,
    },
    {
        id: "ring",
        name: "Mastery ring",
        Mark: RingMark,
        note: "A ring still filling up, with the orange dot as the next thing to practise. Most app-icon-like.",
        tileOnDark: true,
    },
    {
        id: "book",
        name: "Open book",
        Mark: BookMark,
        note: "Notes on one page, a mastery chart on the other. The most literal; detail drops out below 32px.",
        tileOnDark: false,
    },
    {
        id: "a-star",
        name: "A* sticker",
        Mark: StarStickerMark,
        note: "The grade everyone wants, as a sticker slapped on the page. Most playful, least about mastery.",
        tileOnDark: false,
    },
] as const;
