"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { loadPaperParts, markContextFor } from "@/lib/papers/context";
import { parseExamDuration } from "@/lib/papers/grades";
import { loadPaperPdf } from "@/lib/papers/pages";
import { pageTexts, pageToPlainText } from "@/lib/papers/pdf";
import { assertUser } from "@/lib/session";
import { storage } from "@/lib/storage";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** The paper's own time limit from its cover page, or 90 minutes. */
async function paperMinutes(paperId: string) {
    const paper = await db.paper.findUnique({ where: { id: paperId }, select: { storageKey: true, pageKeys: true, mime: true, sha256: true, pageCount: true } });
    if (!paper || paper.pageKeys.length) return 90;
    try {
        const { doc } = await loadPaperPdf(storage(), paper);
        try {
            return parseExamDuration(pageToPlainText((await pageTexts(doc, [1]))[0])) ?? 90;
        } finally {
            await doc.close();
        }
    } catch {
        return 90;
    }
}

export async function startExam(input: { sittingId: string }): Promise<Result<{ sessionId: string }>> {
    const user = await assertUser();
    const parsed = z.object({ sittingId: z.string().min(1).max(64) }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Invalid paper." };
    const loaded = await loadPaperParts(parsed.data.sittingId, user);
    if (!loaded || loaded.parts.length === 0) return { ok: false, error: "This paper's questions aren't ready yet." };
    // One live exam per paper at a time: resume it instead of starting another
    const live = await db.paperExamSession.findFirst({
        where: { userId: user.id, sittingId: loaded.sitting.id, submittedAt: null, endsAt: { gt: new Date() } },
        select: { id: true },
    });
    if (live) return { ok: true, sessionId: live.id };
    const minutes = await paperMinutes(loaded.qp.id);
    const maxMarks = loaded.parts.reduce((a, p) => a + markContextFor(loaded.rows, p).maxMarks, 0);
    const session = await db.paperExamSession.create({
        data: { userId: user.id, sittingId: loaded.sitting.id, mode: "TIMED", endsAt: new Date(Date.now() + minutes * 60_000), maxMarks },
    });
    revalidatePath(`/papers/${loaded.sitting.id}/exam`);
    return { ok: true, sessionId: session.id };
}

const submitInput = z.object({
    sessionId: z.string().min(1).max(64),
    answers: z.array(z.object({ questionId: z.string().min(1).max(64), answer: z.string().max(6000) })).max(300),
});

/** Saves every answer unmarked; marking happens on the results page, part by part (self or AI). */
export async function submitExam(input: z.input<typeof submitInput>): Promise<Result<{ sessionId: string }>> {
    const user = await assertUser();
    const parsed = submitInput.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Couldn't read your answers." };
    const session = await db.paperExamSession.findFirst({ where: { id: parsed.data.sessionId, userId: user.id }, select: { id: true, sittingId: true, submittedAt: true } });
    if (!session) return { ok: false, error: "Exam not found." };
    if (session.submittedAt) return { ok: true, sessionId: session.id };
    const loaded = await loadPaperParts(session.sittingId, user);
    if (!loaded) return { ok: false, error: "Exam not found." };
    const byId = new Map(loaded.parts.map((p) => [p.id, p]));
    const rows = parsed.data.answers
        .filter((a) => byId.has(a.questionId) && a.answer.trim())
        .map((a) => ({
            userId: user.id,
            questionId: a.questionId,
            sessionId: session.id,
            answer: a.answer.trim(),
            maxMarks: markContextFor(loaded.rows, byId.get(a.questionId)!).maxMarks,
        }));
    await db.$transaction([
        db.paperAttempt.createMany({ data: rows }),
        db.paperExamSession.update({ where: { id: session.id }, data: { submittedAt: new Date() } }),
    ]);
    revalidatePath(`/papers/${session.sittingId}/exam`, "layout");
    return { ok: true, sessionId: session.id };
}
