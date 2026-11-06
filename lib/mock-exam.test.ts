import { describe, expect, it } from "vitest";
import {
    assemblePaper,
    durationFor,
    formatClock,
    formatDuration,
    indicativeGrade,
    isPastDeadline,
    lengthAvailable,
    marksToNextGrade,
    minutesPerMark,
    secondsLeft,
    SUBMIT_GRACE_SECONDS,
    ticksFromAi,
    type PaperCandidate,
} from "./mock-exam";

function seeded(seed = 1) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function bank(): PaperCandidate[] {
    const out: PaperCandidate[] = [];
    for (let t = 0; t < 6; t++) {
        out.push({ id: `m${t}a`, topicId: `t${t}`, topicOrder: t, marks: 1, isMcq: true });
        out.push({ id: `m${t}b`, topicId: `t${t}`, topicOrder: t, marks: 1, isMcq: true });
        out.push({ id: `w${t}a`, topicId: `t${t}`, topicOrder: t, marks: 3, isMcq: false });
        out.push({ id: `w${t}b`, topicId: `t${t}`, topicOrder: t, marks: 5, isMcq: false });
    }
    return out; // 60 marks over 6 topics
}

const sum = (qs: PaperCandidate[]) => qs.reduce((n, q) => n + q.marks, 0);

describe("durationFor", () => {
    it("uses each subject's real minutes per mark", () => {
        expect(durationFor(80, "physics")).toBe(105);
        expect(durationFor(80, "chemistry")).toBe(90);
        expect(durationFor(75, "mathematics")).toBe(90);
    });
    it("rounds to 5 minutes with a 10 minute floor", () => {
        expect(durationFor(20, "physics")).toBe(25); // 26.25
        expect(durationFor(3, "physics")).toBe(10);
    });
    it("falls back for local subjects", () => {
        expect(minutesPerMark("islam")).toBe(1.25);
        expect(durationFor(40, "islam")).toBe(50);
    });
});

describe("lengthAvailable", () => {
    it("needs most of the target marks", () => {
        expect(lengthAvailable("short", 16)).toBe(true);
        expect(lengthAvailable("short", 15)).toBe(false);
        expect(lengthAvailable("half", 32)).toBe(true);
    });
    it("full takes what's there from 50 marks", () => {
        expect(lengthAvailable("full", 49)).toBe(false);
        expect(lengthAvailable("full", 60)).toBe(true);
    });
});

describe("assemblePaper", () => {
    it("never goes over the target", () => {
        for (let seed = 1; seed < 30; seed++) {
            expect(sum(assemblePaper(bank(), 20, { rng: seeded(seed) }))).toBeLessThanOrEqual(20);
        }
    });

    it("fills the target when the bank allows", () => {
        expect(sum(assemblePaper(bank(), 20, { rng: seeded(3) }))).toBe(20);
        expect(sum(assemblePaper(bank(), 40, { rng: seeded(4) }))).toBe(40);
    });

    it("uses everything when the target exceeds the bank", () => {
        expect(sum(assemblePaper(bank(), 80, { rng: seeded(5) }))).toBe(60);
    });

    it("spreads across topics before doubling up", () => {
        for (let seed = 1; seed < 40; seed++) {
            const paper = assemblePaper(bank(), 20, { rng: seeded(seed) });
            expect(new Set(paper.map((q) => q.topicId)).size).toBe(6);
        }
    });

    it("still includes long questions in a long paper", () => {
        expect(assemblePaper(bank(), 40, { rng: seeded(6) }).some((q) => q.marks === 5)).toBe(true);
    });

    it("never repeats a question", () => {
        const paper = assemblePaper(bank(), 80, { rng: seeded(9) });
        expect(new Set(paper.map((q) => q.id)).size).toBe(paper.length);
    });

    it("puts multiple choice first, then written in spec order", () => {
        const paper = assemblePaper(bank(), 40, { rng: seeded(11) });
        const firstWritten = paper.findIndex((q) => !q.isMcq);
        expect(paper.slice(firstWritten).every((q) => !q.isMcq)).toBe(true);
        const orders = paper.slice(firstWritten).map((q) => q.topicOrder);
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
    });

    it("prefers unseen questions, then the worst-answered", () => {
        const qs: PaperCandidate[] = [
            { id: "seenGood", topicId: "t", topicOrder: 0, marks: 2, isMcq: false },
            { id: "seenBad", topicId: "t", topicOrder: 0, marks: 2, isMcq: false },
            { id: "unseen", topicId: "t", topicOrder: 0, marks: 2, isMcq: false },
        ];
        const seen = new Map([
            ["seenGood", 1],
            ["seenBad", 0.2],
        ]);
        expect(assemblePaper(qs, 2, { seen, rng: seeded(2) }).map((q) => q.id)).toEqual(["unseen"]);
        expect(
            assemblePaper(qs, 4, { seen, rng: seeded(2) })
                .map((q) => q.id)
                .sort(),
        ).toEqual(["seenBad", "unseen"]);
    });

    it("is empty for an empty bank", () => {
        expect(assemblePaper([], 20)).toEqual([]);
    });
});

