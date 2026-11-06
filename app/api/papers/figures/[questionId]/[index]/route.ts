// Figures cropped server-side from page images. Signed-in viewers of the paper only.
import { db } from "@/lib/db";
import { canViewSittingContent, deniedStatus } from "@/lib/papers/permissions";
import { jsonError, PRIVATE_FILE_HEADERS } from "@/lib/papers/serve";
import { getUser } from "@/lib/session";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ questionId: string; index: string }> }) {
    const user = await getUser();
    if (!user) return jsonError(401, "Sign in to open papers");
    const { questionId, index } = await params;
    const i = Number.parseInt(index, 10);
    if (!/^[a-z0-9]{10,40}$/i.test(questionId) || !Number.isFinite(i)) return jsonError(404, "Not found");
    const q = await db.paperQuestion.findUnique({
        where: { id: questionId },
        select: { figures: true, paper: { select: { sitting: { select: { ownerId: true } } } } },
    });
    if (!q || !canViewSittingContent(user, q.paper.sitting)) return jsonError(deniedStatus(user), "Not found");
    const fig = (q.figures as { key?: string }[])[i];
    if (!fig?.key) return jsonError(404, "Not found");
    const bytes = await storage().get(fig.key);
    if (!bytes) return jsonError(404, "Not found");
    return new Response(Buffer.from(bytes), {
        headers: { ...PRIVATE_FILE_HEADERS, "Content-Type": "image/png", "Content-Length": String(bytes.byteLength) },
    });
}
