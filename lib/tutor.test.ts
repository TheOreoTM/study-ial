import { beforeEach, describe, expect, it, vi } from "vitest";

const { consumeAiQuota, refundAiQuota, generateText } = vi.hoisted(() => ({
    consumeAiQuota: vi.fn(),
    refundAiQuota: vi.fn(),
    generateText: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/ai", () => ({ consumeAiQuota, refundAiQuota, fastModel: () => "fast-model" }));
vi.mock("ai", async (importOriginal) => ({ ...(await importOriginal<typeof import("ai")>()), generateText }));

import {
    buildQuestionPrompt,
    buildTopicPrompt,
    explainWithAi,
    normaliseExplanation,
    questionFallback,
    topicFallback,
    type QuestionContext,
    type TopicContext,
} from "@/lib/tutor";

const topic: TopicContext = {
    subject: "Physics",
    unitCode: "WPH11",
    unitName: "Mechanics and Materials",
    topicCode: "1.1",
    topicName: "Motion and kinematics",
    summary: "Uniformly accelerated motion and projectiles.",
    specPoints: ["Use the suvat equations", "Interpret motion graphs"],
    point: 1,
    examples: [{ stem: "What does the gradient of a v–t graph show?", markScheme: "- **B** (1)" }],
};

const question: QuestionContext = {
    subject: "Physics",
    unitCode: "WPH11",
    topicName: "Motion and kinematics",
    stem: "Which quantity is the gradient of a velocity–time graph?",
    marks: 1,
    options: [
        { label: "A", text: "displacement", isCorrect: false },
        { label: "B", text: "acceleration", isCorrect: true },
    ],
    markScheme: "- **B** (1)",
    explanation: "Gradient is Δv/Δt.",
};

describe("buildTopicPrompt", () => {
    it("grounds the prompt in the course, spec points and practice questions, focused on the chosen point", () => {
        const p = buildTopicPrompt(topic);
        expect(p).toContain("WPH11 Mechanics and Materials");
        expect(p).toContain("1. Use the suvat equations");
        expect(p).toContain("2. Interpret motion graphs");
        expect(p).toContain("What does the gradient of a v–t graph show?");
        expect(p).toContain('Explain specification point 2 ("Interpret motion graphs")');
    });

    it("asks for an overview when the whole topic is chosen or the point is out of range", () => {
        expect(buildTopicPrompt({ ...topic, point: -1 })).toContain("overview of this topic");
        expect(buildTopicPrompt({ ...topic, point: 9 })).toContain("overview of this topic");
    });

    it("caps very long content", () => {
        const p = buildTopicPrompt({ ...topic, summary: "x".repeat(10_000), specPoints: Array(60).fill("point") });
        expect(p.length).toBeLessThan(8_000);
        expect(p).not.toContain("26. point");
    });

    it("never contains student fields", () => {
        // The context types carry no user data; this guards against someone adding it to the prompt later.
        const p = buildTopicPrompt(topic) + buildQuestionPrompt(question);
        expect(p).not.toMatch(/@|userId|email|student name/i);
    });
});

describe("buildQuestionPrompt", () => {
    it("includes the options with the correct one marked, the mark scheme and the explanation", () => {
        const p = buildQuestionPrompt(question);
        expect(p).toContain("B. acceleration (correct)");
        expect(p).toContain("<mark_scheme>");
        expect(p).toContain("Gradient is Δv/Δt.");
        expect(p).toContain("why each other option is wrong");
    });

    it("asks a written question to follow the mark scheme", () => {
        expect(buildQuestionPrompt({ ...question, options: [] })).toContain("following the mark scheme");
    });
});

describe("fallbacks", () => {
    it("builds a topic fallback from the spec point, summary and worked explanations", () => {
        const md = topicFallback(topic, [
            { stem: "Q1", explanation: "Because…" },
            { stem: "Q2", explanation: null },
        ]);
        expect(md).toContain("**Specification point 2:** Interpret motion graphs");
        expect(md).toContain("Uniformly accelerated motion");
        expect(md).toContain("Worked explanations from the question bank");
        expect(md).toContain("Because…");
        expect(md).not.toContain("Q2");
    });

    it("says so when there's nothing worked yet", () => {
        expect(topicFallback({ ...topic, point: -1 }, [])).toContain("no worked explanations");
    });

    it("builds a question fallback from the explanation and mark scheme", () => {
        expect(questionFallback(question)).toBe(
            "### Explanation\n\nGradient is Δv/Δt.\n\n### Mark scheme\n\n- **B** (1)",
        );
        expect(questionFallback({ ...question, explanation: null })).toBe("### Mark scheme\n\n- **B** (1)");
    });
});

describe("normaliseExplanation", () => {
    it("trims and caps", () => {
        expect(normaliseExplanation("  hi \n")).toBe("hi");
        expect(normaliseExplanation("a".repeat(7000))).toHaveLength(6001);
    });
});

describe("explainWithAi", () => {
    beforeEach(() => vi.clearAllMocks());

    it("reserves tutor quota before calling the model", async () => {
        generateText.mockResolvedValue({ text: " An explanation " });
        await expect(explainWithAi("u1", "prompt")).resolves.toBe("An explanation");
        expect(consumeAiQuota).toHaveBeenCalledWith("u1", "tutor");
        expect(consumeAiQuota.mock.invocationCallOrder[0]).toBeLessThan(generateText.mock.invocationCallOrder[0]);
        expect(refundAiQuota).not.toHaveBeenCalled();
    });

    it("refunds the quota when the model fails or returns nothing", async () => {
        generateText.mockRejectedValueOnce(new Error("down"));
        await expect(explainWithAi("u1", "prompt")).rejects.toThrow("down");
        generateText.mockResolvedValueOnce({ text: "  " });
        await expect(explainWithAi("u1", "prompt")).rejects.toThrow();
        expect(refundAiQuota).toHaveBeenCalledTimes(2);
    });

    it("doesn't call the model when the quota is used up", async () => {
        consumeAiQuota.mockRejectedValueOnce(new Error("quota"));
        await expect(explainWithAi("u1", "prompt")).rejects.toThrow("quota");
        expect(generateText).not.toHaveBeenCalled();
    });
});
