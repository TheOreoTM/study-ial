// PDF and image utilities on pdfjs-dist + @napi-rs/canvas (both run on Vercel's Node runtime; no system binaries).
// The stored PDFs are never modified: everything here reads them or produces derived images.
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createCanvas, loadImage, type Image } from "@napi-rs/canvas";

type PdfJs = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
let pdfjsPromise: Promise<PdfJs> | null = null;
function pdfjs() {
    pdfjsPromise ??= import("pdfjs-dist/legacy/build/pdf.mjs");
    return pdfjsPromise;
}

function standardFontDataUrl() {
    try {
        const require = createRequire(import.meta.url);
        const dir = path.dirname(require.resolve("pdfjs-dist/package.json"));
        return pathToFileURL(path.join(dir, "standard_fonts") + path.sep).toString();
    } catch {
        return undefined;
    }
}

export async function openPdf(bytes: Uint8Array) {
    const { getDocument } = await pdfjs();
    // pdfjs takes ownership of the buffer, so give it a copy
    const task = getDocument({
        data: new Uint8Array(bytes),
        verbosity: 0,
        standardFontDataUrl: standardFontDataUrl(),
    });
    const doc = await task.promise;
    return Object.assign(doc, { close: () => task.destroy() });
}

export type PdfDoc = Awaited<ReturnType<typeof openPdf>>;

export function isPdf(bytes: Uint8Array) {
    return bytes.length > 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
}

export async function pdfPageCount(bytes: Uint8Array) {
    const doc = await openPdf(bytes);
    try {
        return doc.numPages;
    } finally {
        await doc.close();
    }
}

/** A run of text on a page, in PDF points with the origin at the TOP-left (y grows downwards). */
export type TextItem = { str: string; x: number; y: number; width: number; height: number };
export type PageText = { page: number; width: number; height: number; items: TextItem[] };

export async function pageTexts(doc: PdfDoc, pages?: number[]): Promise<PageText[]> {
    const out: PageText[] = [];
    const list = pages ?? Array.from({ length: doc.numPages }, (_, i) => i + 1);
    for (const n of list) {
        const page = await doc.getPage(n);
        const vp = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();
        const items: TextItem[] = [];
        for (const it of content.items) {
            if (!("str" in it) || !it.str) continue;
            // Symbol fonts map maths glyphs to control and private-use code points; Postgres also rejects NUL in JSON
            const str = it.str.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ue000-\uf8ff]/g, "");
            if (!str) continue;
            const [, , , d, e, f] = it.transform as number[];
            const h = Math.abs(d) || it.height || 0;
            items.push({ str, x: e, y: vp.height - f - h, width: it.width, height: h });
        }
        out.push({ page: n, width: vp.width, height: vp.height, items });
        page.cleanup();
    }
    return out;
}

/** Plain text of one page (items in reading order joined by spaces/newlines). */
export function pageToPlainText(p: PageText) {
    return p.items
        .slice()
        .sort((a, b) => a.y - b.y || a.x - b.x)
        .map((i) => i.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

/** Renders one page to PNG. `scale` 2 ≈ 144 dpi, enough for vision models and crisp crops. */
export async function renderPage(doc: PdfDoc, pageNumber: number, scale = 2) {
    const page = await doc.getPage(pageNumber);
    const vp = page.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // pdfjs' canvas typings are DOM types; @napi-rs/canvas implements the same API
    await page.render({ canvas: canvas as never, canvasContext: ctx as never, viewport: vp }).promise;
    page.cleanup();
    return { png: new Uint8Array(canvas.toBuffer("image/png")), width: canvas.width, height: canvas.height };
}

/** Bounding box as fractions of the page/image: [x0, y0, x1, y1], origin top-left, each in 0..1. */
export type BBox = [number, number, number, number];

export function clampBBox(b: BBox): BBox | null {
    const c = b.map((v) => Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0))) as BBox;
    const [x0, y0, x1, y1] = [Math.min(c[0], c[2]), Math.min(c[1], c[3]), Math.max(c[0], c[2]), Math.max(c[1], c[3])];
    if (x1 - x0 < 0.02 || y1 - y0 < 0.01) return null;
    return [x0, y0, x1, y1];
}

/** Crops a region (fractional bbox) out of an image, with a small padding. Returns PNG bytes. */
export async function cropImage(imageBytes: Uint8Array, bbox: BBox, padding = 0.01) {
    const img = await loadImage(Buffer.from(imageBytes));
    const b = clampBBox([bbox[0] - padding, bbox[1] - padding, bbox[2] + padding, bbox[3] + padding]);
    if (!b) throw new Error("Crop region too small");
    const sx = Math.floor(b[0] * img.width);
    const sy = Math.floor(b[1] * img.height);
    const sw = Math.max(1, Math.ceil((b[2] - b[0]) * img.width));
    const sh = Math.max(1, Math.ceil((b[3] - b[1]) * img.height));
    const canvas = createCanvas(sw, sh);
    canvas.getContext("2d").drawImage(img as Image, sx, sy, sw, sh, 0, 0, sw, sh);
    return new Uint8Array(canvas.toBuffer("image/png"));
}

export type ImageKind = "jpg" | "png" | "webp";

export function sniffImage(bytes: Uint8Array): ImageKind | "heic" | null {
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
    const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
    if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
    if (ascii(4, 8) === "ftyp" && /^(heic|heix|hevc|mif1|msf1)$/.test(ascii(8, 12))) return "heic";
    return null;
}

/**
 * Normalises a photo/scan: decodes it, scales the long edge down to `maxEdge` and re-encodes as JPEG. This also
 * drops EXIF metadata (location etc.) from students' phone photos.
 */
export async function normaliseImage(bytes: Uint8Array, maxEdge = 2200, quality = 85) {
    const img = await loadImage(Buffer.from(bytes));
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img as Image, 0, 0, w, h);
    return { jpeg: new Uint8Array(canvas.toBuffer("image/jpeg", quality)), width: w, height: h };
}
