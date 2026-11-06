// Storage adapter interface. Every object is private: nothing is ever written to a public bucket or `public/`.
// Files reach a browser only through the authenticated routes in app/api/papers/**, which either redirect to a
// short-lived signed URL (R2) or stream the bytes (local).

export type StorageKind = "r2" | "local";

export type SignedUrlOptions = {
    /** Seconds the URL stays valid */
    expiresIn: number;
    contentType?: string;
    /** Suggested filename for Content-Disposition (inline) */
    filename?: string;
};

export interface StorageAdapter {
    readonly kind: StorageKind;
    put(key: string, body: Uint8Array, contentType: string): Promise<void>;
    /** The object's bytes, or null if it doesn't exist */
    get(key: string): Promise<Uint8Array | null>;
    exists(key: string): Promise<boolean>;
    delete(key: string): Promise<void>;
    /** A time-limited direct URL, or null when this adapter can't sign URLs (the caller streams `get()` instead) */
    signedUrl(key: string, options: SignedUrlOptions): Promise<string | null>;
}

const KEY_RE = /^[a-z0-9][a-z0-9._/-]*$/;

/** Keys are lowercase relative paths without "..", empty segments or leading slashes. */
export function assertValidKey(key: string) {
    if (key.length > 512 || !KEY_RE.test(key) || key.split("/").some((seg) => seg === "" || seg === "." || seg === "..")) {
        throw new Error(`Invalid storage key: ${key}`);
    }
}
