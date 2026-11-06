"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfPages } from "@/components/papers/pdf-pages";

export type ViewerDoc = { id: string; type: "QP" | "MS" | "ER"; label: string; pageCount: number; images: boolean };

const fileUrl = (d: ViewerDoc) => `/api/papers/files/${d.id}`;

function Frame({ doc }: { doc: ViewerDoc }) {
    if (doc.images) {
        return (
            <div className="h-full space-y-3 overflow-y-auto rounded-lg bg-muted p-3">
                {Array.from({ length: doc.pageCount }, (_, i) => (
                    // eslint-disable-next-line @next/next/no-img-element -- private, auth-gated images
                    <img
                        key={i}
                        src={`${fileUrl(doc)}?page=${i + 1}`}
                        alt={`${doc.label}, page ${i + 1}`}
                        className="w-full rounded-md bg-card shadow-card"
                        loading={i < 2 ? "eager" : "lazy"}
                    />
                ))}
            </div>
        );
    }
    return <PdfPages url={fileUrl(doc)} label={doc.label} />;
}

/**
 * Question paper beside the mark scheme (or examiner report) from 1024px; one document at a time with a switcher
 * below that. PDFs are drawn with pdf.js from the authenticated file route (phone browsers can't embed PDFs).
 */
export function PaperViewer({ docs }: { docs: ViewerDoc[] }) {
    const qp = docs.find((d) => d.type === "QP") ?? docs[0];
    const others = docs.filter((d) => d !== qp);
    const [side, setSide] = useState(others[0]?.id ?? null);
    const [mobile, setMobile] = useState(qp?.id ?? null);
    const sideDoc = others.find((d) => d.id === side) ?? null;
    if (!qp) return null;

    const tabs = (list: ViewerDoc[], active: string | null, set: (id: string) => void, label: string) => (
        <div role="tablist" aria-label={label} className="flex flex-wrap gap-1.5">
            {list.map((d) => (
                <button
                    key={d.id}
                    role="tab"
                    type="button"
                    aria-selected={active === d.id}
                    onClick={() => set(d.id)}
                    className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-4 font-display font-bold transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        active === d.id ? "bg-selected text-selected-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                >
                    {d.label}
                </button>
            ))}
        </div>
    );

    const openLink = (d: ViewerDoc) => (
        <a
            href={d.images ? `${fileUrl(d)}?page=1` : fileUrl(d)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-selected-foreground underline decoration-2 underline-offset-4"
        >
            Open in new tab <ExternalLink className="size-3.5" aria-hidden />
        </a>
    );

    const mobileDoc = docs.find((d) => d.id === mobile) ?? qp;
    return (
        <>
            {/* Phones and tablets: one document at a time */}
            <div className="lg:hidden">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    {tabs(docs, mobileDoc.id, setMobile, "Document")}
                    {openLink(mobileDoc)}
                </div>
                <div className="h-[75dvh]">
                    <Frame key={mobileDoc.id} doc={mobileDoc} />
                </div>
            </div>
            {/* Desktop: side by side */}
            <div className={cn("hidden gap-4 lg:grid", sideDoc ? "lg:grid-cols-2" : "lg:grid-cols-1")}>
                <section aria-label={qp.label} className="min-w-0">
                    <div className="mb-3 flex min-h-11 items-center justify-between gap-2">
                        <h2 className="text-lg">{qp.label}</h2>
                        {openLink(qp)}
                    </div>
                    <div className="h-[calc(100dvh-14rem)] min-h-[560px]">
                        <Frame doc={qp} />
                    </div>
                </section>
                {sideDoc && (
                    <section aria-label={sideDoc.label} className="min-w-0">
                        <div className="mb-3 flex min-h-11 items-center justify-between gap-2">
                            {others.length > 1 ? tabs(others, sideDoc.id, setSide, "Side document") : <h2 className="text-lg">{sideDoc.label}</h2>}
                            {openLink(sideDoc)}
                        </div>
                        <div className="h-[calc(100dvh-14rem)] min-h-[560px]">
                            <Frame key={sideDoc.id} doc={sideDoc} />
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
