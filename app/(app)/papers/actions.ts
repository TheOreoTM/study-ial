"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { aiEnabled } from "@/lib/ai";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { runJobs, enqueueParse } from "@/lib/papers/jobs";
import { figureKey } from "@/lib/papers/keys";
import { getPageImage } from "@/lib/papers/pages";
import { cropImage } from "@/lib/papers/pdf";
import { linkSitting } from "@/lib/papers/parse/pipeline";
import { canEditSittingQuestions, canViewSittingContent } from "@/lib/papers/permissions";
import { assertUser } from "@/lib/session";
import { storage } from "@/lib/storage";

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const sittingInput = z.object({ sittingId: z.string().min(1).max(64) });

export async function addToMyPapers(input: { sittingId: string }): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = sittingInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };

    const sitting = await db.paperSitting.findUnique({
        where: { id: parsed.data.sittingId },
        select: { id: true, ownerId: true, _count: { select: { papers: true } } },
    });
    if (!sitting || !canViewSittingContent(user, sitting) || sitting._count.papers === 0) {
        return { ok: false, error: "That paper isn't available." };
    }
    // The question paper and its mark scheme / examiner report come together: they share the sitting.
    await db.userPaper.upsert({
        where: { userId_sittingId: { userId: user.id, sittingId: sitting.id } },
        create: { userId: user.id, sittingId: sitting.id },
        update: {},
    });
    revalidatePath("/papers");
    revalidatePath("/past-papers", "layout");
    return { ok: true };
}

export async function removeFromMyPapers(input: { sittingId: string }): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = sittingInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };
    const sitting = await db.paperSitting.findUnique({ where: { id: parsed.data.sittingId }, select: { ownerId: true } });
    if (sitting?.ownerId === user.id) {
        return { ok: false, error: "This is your own upload. Delete it from the paper page instead." };
    }
    await db.userPaper.deleteMany({ where: { userId: user.id, sittingId: parsed.data.sittingId } });
    revalidatePath("/papers");
    revalidatePath("/past-papers", "layout");
    return { ok: true };
}

// ─── Parsing ─────────────────────────────────────────────────────────────────

const paperInput = z.object({ paperId: z.string().min(1).max(64) });

async function paperForUser(paperId: string, userId: string, role: "STUDENT" | "ADMIN") {
    const paper = await db.paper.findUnique({
        where: { id: paperId },
        select: { id: true, type: true, parseStatus: true, parseError: true, sittingId: true, sitting: { select: { ownerId: true } } },
    });
    if (!paper || !canViewSittingContent({ id: userId, role }, paper.sitting)) return null;
    return paper;
}

/** Kicks the job runner after the response is sent (Vercel keeps the function alive for `after`). */
function kickJobs() {
    after(async () => {
        try {
            await runJobs({ budgetMs: 45_000 });
        } catch (err) {
            console.error("paper jobs failed", err);
        }
    });
}

/**
 * Reads the questions of a paper. The text-layer engine costs nothing, so any signed-in student can start it for an
 * indexed paper; re-reading with AI is for the upload's owner (their quota) or an admin.
 */
export async function requestParse(input: { paperId: string; vision?: boolean }): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = paperInput.extend({ vision: z.boolean().optional() }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };
    const paper = await paperForUser(parsed.data.paperId, user.id, user.role);
    if (!paper) return { ok: false, error: "That paper isn't available." };
    const vision = !!parsed.data.vision;
    if (vision) {
        if (!aiEnabled) return { ok: false, error: "AI reading isn't available right now." };
        if (!canEditSittingQuestions(user, paper.sitting)) return { ok: false, error: "Only the paper's owner can do that." };
    } else if (paper.parseStatus !== "NONE" && paper.parseStatus !== "FAILED") {
        return { ok: true };
    }
    await enqueueParse(paper.id, { userId: paper.sitting.ownerId ? user.id : null, vision, force: vision });
    kickJobs();
    revalidatePath(`/papers/${paper.sittingId}`);
    return { ok: true };
}

/** Polled by the paper page while a parse is queued or running; also nudges the runner along. */
export async function getParseStatus(input: { paperId: string }): Promise<ActionResult<{ status: string; error: string | null }>> {
    const user = await assertUser();
    const parsed = paperInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };
    const paper = await paperForUser(parsed.data.paperId, user.id, user.role);
    if (!paper) return { ok: false, error: "That paper isn't available." };
    if (paper.parseStatus === "QUEUED" || paper.parseStatus === "PARSING") kickJobs();
    return { ok: true, status: paper.parseStatus, error: paper.parseError };
}

