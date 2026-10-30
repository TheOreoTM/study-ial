// Flat drawings made from one shape: the pill of a mastery bar. Server-rendered SVG, no state.

const INK = "#17202E";
const WHITE = "#FFFFFF";

type Pill = { x: number; y: number; w: number; h: number; fill: string; o?: number; r?: number };

function Pills({ items }: { items: Pill[] }) {
    return (
        <>
            {items.map((p, i) => (
                <rect
                    key={i}
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    rx={Math.min(p.w, p.h) / 2}
                    fill={p.fill}
                    opacity={p.o ?? 1}
                    transform={p.r ? `rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})` : undefined}
                />
            ))}
        </>
    );
}

// Deterministic pseudo-random so server output is stable.
function rand(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

const LEVEL = ["#FF6A4D", "#FFC93C", "#2EC27E", "#58A6FF", "#FF8AC4"];

/** How it works: loose questions, squeezed through one topic, settled into ordered mastery rows. */
export function ManyIntoOne({ vertical = false }: { vertical?: boolean }) {
    const r = rand(42);
    const pills: Pill[] = [];
    const W = 1200;
    const H = 270;
    // scatter
    for (let i = 0; i < 46; i++) {
        pills.push({
            x: 10 + r() * 330,
            y: 10 + r() * (H - 40),
            w: 26 + r() * 30,
            h: 14,
            fill: i % 2 ? "#F3D9A4" : "#BFD8F2",
            r: (r() - 0.5) * 120,
        });
    }
    // ribbon (three high)
    for (let row = 0; row < 3; row++) {
        for (let i = 0; i < 9; i++) {
            pills.push({ x: 430 + i * 38, y: H / 2 - 30 + row * 20, w: 32, h: 14, fill: INK });
        }
    }
    // ordered rows: four mastery bars of growing length
    const lens = [0.86, 0.71, 0.38, 0.64];
    lens.forEach((l, row) => {
        const y = 40 + row * 52;
        pills.push({ x: 820, y, w: 360, h: 30, fill: "#F1EDE4" });
        pills.push({ x: 820, y, w: 360 * l, h: 30, fill: l < 0.5 ? LEVEL[0] : l < 0.7 ? LEVEL[1] : LEVEL[2] });
    });

    if (vertical) {
        return (
            <svg viewBox={`0 0 ${H} ${W}`} role="img" aria-label="Loose questions gathered into one topic, then sorted into mastery bars">
                <g transform={`translate(${H} 0) rotate(90)`}>
                    <Pills items={pills} />
                </g>
            </svg>
        );
    }
    return (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Loose questions gathered into one topic, then sorted into mastery bars">
            <Pills items={pills} />
        </svg>
    );
}

export function TopicStack() {
    const lens = [220, 170, 250, 140, 200, 120];
    return (
        <svg viewBox="0 0 320 400" aria-hidden="true">
            <Pills
                items={lens.map((w, i) => ({
                    x: 40,
                    y: 50 + i * 52,
                    w: i === 2 ? 250 : w,
                    h: 36,
                    fill: i === 2 ? INK : WHITE,
                }))}
            />
        </svg>
    );
}

export function MasteryBars() {
    const rows = [
        [0.86, LEVEL[2]],
        [0.71, LEVEL[2]],
        [0.38, LEVEL[0]],
        [0.64, LEVEL[1]],
    ] as const;
    return (
        <svg viewBox="0 0 640 400" aria-hidden="true">
            <Pills
                items={rows.flatMap(([l, c], i) => [
                    { x: 50, y: 60 + i * 76, w: 540, h: 46, fill: WHITE },
                    { x: 50, y: 60 + i * 76, w: 540 * l, h: 46, fill: c },
                ])}
            />
        </svg>
    );
}

export function PlanWeek() {
    const items: Pill[] = [];
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 4; col++) {
            const filled = row * 4 + col < 9;
            items.push({ x: 36 + col * 66, y: 50 + row * 62, w: 54, h: 40, fill: filled ? INK : WHITE });
        }
    }
    items.push({ x: 36 + 66, y: 50 + 2 * 62, w: 120, h: 40, fill: "#FF6A4D" });
    return (
        <svg viewBox="0 0 320 400" aria-hidden="true">
            <Pills items={items} />
        </svg>
    );
}

export function Marking() {
    return (
        <svg viewBox="0 0 320 400" aria-hidden="true">
            <Pills
                items={[
                    { x: 40, y: 80, w: 240, h: 240, fill: WHITE },
                    { x: 92, y: 210, w: 90, h: 34, fill: INK, r: 45 },
                    { x: 128, y: 178, w: 150, h: 34, fill: INK, r: -50 },
                ]}
            />
        </svg>
    );
}

export function FocusTimer() {
    return (
        <svg viewBox="0 0 320 400" aria-hidden="true">
            <circle cx="160" cy="200" r="118" fill={WHITE} />
            <circle
                cx="160"
                cy="200"
                r="88"
                fill="none"
                stroke={INK}
                strokeWidth="40"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88 * 0.62} 999`}
                transform="rotate(-90 160 200)"
            />
            <rect x="140" y="40" width="40" height="40" rx="20" fill={INK} />
        </svg>
    );
}

export function Atoll() {
    const r = rand(7);
    const items: Pill[] = [];
    for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const rx = 110;
        const ry = 140;
        const w = 30 + r() * 34;
        items.push({
            x: 160 + Math.cos(a) * rx - w / 2,
            y: 200 + Math.sin(a) * ry - 9,
            w,
            h: 18,
            fill: i % 5 === 0 ? INK : WHITE,
            r: (a * 180) / Math.PI + 90,
        });
    }
    return (
        <svg viewBox="0 0 320 400" aria-hidden="true">
            <Pills items={items} />
        </svg>
    );
}
