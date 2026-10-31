import katex from "katex";
import { describe, expect, it } from "vitest";
import { checkQuestion, importItemSchema } from "@/app/(app)/admin/validation";
import { flashcards, questions, subjects } from "./index";

// Guards the seed content: every question and flashcard points at a real topic, keys are unique, and questions
// pass the same rules the admin editor enforces.

const topicKeys = new Set(subjects.flatMap((s) => s.units.flatMap((u) => u.topics.map((t) => `${u.code}/${t.slug}`))));
const physicsUnits = new Set(subjects.find((s) => s.slug === "physics")!.units.map((u) => u.code));

/** Every $…$ / $$…$$ span (ignoring escaped \$) must parse in KaTeX, as the Markdown renderer would. */
function mathErrors(key: string, text: string) {
    const errors: string[] = [];
    const src = text.replace(/\\\$/g, "");
    for (const m of src.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
        try {
            katex.renderToString(m[1] ?? m[2], { throwOnError: true, displayMode: Boolean(m[1]) });
        } catch (e) {
            errors.push(`${key}: ${(e as Error).message.slice(0, 120)}`);
        }
    }
    return errors;
}

describe("seed questions", () => {
    it("have unique seed keys", () => {
        const keys = questions.map((q) => q.seedKey);
        const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
        expect(dupes).toEqual([]);
    });

    it("reference topics that exist", () => {
        const missing = questions.filter((q) => !topicKeys.has(`${q.unitCode}/${q.topicSlug}`)).map((q) => q.seedKey);
        expect(missing).toEqual([]);
    });

    it("pass the admin validation rules without errors", () => {
        const failures: string[] = [];
        for (const q of questions) {
            const parsed = importItemSchema.safeParse({ ...q, options: q.options ?? [] });
            if (!parsed.success) {
                failures.push(`${q.seedKey}: ${parsed.error.issues.map((i) => i.message).join("; ")}`);
                continue;
            }
            const { errors } = checkQuestion(parsed.data);
            if (errors.length) failures.push(`${q.seedKey}: ${errors.join("; ")}`);
        }
        expect(failures).toEqual([]);
    });

    it("keep every non-Physics question as a draft for admin review", () => {
        const published = questions.filter((q) => !physicsUnits.has(q.unitCode) && q.status !== "DRAFT");
        expect(published.map((q) => q.seedKey)).toEqual([]);
    });

    it("give every draft-bank topic at least one MCQ and one written question", () => {
        const thin: string[] = [];
        // Physics is the older hand-written bank and is checked by hand (WPH16 core practicals is written-only).
        for (const s of subjects.filter((x) => !x.isLocal && x.slug !== "physics"))
            for (const u of s.units)
                for (const t of u.topics) {
                    const qs = questions.filter((q) => q.unitCode === u.code && q.topicSlug === t.slug);
                    if (!qs.some((q) => q.type === "MCQ") || !qs.some((q) => q.type !== "MCQ")) thin.push(`${u.code}/${t.slug}`);
                }
        expect(thin).toEqual([]);
    });

    it("spread MCQ answers across A–D so guessing a letter doesn't pay", () => {
        const skewed: string[] = [];
        for (const s of subjects.filter((x) => !x.isLocal && x.slug !== "physics")) {
            const units = new Set(s.units.map((u) => u.code));
            const mcqs = questions.filter((q) => units.has(q.unitCode) && q.type === "MCQ");
            for (const label of ["A", "B", "C", "D"]) {
                const share = mcqs.filter((q) => q.options?.find((o) => o.isCorrect)?.label === label).length / mcqs.length;
                if (share < 0.15 || share > 0.35) skewed.push(`${s.slug} ${label}: ${Math.round(share * 100)}%`);
            }
        }
        expect(skewed).toEqual([]);
    });

    it("only contain maths that KaTeX can render", () => {
        const errors = questions.flatMap((q) =>
            [q.stem, q.markScheme, q.explanation ?? "", ...(q.options ?? []).map((o) => o.text)].flatMap((t) => mathErrors(q.seedKey, t)),
        );
        expect(errors).toEqual([]);
    });
});

describe("seed flashcards", () => {
    it("have unique seed keys", () => {
        const keys = flashcards.map((c) => c.seedKey);
        const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
        expect(dupes).toEqual([]);
    });

    it("reference topics that exist and have both sides", () => {
        const bad = flashcards
            .filter((c) => !topicKeys.has(`${c.unitCode}/${c.topicSlug}`) || !c.front.trim() || !c.back.trim())
            .map((c) => c.seedKey);
        expect(bad).toEqual([]);
    });

    it("only contain maths that KaTeX can render", () => {
        expect(flashcards.flatMap((c) => [...mathErrors(c.seedKey, c.front), ...mathErrors(c.seedKey, c.back)])).toEqual([]);
    });

    it("stay short enough to read at a glance", () => {
        const long = flashcards.filter((c) => c.front.length > 300 || c.back.length > 600).map((c) => c.seedKey);
        expect(long).toEqual([]);
    });
});
