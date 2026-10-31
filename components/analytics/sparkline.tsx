import type { WeekAccuracy } from "@/lib/analytics";
import { pct, shortDay } from "./format";

const W = 132;
const H = 40;
const PAD = 5;

/**
 * Weekly accuracy as a small line (0–100%). Weeks without attempts are gaps, not zeros. Each point has a native
 * tooltip; the parent renders the values as text for screen readers.
 */
export function Sparkline({ weeks, label }: { weeks: WeekAccuracy[]; label: string }) {
    const step = (W - PAD * 2) / Math.max(1, weeks.length - 1);
    const pts = weeks.map((w, i) => ({
        x: PAD + i * step,
        y: w.accuracy === null ? null : PAD + (1 - w.accuracy) * (H - PAD * 2),
        w,
    }));
    // Break the path at gaps.
    let d = "";
    let pen = false;
    for (const p of pts) {
        if (p.y === null) {
            pen = false;
            continue;
        }
        d += `${pen ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
        pen = true;
    }
    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            role="img"
            aria-label={label}
            className="shrink-0 overflow-visible"
        >
            <line
                x1={PAD}
                x2={W - PAD}
                y1={H / 2}
                y2={H / 2}
                className="stroke-border"
                strokeWidth={1}
                strokeDasharray="2 3"
            />
            {d && (
                <path
                    d={d}
                    fill="none"
                    className="stroke-progress"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
            {pts.map((p) =>
                p.y === null ? null : (
                    <circle key={p.w.end} cx={p.x} cy={p.y} r={4} className="fill-progress stroke-card" strokeWidth={2}>
                        <title>{`Week to ${shortDay(p.w.end)}: ${pct(p.w.accuracy!)} (${p.w.marks}/${p.w.max} marks)`}</title>
                    </circle>
                ),
            )}
        </svg>
    );
}
