import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
const { checkUpload, imageSetHash } = await import("@/lib/papers/upload");

const pdf = new TextEncoder().encode("%PDF-1.7 ...");
const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
const heic = new Uint8Array([0, 0, 0, 24, ...new TextEncoder().encode("ftypheic")]);
const limits = { maxBytes: 100, maxPdfPages: 60, maxImages: 3, perDay: 10 };
const f = (bytes: Uint8Array, name = "x") => ({ name, type: "", bytes });

describe("checkUpload", () => {
    it("accepts one PDF or a set of images", () => {
        expect(checkUpload([f(pdf)], limits)).toEqual({ ok: true, kind: "pdf" });
        expect(checkUpload([f(jpeg), f(png)], limits)).toEqual({ ok: true, kind: "images" });
    });

    it("enforces size and count limits", () => {
        expect(checkUpload([f(new Uint8Array(101))], limits).ok).toBe(false);
        expect(checkUpload([f(jpeg), f(jpeg), f(jpeg), f(jpeg)], limits).ok).toBe(false);
        expect(checkUpload([], limits).ok).toBe(false);
    });

    it("rejects mixed uploads, HEIC and unknown files with a helpful message", () => {
        expect(checkUpload([f(pdf), f(jpeg)], limits)).toMatchObject({ ok: false });
        const h = checkUpload([f(heic)], limits);
        expect(h.ok === false && h.error).toMatch(/HEIC/);
        const u = checkUpload([f(new TextEncoder().encode("hello"), "notes.txt")], limits);
        expect(u.ok === false && u.error).toMatch(/notes\.txt/);
    });
});

describe("imageSetHash", () => {
    it("depends on content and page order", () => {
        expect(imageSetHash([jpeg, png])).toBe(imageSetHash([jpeg, png]));
        expect(imageSetHash([jpeg, png])).not.toBe(imageSetHash([png, jpeg]));
    });
});
