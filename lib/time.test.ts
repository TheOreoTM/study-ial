import { describe, expect, it } from "vitest";
import { localDay, localDayKey } from "./time";

describe("localDay", () => {
    it("uses the Maldives calendar day (UTC+5)", () => {
        // 20:00Z on the 30th is 01:00 on the 31st in Malé
        expect(localDayKey(new Date("2026-10-30T20:00:00Z"))).toBe("2026-10-31");
        expect(localDayKey(new Date("2026-10-30T18:59:00Z"))).toBe("2026-10-30");
        expect(localDay(new Date("2026-10-30T20:00:00Z")).toISOString()).toBe("2026-10-31T00:00:00.000Z");
    });
});
