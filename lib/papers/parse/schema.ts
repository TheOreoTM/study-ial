// The structured form every parse engine produces, validated with zod. Matches the brief's shape
// ({ paper: {board, unit, series, paperType}, questions: [{ number, parent, stem, marks, latex, figures, dependsOn }] })
// plus where each part sits on the page, so the real paper can always be shown next to the extracted text.
import { z } from "zod";

/** [x0, y0, x1, y1] as fractions of the page, origin top-left. */
export const bboxSchema = z.tuple([z.number().min(0).max(1), z.number().min(0).max(1), z.number().min(0).max(1), z.number().min(0).max(1)]);
export const regionSchema = z.object({ page: z.number().int().min(1), bbox: bboxSchema });

export const NUMBER_RE = /^\d{1,2}(?:\([a-z]{1,4}\)){0,3}$/;

export const parsedQuestionSchema = z.object({
    number: z.string().regex(NUMBER_RE, "Question numbers look like 3, 3(b) or 3(b)(ii)"),
    parent: z.string().regex(NUMBER_RE).nullable(),
    /** Markdown; maths as $LaTeX$ when `latex` is true, chemistry with \ce{} */
    stem: z.string().max(8000),
    /** Marks for this node alone (a question header whose marks are all in its parts has 0) */
    marks: z.number().int().min(0).max(100),
    latex: z.boolean(),
    figures: z.array(regionSchema).max(12),
    dependsOn: z.array(z.string().regex(NUMBER_RE)).max(8),
    regions: z.array(regionSchema).max(8).default([]),
});

export const parsedPaperSchema = z.object({
    paper: z.object({
        board: z.string().max(60),
        unit: z.string().max(20).nullable(),
        series: z.string().max(40).nullable(),
        paperType: z.enum(["QP", "MS", "ER"]),
    }),
    questions: z.array(parsedQuestionSchema).max(300),
    /** Totals printed on the paper, used for validation */
    totals: z
        .object({ paper: z.number().int().nullable(), questions: z.record(z.string(), z.number().int()) })
        .default({ paper: null, questions: {} }),
});

export type Region = z.infer<typeof regionSchema>;
export type ParsedQuestion = z.infer<typeof parsedQuestionSchema>;
export type ParsedPaper = z.infer<typeof parsedPaperSchema>;

// ─── Mark schemes ────────────────────────────────────────────────────────────

export const markPointSchema = z.object({
    /** Mark code as printed: M1, A1, B1, dM1, A1ft, A1*, or "1" for science "(1)" marks */
    code: z.string().max(20),
    marks: z.number().int().min(0).max(20),
    text: z.string().max(2000).default(""),
});

export const markSchemeEntrySchema = z.object({
    number: z.string().regex(NUMBER_RE),
    points: z.array(markPointSchema).max(60),
    /** Marks printed for this entry, e.g. "(3)" for a part, when present */
    marks: z.number().int().min(0).max(100).nullable(),
    /** Scheme text (best effort; maths may be garbled in the text layer) */
    text: z.string().max(8000).default(""),
    regions: z.array(regionSchema).max(8).default([]),
});

export const parsedMarkSchemeSchema = z.object({
    entries: z.array(markSchemeEntrySchema).max(300),
    /** Examiner guidance per question number ("Note", "M1: …"), shown with the scheme */
    notes: z.record(z.string(), z.object({ text: z.string().max(12000), regions: z.array(regionSchema).max(12) })).default({}),
    totals: z
        .object({ paper: z.number().int().nullable(), questions: z.record(z.string(), z.number().int()) })
        .default({ paper: null, questions: {} }),
});

export type MarkPoint = z.infer<typeof markPointSchema>;
export type MarkSchemeEntry = z.infer<typeof markSchemeEntrySchema>;
export type ParsedMarkScheme = z.infer<typeof parsedMarkSchemeSchema>;
