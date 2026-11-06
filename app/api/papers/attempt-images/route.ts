// Photos of handwritten working for an attempt. POST stores (re-encoded, EXIF stripped); GET serves the student's own.
import { randomUUID } from "node:crypto";
import { attemptImageKey, isOwnAttemptKey } from "@/lib/papers/keys";
import { normaliseImage, sniffImage } from "@/lib/papers/pdf";
import { jsonError, PRIVATE_FILE_HEADERS } from "@/lib/papers/serve";
import { getUser } from "@/lib/session";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
    const user = await getUser();
    if (!user) return jsonError(401, "Sign in first");
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 64 * 1024) return jsonError(413, "Photo too big");
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!file || typeof file === "string") return jsonError(400, "No photo");
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.byteLength > MAX_BYTES) return jsonError(413, "Photo too big");
    const kind = sniffImage(bytes);
    if (!kind || kind === "heic") return jsonError(400, "Use a JPEG, PNG or WebP photo");
    const { jpeg } = await normaliseImage(bytes, 1800, 82);
    const key = attemptImageKey(user.id, randomUUID().replace(/-/g, ""), "jpg");
    await storage().put(key, jpeg, "image/jpeg");
    return Response.json({ key });
}

export async function GET(request: Request) {
    const user = await getUser();
    if (!user) return jsonError(401, "Sign in first");
    const key = new URL(request.url).searchParams.get("key") ?? "";
    // Students only ever see their own photos
    if (!isOwnAttemptKey(user.id, key)) return jsonError(404, "Not found");
    const bytes = await storage().get(key);
    if (!bytes) return jsonError(404, "Not found");
    return new Response(Buffer.from(bytes), { headers: { ...PRIVATE_FILE_HEADERS, "Content-Type": "image/jpeg" } });
}
