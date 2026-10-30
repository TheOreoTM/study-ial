import { describe, expect, it } from "vitest";
import {
    advance,
    DEFAULT_SETTINGS,
    elapsed,
    formatClock,
    initialState,
    minutesToLog,
    nextMode,
    pause,
    remaining,
    reset,
    sanitizeSettings,
    spokenRemaining,
    start,
} from "./timer";

const S = DEFAULT_SETTINGS;
const MIN = 60_000;

describe("timer state", () => {
    it("derives remaining time from timestamps, not ticks", () => {
        let t = initialState(S);
        expect(remaining(t, 0)).toBe(25 * MIN);
        t = start(t, 1_000);
        // A background tab that wakes up 10 minutes later sees the right value immediately.
        expect(remaining(t, 1_000 + 10 * MIN)).toBe(15 * MIN);
        expect(remaining(t, 1_000 + 30 * MIN)).toBe(0);
    });

    it("pauses and resumes without losing time", () => {
        let t = start(initialState(S), 0);
        t = pause(t, 5 * MIN);
        expect(remaining(t, 999 * MIN)).toBe(20 * MIN);
        t = start(t, 100 * MIN);
        expect(t.startedAt).toBe(0); // first start is kept for logging
        expect(remaining(t, 110 * MIN)).toBe(10 * MIN);
        expect(elapsed(t, 110 * MIN)).toBe(15 * MIN);
    });

    it("start and pause are idempotent; reset restores the full period", () => {
        const t = start(initialState(S), 0);
        expect(start(t, 50)).toBe(t);
        const p = pause(t, MIN);
        expect(pause(p, 2 * MIN)).toBe(p);
        expect(reset(p)).toMatchObject({ endsAt: null, remainingMs: 25 * MIN, startedAt: null });
    });
});

describe("cycle", () => {
    it("takes a long break after every 4th focus period", () => {
        expect(nextMode("focus", 1, 4)).toBe("short");
        expect(nextMode("focus", 3, 4)).toBe("short");
        expect(nextMode("focus", 4, 4)).toBe("long");
        expect(nextMode("focus", 8, 4)).toBe("long");
        expect(nextMode("short", 1, 4)).toBe("focus");
        expect(nextMode("long", 4, 4)).toBe("focus");
    });

    it("advances focus → break (auto-starting breaks by default) and counts completed focus", () => {
        let t = initialState(S);
        for (let i = 1; i <= 4; i++) {
            t = advance(t, S, { countFocus: true, now: 0 });
            expect(t.mode).toBe(i === 4 ? "long" : "short");
            expect(t.endsAt).not.toBeNull();
            expect(t.completedFocus).toBe(i);
            t = advance(t, S, { countFocus: true, now: 0 });
            expect(t.mode).toBe("focus");
            expect(t.endsAt).toBeNull(); // focus waits for the student by default
        }
    });

    it("skipping focus doesn't count toward the long break", () => {
        const t = advance(initialState(S), S, { countFocus: false, now: 0 });
        expect(t.completedFocus).toBe(0);
        expect(t.mode).toBe("short");
    });

    it("uses custom lengths", () => {
        const s = { ...S, focus: 50, short: 10 };
        const t = advance(initialState(s), s, { countFocus: true, now: 0 });
        expect(t.durationMs).toBe(10 * MIN);
    });
});

describe("formatting", () => {
    it("formats the clock rounding up", () => {
        expect(formatClock(25 * MIN)).toBe("25:00");
        expect(formatClock(25 * MIN - 1)).toBe("25:00");
        expect(formatClock(25 * MIN - 1000)).toBe("24:59");
        expect(formatClock(1)).toBe("00:01");
        expect(formatClock(0)).toBe("00:00");
        expect(formatClock(90 * MIN)).toBe("1:30:00");
    });

    it("speaks remaining time", () => {
        expect(spokenRemaining(25 * MIN)).toBe("25 minutes left");
        expect(spokenRemaining(24 * MIN)).toBe("25 minutes left");
        expect(spokenRemaining(20 * MIN)).toBe("20 minutes left");
        expect(spokenRemaining(5 * MIN)).toBe("5 minutes left");
        expect(spokenRemaining(4 * MIN + 1)).toBe("5 minutes left");
        expect(spokenRemaining(61_000)).toBe("2 minutes left");
        expect(spokenRemaining(60_000)).toBe("1 minute left");
        expect(spokenRemaining(30_000)).toBe("30 seconds left");
        expect(spokenRemaining(9_000)).toBe("10 seconds left");
    });

    it("rounds logged minutes", () => {
        expect(minutesToLog(25 * MIN)).toBe(25);
        expect(minutesToLog(5 * MIN + 29_000)).toBe(5);
        expect(minutesToLog(29_000)).toBe(0);
    });
});

describe("sanitizeSettings", () => {
    it("falls back to defaults and clamps", () => {
        expect(sanitizeSettings(null)).toEqual(S);
        expect(sanitizeSettings({ focus: 500, short: 0, long: "x", sound: false })).toMatchObject({
            focus: 120,
            short: 1,
            long: 15,
            sound: false,
        });
    });
});
