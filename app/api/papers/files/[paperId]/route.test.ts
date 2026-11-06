import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const findUnique = vi.fn();
const store = { kind: "local", get: vi.fn(), signedUrl: vi.fn(), put: vi.fn(), exists: vi.fn(), delete: vi.fn() };

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ getUser: () => getUser() }));
vi.mock("@/lib/db", () => ({ db: { paper: { findUnique: (a: unknown) => findUnique(a) } } }));
vi.mock("@/lib/storage", () => ({ storage: () => store }));

const { GET } = await import("./route");

const call = (id = "cmabcdefghijklmno", query = "") =>
    GET(new Request(`http://localhost/api/papers/files/${id}${query}`), { params: Promise.resolve({ paperId: id }) });

const indexedPaper = {
    storageKey: "ial/mathematics/wma11/2024-jan/wma11-01-qp.pdf",
    pageKeys: [],
    mime: "application/pdf",
    type: "QP",
    sourceUrl: "https://qualifications.pearson.com/content/dam/pdf/x.pdf",
    sitting: { ownerId: null, subject: "mathematics", unitCode: "WMA11" },
};

beforeEach(() => {
    vi.clearAllMocks();
    store.signedUrl.mockResolvedValue(null);
    store.get.mockResolvedValue(new TextEncoder().encode("%PDF-1.7"));
});

describe("GET /api/papers/files/[paperId]", () => {
    it("returns 401 to signed-out visitors without touching the database or storage", async () => {
        getUser.mockResolvedValue(null);
        const res = await call();
        expect(res.status).toBe(401);
        expect(findUnique).not.toHaveBeenCalled();
        expect(store.get).not.toHaveBeenCalled();
        expect(res.headers.get("cache-control")).toContain("no-store");
    });

    it("streams an indexed paper to a signed-in student, privately and unindexed", async () => {
        getUser.mockResolvedValue({ id: "u1", role: "STUDENT" });
        findUnique.mockResolvedValue(indexedPaper);
        const res = await call();
        expect(res.status).toBe(200);
        expect(res.headers.get("content-type")).toBe("application/pdf");
        expect(res.headers.get("cache-control")).toContain("private");
        expect(res.headers.get("x-robots-tag")).toContain("noindex");
        expect(Buffer.from(await res.arrayBuffer()).toString()).toBe("%PDF-1.7");
    });

    it("redirects to a short-lived signed URL when storage can sign", async () => {
        getUser.mockResolvedValue({ id: "u1", role: "STUDENT" });
        findUnique.mockResolvedValue(indexedPaper);
        store.signedUrl.mockResolvedValue("https://bucket.example/signed?X-Amz-Expires=300");
        const res = await call();
        expect(res.status).toBe(302);
        expect(res.headers.get("location")).toContain("X-Amz-Expires=300");
        expect(store.signedUrl.mock.calls[0][1].expiresIn).toBeLessThanOrEqual(300);
    });

    it("hides someone else's private upload behind a 404", async () => {
        getUser.mockResolvedValue({ id: "u2", role: "ADMIN" });
        findUnique.mockResolvedValue({ ...indexedPaper, sourceUrl: null, sitting: { ...indexedPaper.sitting, ownerId: "u1" } });
        const res = await call();
        expect(res.status).toBe(404);
        expect(store.get).not.toHaveBeenCalled();
    });

    it("404s unknown and malformed ids", async () => {
        getUser.mockResolvedValue({ id: "u1", role: "STUDENT" });
        findUnique.mockResolvedValue(null);
        expect((await call()).status).toBe(404);
        expect((await call("../../etc")).status).toBe(404);
    });

    it("serves image-upload pages to their owner", async () => {
        getUser.mockResolvedValue({ id: "u1", role: "STUDENT" });
        findUnique.mockResolvedValue({
            ...indexedPaper,
            sourceUrl: null,
            mime: "image/jpeg",
            pageKeys: [`uploads/${"a".repeat(64)}/page-001.jpg`],
            sitting: { ...indexedPaper.sitting, ownerId: "u1" },
        });
        expect((await call("cmabcdefghijklmno", "?page=1")).status).toBe(200);
        expect((await call("cmabcdefghijklmno", "?page=2")).status).toBe(404);
    });
});
