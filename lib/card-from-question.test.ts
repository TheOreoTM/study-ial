import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { CARD_BACK_MAX, CARD_FRONT_MAX, cardFromQuestion, clipMarkdown } from "./card-from-question";

describe("clipMarkdown", () => {
    it("leaves short text alone", () => {
        expect(clipMarkdown("  Hello  ", 10)).toBe("Hello");
    });
    it("cuts at a word break and adds an ellipsis", () => {
        const out = clipMarkdown("one two three four five", 12);
        expect(out).toBe("one two…");
        expect(out.length).toBeLessThanOrEqual(12);
    });
    it("never leaves a formula open", () => {
        const out = clipMarkdown("Use the formula $v^2 = u^2 + 2as$ to find the speed", 30);
        expect((out.match(/\$/g) ?? []).length % 2).toBe(0);
        expect(out).toBe("Use the formula…");
    });
    it("never leaves display maths open either", () => {
        const stem = "Solve the simultaneous equations\n\n$$x + 2y = 5$$\n$$x^2 + y^2 = 10$$";
        for (const max of [40, 45, 60, 70]) {
            const out = clipMarkdown(stem, max);
            expect((out.match(/\$\$/g) ?? []).length % 2, `max ${max}: ${out}`).toBe(0);
            expect(out.replace(/\$\$[\s\S]*?\$\$/g, "").includes("$"), `max ${max}: ${out}`).toBe(false);
        }
    });
});

describe("cardFromQuestion", () => {
    it("puts the correct option and explanation on the back of an MCQ", () => {
        const card = cardFromQuestion({
            stem: "Which force pairs with the weight of a book?",
            type: "MCQ",
            options: [
                { label: "A", text: "the normal force", isCorrect: false },
                { label: "C", text: "the pull of the book on the Earth", isCorrect: true },
            ],
            markScheme: "C",
            explanation: "Newton's third law pairs act on different bodies.",
        });
        expect(card.front).toBe("Which force pairs with the weight of a book?");
        expect(card.back).toBe("**C.** the pull of the book on the Earth\n\nNewton's third law pairs act on different bodies.");
    });
    it("lists mark-scheme points for a written question", () => {
        const card = cardFromQuestion({
            stem: "Define stress.",
            type: "SHORT",
            options: [],
            markScheme: "force per unit area (1)\nunit Pa or N m⁻² (1)",
            explanation: null,
        });
        expect(card.back).toBe("- force per unit area\n- unit Pa or N m⁻²");
    });
    it("fits the card limits", () => {
        const long = "word ".repeat(400);
        const card = cardFromQuestion({ stem: long, type: "LONG", options: [], markScheme: long, explanation: long });
        expect(card.front.length).toBeLessThanOrEqual(CARD_FRONT_MAX);
        expect(card.back.length).toBeLessThanOrEqual(CARD_BACK_MAX);
    });
});
