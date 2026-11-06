// Ingestion: discover → filter → download → hash → store → upsert. Idempotent and resumable: a file whose source URL
// is already in the database is never requested again, and identical content (same SHA-256) is stored once.
import { createHash } from "node:crypto";
import { checkPdfResponse, isInRestrictedWindow, isRestrictedPath } from "@/lib/papers/access";
import { enabledPaperSubjects, restrictedMonths, type PaperSubjectConfig } from "@/lib/papers/config";
import { findSittingInText, type DocType, type Series } from "@/lib/papers/filename";
import { PoliteFetcher, RobotsDisallowedError } from "@/lib/papers/http";
import { paperKey } from "@/lib/papers/keys";
import { openPdf, pageTexts, pageToPlainText } from "@/lib/papers/pdf";
import { discoverPearson } from "@/lib/papers/sources/pearson";
import { discoverPmt } from "@/lib/papers/sources/pmt";
import type { PaperCandidate, Skipped } from "@/lib/papers/sources/types";
import type { StorageAdapter } from "@/lib/storage/types";
import type { PrismaClient } from "@/lib/generated/prisma/client";

export const sha256Hex = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

const SERIES_ENUM = { jan: "JAN", jun: "JUN", oct: "OCT" } as const;

export type IngestOptions = {
    subjects?: string[];
    units?: string[];
    types?: DocType[];
    limit?: number;
    dryRun?: boolean;
    sources?: ("pearson" | "pmt")[];
    now?: Date;
    log?: (msg: string) => void;
};

export type IngestReport = {
    startedAt: string;
    finishedAt?: string;
    storage: string;
    discovered: number;
    alreadyStored: number;
    stored: { url: string; key: string; sha256: string; pages: number }[];
    duplicates: { url: string; sameAs: string }[];
    skipped: Skipped[];
    errors: { url: string; error: string }[];
    requests: number;
};

/** Sitting identity used to let Pearson originals win over PMT copies. */
const slotKey = (c: Pick<PaperCandidate, "unitCode" | "paperCode" | "year" | "series" | "type">) =>
    `${c.unitCode}|${c.paperCode}|${c.year}|${c.series}|${c.type}`;

/**
 * One file per slot: within Pearson's listing a corrected ("updated") re-issue beats the original; PMT entries are
 * only kept for slots Pearson's open listing doesn't fill. Candidates without a known sitting pass through (the
 * cover page decides later). Pure, unit-tested.
 */
export function mergeCandidates(pearson: PaperCandidate[], pmt: PaperCandidate[]) {
    const bySlot = new Map<string, PaperCandidate>();
    const unknown: PaperCandidate[] = [];
    for (const c of pearson) {
        if (!c.year || !c.series) {
            unknown.push(c);
            continue;
        }
        const k = slotKey(c);
        const prev = bySlot.get(k);
        if (!prev || (c.preferred && !prev.preferred)) bySlot.set(k, c);
    }
    const kept = [...bySlot.values(), ...unknown];
    return [...kept, ...pmt.filter((c) => !bySlot.has(slotKey(c)))];
}

export async function discoverSubject(
    fetcher: PoliteFetcher,
    subject: PaperSubjectConfig,
    opts: Pick<IngestOptions, "sources" | "now">,
) {
    const sources = opts.sources ?? ["pearson", "pmt"];
    const now = opts.now ?? new Date();
    const pearson = sources.includes("pearson") ? await discoverPearson(fetcher, subject, now) : { candidates: [], skipped: [] };
    const pmt = sources.includes("pmt") ? await discoverPmt(subject.slug, now) : { candidates: [], skipped: [] };
    return {
        candidates: mergeCandidates(pearson.candidates, pmt.candidates),
        skipped: [...pearson.skipped, ...pmt.skipped],
    };
}

async function findOrCreateSitting(
    db: PrismaClient,
    c: PaperCandidate & { year: number; series: Series },
    unitIds: Map<string, string>,
) {
    const where = {
        ownerId: null,
        unitCode: c.unitCode,
        paperCode: c.paperCode,
        year: c.year,
        series: SERIES_ENUM[c.series],
    };
    const existing = await db.paperSitting.findFirst({ where });
    if (existing) return existing;
    return db.paperSitting.create({
        data: { ...where, subject: c.subject, spec: c.spec, unitId: unitIds.get(c.unitCode) ?? null },
    });
}

