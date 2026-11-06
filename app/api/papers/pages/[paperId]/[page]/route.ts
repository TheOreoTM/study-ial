// Page images (rendered once from the PDF, or an uploaded photo). Signed-in viewers of the paper only.
import { db } from "@/lib/db";
import { getPageImage } from "@/lib/papers/pages";
import { canViewSittingContent, deniedStatus } from "@/lib/papers/permissions";
import { jsonError, PRIVATE_FILE_HEADERS } from "@/lib/papers/serve";
import { getUser } from "@/lib/session";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(_req: Request, { params }: { params: Promise<{ paperId: string; page: string }> }) {
    const user = await getUser();
    if (!user) return jsonError(401, "Sign in to open papers");
    const { paperId, page } = await params;
    const n = Number.parseInt(page, 10);
    if (!/^[a-z0-9]{10,40}$/i.test(paperId) || !Number.isFinite(n)) return jsonError(404, "Not found");

    const paper = await db.paper.findUnique({
        where: { id: paperId },
        select: { storageKey: true, pageKeys: true, mime: true, sha256: true, pageCount: true, sitting: { select: { ownerId: true } } },
    });
    if (!paper || !canViewSittingContent(user, paper.sitting)) return jsonError(deniedStatus(user), "Not found");
    const img = await getPageImage(storage(), paper, n);
    if (!img) return jsonError(404, "Page not found");
    return new Response(Buffer.from(img.bytes), {
        headers: { ...PRIVATE_FILE_HEADERS, "Content-Type": img.mime, "Content-Length": String(img.bytes.byteLength) },
    });
}
