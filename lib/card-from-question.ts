// Turns a question the student got wrong into one of their own flashcards. Pure (unit-tested).

import { parseMarkScheme } from "@/lib/marking";

export const CARD_FRONT_MAX = 300;
export const CARD_BACK_MAX = 600;

/**
 * Shortens Markdown to at most `max` characters at a word break, without cutting through a $…$ or $$…$$ formula
 * (which would leave an unclosed delimiter and break the rendering): a cut inside one moves to before it opens.
 */
export function clipMarkdown(text: string, max: number): string {
    const t = text.trim();
    if (t.length <= max) return t;
    let cut = t.lastIndexOf(" ", max - 1);
    if (cut <= 0) cut = max - 1;
    for (const m of t.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]*?\$/g)) {
        const start = m.index;
        const end = start + m[0].length;
        if (start < cut && cut < end) {
            cut = start;
            break;
        }
    }
    return `${t.slice(0, cut).trimEnd()}…`;
}

export type QuestionForCard = {
    stem: string;
    type: "MCQ" | "SHORT" | "CALCULATION" | "LONG";
    options: { label: string; text: string; isCorrect: boolean }[];
    markScheme: string;
    explanation: string | null;
};

export function cardFromQuestion(q: QuestionForCard): { front: string; back: string } {
    const front = clipMarkdown(q.stem, CARD_FRONT_MAX);
    let answer: string;
    if (q.type === "MCQ") {
        const right = q.options.find((o) => o.isCorrect);
        answer = right ? `**${right.label}.** ${right.text}` : "";
    } else {
        answer = parseMarkScheme(q.markScheme)
            .points.map((p) => `- ${p.text}`)
            .join("\n");
    }
    const parts = [answer, q.explanation?.trim()].filter((p): p is string => !!p);
    return { front, back: clipMarkdown(parts.join("\n\n") || "See the mark scheme.", CARD_BACK_MAX) };
}
