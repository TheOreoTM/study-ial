// Original question generation for the public bank. Pure parts (prompts, similarity guard, answer comparison) are
// unit-tested; model calls are admin-only and quota-limited. Every generated question is a DRAFT until an admin
// publishes it, and a second, independent model call solves it to catch wrong answers before review.
import { generateText, Output } from "ai";
import { z } from "zod";
import { consumeAiQuota, fastModelId, modelById, refundAiQuota, smartModelId } from "@/lib/ai";
import { logAiCall } from "@/lib/ai-log";

export const generatedQuestionSchema = z.object({
    questions: z.array(
        z.object({
            type: z.enum(["MCQ", "SHORT", "CALCULATION", "LONG"]),
            difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
            marks: z.number().int().min(1).max(12),
            stem: z.string().describe("Markdown with $LaTeX$ (and \\ce{} for chemistry). Self-contained: no diagrams needed"),
            options: z
                .array(z.object({ label: z.enum(["A", "B", "C", "D"]), text: z.string(), isCorrect: z.boolean() }))
                .describe("Exactly four options for MCQ, one correct; empty otherwise"),
            markScheme: z.string().describe('One marking point per line, each ending in its marks, e.g. "Uses v² = u² + 2as (1)"'),
            workedSolution: z.string().describe("Step-by-step worked solution in Markdown"),
            finalAnswer: z.string().describe("The final answer only, e.g. \"12.4 m s^-1\" or \"B\""),
        }),
    ),
});

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>["questions"][number];

export type GenerationTopic = {
    subject: string;
    unitCode: string;
    unitName: string;
    topicCode: string;
    topicName: string;
    specPoints: string[];
    /** A few of the bank's existing questions, to match house style (not to copy) */
    styleExamples: string[];
};

export const GENERATION_INSTRUCTIONS = `You write ORIGINAL exam-style practice questions for Pearson Edexcel International A Level students.

- Write new questions in the style and level of IAL papers for the given specification topic. They must not be copies or paraphrases of real Pearson past-paper questions: invent your own contexts, numbers and wording.
- Each question is self-contained text: no diagrams, graphs or images are available. Describe set-ups in words.
- Mark schemes: one marking point per line, each ending in "(n)" with its marks; marks must add up to the question's marks. Use M1/A1/B1 style wording for maths where natural.
- Give a correct, complete worked solution and the final answer on its own.
- Use Markdown with $LaTeX$ for maths (only $…$ and $$…$$) and $\\ce{…}$ for chemistry. Use SI units. Never use HTML.
- Physical constants: g = 9.81 m s^-2 unless the unit uses 9.8. Give answers to sensible significant figures.`;

export function buildGenerationPrompt(t: GenerationTopic, opts: { count: number; difficulty: "EASY" | "MEDIUM" | "HARD" | "MIXED"; types: string[] }) {
    return [
        `<course>${t.subject} · ${t.unitCode} ${t.unitName} · topic ${t.topicCode} ${t.topicName}</course>`,
        `<specification_points>\n${t.specPoints.slice(0, 25).map((p, i) => `${i + 1}. ${p.slice(0, 400)}`).join("\n")}\n</specification_points>`,
        t.styleExamples.length
            ? `<house_style_examples>\n${t.styleExamples.slice(0, 3).map((e) => e.slice(0, 800)).join("\n---\n")}\n</house_style_examples>`
            : "",
        `Write ${opts.count} new question${opts.count === 1 ? "" : "s"}. Difficulty: ${opts.difficulty === "MIXED" ? "a mix of EASY, MEDIUM and HARD" : opts.difficulty}. Types allowed: ${opts.types.join(", ")}. Cover different specification points where possible.`,
    ]
        .filter(Boolean)
        .join("\n\n");
}

// ─── Copyright guard: too close to a real past-paper question? ──────────────────

const words = (s: string) =>
    s
        .toLowerCase()
        .replace(/\$[^$]*\$/g, " ")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2);

function shingles(s: string, n = 3) {
    const w = words(s);
    const out = new Set<string>();
    for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
    return out;
}

/** Jaccard similarity of word trigrams (0–1). Above ~0.35 a question is likely a paraphrase. */
export function textSimilarity(a: string, b: string) {
    const x = shingles(a);
    const y = shingles(b);
    if (!x.size || !y.size) return 0;
    let inter = 0;
    for (const s of x) if (y.has(s)) inter++;
    return inter / (x.size + y.size - inter);
}

export const PARAPHRASE_THRESHOLD = 0.35;

export function closestPastPaper(stem: string, pastStems: { id: string; stem: string; label: string }[]) {
    let best: { id: string; label: string; score: number } | null = null;
    for (const p of pastStems) {
        const score = textSimilarity(stem, p.stem);
        if (!best || score > best.score) best = { id: p.id, label: p.label, score };
    }
    return best;
}

