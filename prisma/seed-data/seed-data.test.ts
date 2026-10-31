import { describe, expect, it } from "vitest";
import { checkQuestion, importItemSchema } from "@/app/(app)/admin/validation";
import { flashcards, questions, subjects } from "./index";

// Guards the seed content: every question and flashcard points at a real topic, keys are unique, and questions
// pass the same rules the admin editor enforces.

const topicKeys = new Set(subjects.flatMap((s) => s.units.flatMap((u) => u.topics.map((t) => `${u.code}/${t.slug}`))));

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
        const published = questions.filter((q) => !q.seedKey.startsWith("phy-") && q.status !== "DRAFT");
        expect(published.map((q) => q.seedKey)).toEqual([]);
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

    it("stay short enough to read at a glance", () => {
        const long = flashcards.filter((c) => c.front.length > 300 || c.back.length > 600).map((c) => c.seedKey);
        expect(long).toEqual([]);
    });
});
