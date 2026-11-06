// Storage key conventions. Pure and unit-tested. Keys are lowercase with no spaces so they're safe in any store.
import { DOC_TYPE_KEY, SERIES, type DocType, type Series } from "@/lib/papers/filename";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UNIT_RE = /^[a-z]{3}\d{2}$/;
const PAPER_RE = /^\d{2}[a-z]?$/;
const SHA_RE = /^[a-f0-9]{64}$/;

export type PaperKeyParts = {
    subject: string; // subject slug, e.g. "mathematics"
    unitCode: string; // "WMA11"
    paperCode: string; // "01" | "01a"
    year: number;
    series: Series;
    type: DocType;
};

/** ial/{subject}/{unit}/{year}-{series}/{unit}-{paper}-{qp|ms|er}.pdf */
export function paperKey(p: PaperKeyParts): string {
    const subject = p.subject.toLowerCase();
    const unit = p.unitCode.toLowerCase();
    const paper = p.paperCode.toLowerCase();
    if (!SLUG_RE.test(subject)) throw new Error(`Invalid subject slug: ${p.subject}`);
    if (!UNIT_RE.test(unit)) throw new Error(`Invalid unit code: ${p.unitCode}`);
    if (!PAPER_RE.test(paper)) throw new Error(`Invalid paper code: ${p.paperCode}`);
    if (!Number.isInteger(p.year) || p.year < 2000 || p.year > 2100) throw new Error(`Invalid year: ${p.year}`);
    if (!SERIES.includes(p.series)) throw new Error(`Invalid series: ${p.series}`);
    return `ial/${subject}/${unit}/${p.year}-${p.series}/${unit}-${paper}-${DOC_TYPE_KEY[p.type]}.pdf`;
}

/** Parses a paper key back into its parts, or null if it doesn't follow the convention. */
export function parsePaperKey(key: string): PaperKeyParts | null {
    const m = /^ial\/([a-z0-9-]+)\/([a-z]{3}\d{2})\/(\d{4})-(jan|jun|oct)\/([a-z]{3}\d{2})-(\d{2}[a-z]?)-(qp|ms|er)\.pdf$/.exec(key);
    if (!m || m[2] !== m[5]) return null;
    const type = ({ qp: "QP", ms: "MS", er: "ER" } as const)[m[7] as "qp" | "ms" | "er"];
    return {
        subject: m[1],
        unitCode: m[2].toUpperCase(),
        paperCode: m[6],
        year: Number(m[3]),
        series: m[4] as Series,
        type,
    };
}

function assertSha(sha256: string) {
    if (!SHA_RE.test(sha256)) throw new Error("Invalid sha256");
}

/** A student's uploaded PDF, stored once per unique content. */
export function uploadPdfKey(sha256: string) {
    assertSha(sha256);
    return `uploads/${sha256}.pdf`;
}

/** One page of an uploaded image set (1-based page number). */
export function uploadImageKey(setSha256: string, page: number, ext: "jpg" | "png" | "webp") {
    assertSha(setSha256);
    return `uploads/${setSha256}/page-${String(page).padStart(3, "0")}.${ext}`;
}

/** Rendered page image derived from a stored file (for parsing, review and crops). */
export function pageImageKey(sha256: string, page: number) {
    assertSha(sha256);
    return `derived/${sha256}/page-${String(page).padStart(3, "0")}.png`;
}

/** A figure cropped server-side from a page image. */
export function figureKey(sha256: string, page: number, index: number) {
    assertSha(sha256);
    return `derived/${sha256}/figures/p${String(page).padStart(3, "0")}-${index}.png`;
}

/** A photo of handwritten working attached to an attempt. */
export function attemptImageKey(userId: string, id: string, ext: "jpg" | "png" | "webp") {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(userId) || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) throw new Error("Invalid id");
    return `attempts/${userId}/${id}.${ext}`;
}

/** True only for a key this exact function produced for this user: attempts/{userId}/{id}.{ext}. No traversal. */
export function isOwnAttemptKey(userId: string, key: string) {
    const m = /^attempts\/([A-Za-z0-9_-]{1,64})\/([A-Za-z0-9_-]{1,64})\.(jpg|png|webp)$/.exec(key);
    return !!m && m[1] === userId;
}
