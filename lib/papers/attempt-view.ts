import { z } from "zod";

export type PointView = { code: string; point: string; awarded: boolean; comment: string };
export type MarkResult = {
    ok: true;
    attemptId: string;
    marksAwarded: number;
    maxMarks: number;
    method: "SELF" | "AI" | "AI_ESTIMATED";
    points: PointView[];
    justification: string;
    feedback: string;
    remaining: number | null;
};
export type SavedExplanation = { markdown: string; ai: boolean };

/** `PaperAttempt.feedback`. Lenient, so one malformed field doesn't lose the rest of a student's result. */
const storedFeedback = z.object({
    points: z
        .array(z.object({ code: z.string(), point: z.string(), awarded: z.boolean(), comment: z.string().catch("") }))
        .catch([]),
    justification: z.string().catch(""),
    feedback: z.string().catch(""),
    explanation: z.object({ markdown: z.string().min(1), ai: z.boolean() }).nullable().catch(null),
});

function readFeedback(raw: unknown) {
    const parsed = storedFeedback.safeParse({
        points: undefined,
        justification: undefined,
        feedback: undefined,
        explanation: null,
        ...(raw && typeof raw === "object" ? raw : {}),
    });
    return parsed.success ? parsed.data : { points: [], justification: "", feedback: "", explanation: null };
}

export function savedExplanation(raw: unknown): SavedExplanation | null {
    return readFeedback(raw).explanation;
}

/** The attempt's feedback with the step-by-step added, keeping the marks and comments already there. */
export function feedbackWithExplanation(raw: unknown, explanation: SavedExplanation) {
    return { ...(raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}), explanation };
}

/** Rebuilds the result panel from a saved attempt. Null for an answer that hasn't been marked yet. */
export function restoreAttempt(attempt: {
    id: string;
    marksAwarded: number | null;
    maxMarks: number;
    method: MarkResult["method"] | null;
    feedback: unknown;
}): { result: MarkResult; explanation: SavedExplanation | null } | null {
    if (attempt.marksAwarded === null || attempt.method === null) return null;
    const { points, justification, feedback, explanation } = readFeedback(attempt.feedback);
    return {
        result: {
            ok: true,
            attemptId: attempt.id,
            marksAwarded: attempt.marksAwarded,
            maxMarks: attempt.maxMarks,
            method: attempt.method,
            points,
            justification,
            feedback,
            // Today's allowance is only worth showing straight after marking
            remaining: null,
        },
        explanation,
    };
}
