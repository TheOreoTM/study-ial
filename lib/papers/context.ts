// Everything attempt mode, marking and explanations need about one question part: its ancestors (context), matched
// mark-scheme entries, guidance, examiner comments, and image crops of the real pages.
import "server-only";
import { db } from "@/lib/db";
import { getPageImage, loadPaperPdf } from "@/lib/papers/pages";
import { cropImage, type BBox } from "@/lib/papers/pdf";
import type { MarkSchemeEntry } from "@/lib/papers/parse/schema";
import { canViewSittingContent, type Viewer } from "@/lib/papers/permissions";
import { ancestors, leafMarks, leaves } from "@/lib/papers/tree";
import type { MarkContext } from "@/lib/papers/mark";
import { storage } from "@/lib/storage";

export type Figure = { page: number; bbox: number[]; key: string };

type Row = Awaited<ReturnType<typeof loadRows>>[number];

function loadRows(paperId: string) {
    return db.paperQuestion.findMany({
        where: { paperId },
        orderBy: { order: "asc" },
        select: {
            id: true,
            parentId: true,
            number: true,
            order: true,
            marks: true,
            stem: true,
            page: true,
            bbox: true,
            figures: true,
            markPoints: true,
            markNotes: true,
            examinerNotes: true,
            topicId: true,
        },
    });
}

export type MarkPointsJson = { paperId: string; how: string; entries: MarkSchemeEntry[] } | null;

/** Loads a question paper's parts for a viewer, or null if they can't see it. */
export async function loadPaperParts(sittingId: string, viewer: Viewer) {
    const sitting = await db.paperSitting.findUnique({
        where: { id: sittingId },
        select: {
            id: true,
            ownerId: true,
            title: true,
            unitCode: true,
            paperCode: true,
            year: true,
            series: true,
            unit: { select: { name: true } },
            papers: { select: { id: true, type: true, pageCount: true, parseStatus: true } },
        },
    });
    if (!sitting || !canViewSittingContent(viewer, sitting)) return null;
    const qp = sitting.papers.find((p) => p.type === "QP");
    if (!qp) return null;
    const rows = await loadRows(qp.id);
    return { sitting, qp, rows, parts: leaves(rows) };
}

/** Builds the marking context for one leaf part. */
export function markContextFor(rows: Row[], leaf: Row): MarkContext & { entries: MarkSchemeEntry[]; msPaperId: string | null; examinerNotes: string | null } {
    const chain = ancestors(rows, leaf.id);
    // The part's own scheme entry, or its parent's when the scheme only splits at a higher level
    const own = (leaf.markPoints as MarkPointsJson) ?? null;
    const inherited = own ?? ([...chain].reverse().map((r) => r.markPoints as MarkPointsJson).find(Boolean) ?? null);
    const entries = inherited?.entries ?? [];
    const points = entries.flatMap((e) => e.points);
    const root = chain[0] ?? leaf;
    return {
        number: leaf.number,
        maxMarks: leafMarks(rows, leaf),
        context: chain.map((r) => r.stem).filter(Boolean),
        stem: leaf.stem,
        points,
        schemeText: entries.map((e) => `${e.number}: ${e.text}`).join("\n"),
        guidance: leaf.markNotes ?? root.markNotes ?? null,
        hasMarkScheme: entries.length > 0,
        entries,
        msPaperId: inherited?.paperId ?? null,
        examinerNotes: root.examinerNotes ?? null,
    };
}

async function paperRef(paperId: string) {
    return db.paper.findUnique({ where: { id: paperId }, select: { storageKey: true, pageKeys: true, mime: true, sha256: true, pageCount: true } });
}

/** Crops of the printed question (ancestors first) and the mark-scheme rows, for the vision model. */
export async function contextImages(qpPaperId: string, rows: Row[], leaf: Row, msPaperId: string | null, entries: MarkSchemeEntry[]) {
    const store = storage();
    const question: Uint8Array[] = [];
    const scheme: Uint8Array[] = [];
    const qp = await paperRef(qpPaperId);
    if (qp) {
        const { doc } = qp.pageKeys.length ? { doc: undefined } : await loadPaperPdf(store, qp);
        try {
            for (const r of [...ancestors(rows, leaf.id), leaf]) {
                if (!r.page || r.bbox.length !== 4) continue;
                const img = await getPageImage(store, qp, r.page, doc);
                if (img) question.push(await cropImage(img.bytes, r.bbox as BBox, 0.005).catch(() => img.bytes));
            }
        } finally {
            await doc?.close();
        }
    }
    if (msPaperId) {
        const ms = await paperRef(msPaperId);
        if (ms) {
            const { doc } = ms.pageKeys.length ? { doc: undefined } : await loadPaperPdf(store, ms);
            try {
                for (const e of entries) {
                    for (const r of e.regions.slice(0, 2)) {
                        if (scheme.length >= 4) break;
                        const img = await getPageImage(store, ms, r.page, doc);
                        if (img) scheme.push(await cropImage(img.bytes, r.bbox as BBox, 0.005).catch(() => img.bytes));
                    }
                }
            } finally {
                await doc?.close();
            }
        }
    }
    return { question, scheme };
}
