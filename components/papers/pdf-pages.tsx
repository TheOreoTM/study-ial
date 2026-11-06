"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type PdfJs = typeof import("pdfjs-dist");
type Doc = Awaited<ReturnType<PdfJs["getDocument"]>["promise"]>;

let pdfjsPromise: Promise<PdfJs> | null = null;
function loadPdfJs() {
    pdfjsPromise ??= import("pdfjs-dist").then((mod) => {
        mod.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        return mod;
    });
    return pdfjsPromise;
}

/** Renders a page when it scrolls near the viewport, at the container's width and the screen's pixel density. */
function Page({ doc, number, width, label }: { doc: Doc; number: number; width: number; label: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(number <= 2);
    const [ratio, setRatio] = useState(1.414);

    useEffect(() => {
        const el = boxRef.current;
        if (!el || visible) return;
        const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setVisible(true), {
            rootMargin: "600px 0px",
        });
        io.observe(el);
        return () => io.disconnect();
    }, [visible]);

    useEffect(() => {
        if (!visible || width <= 0) return;
        let cancelled = false;
        let task: { cancel: () => void } | null = null;
        (async () => {
            const page = await doc.getPage(number);
            if (cancelled) return;
            const base = page.getViewport({ scale: 1 });
            setRatio(base.height / base.width);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const vp = page.getViewport({ scale: (width / base.width) * dpr });
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = Math.floor(vp.width);
            canvas.height = Math.floor(vp.height);
            const render = page.render({ canvas, viewport: vp });
            task = render;
            await render.promise.catch(() => {});
        })();
        return () => {
            cancelled = true;
            task?.cancel();
        };
    }, [doc, number, visible, width]);

    return (
        <div ref={boxRef} className="relative w-full overflow-hidden rounded-md bg-white shadow-card" style={{ aspectRatio: `1 / ${ratio}` }}>
            <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label={`${label}, page ${number}`} />
        </div>
    );
}

/**
 * Scrollable stack of PDF pages drawn with pdf.js, so it works on phones whose browsers can't embed PDFs.
 * Give it a `key` per document: a new url should remount it rather than reuse the old state.
 */
export function PdfPages({ url, label }: { url: string; label: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [doc, setDoc] = useState<Doc | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        let cancelled = false;
        let loaded: Doc | null = null;
        loadPdfJs()
            .then((pdfjs) => pdfjs.getDocument({ url, withCredentials: true }).promise)
            .then((d) => {
                loaded = d;
                if (!cancelled) setDoc(d);
            })
            .catch(() => !cancelled && setError("This document couldn't be loaded. Try opening it in a new tab."));
        return () => {
            cancelled = true;
            void loaded?.loadingTask.destroy();
        };
    }, [url]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div className="h-full overflow-y-auto overscroll-contain rounded-lg bg-muted p-2 sm:p-3">
            <div ref={containerRef} className="space-y-3">
                {error ? (
                    <p className="p-6 text-center text-muted-foreground">{error}</p>
                ) : !doc ? (
                    <p className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" aria-hidden /> Loading {label.toLowerCase()}…
                    </p>
                ) : (
                    Array.from({ length: doc.numPages }, (_, i) => (
                        <Page key={i} doc={doc} number={i + 1} width={width} label={label} />
                    ))
                )}
            </div>
        </div>
    );
}
