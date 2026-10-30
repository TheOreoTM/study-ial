// Shapes for seed content. Seeding is idempotent: rows are upserted by their natural keys
// (subject.slug, unit.code, topic [unitCode, slug], question seedKey).

export type SeedTopic = {
    slug: string; // unique within its unit, kebab-case
    code: string; // "1.2" — order within the unit's spec
    name: string;
    summary?: string;
    specPoints?: string[];
};

export type SeedUnit = {
    code: string; // Pearson paper code, e.g. "WPH11"
    number: number;
    name: string;
    description?: string;
    topics: SeedTopic[];
};

export type SeedSubject = {
    slug: string;
    code: string; // qualification code
    name: string;
    description: string;
    color: "teal" | "blue" | "violet" | "amber" | "rose" | "emerald" | "orange" | "slate";
    isLocal?: boolean;
    units: SeedUnit[];
};

export type SeedQuestion = {
    seedKey: string; // stable unique id, e.g. "phy-u1-motion-001"
    unitCode: string;
    topicSlug: string;
    type: "MCQ" | "SHORT" | "CALCULATION" | "LONG";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    marks: number;
    stem: string; // markdown + $LaTeX$
    markScheme: string; // markdown, one marking point per line, each ending with "(1)"
    explanation?: string;
    options?: { label: "A" | "B" | "C" | "D"; text: string; isCorrect: boolean }[]; // MCQ only, exactly one correct
};
