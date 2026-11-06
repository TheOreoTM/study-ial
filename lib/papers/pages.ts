// Page images for stored papers: uploaded photos are their own pages; PDF pages are rendered once and kept in
// storage under derived/{sha256}/page-NNN.png. These derived images are what figures are cropped from and what the
// vision model and the review screen see.
import { openPdf, renderPage, type PdfDoc } from "@/lib/papers/pdf";
import { pageImageKey } from "@/lib/papers/keys";
import type { StorageAdapter } from "@/lib/storage/types";

export type StoredPaperRef = { storageKey: string; pageKeys: string[]; mime: string; sha256: string; pageCount: number };

export async function loadPaperPdf(store: StorageAdapter, paper: StoredPaperRef) {
    const bytes = await store.get(paper.storageKey);
    if (!bytes) throw new Error(`Missing file ${paper.storageKey}`);
    return { bytes, doc: await openPdf(bytes) };
}

/** Returns a page image, rendering (and caching) PDF pages on first use. */
export async function getPageImage(
    store: StorageAdapter,
    paper: StoredPaperRef,
    page: number,
    doc?: PdfDoc,
): Promise<{ bytes: Uint8Array; mime: string } | null> {
    if (page < 1 || page > paper.pageCount) return null;
    if (paper.pageKeys.length) {
        const bytes = await store.get(paper.pageKeys[page - 1]);
        return bytes ? { bytes, mime: paper.mime } : null;
    }
    const key = pageImageKey(paper.sha256, page);
    const cached = await store.get(key);
    if (cached) return { bytes: cached, mime: "image/png" };
    let own: Awaited<ReturnType<typeof loadPaperPdf>> | null = null;
    try {
        const d = doc ?? (own = await loadPaperPdf(store, paper)).doc;
        const { png } = await renderPage(d, page, 2);
        await store.put(key, png, "image/png");
        return { bytes: png, mime: "image/png" };
    } finally {
        await own?.doc.close();
    }
}
