import { describe, expect, it } from "vitest";
import { attemptImageKey, figureKey, isOwnAttemptKey, pageImageKey, paperKey, parsePaperKey, uploadImageKey, uploadPdfKey } from "@/lib/papers/keys";

const sha = "a".repeat(64);

describe("paperKey", () => {
    it("follows ial/{subject}/{unit}/{year}-{series}/{unit}-{paper}-{type}.pdf in lowercase", () => {
        expect(
            paperKey({ subject: "mathematics", unitCode: "WMA11", paperCode: "01", year: 2024, series: "jan", type: "QP" }),
        ).toBe("ial/mathematics/wma11/2024-jan/wma11-01-qp.pdf");
        expect(
            paperKey({ subject: "further-mathematics", unitCode: "WFM01", paperCode: "01A", year: 2025, series: "oct", type: "MS" }),
        ).toBe("ial/further-mathematics/wfm01/2025-oct/wfm01-01a-ms.pdf");
        expect(
            paperKey({ subject: "physics", unitCode: "wph11", paperCode: "01", year: 2023, series: "jun", type: "ER" }),
        ).toBe("ial/physics/wph11/2023-jun/wph11-01-er.pdf");
    });

    it("rejects values that would break the convention", () => {
        const base = { subject: "mathematics", unitCode: "WMA11", paperCode: "01", year: 2024, series: "jan", type: "QP" } as const;
        expect(() => paperKey({ ...base, subject: "Further Maths" })).toThrow();
        expect(() => paperKey({ ...base, unitCode: "WMA1" })).toThrow();
        expect(() => paperKey({ ...base, paperCode: "1" })).toThrow();
        expect(() => paperKey({ ...base, series: "may" as "jan" })).toThrow();
        expect(() => paperKey({ ...base, subject: "../etc" })).toThrow();
    });

    it("round-trips", () => {
        const parts = { subject: "mathematics", unitCode: "WMA11", paperCode: "01r", year: 2024, series: "jun", type: "ER" } as const;
        expect(parsePaperKey(paperKey(parts))).toEqual(parts);
        expect(parsePaperKey("ial/mathematics/wma11/2024-jun/wma12-01-qp.pdf")).toBeNull();
        expect(parsePaperKey("ial/Mathematics/wma11/2024-jun/wma11-01-qp.pdf")).toBeNull();
    });
});

describe("derived keys", () => {
    it("builds upload, page, figure and attempt keys", () => {
        expect(uploadPdfKey(sha)).toBe(`uploads/${sha}.pdf`);
        expect(uploadImageKey(sha, 3, "jpg")).toBe(`uploads/${sha}/page-003.jpg`);
        expect(pageImageKey(sha, 12)).toBe(`derived/${sha}/page-012.png`);
        expect(figureKey(sha, 2, 1)).toBe(`derived/${sha}/figures/p002-1.png`);
        expect(attemptImageKey("user_1", "abc", "jpg")).toBe("attempts/user_1/abc.jpg");
    });

    it("rejects bad hashes and ids", () => {
        expect(() => uploadPdfKey("../../x")).toThrow();
        expect(() => attemptImageKey("../x", "a", "jpg")).toThrow();
    });
});

describe("isOwnAttemptKey", () => {
    it("accepts only the user's own, well-formed keys", () => {
        expect(isOwnAttemptKey("u1", "attempts/u1/abc.jpg")).toBe(true);
        expect(isOwnAttemptKey("u1", "attempts/u2/abc.jpg")).toBe(false);
        expect(isOwnAttemptKey("u1", "attempts/u1/../u2/abc.jpg")).toBe(false);
        expect(isOwnAttemptKey("u1", "attempts/u1/abc.jpg/../../x")).toBe(false);
        expect(isOwnAttemptKey("u1", "uploads/abc.pdf")).toBe(false);
    });
});