export async function ingest(
    db: PrismaClient,
    store: StorageAdapter,
    fetcher: PoliteFetcher,
    opts: IngestOptions = {},
): Promise<IngestReport> {
    const log = opts.log ?? console.log;
    const now = opts.now ?? new Date();
    const report: IngestReport = {
        startedAt: now.toISOString(),
        storage: store.kind,
        discovered: 0,
        alreadyStored: 0,
        stored: [],
        duplicates: [],
        skipped: [],
        errors: [],
        requests: 0,
    };
    const units = await db.unit.findMany({ select: { id: true, code: true } });
    const unitIds = new Map(units.map((u) => [u.code, u.id]));
    const subjects = enabledPaperSubjects().filter((s) => !opts.subjects?.length || opts.subjects.includes(s.slug));
    const unitFilter = opts.units?.map((u) => u.toUpperCase());
    let processed = 0;

    for (const subject of subjects) {
        log(`\n▸ ${subject.name}: discovering…`);
        const { candidates, skipped } = await discoverSubject(fetcher, subject, { sources: opts.sources, now });
        report.skipped.push(...skipped);
        const wanted = candidates
            .filter((c) => !unitFilter?.length || unitFilter.includes(c.unitCode))
            .filter((c) => !opts.types?.length || opts.types.includes(c.type))
            // Oldest first: a stable order makes interrupted runs resume predictably
            .sort((a, b) => (a.year ?? 0) - (b.year ?? 0) || a.unitCode.localeCompare(b.unitCode) || a.sourceUrl.localeCompare(b.sourceUrl));
        report.discovered += wanted.length;
        log(`  ${wanted.length} candidate files, ${skipped.length} skipped by the access rules`);

        const known = new Set(
            (
                await db.paper.findMany({
                    where: { sourceUrl: { in: wanted.map((c) => c.sourceUrl) } },
                    select: { sourceUrl: true },
                })
            ).map((p) => p.sourceUrl),
        );

        for (const c of wanted) {
            if (known.has(c.sourceUrl)) {
                report.alreadyStored++;
                continue;
            }
            if (opts.limit !== undefined && processed >= opts.limit) break;
            processed++;
            if (opts.dryRun) {
                log(`  would fetch ${c.sourceUrl}`);
                continue;
            }
            try {
                await ingestOne(db, store, fetcher, c, { now, unitIds, report, log });
            } catch (err) {
                if (err instanceof RobotsDisallowedError) {
                    report.skipped.push({ sourceUrl: c.sourceUrl, title: c.title, reason: "robots" });
                } else {
                    report.errors.push({ url: c.sourceUrl, error: (err as Error).message });
                    log(`  ✗ ${c.sourceUrl}: ${(err as Error).message}`);
                }
            }
        }
    }
    report.requests = fetcher.requests;
    report.finishedAt = new Date().toISOString();
    return report;
}

async function ingestOne(
    db: PrismaClient,
    store: StorageAdapter,
    fetcher: PoliteFetcher,
    c: PaperCandidate,
    ctx: { now: Date; unitIds: Map<string, string>; report: IngestReport; log: (m: string) => void },
) {
    const { report, log } = ctx;
    // Belt and braces: never request anything on a restricted path
    if (isRestrictedPath(c.sourceUrl)) {
        report.skipped.push({ sourceUrl: c.sourceUrl, title: c.title, reason: "restricted-path" });
        return;
    }
    const res = await fetcher.download(c.sourceUrl);
    const check = checkPdfResponse({ ...res, firstBytes: res.body.slice(0, 8) });
    if (!check.ok) {
        report.skipped.push({ sourceUrl: c.sourceUrl, title: c.title, reason: check.reason, detail: res.finalUrl });
        log(`  – skip ${c.sourceUrl} (${check.reason})`);
        return;
    }

    const sha256 = sha256Hex(res.body);
    const doc = await openPdf(res.body);
    let pageCount: number;
    let coverText: string;
    try {
        pageCount = doc.numPages;
        coverText = pageToPlainText((await pageTexts(doc, [1]))[0]);
    } finally {
        await doc.close();
    }

    // The listing's sitting wins; the cover page fills gaps and is cross-checked.
    const cover = findSittingInText(coverText);
    const year = c.year ?? cover?.year ?? null;
    const series = c.series ?? cover?.series ?? null;
    if (!year || !series) {
        report.skipped.push({ sourceUrl: c.sourceUrl, title: c.title, reason: "not-a-paper", detail: "no sitting found" });
        return;
    }
    if (cover && c.year && (cover.year !== c.year || cover.series !== c.series)) {
        log(`  ! ${c.sourceUrl}: listing says ${c.series} ${c.year}, cover says ${cover.series} ${cover.year}`);
    }
    if (isInRestrictedWindow({ year, series }, ctx.now, restrictedMonths())) {
        report.skipped.push({ sourceUrl: c.sourceUrl, title: c.title, reason: "restricted-window" });
        return;
    }

    const dup = await db.paper.findFirst({ where: { sha256, source: { not: "UPLOAD" } }, select: { sourceUrl: true } });
    if (dup?.sourceUrl) {
        report.duplicates.push({ url: c.sourceUrl, sameAs: dup.sourceUrl });
        return;
    }

    const key = paperKey({ subject: c.subject, unitCode: c.unitCode, paperCode: c.paperCode, year, series, type: c.type });
    const sitting = await findOrCreateSitting(db, { ...c, year, series }, ctx.unitIds);
    const clash = await db.paper.findFirst({ where: { sittingId: sitting.id, type: c.type }, select: { id: true, source: true } });
    if (clash) {
        // A different file already fills this slot (e.g. a re-issued copy). Keep the first; record the duplicate.
        report.duplicates.push({ url: c.sourceUrl, sameAs: `sitting ${sitting.id} ${c.type}` });
        return;
    }
    if (!(await store.exists(key))) await store.put(key, res.body, "application/pdf");
    await db.paper.create({
        data: {
            sittingId: sitting.id,
            type: c.type,
            source: c.source,
            sourceUrl: c.sourceUrl,
            sourceTitle: c.title,
            storageKey: key,
            sha256,
            sizeBytes: res.body.byteLength,
            pageCount,
            publishedAt: c.publishedAt,
        },
    });
    report.stored.push({ url: c.sourceUrl, key, sha256, pages: pageCount });
    log(`  ✓ ${key} (${pageCount} pages)`);
}
