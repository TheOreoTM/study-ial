// Student uploads: limits, dedupe by content hash, storage and the private sitting they live in.
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { sha256Hex } from "@/lib/papers/hash";
import { uploadImageKey, uploadPdfKey } from "@/lib/papers/keys";
import { isPdf, normaliseImage, pdfPageCount, sniffImage } from "@/lib/papers/pdf";
import { localDayKey } from "@/lib/time";
import type { StorageAdapter } from "@/lib/storage/types";

const envInt = (name: string, fallback: number) => {
    const n = Number.parseInt(process.env[name] ?? "", 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const uploadLimits = () => ({
    /** Per request: Vercel functions accept bodies up to 4.5 MB; phones' photos are shrunk in the browser first */
    maxBytes: envInt("PAPERS_UPLOAD_MAX_MB", 4) * 1024 * 1024,
    maxPdfPages: envInt("PAPERS_UPLOAD_MAX_PAGES", 60),
    maxImages: envInt("PAPERS_UPLOAD_MAX_IMAGES", 30),
    perDay: envInt("PAPERS_UPLOADS_PER_DAY", 10),
});

export type UploadFile = { name: string; type: string; bytes: Uint8Array };

export type UploadCheck = { ok: true; kind: "pdf" | "images" } | { ok: false; error: string };

/** Validates the shape of an upload before anything is decoded. Pure, unit-tested. */
export function checkUpload(files: UploadFile[], limits = uploadLimits()): UploadCheck {
    if (files.length === 0) return { ok: false, error: "Choose a PDF or some photos first." };
    const total = files.reduce((n, f) => n + f.bytes.byteLength, 0);
    if (total > limits.maxBytes) {
        return { ok: false, error: `That's too big: uploads can be up to ${Math.round(limits.maxBytes / 1024 / 1024)} MB.` };
    }
    const pdfs = files.filter((f) => isPdf(f.bytes));
    if (pdfs.length > 0) {
        if (files.length > 1) return { ok: false, error: "Upload one PDF at a time, or photos on their own." };
        return { ok: true, kind: "pdf" };
    }
    if (files.length > limits.maxImages) return { ok: false, error: `Up to ${limits.maxImages} photos per paper.` };
    for (const f of files) {
        const kind = sniffImage(f.bytes);
        if (kind === "heic") return { ok: false, error: "HEIC photos aren't supported. Choose JPEG (Most Compatible) in your camera settings." };
        if (!kind) return { ok: false, error: `${f.name || "A file"} isn't a PDF, JPEG, PNG or WebP image.` };
    }
    return { ok: true, kind: "images" };
}

/** One hash for a set of photos: order matters (it's page order). */
export function imageSetHash(files: Uint8Array[]) {
    const h = createHash("sha256");
    for (const f of files) h.update(sha256Hex(f));
    return h.digest("hex");
}

export async function uploadsToday(userId: string) {
    const rows = await db.paper.findMany({
        where: { uploadedById: userId, createdAt: { gte: new Date(Date.now() - 36 * 3600 * 1000) } },
        select: { createdAt: true },
    });
    const today = localDayKey(new Date());
    return rows.filter((r) => localDayKey(r.createdAt) === today).length;
}

export type UploadMeta = { title: string; unitCode: string | null; type: "QP" | "MS"; sittingId?: string | null };

export type UploadResult =
    | { ok: true; sittingId: string; paperId: string; deduped: "index" | "own" | null }
    | { ok: false; error: string };

/**
 * Stores an upload and creates its private sitting (or adds a mark scheme to an existing one). If the file is
 * identical to an indexed Pearson paper, the student gets that sitting instead of a copy.
 */
export async function createUpload(store: StorageAdapter, userId: string, files: UploadFile[], meta: UploadMeta): Promise<UploadResult> {
    const limits = uploadLimits();
    const check = checkUpload(files, limits);
    if (!check.ok) return check;
    if ((await uploadsToday(userId)) >= limits.perDay) {
        return { ok: false, error: `You can upload ${limits.perDay} papers a day. Try again tomorrow.` };
    }

    let sha256: string;
    let storageKey: string;
    let pageKeys: string[] = [];
    let mime = "application/pdf";
    let pageCount: number;
    let sizeBytes: number;
    let pending: { key: string; bytes: Uint8Array; type: string }[] = [];

    if (check.kind === "pdf") {
        const bytes = files[0].bytes;
        sha256 = sha256Hex(bytes);
        try {
            pageCount = await pdfPageCount(bytes);
        } catch {
            return { ok: false, error: "That PDF couldn't be opened. Is it password-protected?" };
        }
        if (pageCount > limits.maxPdfPages) return { ok: false, error: `PDFs can have up to ${limits.maxPdfPages} pages.` };
        storageKey = uploadPdfKey(sha256);
        sizeBytes = bytes.byteLength;
        pending = [{ key: storageKey, bytes, type: "application/pdf" }];
    } else {
        sha256 = imageSetHash(files.map((f) => f.bytes));
        mime = "image/jpeg";
        sizeBytes = 0;
        for (const [i, f] of files.entries()) {
            let jpeg: Uint8Array;
            try {
                // Re-encoding also strips EXIF (location, device) from phone photos
                jpeg = (await normaliseImage(f.bytes)).jpeg;
            } catch {
                return { ok: false, error: `Photo ${i + 1} couldn't be read.` };
            }
            const key = uploadImageKey(sha256, i + 1, "jpg");
            pageKeys.push(key);
            sizeBytes += jpeg.byteLength;
            pending.push({ key, bytes: jpeg, type: "image/jpeg" });
        }
        storageKey = pageKeys[0];
        pageCount = files.length;
    }

    // Dedupe 1: the same file as an indexed paper → save that sitting instead
    const indexed = await db.paper.findFirst({ where: { sha256, source: { in: ["PEARSON", "PMT"] } }, select: { id: true, sittingId: true } });
    if (indexed) {
        await db.userPaper.upsert({
            where: { userId_sittingId: { userId, sittingId: indexed.sittingId } },
            create: { userId, sittingId: indexed.sittingId },
            update: {},
        });
        return { ok: true, sittingId: indexed.sittingId, paperId: indexed.id, deduped: "index" };
    }
    // Dedupe 2: this student already uploaded it
    const own = await db.paper.findFirst({ where: { sha256, uploadedById: userId }, select: { id: true, sittingId: true } });
    if (own) return { ok: true, sittingId: own.sittingId, paperId: own.id, deduped: "own" };

    // Bytes are stored once per hash, whoever uploaded them
    for (const p of pending) if (!(await store.exists(p.key))) await store.put(p.key, p.bytes, p.type);
    pageKeys = check.kind === "images" ? pageKeys : [];

    let sittingId = meta.sittingId ?? null;
    if (sittingId) {
        const s = await db.paperSitting.findUnique({ where: { id: sittingId }, select: { ownerId: true, papers: { select: { type: true } } } });
        if (!s || s.ownerId !== userId) return { ok: false, error: "You can only add files to your own uploads." };
        if (s.papers.some((p) => p.type === meta.type)) return { ok: false, error: `This paper already has a ${meta.type === "MS" ? "mark scheme" : "question paper"}.` };
    } else {
        const unit = meta.unitCode ? await db.unit.findUnique({ where: { code: meta.unitCode }, select: { id: true, code: true, subject: { select: { slug: true } } } }) : null;
        const sitting = await db.paperSitting.create({
            data: {
                ownerId: userId,
                title: meta.title.trim().slice(0, 120) || "Uploaded paper",
                subject: unit?.subject.slug ?? "other",
                unitCode: unit?.code ?? "OTHER",
                unitId: unit?.id ?? null,
            },
        });
        sittingId = sitting.id;
        await db.userPaper.create({ data: { userId, sittingId } });
    }
    const paper = await db.paper.create({
        data: {
            sittingId,
            type: meta.type,
            source: "UPLOAD",
            storageKey,
            pageKeys,
            mime,
            sha256,
            sizeBytes,
            pageCount,
            uploadedById: userId,
        },
    });
    return { ok: true, sittingId, paperId: paper.id, deduped: null };
}
