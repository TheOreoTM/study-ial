import type { DocType, Series } from "@/lib/papers/filename";
import type { SkipReason } from "@/lib/papers/access";

export type PaperSourceName = "PEARSON" | "PMT";

/** A file found by discovery, before download. */
export type PaperCandidate = {
    source: PaperSourceName;
    /** Full original URL, exactly as listed (never reconstructed) */
    sourceUrl: string;
    title: string;
    subject: string;
    /** Pearson specification the paper belongs to ("2018", "2013") */
    spec: string | null;
    unitCode: string;
    paperCode: string;
    type: DocType;
    /** Null when the listing doesn't say; the ingest reads it from the cover page */
    year: number | null;
    series: Series | null;
    publishedAt: Date | null;
    /** A corrected re-issue ("updated"): wins over another file for the same slot */
    preferred?: boolean;
};

export type Skipped = { sourceUrl: string; title: string; reason: SkipReason; detail?: string };

export type DiscoveryResult = { candidates: PaperCandidate[]; skipped: Skipped[] };
