import { describe, expect, it } from "vitest";
import { localDay, localDayKey, localDayStart, zoneOffsetMinutes } from "./time";

describe("localDay", () => {
    it("uses the Maldives calendar day (UTC+5)", () => {
        // 20:00Z on the 30th is 01:00 on the 31st in Malé
        expect(localDayKey(new Date("2026-10-30T20:00:00Z"))).toBe("2026-10-31");
        expect(localDayKey(new Date("2026-10-30T18:59:00Z"))).toBe("2026-10-30");
        expect(localDay(new Date("2026-10-30T20:00:00Z")).toISOString()).toBe("2026-10-31T00:00:00.000Z");
    });
});

describe("localDayStart", () => {
    it("is local midnight as an instant", () => {
        expect(zoneOffsetMinutes(new Date("2026-10-30T12:00:00Z"), "Indian/Maldives")).toBe(300);
        expect(localDayStart(new Date("2026-10-30T20:00:00Z")).toISOString()).toBe("2026-10-30T19:00:00.000Z");
        expect(localDayStart(new Date("2026-10-30T18:59:00Z")).toISOString()).toBe("2026-10-29T19:00:00.000Z");
    });
    it("works west of UTC too", () => {
        expect(localDayStart(new Date("2026-07-01T03:00:00Z"), "America/New_York").toISOString()).toBe(
            "2026-06-30T04:00:00.000Z",
        );
    });
});
