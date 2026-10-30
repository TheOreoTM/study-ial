"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Pick = { key: string; style: string; version: string; src: string; note: string };
type Device = "desktop" | "mobile";

const WIDTH: Record<Device, number> = { desktop: 1440, mobile: 390 };

// Neutral, unopinionated chrome so the viewer doesn't bias the comparison.
const ui = {
    font: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    bg: "#f4f4f4",
    panel: "#ffffff",
    line: "#dcdcdc",
    text: "#1a1a1a",
    muted: "#666666",
};

export function FinalViewer({ picks }: { picks: Pick[] }) {
    const [device, setDevice] = useState<Device>("desktop");
    const [sync, setSync] = useState(true);
    const [focus, setFocus] = useState<number | null>(null);
    const frames = useRef<(HTMLIFrameElement | null)[]>([]);
    const syncing = useRef(false);

    // Scroll the other frames to the same relative position as the one being scrolled.
    const onFrameScroll = useCallback(
        (from: number) => {
            if (!sync || syncing.current) return;
            const src = frames.current[from]?.contentWindow;
            if (!src) return;
            const doc = src.document.documentElement;
            const max = doc.scrollHeight - src.innerHeight;
            const ratio = max > 0 ? src.scrollY / max : 0;
            syncing.current = true;
            frames.current.forEach((f, i) => {
                const w = f?.contentWindow;
                if (i === from || !w) return;
                const d = w.document.documentElement;
                w.scrollTo(0, ratio * (d.scrollHeight - w.innerHeight));
            });
            requestAnimationFrame(() => (syncing.current = false));
        },
        [sync],
    );

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === "Escape") setFocus(null);
            const n = Number.parseInt(e.key, 10);
            if (n >= 1 && n <= picks.length) setFocus((f) => (f === n - 1 ? null : n - 1));
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [picks.length]);

    const visible = focus === null ? picks.map((_, i) => i) : [focus];

    return (
        <div style={{ fontFamily: ui.font, background: ui.bg, color: ui.text }} className="flex h-dvh flex-col overflow-hidden text-[13px]">
            <header style={{ background: ui.panel, borderColor: ui.line }} className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3">
                <h1 className="text-[13px] font-semibold">Design lab · Final</h1>
                <span style={{ color: ui.muted }}>
                    Your three picks · keys 1–3 focus one, Esc shows all
                </span>
                <div className="ml-auto flex items-center gap-2">
                    <label style={{ borderColor: ui.line }} className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5">
                        <input type="checkbox" checked={sync} onChange={(e) => setSync(e.target.checked)} />
                        Sync scroll
                    </label>
                    <div role="radiogroup" aria-label="Preview width" style={{ borderColor: ui.line }} className="flex overflow-hidden rounded-md border">
                        {(["desktop", "mobile"] as const).map((d) => (
                            <button
                                key={d}
                                role="radio"
                                aria-checked={device === d}
                                onClick={() => setDevice(d)}
                                style={{ background: device === d ? ui.text : ui.panel, color: device === d ? ui.panel : ui.text }}
                                className="px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                            >
                                {d === "desktop" ? "Desktop 1440" : "Mobile 390"}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main
                className="grid min-h-0 flex-1 gap-3 p-3"
                style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}
            >
                {picks.map((p, i) => (
                    <Column
                        key={p.key}
                        pick={p}
                        index={i}
                        hidden={!visible.includes(i)}
                        width={WIDTH[device]}
                        focused={focus === i}
                        onToggleFocus={() => setFocus(focus === i ? null : i)}
                        frameRef={(el) => (frames.current[i] = el)}
                        onScroll={() => onFrameScroll(i)}
                    />
                ))}
            </main>
        </div>
    );
}

function Column({
    pick,
    index,
    hidden,
    width,
    focused,
    onToggleFocus,
    frameRef,
    onScroll,
}: {
    pick: Pick;
    index: number;
    hidden: boolean;
    width: number;
    focused: boolean;
    onToggleFocus: () => void;
    frameRef: (el: HTMLIFrameElement | null) => void;
    onScroll: () => void;
}) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState({ w: 0, h: 0 });
    const onScrollRef = useRef(onScroll);
    useEffect(() => {
        onScrollRef.current = onScroll;
    }, [onScroll]);

    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        // Ignore the 0×0 reading while hidden so the iframe stays mounted.
        const ro = new ResizeObserver(([entry]) => {
            const { width: w, height: h } = entry.contentRect;
            if (w > 0 && h > 0) setBox({ w, h });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const scale = box.w ? Math.min(1, box.w / width) : 0;

    return (
        // Hidden columns stay mounted so their scroll position and loaded state survive focus mode.
        <section
            style={{ background: ui.panel, borderColor: ui.line, display: hidden ? "none" : undefined }}
            className="flex min-h-0 min-w-0 flex-col rounded-md border"
        >
            <div style={{ borderColor: ui.line }} className="shrink-0 border-b px-3 py-2">
                <div className="flex items-center gap-2">
                    <kbd style={{ borderColor: ui.line, color: ui.muted }} className="rounded border px-1 font-mono text-[10px]">
                        {index + 1}
                    </kbd>
                    <h2 className="truncate text-[13px] font-semibold">
                        {pick.style} <span style={{ color: ui.muted }} className="font-normal">· {pick.version}</span>
                    </h2>
                    <span className="ml-auto flex shrink-0 gap-1.5">
                        <button
                            onClick={onToggleFocus}
                            aria-pressed={focused}
                            style={{ borderColor: ui.line }}
                            className="rounded-md border px-2.5 py-1 hover:bg-black/5 focus-visible:outline-2"
                        >
                            {focused ? "Show all" : "Focus"}
                        </button>
                        <a
                            href={pick.src}
                            target="_blank"
                            rel="noopener"
                            style={{ borderColor: ui.line }}
                            className="rounded-md border px-2.5 py-1 hover:bg-black/5 focus-visible:outline-2"
                        >
                            Open ↗
                        </a>
                    </span>
                </div>
                <p style={{ color: ui.muted }} className="mt-1 line-clamp-2">
                    {pick.note}
                </p>
            </div>
            <div ref={boxRef} style={{ background: "#e9e9e9" }} className="relative min-h-0 flex-1 overflow-hidden">
                {scale > 0 && (
                    <iframe
                        ref={frameRef}
                        src={pick.src}
                        title={`${pick.style}, ${pick.version}`}
                        onLoad={(e) => {
                            const w = e.currentTarget.contentWindow;
                            w?.addEventListener("scroll", () => onScrollRef.current(), { passive: true });
                        }}
                        style={{
                            width,
                            height: box.h / scale,
                            transform: `scale(${scale})`,
                            transformOrigin: "top left",
                            left: Math.max(0, (box.w - width * scale) / 2),
                        }}
                        className="absolute top-0 border-0 bg-white"
                    />
                )}
            </div>
        </section>
    );
}
