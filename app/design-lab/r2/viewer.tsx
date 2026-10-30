"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Style = { slug: string; name: string; description: string };
type Device = "desktop" | "mobile";
type VersionKey = "baseline" | "a" | "b" | "c";

const VERSIONS: { key: VersionKey; label: string }[] = [
    { key: "baseline", label: "Baseline (round 1)" },
    { key: "a", label: "A — Refined" },
    { key: "b", label: "B — Pushed" },
    { key: "c", label: "C — Alive" },
];

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

function srcFor(style: string, v: VersionKey) {
    return v === "baseline" ? `/design-lab/${style}/impeccable` : `/design-lab/r2/${style}/${v}`;
}

function labelFor(v: VersionKey) {
    return VERSIONS.find((x) => x.key === v)!.label;
}

export function R2Viewer({ styles, initialIndex }: { styles: Style[]; initialIndex: number }) {
    const [index, setIndex] = useState(initialIndex);
    const [device, setDevice] = useState<Device>("desktop");
    const [focus, setFocus] = useState<[VersionKey, VersionKey] | null>(null);
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
            if (e.key === "Escape") setFocus(null);
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-3">
                    <h1 className="text-[13px] font-semibold">Design lab · Round 2</h1>
                    <span style={{ color: ui.muted }}>Baseline vs three iterations · keys 1–3 switch styles · Esc leaves focus</span>
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => setFocus(focus ? null : ["baseline", "a"])}
                            aria-pressed={focus !== null}
                            style={{
                                borderColor: ui.line,
                                background: focus ? ui.text : ui.panel,
                                color: focus ? ui.panel : ui.text,
                            }}
                            className="rounded-md border px-3 py-1.5 focus-visible:outline-2"
                        >
                            Focus: compare two
                        </button>
                        <Segmented
                            label="Preview width"
                            value={device}
                            onChange={setDevice}
                            options={[
                                { value: "desktop", label: "Desktop 1440" },
                                { value: "mobile", label: "Mobile 390" },
                            ]}
                        />
                    </div>
                </div>
                <nav role="tablist" aria-label="Styles" className="flex gap-1 px-2 pt-2">
                    {styles.map((s, i) => {
                        const selected = i === index;
                        return (
                            <button
                                key={s.slug}
                                role="tab"
                                aria-selected={selected}
                                aria-controls="r2-panel"
                                onClick={() => select(i)}
                                style={{ borderColor: selected ? ui.text : "transparent", color: selected ? ui.text : ui.muted }}
                                className="min-w-0 flex-1 border-b-2 px-3 pt-1.5 pb-2 text-left focus-visible:outline-2"
                            >
                                <span className="flex items-baseline gap-2">
                                    <kbd style={{ borderColor: ui.line, color: ui.muted }} className="rounded border px-1 font-mono text-[10px]">
                                        {i + 1}
                                    </kbd>
                                    <span className="font-semibold">{s.name}</span>
                                </span>
                                <span className="mt-0.5 block truncate" style={{ color: ui.muted }}>
                                    {s.description}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </header>

            {focus ? (
                <main id="r2-panel" role="tabpanel" aria-label={`${active.name}, focus`} className="flex min-h-0 flex-1 flex-col p-3">
                    <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
                        {focus.map((v, side) => (
                            <Preview
                                key={`${active.slug}-${side}-${v}`}
                                label={labelFor(v)}
                                src={srcFor(active.slug, v)}
                                width={WIDTH[device]}
                                title={`${active.name}, ${labelFor(v)}`}
                                picker={
                                    <select
                                        aria-label={side === 0 ? "Left version" : "Right version"}
                                        value={v}
                                        onChange={(e) => {
                                            const next = [...focus] as [VersionKey, VersionKey];
                                            next[side] = e.target.value as VersionKey;
                                            setFocus(next);
                                        }}
                                        style={{ borderColor: ui.line, background: ui.panel }}
                                        className="rounded-md border px-2 py-1"
                                    >
                                        {VERSIONS.map((o) => (
                                            <option key={o.key} value={o.key}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                }
                            />
                        ))}
                    </div>
                </main>
            ) : (
                <main
                    id="r2-panel"
                    role="tabpanel"
                    aria-label={active.name}
                    className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 p-3"
                >
                    {VERSIONS.map((v) => (
                        <Preview
                            key={`${active.slug}-${v.key}`}
                            label={v.label}
                            src={srcFor(active.slug, v.key)}
                            width={WIDTH[device]}
                            title={`${active.name}, ${v.label}`}
                            onFocus={() => setFocus([v.key, v.key === "baseline" ? "a" : "baseline"])}
                        />
                    ))}
                </main>
            )}
        </div>
    );
}

function Segmented<T extends string>({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: string }[];
}) {
    return (
        <div role="radiogroup" aria-label={label} style={{ borderColor: ui.line }} className="flex overflow-hidden rounded-md border">
            {options.map((o) => (
                <button
                    key={o.value}
                    role="radio"
                    aria-checked={value === o.value}
                    onClick={() => onChange(o.value)}
                    style={{ background: value === o.value ? ui.text : ui.panel, color: value === o.value ? ui.panel : ui.text }}
                    className="px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

/** An iframe rendered at a fixed virtual width and scaled down to fit its cell. */
function Preview({
    label,
    src,
    width,
    title,
    onFocus,
    picker,
}: {
    label: string;
    src: string;
    width: number;
    title: string;
    onFocus?: () => void;
    picker?: React.ReactNode;
}) {
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
            <div style={{ borderColor: ui.line }} className="flex shrink-0 items-center gap-2 border-b px-3 py-1.5">
                {picker ?? <h2 className="text-[13px] font-semibold">{label}</h2>}
                <span style={{ color: ui.muted }} className="hidden truncate font-mono text-[11px] xl:inline">
                    {src}
                </span>
                <span className="ml-auto flex shrink-0 gap-1.5">
                    {onFocus && (
                        <button
                            onClick={onFocus}
                            style={{ borderColor: ui.line }}
                            className="rounded-md border px-2.5 py-1 hover:bg-black/5 focus-visible:outline-2"
                        >
                            Focus
                        </button>
                    )}
                    <a
                        href={src}
                        target="_blank"
                        rel="noopener"
                        style={{ borderColor: ui.line }}
                        className="rounded-md border px-2.5 py-1 hover:bg-black/5 focus-visible:outline-2"
                    >
                        Open full screen ↗
                    </a>
                </span>
            </div>
            <div ref={frameRef} style={{ background: "#e9e9e9" }} className="relative min-h-0 flex-1 overflow-hidden">
                {scale > 0 && (
                    <iframe
                        src={src}
                        title={title}
                        loading="lazy"
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