describe("indicativeGrade", () => {
    it("uses the UMS-style thresholds", () => {
        expect(indicativeGrade(64, 80)).toBe("A");
        expect(indicativeGrade(63, 80)).toBe("B");
        expect(indicativeGrade(56, 80)).toBe("B");
        expect(indicativeGrade(48, 80)).toBe("C");
        expect(indicativeGrade(40, 80)).toBe("D");
        expect(indicativeGrade(32, 80)).toBe("E");
        expect(indicativeGrade(31, 80)).toBe("U");
    });
    it("is U with nothing to mark", () => {
        expect(indicativeGrade(0, 0)).toBe("U");
    });
});

describe("marksToNextGrade", () => {
    it("counts the marks to the next threshold", () => {
        expect(marksToNextGrade(30, 40)).toEqual({ grade: "A", marks: 2 });
        expect(marksToNextGrade(10, 40)).toEqual({ grade: "E", marks: 6 });
        expect(marksToNextGrade(20, 40)).toEqual({ grade: "C", marks: 4 });
    });
    it("rounds thresholds up to whole marks", () => {
        expect(marksToNextGrade(15, 21)).toEqual({ grade: "A", marks: 2 }); // 16.8 → 17
    });
    it("is null at A", () => {
        expect(marksToNextGrade(32, 40)).toBeNull();
    });
});

describe("clock", () => {
    const start = new Date("2026-11-05T10:00:00Z");
    it("counts down and stops at zero", () => {
        expect(secondsLeft(start, 25, new Date("2026-11-05T10:05:00Z"))).toBe(20 * 60);
        expect(secondsLeft(start, 25, new Date("2026-11-05T11:00:00Z"))).toBe(0);
    });
    it("accepts submissions within the grace period", () => {
        const end = start.getTime() + 25 * 60_000;
        expect(isPastDeadline(start, 25, new Date(end + (SUBMIT_GRACE_SECONDS - 1) * 1000))).toBe(false);
        expect(isPastDeadline(start, 25, new Date(end + (SUBMIT_GRACE_SECONDS + 1) * 1000))).toBe(true);
    });
    it("formats the countdown", () => {
        expect(formatClock(42 * 60 + 7)).toBe("42:07");
        expect(formatClock(3909)).toBe("1:05:09");
        expect(formatClock(-5)).toBe("0:00");
    });
    it("formats durations", () => {
        expect(formatDuration(105)).toBe("1 h 45 min");
        expect(formatDuration(50)).toBe("50 min");
        expect(formatDuration(120)).toBe("2 h");
    });
});

describe("ticksFromAi", () => {
    it("ticks the points the AI awarded, in order", () => {
        expect(ticksFromAi([{ awarded: true }, { awarded: false }, { awarded: true }], 3)).toEqual([0, 2]);
    });
    it("ticks nothing when the points don't line up with the mark scheme", () => {
        expect(ticksFromAi([{ awarded: false }, { awarded: true }, { awarded: true }], 2)).toBeNull();
        expect(ticksFromAi([{ awarded: true }], 3)).toBeNull();
    });
});
