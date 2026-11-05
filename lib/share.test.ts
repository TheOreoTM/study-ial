import { describe, expect, it } from "vitest";
import { hashShareToken, isShareTokenShaped, newShareToken, shareDisplayName, sharePath } from "./share";

describe("share tokens", () => {
    it("are 43 url-safe characters and unique", () => {
        const a = newShareToken();
        const b = newShareToken();
        expect(isShareTokenShaped(a)).toBe(true);
        expect(a).not.toBe(b);
    });
    it("hash deterministically, without containing the token", () => {
        const t = newShareToken();
        expect(hashShareToken(t)).toBe(hashShareToken(t));
        expect(hashShareToken(t)).toMatch(/^[0-9a-f]{64}$/);
        expect(hashShareToken(t)).not.toContain(t);
    });
    it("rejects anything else before a database lookup", () => {
        expect(isShareTokenShaped("short")).toBe(false);
        expect(isShareTokenShaped("x".repeat(44))).toBe(false);
        expect(isShareTokenShaped(`${"a".repeat(42)}/`)).toBe(false);
    });
    it("builds the path", () => {
        expect(sharePath("abc")).toBe("/share/abc");
    });
});

describe("shareDisplayName", () => {
    it("uses the first name only", () => {
        expect(shareDisplayName("Aishath Ibrahim")).toBe("Aishath");
        expect(shareDisplayName("  ")).toBe("This student");
    });
});
