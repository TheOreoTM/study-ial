import { z } from "zod";

// Answers saved while sitting a mock paper. Shared by the server actions and the sitting UI.

export const answerSchema = z.object({
    optionId: z.string().min(1).max(64).optional(),
    answer: z.string().max(5000, "That answer is too long (5,000 characters max).").optional(),
});

export const answersSchema = z
    .record(z.string().min(1).max(64), answerSchema)
    .refine((r) => Object.keys(r).length <= 80, "Too many answers.");

export type MockAnswer = z.infer<typeof answerSchema>;
export type MockAnswers = Record<string, MockAnswer>;

/** Reads the JSON column defensively: anything malformed becomes "no answer". */
export function readAnswers(json: unknown): MockAnswers {
    const parsed = answersSchema.safeParse(json);
    return parsed.success ? parsed.data : {};
}

/** Only answers to questions on the paper, with blank written answers dropped. */
export function cleanAnswers(answers: MockAnswers, questionIds: string[]): MockAnswers {
    const onPaper = new Set(questionIds);
    const out: MockAnswers = {};
    for (const [id, a] of Object.entries(answers)) {
        if (!onPaper.has(id)) continue;
        const answer = a.answer?.trim() ? a.answer : undefined;
        if (a.optionId || answer) out[id] = { ...(a.optionId ? { optionId: a.optionId } : {}), ...(answer ? { answer } : {}) };
    }
    return out;
}