// ─── Self-check: an independent solve ───────────────────────────────────────────

export const solveSchema = z.object({
    working: z.string(),
    finalAnswer: z.string(),
    problems: z.string().describe("Anything ambiguous, impossible or missing in the question; empty if none"),
});

export const SOLVER_INSTRUCTIONS = `You are checking a new exam question. Solve it yourself, carefully and independently, as a top IAL student would. Give your working and final answer. Report any ambiguity, missing data or error in the question. Use $LaTeX$ for maths.`;

/** Pulls the numbers out of an answer ("1.2 × 10^{-3} m", "x = 4 or x = -2"), ignoring unit powers (m s^-1, m s-1). */
export function answerNumbers(s: string) {
    const cleaned = s
        .replace(/,(?=\d{3})/g, "")
        .replace(/\s*[×x]\s*10\s*\^\s*\{?\s*(-?\d+)\s*\}?/g, "e$1")
        .replace(/\^\s*\{?\s*-?\d+\s*\}?/g, "")
        .replace(/(\s[A-Za-z]{1,3})-\d\b/g, "$1");
    const out: number[] = [];
    for (const m of cleaned.matchAll(/-?\d+(?:\.\d+)?(?:e-?\d+)?/g)) {
        const n = Number.parseFloat(m[0]);
        if (Number.isFinite(n)) out.push(n);
    }
    return out;
}

/**
 * Do two final answers agree? Numbers must match to 2% (rounding to 3 s.f. differs by less); MCQ letters must match;
 * otherwise falls back to normalised text. Returns null when it can't tell (the reviewer decides).
 */
export function answersAgree(expected: string, got: string): boolean | null {
    const letter = (s: string) => /^\s*\(?([ABCD])\)?\s*$/i.exec(s)?.[1]?.toUpperCase() ?? null;
    if (letter(expected) && letter(got)) return letter(expected) === letter(got);
    const a = answerNumbers(expected);
    const b = answerNumbers(got);
    if (a.length && b.length) {
        return a.every((x) => b.some((y) => Math.abs(x - y) <= Math.max(1e-9, 0.02 * Math.max(Math.abs(x), Math.abs(y)))));
    }
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (norm(expected) && norm(got)) return norm(expected) === norm(got) ? true : null;
    return null;
}

export type SelfCheck = { status: "agree" | "disagree" | "unclear"; solverAnswer: string; notes: string };

export async function generateQuestions(userId: string, topic: GenerationTopic, opts: { count: number; difficulty: "EASY" | "MEDIUM" | "HARD" | "MIXED"; types: string[] }) {
    await consumeAiQuota(userId, "generate");
    const model = smartModelId();
    try {
        const res = await generateText({
            model: modelById(model),
            instructions: GENERATION_INSTRUCTIONS,
            prompt: buildGenerationPrompt(topic, opts),
            output: Output.object({ schema: generatedQuestionSchema }),
            temperature: 0.8,
            maxRetries: 1,
            abortSignal: AbortSignal.timeout(120_000),
        });
        await logAiCall({ userId, feature: "generate", model, usage: res.usage, ok: true });
        return { model, questions: res.output.questions.slice(0, opts.count) };
    } catch (err) {
        await refundAiQuota(userId, "generate");
        await logAiCall({ userId, feature: "generate", model, usage: undefined, ok: false });
        throw err;
    }
}

/** Second, independent model call: solves the question without seeing the answer, then compares. */
export async function selfCheckQuestion(userId: string, q: GeneratedQuestion): Promise<SelfCheck> {
    const model = fastModelId();
    try {
        const stem = q.type === "MCQ" ? `${q.stem}\n\n${q.options.map((o) => `${o.label}. ${o.text}`).join("\n")}\n\nAnswer with the letter.` : q.stem;
        const res = await generateText({
            model: modelById(model),
            instructions: SOLVER_INSTRUCTIONS,
            prompt: `<question marks="${q.marks}">\n${stem}\n</question>`,
            output: Output.object({ schema: solveSchema }),
            temperature: 0,
            maxRetries: 1,
            abortSignal: AbortSignal.timeout(90_000),
        });
        await logAiCall({ userId, feature: "generate", model, usage: res.usage, ok: true });
        const agree = answersAgree(q.finalAnswer, res.output.finalAnswer);
        return {
            status: res.output.problems.trim() ? "unclear" : agree === true ? "agree" : agree === false ? "disagree" : "unclear",
            solverAnswer: res.output.finalAnswer.slice(0, 500),
            notes: res.output.problems.slice(0, 1000),
        };
    } catch (err) {
        await logAiCall({ userId, feature: "generate", model, usage: undefined, ok: false });
        return { status: "unclear", solverAnswer: "", notes: `Self-check failed: ${(err as Error).message.slice(0, 200)}` };
    }
}
