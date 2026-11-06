// Past-paper configuration: which subjects may be indexed, where their materials are listed, and how files are served.
// Only subjects without third-party copyright extracts are allowed (no English, Economics, Business, …).

export type ServeMode = "storage" | "source";

export type PaperSubjectConfig = {
    /** Matches Subject.slug in the curriculum */
    slug: string;
    name: string;
    /** Pearson Algolia specification codes to discover from (2018 spec first, then the 2013 legacy spec) */
    pearsonSpecCodes: { code: string; spec: string }[];
    /** Public course-materials page that embeds the Algolia credentials */
    pearsonListingPage: string;
    /** IAL unit-code prefixes that belong to this subject (filters out UK A Level papers in shared listings) */
    unitPrefixes: string[];
    /** Where signed-in users get the file from: our private copy, or a redirect to the original source URL */
    serve: ServeMode;
    enabled: boolean;
};

const IAL = "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels";

export const PAPER_SUBJECTS: PaperSubjectConfig[] = [
    {
        slug: "mathematics",
        name: "Mathematics",
        pearsonSpecCodes: [
            { code: "ial18-mathematics", spec: "2018" },
            { code: "ial-maths", spec: "2013" },
        ],
        pearsonListingPage: `${IAL}/mathematics-2018.coursematerials.html`,
        // Pure (WMA), Mechanics (WME), Statistics (WST) and Decision (WDM) units
        unitPrefixes: ["WMA", "WME", "WST", "WDM"],
        serve: "storage",
        enabled: true,
    },
    {
        slug: "further-mathematics",
        name: "Further Mathematics",
        pearsonSpecCodes: [
            { code: "ial18-mathematics", spec: "2018" },
            { code: "ial-maths", spec: "2013" },
        ],
        pearsonListingPage: `${IAL}/mathematics-2018.coursematerials.html`,
        unitPrefixes: ["WFM"],
        serve: "storage",
        enabled: true,
    },
    {
        slug: "physics",
        name: "Physics",
        pearsonSpecCodes: [
            { code: "ial18-physics", spec: "2018" },
            { code: "ial-physics", spec: "2013" },
        ],
        pearsonListingPage: `${IAL}/physics-2018.coursematerials.html`,
        unitPrefixes: ["WPH"],
        serve: "storage",
        enabled: true,
    },
    {
        slug: "chemistry",
        name: "Chemistry",
        pearsonSpecCodes: [
            { code: "ial18-chemistry", spec: "2018" },
            { code: "ial-chemistry", spec: "2013" },
        ],
        pearsonListingPage: `${IAL}/chemistry-2018.coursematerials.html`,
        unitPrefixes: ["WCH"],
        serve: "storage",
        enabled: true,
    },
    {
        slug: "biology",
        name: "Biology",
        pearsonSpecCodes: [
            { code: "ial18-biology", spec: "2018" },
            { code: "ial-biology", spec: "2013" },
        ],
        pearsonListingPage: `${IAL}/biology-2018.coursematerials.html`,
        unitPrefixes: ["WBI"],
        serve: "storage",
        enabled: true,
    },
];

export const enabledPaperSubjects = () => PAPER_SUBJECTS.filter((s) => s.enabled);

export function paperSubjectBySlug(slug: string) {
    return PAPER_SUBJECTS.find((s) => s.slug === slug && s.enabled) ?? null;
}

/** The allowlisted subject a unit code belongs to (WFM01 → further-mathematics), or null. */
export function paperSubjectForUnit(unitCode: string) {
    const code = unitCode.toUpperCase();
    return enabledPaperSubjects().find((s) => s.unitPrefixes.some((p) => code.startsWith(p))) ?? null;
}

/** Months after a sitting during which Pearson keeps papers behind a centre login. Never index inside this window. */
export function restrictedMonths() {
    const n = Number.parseInt(process.env.PAPERS_RESTRICTED_MONTHS ?? "", 10);
    return Number.isFinite(n) && n >= 12 ? n : 12;
}

/** Generic, descriptive User-Agent for every request the indexer makes. No personal details. */
export const INDEXER_USER_AGENT = "StudyIAL-PaperIndexer/1.0 (+https://study.oreotm.xyz/takedown)";

/** Minimum gap between two requests to the same host. */
export const MIN_REQUEST_GAP_MS = 2000;

export const TAKEDOWN_EMAIL = process.env.NEXT_PUBLIC_TAKEDOWN_EMAIL || "takedown@oreotm.xyz";

/** Names for 2013-spec units that aren't in the curriculum (the 2018 spec renamed or merged them). */
export const LEGACY_UNIT_NAMES: Record<string, string> = {
    WMA01: "Core Mathematics C12",
    WMA02: "Core Mathematics C34",
    WDM01: "Decision Mathematics D1",
    WPH01: "Physics on the Go",
    WPH02: "Physics at Work",
    WPH03: "Exploring Physics",
    WPH04: "Physics on the Move",
    WPH05: "Physics from Creation to Collapse",
    WPH06: "Experimental Physics",
    WCH01: "The Core Principles of Chemistry",
    WCH02: "Application of Core Principles of Chemistry",
    WCH03: "Chemistry Laboratory Skills I",
    WCH04: "General Principles of Chemistry I",
    WCH05: "General Principles of Chemistry II",
    WCH06: "Chemistry Laboratory Skills II",
    WBI01: "Lifestyle, Transport, Genes and Health",
    WBI02: "Development, Plants and the Environment",
    WBI03: "Practical Biology and Research Skills I",
    WBI04: "The Natural Environment and Species Survival",
    WBI05: "Energy, Exercise and Co-ordination",
    WBI06: "Practical Biology and Investigative Skills",
};

export const unitDisplayName = (code: string, curriculumName?: string | null) =>
    curriculumName ?? LEGACY_UNIT_NAMES[code.toUpperCase()] ?? "Legacy specification unit";
