"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Style = { slug: string; name: string; description: string };
type Device = "desktop" | "mobile";

const SKILLS = [
    { key: "impeccable", label: "Impeccable" },
    { key: "taste", label: "Taste" },
] as const;

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

export function DesignLabViewer({ styles, initialIndex }: { styles: Style[]; initialIndex: number }) {
    const [index, setIndex] = useState(initialIndex);
    const [device, setDevice] = useState<Device>("desktop");
    const active = styles[index];

    const select = useCallback(
        (i: number) => {
            setIndex(i);
            const url = new URL(window.location.href);
            url.searchParams.set("style", styles[i].slug);
            window.history.replaceState(null, "", url);
        },
        [styles],
    );

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const t = e.target as HTMLElement | null;
            if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
            const n = Number.parseInt(e.key, 10);
            if (n >= 1 && n <= styles.length) select(n - 1);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [select, styles.length]);

    return (
        <div
            style={{ fontFamily: ui.font, background: ui.bg, color: ui.text }}
            className="flex h-dvh flex-col overflow-hidden text-[13px]"
        >
            <header style={{ background: ui.panel, borderColor: ui.line }} className="shrink-0 border-b">
                <div className="flex items-center gap-4 px-4 pt-3">
                    <h1 className="text-[13px] font-semibold">Design lab</h1>
                    <span style={{ color: ui.muted }}>Homepage directions · same copy, two skills</span>
                    <div
                        role="radiogroup"
                        aria-label="Preview width"
                        style={{ borderColor: ui.line }}
                        className="ml-auto flex overflow-hidden rounded-md border"
                    >
                        {(["desktop", "mobile"] as const).map((d) => (
                            <button
                                key={d}
                                role="radio"
                                aria-checked={device === d}
                                onClick={() => setDevice(d)}
                                style={{
                                    background: device === d ? ui.text : ui.panel,
                                    color: device === d ? ui.panel : ui.text,
                                }}
                                className="px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                            >
                                {d === "desktop" ? "Desktop 1440" : "Mobile 390"}
                            </button>
                        ))}
                    </div>
                </div>
                <nav role="tablist" aria-label="Styles" className="flex gap-1 overflow-x-auto px-2 pt-2">
                    {styles.map((s, i) => {
                        const selected = i === index;
                        return (
                            <button
                                key={s.slug}
                                role="tab"
                                aria-selected={selected}
                                aria-controls="design-lab-panel"
                                onClick={() => select(i)}
                                style={{
                                    borderColor: selected ? ui.text : "transparent",
                                    color: selected ? ui.text : ui.muted,
                                }}
                                className="min-w-[11rem] flex-1 border-b-2 px-3 pt-1.5 pb-2 text-left focus-visible:outline-2"
                            >
                                <span className="flex items-baseline gap-2">
                                    <kbd
                                        style={{ borderColor: ui.line, color: ui.muted }}
                                        className="rounded border px-1 font-mono text-[10px]"
                                    >
                                        {i + 1}
                                    </kbd>
                                    <span className="font-semibold">{s.name}</span>
                                </span>
                                <span className="mt-0.5 line-clamp-2 block" style={{ color: ui.muted }}>
                                    {s.description}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </header>

            <main id="design-lab-panel" role="tabpanel" aria-label={active.name} className="grid min-h-0 flex-1 grid-cols-2 gap-3 p-3">
                {SKILLS.map((skill) => (
                    <Preview
                        key={`${active.slug}-${skill.key}`}
                        label={skill.label}
                        src={`/design-lab/${active.slug}/${skill.key}`}
                        width={WIDTH[device]}
                        title={`${active.name}, ${skill.label} version`}
                    />
                ))}
            </main>
        </div>
    );
}

/** An iframe rendered at a fixed virtual width and scaled down to fit its column. */
function Preview({ label, src, width, title }: { label: string; src: string; width: number; title: string }) {
    const frameRef = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = frameRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const scale = box.w ? Math.min(1, box.w / width) : 0;

    return (
        <section style={{ background: ui.panel, borderColor: ui.line }} className="flex min-h-0 min-w-0 flex-col rounded-md border">
            <div style={{ borderColor: ui.line }} className="flex shrink-0 items-center gap-2 border-b px-3 py-2">
                <h2 className="text-[13px] font-semibold">{label}</h2>
                <span style={{ color: ui.muted }} className="truncate font-mono text-[11px]">
                    {src}
                </span>
                <a
                    href={src}
                    target="_blank"
                    rel="noopener"
                    style={{ borderColor: ui.line }}
                    className="ml-auto shrink-0 rounded-md border px-2.5 py-1 hover:bg-black/5 focus-visible:outline-2"
                >
                    Open full screen ↗
                </a>
            </div>
            <div ref={frameRef} style={{ background: "#e9e9e9" }} className="relative min-h-0 flex-1 overflow-hidden">
                {scale > 0 && (
                    <iframe
                        src={src}
                        title={title}
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
