// Parsing of Pearson exam-material filenames, titles and series labels. Pure and unit-tested.
//
// Filenames come in two styles:
//   2018 spec:  wma11-01-que-20250110.pdf   wma11-01a-rms-20250814.pdf   wma12-01r-pef-20240815.pdf
//   older:      WME02_01_pef_20220303.pdf    WME03_01_msc_20150305.pdf
// The trailing date is the PUBLICATION date (a mark scheme for October 2022 can be dated 2023-01-12), never the series.

export type DocType = "QP" | "MS" | "ER";
export type Series = "jan" | "jun" | "oct";

export const SERIES: Series[] = ["jan", "jun", "oct"];
export const SERIES_LABEL: Record<Series, string> = { jan: "January", jun: "June", oct: "October" };
/** Last month of each series' exam window (1-based), used for the restricted-window check */
export const SERIES_END_MONTH: Record<Series, number> = { jan: 1, jun: 6, oct: 10 };

export const DOC_TYPE_LABEL: Record<DocType, string> = { QP: "Question paper", MS: "Mark scheme", ER: "Examiner report" };
export const DOC_TYPE_KEY: Record<DocType, "qp" | "ms" | "er"> = { QP: "qp", MS: "ms", ER: "er" };

const TYPE_CODES: Record<string, DocType> = {
    que: "QP",
    qp: "QP",
    rms: "MS",
    msc: "MS",
    mcs: "MS", // typo in some of Pearson's filenames
    ms: "MS",
    pef: "ER",
    er: "ER",
};

export type ParsedFilename = {
    unitCode: string; // "WMA11"
    paperCode: string; // "01", "01a", "01r"
    /** Null when the filename has no recognisable type code; the listing's document type is used then */
    type: DocType | null;
    publishedAt: Date | null;
    /** "-updated" corrected re-issue: preferred over the original for the same sitting */
    updated: boolean;
    /** Pearson's "unused" papers (prepared for a cancelled sitting): not a real sitting, skipped */
    unused: boolean;
};

const STRICT_RE = /^(w[a-z]{2}\d{2})[-_](\d{2}[a-z]?)[-_]([a-z]{2,3})[-_](\d{8})\.pdf$/i;
const LENIENT_RE = /^(?:ial[-_])?(w[a-z]{2}\d{2})[-_](\d{2}[a-z]?)(?=[-_.])(.*)\.pdf$/i;
// Known typos in Pearson's own filenames: "mcs" for "msc"
const TYPE_TOKEN_RE = /(?:^|[-_])(que|qp|rms|msc|mcs|ms|pef|er)(?=[-_.]|$)/i;

/**
 * Parses a Pearson IAL exam-material filename. Returns null for anything that isn't an IAL paper PDF. The strict
 * pattern covers almost every file; a lenient one handles the irregular names (`ial-wma11-01-oct19.pdf`,
 * `wfm03-01-que-20230405-updated.pdf`, `wfm01-01-msc-202010113.pdf`).
 */
export function parsePearsonFilename(filename: string): ParsedFilename | null {
    const name = filename.trim();
    const strict = STRICT_RE.exec(name);
    if (strict) {
        const type = TYPE_CODES[strict[3].toLowerCase()];
        if (!type) return null;
        return {
            unitCode: strict[1].toUpperCase(),
            paperCode: strict[2].toLowerCase(),
            type,
            publishedAt: parseCompactDate(strict[4]),
            updated: false,
            unused: false,
        };
    }
    const m = LENIENT_RE.exec(name);
    if (!m) return null;
    const rest = m[3].toLowerCase();
    const token = TYPE_TOKEN_RE.exec(rest)?.[1];
    const date = /(?:^|[-_])(\d{8})(?=[-_.]|$)/.exec(rest)?.[1];
    return {
        unitCode: m[1].toUpperCase(),
        paperCode: m[2].toLowerCase(),
        type: token ? (TYPE_CODES[token] ?? null) : null,
        publishedAt: date ? parseCompactDate(date) : null,
        updated: /updated/.test(rest),
        unused: /unused/.test(rest),
    };
}

/** "20250110" → 2025-01-10 (UTC). Invalid dates → null. */
export function parseCompactDate(s: string): Date | null {
    if (!/^\d{8}$/.test(s)) return null;
    const y = Number(s.slice(0, 4));
    const mo = Number(s.slice(4, 6));
    const d = Number(s.slice(6, 8));
    const date = new Date(Date.UTC(y, mo - 1, d));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
    return date;
}

const MONTH_SERIES: Record<string, Series> = {
    january: "jan",
    jan: "jan",
    winter: "jan",
    february: "jan",
    may: "jun",
    june: "jun",
    jun: "jun",
    summer: "jun",
    october: "oct",
    oct: "oct",
    november: "oct",
    autumn: "oct",
};

export type Sitting = { year: number; series: Series };

/** "October-2023" (Algolia facet) → { year: 2023, series: "oct" }. */
export function parseSeriesFacet(facet: string): Sitting | null {
    const m = /^([A-Za-z]+)-(\d{4})$/.exec(facet.trim());
    if (!m) return null;
    const series = MONTH_SERIES[m[1].toLowerCase()];
    return series ? { year: Number(m[2]), series } : null;
}

/**
 * Finds a sitting in free text: a listing title ("Mark scheme - Unit 1 (WMA11) - October 2022") or cover-page text
 * ("Monday 8 January 2024", "Summer 2023", "October 2023"). Takes the first month-or-season + year pair.
 */
export function findSittingInText(text: string): Sitting | null {
    const re = /\b(january|february|may|june|october|november|winter|summer|autumn)(?:\s*\/\s*june)?\s+(20\d{2})\b/i;
    const m = re.exec(text);
    if (!m) return null;
    const series = MONTH_SERIES[m[1].toLowerCase()];
    return series ? { year: Number(m[2]), series } : null;
}

/** Algolia "Document-Type" facet value → DocType; modified papers, specs, etc. → null. */
export function docTypeFromFacet(facet: string): DocType | null {
    const v = facet.toLowerCase();
    if (v === "question-paper") return "QP";
    if (v === "mark-scheme") return "MS";
    if (v === "examiner-report" || v === "examiner-reports") return "ER";
    return null;
}

export function seriesLabel(s: Sitting) {
    return `${SERIES_LABEL[s.series]} ${s.year}`;
}

/** Sort key: newest sitting first when sorted descending. */
export function sittingOrdinal(s: Sitting) {
    return s.year * 100 + SERIES_END_MONTH[s.series];
}

/** Human paper label: "01" → "Paper 1", "01a" → "Paper 1A", "01r" → "Paper 1R". */
export function paperLabel(paperCode: string) {
    const m = /^0*(\d+)([a-z]?)$/i.exec(paperCode);
    return m ? `Paper ${m[1]}${m[2].toUpperCase()}` : `Paper ${paperCode}`;
}

/**
 * Fallback for free-form filenames ("Mark-scheme-Paper-C12-(WMA01)-June-2014.pdf"): reads the unit code and paper
 * variant from the listing title ("Question paper - Unit 1A ( WMA11) - June 2025").
 */
export function parseListingTitle(title: string): { unitCode: string; paperCode: string } | null {
    const unit = /\(\s*(W[A-Z]{2}\d{2})\s*\)/i.exec(title)?.[1];
    if (!unit) return null;
    const variant = /\b(?:unit|paper)\s+\d+([AR])\b/i.exec(title)?.[1];
    return { unitCode: unit.toUpperCase(), paperCode: `01${variant ? variant.toLowerCase() : ""}` };
}
