// Copyright rules: every route that can return Pearson material or a student's files refuses signed-out requests.
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const db = {
    paper: { findUnique: vi.fn() },
    paperQuestion: { findUnique: vi.fn() },
};
const store = { kind: "local", get: vi.fn(), put: vi.fn(), exists: vi.fn(), delete: vi.fn(), signedUrl: vi.fn() };

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ getUser: () => getUser() }));
vi.mock("@/lib/db", () => ({ db }));
vi.mock("@/lib/storage", () => ({ storage: () => store }));
vi.mock("next/server", () => ({ after: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const pages = await import("./pages/[paperId]/[page]/route");
const figures = await import("./figures/[questionId]/[index]/route");
const photos = await import("./attempt-images/route");
const uploads = await import("./uploads/route");
const jobs = await import("./jobs/route");

const pid = "cmabcdefghijklmno";

beforeEach(() => {
    vi.clearAllMocks();
    store.get.mockResolvedValue(new Uint8Array([1, 2, 3]));
});

describe("signed-out requests are refused", () => {
    beforeEach(() => getUser.mockResolvedValue(null));

    it("page images", async () => {
        const res = await pages.GET(new Request("http://x"), { params: Promise.resolve({ paperId: pid, page: "1" }) });
        expect(res.status).toBe(401);
        expect(db.paper.findUnique).not.toHaveBeenCalled();
    });

    it("figure crops", async () => {
        const res = await figures.GET(new Request("http://x"), { params: Promise.resolve({ questionId: pid, index: "0" }) });
        expect(res.status).toBe(401);
        expect(db.paperQuestion.findUnique).not.toHaveBeenCalled();
    });

    it("attempt photos and uploads", async () => {
        expect((await photos.GET(new Request("http://x/?key=attempts/u1/a.jpg"))).status).toBe(401);
        expect((await photos.POST(new Request("http://x", { method: "POST" }))).status).toBe(401);
        expect((await uploads.POST(new Request("http://x", { method: "POST" }))).status).toBe(401);
        expect(store.get).not.toHaveBeenCalled();
    });

    it("the job runner without the cron secret", async () => {
        expect((await jobs.GET(new Request("http://x"))).status).toBe(401);
        process.env.CRON_SECRET = "s3cret";
        expect((await jobs.GET(new Request("http://x", { headers: { authorization: "Bearer nope" } }))).status).toBe(401);
        delete process.env.CRON_SECRET;
    });
});

describe("signed-in students only reach what's theirs", () => {
    beforeEach(() => getUser.mockResolvedValue({ id: "u2", role: "STUDENT" }));

    it("can't open another student's upload pages or figures", async () => {
        db.paper.findUnique.mockResolvedValue({ storageKey: "x", pageKeys: ["uploads/a/page-001.jpg"], mime: "image/jpeg", sha256: "a", pageCount: 1, sitting: { ownerId: "u1" } });
        expect((await pages.GET(new Request("http://x"), { params: Promise.resolve({ paperId: pid, page: "1" }) })).status).toBe(404);
        db.paperQuestion.findUnique.mockResolvedValue({ figures: [{ key: "derived/x.png" }], paper: { sitting: { ownerId: "u1" } } });
        expect((await figures.GET(new Request("http://x"), { params: Promise.resolve({ questionId: pid, index: "0" }) })).status).toBe(404);
    });

    it("can't read another student's attempt photos", async () => {
        expect((await photos.GET(new Request("http://x/?key=attempts/u1/a.jpg"))).status).toBe(404);
        expect((await photos.GET(new Request("http://x/?key=attempts/u2/../u1/a.jpg"))).status).toBe(404);
        expect((await photos.GET(new Request("http://x/?key=attempts/u2/a.jpg"))).status).toBe(200);
    });

    it("can open indexed-paper figures", async () => {
        db.paperQuestion.findUnique.mockResolvedValue({ figures: [{ key: "derived/x.png" }], paper: { sitting: { ownerId: null } } });
        const res = await figures.GET(new Request("http://x"), { params: Promise.resolve({ questionId: pid, index: "0" }) });
        expect(res.status).toBe(200);
        expect(res.headers.get("cache-control")).toContain("no-store");
    });
});
