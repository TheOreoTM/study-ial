import { describe, expect, it } from "vitest";
import { sessionForDate, sessionOptions, upcomingExamSessions } from "./exam-sessions";

const at = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("upcomingExamSessions", () => {
    it("includes every session this year and next in early January", () => {
        expect(upcomingExamSessions(at("2026-01-03")).map((s) => s.id)).toEqual([
            "2026-jan",
            "2026-jun",
            "2026-oct",
            "2027-jan",
            "2027-jun",
            "2027-oct",
        ]);
    });

    it("drops sessions whose months have passed", () => {
        expect(upcomingExamSessions(at("2026-02-10")).map((s) => s.id)).toEqual([
            "2026-jun",
            "2026-oct",
            "2027-jan",
            "2027-jun",
            "2027-oct",
        ]);
        expect(upcomingExamSessions(at("2026-07-01"))[0].id).toBe("2026-oct");
    });

    it("drops a session once its approximate exam date has passed", () => {
        expect(upcomingExamSessions(at("2026-10-19"))[0].id).toBe("2026-oct");
        expect(upcomingExamSessions(at("2026-10-21"))[0].id).toBe("2027-jan");
    });

    it("maps sessions to approximate exam dates", () => {
        const s = upcomingExamSessions(at("2026-01-01"));
        expect(s.map((x) => x.date).slice(0, 3)).toEqual(["2026-01-15", "2026-06-01", "2026-10-20"]);
        expect(s[1].label).toBe("May/June 2026");
    });
});

describe("sessionForDate", () => {
    it("maps stored dates back to sessions", () => {
        expect(sessionForDate(new Date("2027-01-15T00:00:00Z"))?.id).toBe("2027-jan");
        expect(sessionForDate("2026-11-05")?.id).toBe("2026-oct");
        expect(sessionForDate("2026-05-20")?.id).toBe("2026-jun");
        expect(sessionForDate("2026-03-01")).toBeNull();
        expect(sessionForDate(null)).toBeNull();
    });
});

describe("sessionOptions", () => {
    it("keeps a past or custom saved date selectable", () => {
        const today = at("2026-10-30");
        expect(sessionOptions(today, null)[0].id).toBe("2027-jan");
        expect(sessionOptions(today, "2027-01-15")).toHaveLength(upcomingExamSessions(today).length);
        const past = sessionOptions(today, "2026-06-01");
        expect(past[0]).toMatchObject({ id: "2026-jun", date: "2026-06-01" });
        const custom = sessionOptions(today, "2027-03-04");
        expect(custom[0]).toMatchObject({ id: "custom-2027-03-04", date: "2027-03-04" });
    });
});
