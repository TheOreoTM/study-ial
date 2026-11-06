// Local filesystem storage, used automatically when R2 isn't configured (development, tests, CI).
// Lives outside `public/`, so nothing is reachable without going through an authenticated route.
import { mkdir, readFile, rm, stat, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { assertValidKey, type StorageAdapter } from "@/lib/storage/types";

export class LocalStorage implements StorageAdapter {
    readonly kind = "local" as const;
    constructor(private readonly root: string) {}

    private resolve(key: string) {
        assertValidKey(key);
        const root = path.resolve(this.root);
        const full = path.resolve(root, key);
        if (!full.startsWith(root + path.sep)) throw new Error(`Invalid storage key: ${key}`);
        return full;
    }

    async put(key: string, body: Uint8Array) {
        const full = this.resolve(key);
        await mkdir(path.dirname(full), { recursive: true });
        // Write then rename so a crash never leaves a half-written object behind
        const tmp = `${full}.${randomUUID()}.tmp`;
        await writeFile(tmp, body);
        await rename(tmp, full);
    }

    async get(key: string) {
        try {
            return new Uint8Array(await readFile(this.resolve(key)));
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
            throw err;
        }
    }

    async exists(key: string) {
        try {
            return (await stat(this.resolve(key))).isFile();
        } catch {
            return false;
        }
    }

    async delete(key: string) {
        await rm(this.resolve(key), { force: true });
    }

    async signedUrl() {
        return null;
    }
}
