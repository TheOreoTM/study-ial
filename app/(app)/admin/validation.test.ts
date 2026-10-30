import { describe, expect, it } from "vitest";
import { checkQuestion, countMarkingPoints, parseImport, questionInputSchema } from "./validation";

const mcqOptions = [
    { label: "A" as const, text: "1 m", isCorrect: false },
    { label: "B" as const, text: "2 m", isCorrect: true },
    { label: "C" as const, text: "3 m", isCorrect: false },
    { label: "D" as const, text: "4 m", isCorrect: false },
];

const base = { topicId: "t1", difficulty: "MEDIUM", stem: "What?", source: "ORIGINAL" } as const;

describe("countMarkingPoints", () => {
    it("counts lines ending in (1)", () => {
        expect(countMarkingPoints("- use of $v = u + at$ (1)\n- answer 12 m/s (1)  \nnote: ecf")).toBe(2);
        expect(countMarkingPoints("")).toBe(0);
    });
});

describe("questionInputSchema", () => {
    it("accepts a valid MCQ and fills in the mark scheme", () => {
        const res = questionInputSchema.safeParse({ ...base, type: "MCQ", marks: 1, options: mcqOptions });
        expect(res.success).toBe(true);
        expect(res.data?.markScheme).toBe("**B** (1)");
        expect(res.data?.status).toBe("DRAFT");
    });

    it("rejects MCQ with zero or two correct options", () => {
        const none = mcqOptions.map((o) => ({ ...o, isCorrect: false }));
        expect(questionInputSchema.safeParse({ ...base, type: "MCQ", marks: 1, options: none }).success).toBe(false);
        const two = mcqOptions.map((o) => ({ ...o, isCorrect: o.label < "C" }));
        expect(questionInputSchema.safeParse({ ...base, type: "MCQ", marks: 1, options: two }).success).toBe(false);
    });

    it("rejects MCQ with too few or too many options", () => {
        const one = [{ label: "A", text: "x", isCorrect: true }];
        expect(questionInputSchema.safeParse({ ...base, type: "MCQ", marks: 1, options: one }).success).toBe(false);
        const six = [
            ...mcqOptions,
            { label: "E", text: "5", isCorrect: false },
            { label: "E", text: "6", isCorrect: false },
        ];
        expect(questionInputSchema.safeParse({ ...base, type: "MCQ", marks: 1, options: six }).success).toBe(false);
    });

    it("requires enough marking points for SHORT/CALCULATION", () => {
        const q = { ...base, type: "CALCULATION", marks: 3, markScheme: "a (1)\nb (1)" };
        expect(questionInputSchema.safeParse(q).success).toBe(false);
        expect(questionInputSchema.safeParse({ ...q, markScheme: "a (1)\nb (1)\nc (1)" }).success).toBe(true);
    });

    it("only warns for LONG questions with too few points", () => {
        const q = {
            type: "LONG" as const,
            marks: 6,
            markScheme: "Level 3 (5–6 marks): ...",
            options: [],
            source: "ORIGINAL" as const,
            sourceRef: null,
        };
        const { errors, warnings } = checkQuestion(q);
        expect(errors).toEqual([]);
        expect(warnings.length).toBe(1);
        expect(questionInputSchema.safeParse({ ...base, ...q }).success).toBe(true);
    });

    it("drops options from non-MCQ questions only via error, and requires a topic", () => {
        const q = { ...base, type: "SHORT", marks: 1, markScheme: "x (1)", options: mcqOptions };
        expect(questionInputSchema.safeParse(q).success).toBe(false);
        expect(questionInputSchema.safeParse({ ...q, options: [], topicId: "" }).success).toBe(false);
    });

    it("warns when a past-paper question has no reference", () => {
        const { warnings } = checkQuestion({
            type: "SHORT",
            marks: 1,
            markScheme: "x (1)",
            options: [],
            source: "PAST_PAPER",
            sourceRef: null,
        });
        expect(warnings).toHaveLength(1);
    });
});

describe("parseImport", () => {
    const good = {
        seedKey: "phy-u1-motion-900",
        unitCode: "wph11",
        topicSlug: "motion",
        type: "SHORT",
        difficulty: "EASY",
        marks: 1,
        stem: "Define velocity.",
        markScheme: "rate of change of displacement (1)",
    };

    it("reports invalid JSON", () => {
        const res = parseImport("[{");
        expect(res.ok).toBe(false);
    });

    it("validates each row independently and upper-cases unit codes", () => {
        const res = parseImport(JSON.stringify([good, { ...good, seedKey: "x-2", marks: 0 }]));
        if (!res.ok) throw new Error(res.error);
        expect(res.rows[0].ok).toBe(true);
        if (res.rows[0].ok) expect(res.rows[0].item.unitCode).toBe("WPH11");
        expect(res.rows[1].ok).toBe(false);
    });

    it("flags duplicate seedKeys and allows missing ones", () => {
        const { seedKey: _omit, ...noKey } = good;
        void _omit;
        const res = parseImport(JSON.stringify([good, good, noKey]));
        if (!res.ok) throw new Error(res.error);
        expect(res.rows.map((r) => r.ok)).toEqual([true, false, true]);
        if (res.rows[2].ok) expect(res.rows[2].item.seedKey).toBeNull();
    });

    it("accepts a single object or { questions: [...] }", () => {
        const single = parseImport(JSON.stringify(good));
        expect(single.ok && single.rows.length).toBe(1);
        const wrapped = parseImport(JSON.stringify({ questions: [good] }));
        expect(wrapped.ok && wrapped.rows.length).toBe(1);
    });

    it("rejects an empty array", () => {
        expect(parseImport("[]").ok).toBe(false);
    });
});