// ─── Review ──────────────────────────────────────────────────────────────────

const bbox = z.array(z.number().min(0).max(1)).length(4);

const questionEdit = z.object({
    questionId: z.string().min(1).max(64),
    stem: z.string().max(8000),
    marks: z.number().int().min(0).max(100),
    page: z.number().int().min(1).max(200).nullable(),
    bbox: bbox.nullable(),
    /** Figures to keep (by index) and new figure boxes to crop */
    keepFigures: z.array(z.number().int().min(0).max(20)).max(12),
    addFigures: z.array(z.object({ page: z.number().int().min(1).max(200), bbox })).max(4),
});

export async function saveQuestion(input: z.input<typeof questionEdit>): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = questionEdit.safeParse(input);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    const d = parsed.data;
    const q = await db.paperQuestion.findUnique({
        where: { id: d.questionId },
        select: {
            figures: true,
            paper: { select: { id: true, sittingId: true, sha256: true, storageKey: true, pageKeys: true, mime: true, pageCount: true, sitting: { select: { ownerId: true } } } },
        },
    });
    if (!q || !canEditSittingQuestions(user, q.paper.sitting)) return { ok: false, error: "You can't edit this paper." };
    if (d.page !== null && d.page > q.paper.pageCount) return { ok: false, error: "That page doesn't exist." };

    const old = (q.figures as { page: number; bbox: number[]; key: string }[]) ?? [];
    const figures = d.keepFigures.filter((i) => old[i]).map((i) => old[i]);
    for (const f of d.addFigures) {
        if (f.page > q.paper.pageCount) continue;
        const cropped = await cropFigure(q.paper, f.page, f.bbox as [number, number, number, number], old.length + figures.length);
        if (cropped) figures.push(cropped);
    }
    await db.paperQuestion.update({
        where: { id: d.questionId },
        data: {
            stem: d.stem.trim(),
            marks: d.marks,
            page: d.page,
            bbox: d.bbox ?? [],
            figures: figures as Prisma.InputJsonValue,
            edited: true,
        },
    });
    revalidatePath(`/papers/${q.paper.sittingId}`, "layout");
    return { ok: true };
}

async function cropFigure(
    paper: { sha256: string; storageKey: string; pageKeys: string[]; mime: string; pageCount: number },
    page: number,
    box: [number, number, number, number],
    index: number,
) {
    const store = storage();
    const img = await getPageImage(store, paper, page);
    if (!img) return null;
    try {
        const png = await cropImage(img.bytes, box, 0);
        const key = figureKey(paper.sha256, page, 100 + index + Math.floor(Math.random() * 1e6));
        await store.put(key, png, "image/png");
        return { page, bbox: box, key };
    } catch {
        return null;
    }
}

/** The owner (or an admin, for the index) confirms the questions look right. */
export async function finishReview(input: { paperId: string }): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = paperInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };
    const paper = await paperForUser(parsed.data.paperId, user.id, user.role);
    if (!paper || !canEditSittingQuestions(user, paper.sitting)) return { ok: false, error: "You can't edit this paper." };
    const count = await db.paperQuestion.count({ where: { paperId: paper.id } });
    if (count === 0) return { ok: false, error: "There are no questions to save yet." };
    await db.paper.update({ where: { id: paper.id }, data: { parseStatus: "READY" } });
    await linkSitting(paper.sittingId);
    revalidatePath(`/papers/${paper.sittingId}`, "layout");
    revalidatePath("/papers");
    return { ok: true };
}

/** Deletes a private upload (its sitting, files' records and attempts). Stored bytes shared by hash stay. */
export async function deleteUpload(input: { sittingId: string }): Promise<ActionResult> {
    const user = await assertUser();
    const parsed = sittingInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };
    const sitting = await db.paperSitting.findUnique({ where: { id: parsed.data.sittingId }, select: { ownerId: true } });
    if (!sitting || sitting.ownerId !== user.id) return { ok: false, error: "You can only delete your own uploads." };
    await db.paperSitting.delete({ where: { id: parsed.data.sittingId } });
    revalidatePath("/papers");
    return { ok: true };
}
