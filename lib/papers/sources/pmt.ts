// Physics & Maths Tutor fallback. PMT's listing pages are rendered client-side, so discovery reads a curated
// manifest (data/papers/pmt-manifest.json) of download URLs instead of crawling. Entries are only ingested for
// (unit, paper, sitting, type) combinations that Pearson's open listing doesn't have: Pearson's originals always win.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { isInRestrictedWindow } from "@/lib/papers/access";
import { paperSubjectForUnit, restrictedMonths } from "@/lib/papers/config";
import { findSittingInText } from "@/lib/papers/filename";
import type { DiscoveryResult, PaperCandidate } from "@/lib/papers/sources/types";

export const PMT_HOSTS = ["pmt.physicsandmathstutor.com", "www.physicsandmathstutor.com"];

const entrySchema = z.object({
    url: z.string().url(),
    unitCode: z.string().regex(/^W[A-Z]{2}\d{2}$/),
    paperCode: z.string().regex(/^\d{2}[a-z]?$/).default("01"),
    type: z.enum(["QP", "MS", "ER"]),
    /** e.g. "January 2017"; parsed from the URL when omitted */
    sitting: z.string().optional(),
});

export type PmtManifestEntry = z.infer<typeof entrySchema>;

export const PMT_MANIFEST_PATH = path.join(process.cwd(), "data", "papers", "pmt-manifest.json");

export function mapPmtEntry(entry: PmtManifestEntry, now: Date): ReturnType<typeof toCandidate> {
    return toCandidate(entry, now);
}

function toCandidate(
    entry: PmtManifestEntry,
    now: Date,
): { candidate: PaperCandidate } | { skip: DiscoveryResult["skipped"][number] } {
    const url = new URL(entry.url);
    const title = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    if (!PMT_HOSTS.includes(url.host)) return { skip: { sourceUrl: entry.url, title, reason: "not-a-paper", detail: "host" } };
    const subject = paperSubjectForUnit(entry.unitCode);
    if (!subject) return { skip: { sourceUrl: entry.url, title, reason: "not-allowlisted" } };
    const sitting = findSittingInText(entry.sitting ?? decodeURIComponent(url.pathname).replace(/[-_]/g, " "));
    if (!sitting) return { skip: { sourceUrl: entry.url, title, reason: "not-a-paper", detail: "no sitting" } };
    if (isInRestrictedWindow(sitting, now, restrictedMonths())) {
        return { skip: { sourceUrl: entry.url, title, reason: "restricted-window" } };
    }
    return {
        candidate: {
            source: "PMT",
            sourceUrl: url.toString(),
            title: `${entry.type} ${entry.unitCode} ${sitting.series} ${sitting.year} (PMT)`,
            subject: subject.slug,
            spec: null,
            unitCode: entry.unitCode,
            paperCode: entry.paperCode,
            type: entry.type,
            year: sitting.year,
            series: sitting.series,
            publishedAt: null,
        },
    };
}

export async function discoverPmt(subjectSlug: string, now = new Date(), manifestPath = PMT_MANIFEST_PATH) {
    let raw: unknown;
    try {
        raw = JSON.parse(await readFile(manifestPath, "utf8"));
    } catch {
        return { candidates: [], skipped: [] } satisfies DiscoveryResult;
    }
    const entries = z.array(entrySchema).parse(raw);
    const result: DiscoveryResult = { candidates: [], skipped: [] };
    for (const e of entries) {
        const mapped = toCandidate(e, now);
        if ("candidate" in mapped) {
            if (mapped.candidate.subject === subjectSlug) result.candidates.push(mapped.candidate);
        } else result.skipped.push(mapped.skip);
    }
    return result;
}
