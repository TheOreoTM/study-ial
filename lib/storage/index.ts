// Picks the storage backend: R2 when all four R2_* variables are set, otherwise the local filesystem.
import path from "node:path";
import { LocalStorage } from "@/lib/storage/local";
import { R2Storage } from "@/lib/storage/r2";
import type { StorageAdapter } from "@/lib/storage/types";

export type { StorageAdapter } from "@/lib/storage/types";

export function r2ConfigFromEnv(env: NodeJS.ProcessEnv = process.env) {
    const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = env;
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) return null;
    return {
        accountId: R2_ACCOUNT_ID,
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
        bucket: R2_BUCKET,
    };
}

export function createStorage(env: NodeJS.ProcessEnv = process.env): StorageAdapter {
    const r2 = r2ConfigFromEnv(env);
    if (r2) return new R2Storage(r2);
    if (env.NODE_ENV === "production" && env.VERCEL) {
        // Vercel's filesystem is read-only and per-instance: local storage would silently lose files.
        console.warn("storage: R2 is not configured; falling back to local storage, which does not persist on Vercel");
    }
    return new LocalStorage(env.STORAGE_LOCAL_DIR || path.join(process.cwd(), ".storage"));
}

const globalForStorage = globalThis as unknown as { paperStorage?: StorageAdapter };

export function storage(): StorageAdapter {
    globalForStorage.paperStorage ??= createStorage();
    return globalForStorage.paperStorage;
}
