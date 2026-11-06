// Turns a stored object into an HTTP response for a signed-in, authorised viewer: a redirect to a short-lived signed
// URL (R2), a redirect to the original source (subjects in "source" serve mode), or the bytes streamed (local).
import { paperSubjectBySlug, paperSubjectForUnit } from "@/lib/papers/config";
import type { StorageAdapter } from "@/lib/storage/types";

export const SIGNED_URL_SECONDS = 300;

/** Headers on every private file response: never cached by shared caches, never indexed, never sniffed. */
export const PRIVATE_FILE_HEADERS = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
} as const;

export function jsonError(status: number, error: string) {
    return Response.json({ error }, { status, headers: PRIVATE_FILE_HEADERS });
}

export function serveModeFor(subject: string, unitCode: string) {
    return (paperSubjectBySlug(subject) ?? paperSubjectForUnit(unitCode))?.serve ?? "storage";
}

export async function storedObjectResponse(
    store: StorageAdapter,
    key: string,
    opts: { contentType: string; filename: string; sourceUrl?: string | null; serve?: "storage" | "source" },
) {
    if (opts.serve === "source" && opts.sourceUrl) {
        return new Response(null, { status: 302, headers: { ...PRIVATE_FILE_HEADERS, Location: opts.sourceUrl } });
    }
    const signed = await store.signedUrl(key, {
        expiresIn: SIGNED_URL_SECONDS,
        contentType: opts.contentType,
        filename: opts.filename,
    });
    if (signed) return new Response(null, { status: 302, headers: { ...PRIVATE_FILE_HEADERS, Location: signed } });

    const bytes = await store.get(key);
    if (!bytes) return jsonError(404, "File not found");
    return new Response(Buffer.from(bytes), {
        status: 200,
        headers: {
            ...PRIVATE_FILE_HEADERS,
            "Content-Type": opts.contentType,
            "Content-Length": String(bytes.byteLength),
            "Content-Disposition": `inline; filename="${opts.filename.replace(/[^A-Za-z0-9._-]/g, "_")}"`,
        },
    });
}
