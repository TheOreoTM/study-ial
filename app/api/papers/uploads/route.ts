// Upload a paper: one PDF, or several photos (one paper, in page order). Parsing is queued and runs after the
// response, so the request returns as soon as the files are stored.
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { enqueueParse, runJobs } from "@/lib/papers/jobs";
import { jsonError } from "@/lib/papers/serve";
import { createUpload, uploadLimits, type UploadFile } from "@/lib/papers/upload";
import { getUser } from "@/lib/session";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const meta = z.object({
    title: z.string().max(120).default(""),
    unitCode: z.string().regex(/^W[A-Z]{2}\d{2}$|^ISL\d{2}$/).nullable().default(null),
    type: z.enum(["QP", "MS"]).default("QP"),
    sittingId: z.string().max(64).nullable().default(null),
});

export async function POST(request: Request) {
    const user = await getUser();
    if (!user) return jsonError(401, "Sign in to upload papers");
    const len = Number(request.headers.get("content-length") ?? 0);
    if (len > uploadLimits().maxBytes + 64 * 1024) return jsonError(413, "That upload is too big.");

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return jsonError(400, "Couldn't read the upload.");
    }
    const parsed = meta.safeParse({
        title: form.get("title") ?? "",
        unitCode: (form.get("unitCode") as string) || null,
        type: form.get("type") ?? "QP",
        sittingId: (form.get("sittingId") as string) || null,
    });
    if (!parsed.success) return jsonError(400, "Check the unit and type.");

    const files: UploadFile[] = [];
    for (const entry of form.getAll("files")) {
        if (typeof entry === "string") continue;
        files.push({ name: entry.name, type: entry.type, bytes: new Uint8Array(await entry.arrayBuffer()) });
    }
    const result = await createUpload(storage(), user.id, files, parsed.data);
    if (!result.ok) return jsonError(400, result.error);

    if (!result.deduped) {
        await enqueueParse(result.paperId, { userId: user.id });
        after(async () => {
            try {
                await runJobs({ budgetMs: 50_000 });
            } catch (err) {
                console.error("paper jobs failed", err);
            }
        });
    }
    revalidatePath("/papers");
    return Response.json({ ok: true, sittingId: result.sittingId, deduped: result.deduped });
}
