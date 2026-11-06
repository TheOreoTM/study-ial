import { mkdtemp, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createStorage } from "@/lib/storage";
import { LocalStorage } from "@/lib/storage/local";
import { assertValidKey, type StorageAdapter } from "@/lib/storage/types";

let dir: string;
let store: StorageAdapter;

beforeAll(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "storage-test-"));
    store = new LocalStorage(dir);
});
afterAll(() => rm(dir, { recursive: true, force: true }));

describe("LocalStorage", () => {
    const key = "ial/mathematics/wma11/2024-jan/wma11-01-qp.pdf";
    const body = new TextEncoder().encode("%PDF-1.7 test");

    it("round-trips bytes and reports existence", async () => {
        expect(await store.exists(key)).toBe(false);
        expect(await store.get(key)).toBeNull();
        await store.put(key, body, "application/pdf");
        expect(await store.exists(key)).toBe(true);
        expect(Buffer.from((await store.get(key))!).toString()).toBe("%PDF-1.7 test");
    });

    it("overwrites atomically and leaves no temp files", async () => {
        await store.put(key, new TextEncoder().encode("second"), "application/pdf");
        expect(Buffer.from((await store.get(key))!).toString()).toBe("second");
        const files = await readdir(path.join(dir, "ial/mathematics/wma11/2024-jan"));
        expect(files).toEqual(["wma11-01-qp.pdf"]);
    });

    it("deletes", async () => {
        await store.delete(key);
        expect(await store.exists(key)).toBe(false);
        await store.delete(key); // idempotent
    });

    it("never signs URLs (bytes are streamed through the authenticated route)", async () => {
        expect(await store.signedUrl("a.pdf", { expiresIn: 60 })).toBeNull();
    });

    it("refuses keys that escape the root or break the convention", async () => {
        for (const bad of ["../x.pdf", "/etc/passwd", "a//b", "a/./b", "A/B.pdf", "a b.pdf", ""]) {
            await expect(store.put(bad, body, "application/pdf")).rejects.toThrow();
            expect(() => assertValidKey(bad)).toThrow();
        }
    });
});

describe("createStorage", () => {
    it("uses local storage unless every R2 variable is set", () => {
        expect(createStorage({ NODE_ENV: "test", STORAGE_LOCAL_DIR: dir }).kind).toBe("local");
        expect(createStorage({ NODE_ENV: "test", R2_ACCOUNT_ID: "a", R2_BUCKET: "b" }).kind).toBe("local");
        expect(
            createStorage({ NODE_ENV: "test", R2_ACCOUNT_ID: "a", R2_ACCESS_KEY_ID: "b", R2_SECRET_ACCESS_KEY: "c", R2_BUCKET: "d" }).kind,
        ).toBe("r2");
    });
});
