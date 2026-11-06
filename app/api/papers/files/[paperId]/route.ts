// The only way a paper file leaves storage. Signed-out → 401; someone else's private upload → 404.
import { db } from "@/lib/db";
import { canViewSittingContent, deniedStatus } from "@/lib/papers/permissions";
import { jsonError, serveModeFor, storedObjectResponse } from "@/lib/papers/serve";
import { getUser } from "@/lib/session";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ paperId: string }> }) {
    const user = await getUser();
    if (!user) return jsonError(401, "Sign in to open papers");

    const { paperId } = await params;
    if (!/^[a-z0-9]{10,40}$/i.test(paperId)) return jsonError(404, "Not found");
    const paper = await db.paper.findUnique({
        where: { id: paperId },
        select: {
            storageKey: true,
            pageKeys: true,
            mime: true,
            type: true,
            sourceUrl: true,
            sitting: { select: { ownerId: true, subject: true, unitCode: true } },
        },
    });
    if (!paper || !canViewSittingContent(user, paper.sitting)) return jsonError(deniedStatus(user), "Not found");

    // Image uploads: ?page=n serves one page image
    const page = Number.parseInt(new URL(request.url).searchParams.get("page") ?? "", 10);
    if (paper.pageKeys.length > 0) {
        const n = Number.isFinite(page) ? page : 1;
        const key = paper.pageKeys[n - 1];
        if (!key) return jsonError(404, "Page not found");
        return storedObjectResponse(storage(), key, { contentType: paper.mime, filename: key.split("/").pop()! });
    }
    return storedObjectResponse(storage(), paper.storageKey, {
        contentType: "application/pdf",
        filename: paper.storageKey.split("/").pop()!,
        sourceUrl: paper.sitting.ownerId === null ? paper.sourceUrl : null,
        serve: paper.sitting.ownerId === null ? serveModeFor(paper.sitting.subject, paper.sitting.unitCode) : "storage",
    });
}
