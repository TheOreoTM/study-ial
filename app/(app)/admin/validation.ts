// Pure validation for admin question editing and JSON import. No DB / server imports, so it is
// shared by server actions, client components (live warnings) and unit tests.
import { z } from "zod";

export const QUESTION_TYPES = ["MCQ", "SHORT", "CALCULATION", "LONG"] as const;
export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
export const SOURCES = ["ORIGINAL", "PAST_PAPER"] as const;
export const STATUSES = ["DRAFT", "PUBLISHED"] as const;
export const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const;

export type QuestionTypeValue = (typeof QUESTION_TYPES)[number];

export const TYPE_LABELS: Record<QuestionTypeValue, string> = {
    MCQ: "Multiple choice",
    SHORT: "Short answer",
    CALCULATION: "Calculation",
    LONG: "Extended (long)",
};

const optionSchema = z.object({
    label: z.enum(OPTION_LABELS),
    text: z.string().trim().min(1, "Option text is required"),
    isCorrect: z.boolean(),
});

/** Fields shared by the editor and the importer (everything except where the question lives). */
const contentShape = {
    type: z.enum(QUESTION_TYPES),
    difficulty: z.enum(DIFFICULTIES).default("MEDIUM"),
    marks: z.number().int("Marks must be a whole number").min(1, "Marks must be at least 1").max(30),
    stem: z.string().trim().min(1, "Stem is required").max(20_000),
    markScheme: z.string().trim().max(20_000).default(""),
    explanation: z
        .string()
        .trim()
        .max(20_000)
        .nullish()
        .transform((v) => v || null),
    source: z.enum(SOURCES).default("ORIGINAL"),
    sourceRef: z
        .string()
        .trim()
        .max(300)
        .nullish()
        .transform((v) => v || null),
    options: z.array(optionSchema).default([]),
};

export type OptionInput = z.infer<typeof optionSchema>;

type ContentLike = {
    type: QuestionTypeValue;
    marks: number;
    markScheme: string;
    options: OptionInput[];
    source: (typeof SOURCES)[number];
    sourceRef: string | null;
};

/** Lines of a mark scheme that are a single marking point, i.e. end with "(1)". */
export function countMarkingPoints(markScheme: string) {
    return markScheme.split("\n").filter((line) => /\(1\)\s*$/.test(line.trim())).length;
}

/** Cross-field rules. Hard errors block saving; warnings are shown but allowed. */
export function checkQuestion(q: ContentLike): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (q.type === "MCQ") {
        if (q.options.length < 2 || q.options.length > 5) errors.push("MCQ needs between 2 and 5 options");
        const correct = q.options.filter((o) => o.isCorrect).length;
        if (correct !== 1) errors.push(`MCQ needs exactly one correct option (found ${correct})`);
        const labels = q.options.map((o) => o.label);
        if (new Set(labels).size !== labels.length) errors.push("Option labels must be unique");
    } else {
        if (q.options.length > 0) errors.push("Only MCQ questions can have options");
        if (!q.markScheme) {
            errors.push("Mark scheme is required");
        } else {
            const points = countMarkingPoints(q.markScheme);
            if (points < q.marks) {
                const msg = `Mark scheme has ${points} marking point${points === 1 ? "" : "s"} ending in "(1)" but the question is worth ${q.marks}`;
                // Extended responses are often levels-marked, so this is only advisory for them.
                if (q.type === "LONG") warnings.push(msg);
                else errors.push(msg);
            } else if (points > q.marks) {
                warnings.push(
                    `Mark scheme has ${points} points for ${q.marks} marks — state "max ${q.marks}" if intended`,
                );
            }
        }
    }
    if (q.source === "PAST_PAPER" && !q.sourceRef) {
        warnings.push('Past-paper questions should have a source reference (e.g. "WPH11 Jan 2024 Q12" or a URL)');
    }
    return { errors, warnings };
}

/** Default MCQ mark scheme when none is written: "**B** (1)". */
export function mcqMarkScheme(options: OptionInput[]) {
    const correct = options.find((o) => o.isCorrect);
    return correct ? `**${correct.label}** (1)` : "";
}

/** Empty A–D options for a fresh MCQ. */
export function blankOptions(): OptionInput[] {
    return OPTION_LABELS.slice(0, 4).map((label) => ({ label, text: "", isCorrect: false }));
}

function refineContent(q: ContentLike, ctx: z.RefinementCtx) {
    for (const message of checkQuestion(q).errors) ctx.addIssue({ code: "custom", message });
}

function finalize<T extends ContentLike>(q: T): T {
    if (q.type !== "MCQ") return { ...q, options: [] };
    const options = [...q.options].sort((a, b) => a.label.localeCompare(b.label));
    return { ...q, options, markScheme: q.markScheme || mcqMarkScheme(options) };
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export const questionInputSchema = z
    .object({
        id: z.string().min(1).optional(),
        topicId: z.string().min(1, "Choose a topic"),
        status: z.enum(STATUSES).default("DRAFT"),
        ...contentShape,
    })
    .superRefine(refineContent)
    .transform(finalize);

export type QuestionInput = z.output<typeof questionInputSchema>;
export type QuestionFormValues = z.input<typeof questionInputSchema>;

// ─── Import (SeedQuestion-compatible) ────────────────────────────────────────

export const importItemSchema = z
    .object({
        seedKey: z
            .string()
            .trim()
            .regex(/^[a-z0-9][a-z0-9-_.]*$/i, "seedKey may only contain letters, digits, - _ .")
            .max(120)
            .nullish()
            .transform((v) => v || null),
        unitCode: z
            .string()
            .trim()
            .min(1, "unitCode is required")
            .transform((v) => v.toUpperCase()),
        topicSlug: z.string().trim().min(1, "topicSlug is required"),
        ...contentShape,
    })
    .superRefine(refineContent)
    .transform(finalize);

export type ImportItem = z.output<typeof importItemSchema>;

export const MAX_IMPORT_ITEMS = 500;

export type ParsedRow =
    | { index: number; ok: true; item: ImportItem; warnings: string[] }
    | { index: number; ok: false; errors: string[]; raw: unknown };

function formatIssues(error: z.ZodError) {
    return error.issues.map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message));
}

/** Parses pasted JSON (an array, or a single object) and validates each item independently. */
export function parseImport(text: string): { ok: true; rows: ParsedRow[] } | { ok: false; error: string } {
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch (e) {
        return { ok: false, error: `Invalid JSON: ${(e as Error).message}` };
    }
    if (data && typeof data === "object" && !Array.isArray(data) && "questions" in data) {
        data = (data as { questions: unknown }).questions;
    }
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) return { ok: false, error: "The array is empty" };
    if (items.length > MAX_IMPORT_ITEMS) {
        return { ok: false, error: `Too many items (${items.length}); import at most ${MAX_IMPORT_ITEMS} at a time` };
    }

    const seen = new Map<string, number>();
    const rows = items.map((raw, index): ParsedRow => {
        const res = importItemSchema.safeParse(raw);
        if (!res.success) return { index, ok: false, errors: formatIssues(res.error), raw };
        const key = res.data.seedKey;
        if (key) {
            if (seen.has(key)) {
                return { index, ok: false, errors: [`Duplicate seedKey (also row ${seen.get(key)! + 1})`], raw };
            }
            seen.set(key, index);
        }
        return { index, ok: true, item: res.data, warnings: checkQuestion(res.data).warnings };
    });
    return { ok: true, rows };
}

export function formatZodError(error: z.ZodError) {
    return formatIssues(error).join("; ");
}
