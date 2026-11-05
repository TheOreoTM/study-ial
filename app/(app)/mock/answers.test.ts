import { describe, expect, it } from "vitest";
import { cleanAnswers, readAnswers } from "./answers";

describe("readAnswers", () => {
    it("reads well-formed answers", () => {
        expect(readAnswers({ q1: { optionId: "o1" }, q2: { answer: "F = ma" } })).toEqual({
            q1: { optionId: "o1" },
            q2: { answer: "F = ma" },
        });
    });
    it("treats malformed JSON as no answers", () => {
        expect(readAnswers(null)).toEqual({});
        expect(readAnswers("nope")).toEqual({});
        expect(readAnswers({ q1: { optionId: 5 } })).toEqual({});
    });
});

describe("cleanAnswers", () => {
    it("keeps only questions on the paper", () => {
        expect(cleanAnswers({ q1: { optionId: "a" }, x: { optionId: "b" } }, ["q1"])).toEqual({ q1: { optionId: "a" } });
    });
    it("drops blank written answers", () => {
        expect(cleanAnswers({ q1: { answer: "   " }, q2: { answer: "ok" } }, ["q1", "q2"])).toEqual({ q2: { answer: "ok" } });
    });
});
