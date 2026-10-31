"use client";

import { useEffect, useRef, useState } from "react";
import type { PlanPace } from "@/lib/analytics";
import { shortDay } from "./format";

const H = 220;
const M = { top: 24, right: 12, bottom: 28, left: 32 };

/**
 * Cumulative tasks scheduled (dashed reference line) and done (solid progress line) from the plan's start to its
 * exam day. Hovering or focusing the chart shows a crosshair with that day's numbers.
 */
export function PlanPaceChart({ pace, today }: { pace: PlanPace; today: string }) {
    const [hover, setHover] = useState<number | null>(null);
    // Draw at the real pixel width so text and strokes stay their true size on phones.
    const box = useRef<HTMLDivElement>(null);
    const [W, setW] = useState<number | null>(null);
    useEffect(() => {
        const el = box.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    const s = pace.series;
    if (W === null) {
        // Measure first, so the chart never flashes at the wrong size.
        return <div ref={box} style={{ height: H + 30 }} aria-hidden />;
    }
    const n = s.length;
    const yMax = Math.max(1, pace.total);
    const x = (i: number) => M.left + (n === 1 ? 0 : (i / (n - 1)) * (W - M.left - M.right));
    const y = (v: number) => M.top + (1 - v / yMax) * (H - M.top - M.bottom);
    const line = (vals: (number | null)[]) =>
        vals
            .map((v, i) =>
                v === null
                    ? null
                    : `${i === 0 || vals[i - 1] === null ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`,
            )
            .filter(Boolean)
            .join(" ");
    const todayIdx = s.findIndex((p) => p.day === today);
    const lastDone = [...s].reverse().find((p) => p.done !== null);
    const lastDoneIdx = lastDone ? s.indexOf(lastDone) : -1;
    const ticks = [0, Math.round(yMax / 2), yMax].filter((v, i, a) => a.indexOf(v) === i);
    const active = hover !== null ? s[hover] : null;

    const width = W;
    function pick(clientX: number, rect: DOMRect) {
        const px = ((clientX - rect.left) / rect.width) * width;
        const i = Math.round(((px - M.left) / (width - M.left - M.right)) * (n - 1));
        setHover(Math.min(n - 1, Math.max(0, i)));
    }

    // Weekly rows for the screen-reader table: every 7th day plus the last.
    const tableRows = s.filter((_, i) => i % 7 === 0 || i === n - 1);

    return (
        <div ref={box}>
            <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8125rem] font-semibold text-muted-foreground">
                <span className="flex items-center gap-2">
                    <svg width="22" height="8" aria-hidden>
                        <line
                            x1="1"
                            x2="21"
                            y1="4"
                            y2="4"
                            className="stroke-muted-foreground dark:stroke-foreground"
                            strokeWidth={2}
                            strokeDasharray="4 3"
                        />
                    </svg>
                    Scheduled
                </span>
                <span className="flex items-center gap-2">
                    <svg width="22" height="8" aria-hidden>
                        <line x1="1" x2="21" y1="4" y2="4" className="stroke-progress" strokeWidth={2} />
                    </svg>
                    Done
                </span>
            </div>
            <div className="relative">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    width={W}
                    height={H}
                    className="block max-w-full touch-pan-y outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    role="img"
                    aria-label={`Tasks scheduled and done from ${shortDay(s[0].day)} to ${shortDay(s[n - 1].day)}`}
                    tabIndex={0}
                    onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover((h) => h ?? (todayIdx >= 0 ? todayIdx : n - 1))}
                    onBlur={() => setHover(null)}
                    aria-describedby="pace-chart-hint"
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight") setHover((h) => Math.min(n - 1, (h ?? todayIdx) + 1));
                        else if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? todayIdx) - 1));
                        else return;
                        e.preventDefault();
                    }}
                >
                    {ticks.map((t) => (
                        <g key={t}>
                            <line
                                x1={M.left}
                                x2={W - M.right}
                                y1={y(t)}
                                y2={y(t)}
                                className="stroke-border"
                                strokeWidth={1}
                            />
                            <text
                                x={M.left - 8}
                                y={y(t)}
                                dy="0.32em"
                                textAnchor="end"
                                className="fill-muted-foreground text-[11px] tabular-nums"
                            >
                                {t}
                            </text>
                        </g>
                    ))}
                    <text x={M.left} y={H - 6} className="fill-muted-foreground text-[11px]">
                        {shortDay(s[0].day)}
                    </text>
                    <text x={W - M.right} y={H - 6} textAnchor="end" className="fill-muted-foreground text-[11px]">
                        Exam {shortDay(s[n - 1].day)}
                    </text>
                    {todayIdx >= 0 && (
                        <g>
                            <line
                                x1={x(todayIdx)}
                                x2={x(todayIdx)}
                                y1={M.top - 18}
                                y2={H - M.bottom}
                                className="stroke-border-strong"
                                strokeWidth={1}
                                strokeDasharray="2 3"
                            />
                            <text
                                x={x(todayIdx) + (x(todayIdx) > W - 60 ? -4 : 4)}
                                y={M.top - 8}
                                textAnchor={x(todayIdx) > W - 60 ? "end" : "start"}
                                className="fill-foreground text-[11px] font-bold"
                            >
                                Today
                            </text>
                        </g>
                    )}
                    <path
                        d={line(s.map((p) => p.scheduled))}
                        fill="none"
                        className="stroke-muted-foreground dark:stroke-foreground"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        strokeLinejoin="round"
                    />
                    <path
                        d={line(s.map((p) => p.done))}
                        fill="none"
                        className="stroke-progress"
                        strokeWidth={2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    {lastDone && (
                        <circle
                            cx={x(lastDoneIdx)}
                            cy={y(lastDone.done!)}
                            r={4.5}
                            className="fill-progress stroke-card"
                            strokeWidth={2}
                        />
                    )}
                    {hover !== null && active && (
                        <g aria-hidden>
                            <line
                                x1={x(hover)}
                                x2={x(hover)}
                                y1={M.top}
                                y2={H - M.bottom}
                                className="stroke-foreground"
                                strokeWidth={1}
                            />
                            <circle
                                cx={x(hover)}
                                cy={y(active.scheduled)}
                                r={4}
                                className="fill-card stroke-muted-foreground dark:stroke-foreground"
                                strokeWidth={2}
                            />
                            {active.done !== null && (
                                <circle
                                    cx={x(hover)}
                                    cy={y(active.done)}
                                    r={4}
                                    className="fill-progress stroke-card"
                                    strokeWidth={2}
                                />
                            )}
                        </g>
                    )}
                </svg>
                {hover !== null && active && (
                    <div
                        className="pointer-events-none absolute top-0 z-10 w-max -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-[0.8125rem] shadow-raised"
                        style={{ left: `${Math.min(85, Math.max(15, (x(hover) / W) * 100))}%` }}
                        aria-hidden
                    >
                        <p className="font-bold">{shortDay(active.day)}</p>
                        <p className="tabular-nums">Scheduled: {active.scheduled}</p>
                        <p className="tabular-nums">Done: {active.done ?? "–"}</p>
                    </div>
                )}
            </div>
            <p id="pace-chart-hint" className="sr-only">
                Use the left and right arrow keys to move through the days.
            </p>
            <p className="sr-only" aria-live="polite">
                {active ? `${shortDay(active.day)}: ${active.scheduled} scheduled, ${active.done ?? "no"} done.` : ""}
            </p>
            <table className="sr-only">
                <caption>Tasks scheduled and done by date</caption>
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Scheduled</th>
                        <th scope="col">Done</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows.map((p) => (
                        <tr key={p.day}>
                            <th scope="row">{shortDay(p.day)}</th>
                            <td>{p.scheduled}</td>
                            <td>{p.done ?? "–"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
