// Parse pipeline for one stored paper: choose an engine, parse (or reuse the cached parse for this file hash),
// validate, crop figures from page images, write the question tree, and link mark scheme + examiner report.
import { aiEnabled } from "@/lib/ai";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { figureKey } from "@/lib/papers/keys";
import { getPageImage, loadPaperPdf, type StoredPaperRef } from "@/lib/papers/pages";
import { cropImage, pageTexts, type PageText } from "@/lib/papers/pdf";
import { parseExaminerReport } from "@/lib/papers/parse/layout-er";
import { parseQuestionPaperLayout } from "@/lib/papers/parse/layout";
import { parseMarkSchemeLayout } from "@/lib/papers/parse/layout-ms";
import { matchMarkScheme } from "@/lib/papers/parse/match";
import { compareNumbers, questionOf } from "@/lib/papers/parse/numbering";
import { parsedMarkSchemeSchema, parsedPaperSchema, type ParsedMarkScheme, type ParsedPaper } from "@/lib/papers/parse/schema";
import { validateStructure, type ValidationReport } from "@/lib/papers/parse/validate";
import { parseWithVision } from "@/lib/papers/parse/vision";
import { tagPaperTopics } from "@/lib/papers/tag-paper";
import type { StorageAdapter } from "@/lib/storage/types";

export type ParseOptions = {
    /** User whose AI quota pays for vision calls (null = system/indexer, no per-user quota) */
    userId: string | null;
    /** Force the vision engine (re-parse with AI) */
    vision?: boolean;
    /** Ignore the hash cache */
    fresh?: boolean;
    /** Replace questions even if someone edited them */
    force?: boolean;
    log?: (msg: string) => void;
};

const hasTextLayer = (pages: PageText[]) => pages.reduce((n, p) => n + p.items.reduce((m, i) => m + i.str.trim().length, 0), 0) > 300;

type CachedParse = { engine: string; model: string | null; result: unknown; validation: unknown };

async function cachedParse(sha256: string, docType: "QP" | "MS" | "ER"): Promise<CachedParse | null> {
    return db.paperParse.findUnique({ where: { sha256_docType: { sha256, docType } } });
}

async function saveParse(sha256: string, docType: "QP" | "MS" | "ER", data: CachedParse) {
    const payload = {
        engine: data.engine,
        model: data.model,
        result: data.result as Prisma.InputJsonValue,
        validation: data.validation as Prisma.InputJsonValue,
    };
    await db.paperParse.upsert({
        where: { sha256_docType: { sha256, docType } },
        create: { sha256, docType, ...payload },
        update: payload,
    });
}

/** Runs the right engine for the file. Returns the parse result (not yet written to questions). */
async function runEngines(store: StorageAdapter, paper: StoredPaperRef & { type: "QP" | "MS" | "ER"; source: string }, opts: ParseOptions) {
    const log = opts.log ?? (() => {});
    const isImages = paper.pageKeys.length > 0;
    let texts: PageText[] = [];
    if (!isImages) {
        const { doc } = await loadPaperPdf(store, paper);
        try {
            texts = await pageTexts(doc);
        } finally {
            await doc.close();
        }
    }
    const textLayer = !isImages && hasTextLayer(texts);

    if (paper.type === "ER") {
        if (!textLayer) throw new Error("Examiner reports need a text layer");
        return { engine: "text", model: null, result: { notes: parseExaminerReport(texts) }, validation: { ok: true, issues: [] } };
    }
    if (paper.type === "MS") {
        if (!textLayer) {
            return {
                engine: "none",
                model: null,
                result: { entries: [], notes: {}, totals: { paper: null, questions: {} } },
                validation: { ok: false, issues: [{ level: "warning", code: "no-text", message: "Scanned mark scheme: shown as images only" }] },
            };
        }
        const ms = parsedMarkSchemeSchema.parse(parseMarkSchemeLayout(texts));
        return { engine: "text", model: null, result: ms, validation: { ok: ms.entries.length > 0, issues: [] } };
    }

    // Question paper
    const layout = textLayer ? parseQuestionPaperLayout(texts) : null;
    const layoutReport = layout ? validateStructure(layout) : null;
    if (layout) log(`layout: ${layout.questions.length} parts, ${layoutReport!.totalMarks} marks, ${layoutReport!.ok ? "valid" : "invalid"}`);

    const wantVision = aiEnabled && (opts.vision || !layout || (paper.source === "UPLOAD" && layout.garbledShare > 0.15));
    if (wantVision) {
        const pages = [];
        const { doc } = isImages ? { doc: undefined } : await loadPaperPdf(store, paper);
        try {
            for (let p = 1; p <= paper.pageCount; p++) {
                const img = await getPageImage(store, paper, p, doc);
                if (img) pages.push({ page: p, png: img.bytes });
            }
        } finally {
            await doc?.close();
        }
        // Cover pages and blank pages cost tokens and carry no questions: skip pages the layout pass found empty
        const usePages = layout ? pages.filter((p) => p.page === 1 || layout.questions.some((q) => q.regions.some((r) => r.page === p.page))) : pages;
        try {
            const v = await parseWithVision(usePages, { userId: opts.userId, hint: layout });
            log(`vision: ${v.paper.questions.length} parts, ${v.report.totalMarks} marks, ${v.report.ok ? "valid" : "invalid"} (${v.calls} calls)`);
            // Prefer the vision result when it validates at least as well as the layout pass
            if (!layoutReport || v.report.ok || !layoutReport.ok) {
                const merged = layout ? keepLayoutGeometry(v.paper, layout) : v.paper;
                return { engine: "vision", model: v.model, result: merged, validation: validateStructure(merged) };
            }
        } catch (err) {
            log(`vision failed: ${(err as Error).message}`);
            if (!layout) throw err;
        }
    }
    if (!layout) throw new Error(aiEnabled ? "Couldn't read this paper" : "This paper is a scan or photo: reading it needs AI, which isn't configured");
    const result: ParsedPaper = { paper: layout.paper, questions: layout.questions, totals: layout.totals };
    return { engine: "text", model: null, result, validation: layoutReport };
}

/** Born-digital papers: the text layer's page regions and marks are exact, so keep them under the model's stems. */
function keepLayoutGeometry(vision: ParsedPaper, layout: ParsedPaper): ParsedPaper {
    const byNumber = new Map(layout.questions.map((q) => [q.number, q]));
    return {
        ...vision,
        questions: vision.questions.map((q) => {
            const l = byNumber.get(q.number);
            return l ? { ...q, regions: l.regions.length ? l.regions : q.regions, figures: q.figures.length ? q.figures : l.figures } : q;
        }),
        totals: layout.totals,
    };
}

/** Writes the question tree for a QP (replacing earlier parses), cropping each figure from its page image. */
async function writeQuestions(store: StorageAdapter, paperId: string, paper: StoredPaperRef, parsed: ParsedPaper, force: boolean) {
    const edited = await db.paperQuestion.count({ where: { paperId, edited: true } });
    if (edited > 0 && !force) return { skipped: true as const };

    const questions = parsed.questions.slice().sort((a, b) => compareNumbers(a.number, b.number));
    const figureRows = new Map<string, { page: number; bbox: number[]; key: string }[]>();
    const perPage = new Map<number, number>();
    let doc: Awaited<ReturnType<typeof loadPaperPdf>>["doc"] | undefined;
    try {
        for (const q of questions) {
            const rows: { page: number; bbox: number[]; key: string }[] = [];
            for (const f of q.figures) {
                if (!doc && paper.pageKeys.length === 0) doc = (await loadPaperPdf(store, paper)).doc;
                const img = await getPageImage(store, paper, f.page, doc);
                if (!img) continue;
                try {
                    const png = await cropImage(img.bytes, f.bbox);
                    const index = (perPage.get(f.page) ?? 0) + 1;
                    perPage.set(f.page, index);
                    const key = figureKey(paper.sha256, f.page, index);
                    await store.put(key, png, "image/png");
                    rows.push({ page: f.page, bbox: f.bbox, key });
                } catch {
                    // A degenerate box: keep the part, drop the figure (the reviewer can redraw it)
                }
            }
            figureRows.set(q.number, rows);
        }
    } finally {
        await doc?.close();
    }

    await db.$transaction(async (tx) => {
        await tx.paperQuestion.deleteMany({ where: { paperId } });
        const ids = new Map<string, string>();
        for (const [order, q] of questions.entries()) {
            const parentId = q.parent ? (ids.get(q.parent) ?? null) : null;
            const row = await tx.paperQuestion.create({
                data: {
                    paperId,
                    parentId,
                    number: q.number,
                    order,
                    stem: q.stem,
                    marks: q.marks,
                    page: q.regions[0]?.page ?? null,
                    bbox: q.regions[0]?.bbox ?? [],
                    figures: (figureRows.get(q.number) ?? []) as Prisma.InputJsonValue,
                    dependsOn: q.dependsOn,
                },
                select: { id: true },
            });
            ids.set(q.number, row.id);
        }
    });
    return { skipped: false as const };
}

/**
 * Links the documents of one sitting: mark-scheme points onto question-paper parts (by number) and examiner-report
 * commentary onto questions. Safe to run whenever any of the three finishes parsing.
 */
export async function linkSitting(sittingId: string) {
    const papers = await db.paper.findMany({ where: { sittingId }, select: { id: true, type: true, sha256: true } });
    const qp = papers.find((p) => p.type === "QP");
    if (!qp) return { matched: 0, missing: [] as string[] };
    const questions = await db.paperQuestion.findMany({ where: { paperId: qp.id }, select: { id: true, number: true, marks: true } });
    if (!questions.length) return { matched: 0, missing: [] };

    const msPaper = papers.find((p) => p.type === "MS");
    const erPaper = papers.find((p) => p.type === "ER");
    const msParse = msPaper ? await cachedParse(msPaper.sha256, "MS") : null;
    const erParse = erPaper ? await cachedParse(erPaper.sha256, "ER") : null;

    let matched = 0;
    let missing: string[] = [];
    const updates: Prisma.PrismaPromise<unknown>[] = [];
    if (msParse && msPaper) {
        const ms = parsedMarkSchemeSchema.parse(msParse.result) as ParsedMarkScheme;
        const result = matchMarkScheme(questions, ms.entries);
        missing = result.missing;
        for (const q of questions) {
            const entries = result.matched.get(q.number);
            const notes = ms.notes[String(questionOf(q.number))];
            if (entries) matched++;
            updates.push(
                db.paperQuestion.update({
                    where: { id: q.id },
                    data: {
                        markPoints: entries
                            ? ({ paperId: msPaper.id, how: result.how.get(q.number), entries } as unknown as Prisma.InputJsonValue)
                            : undefined,
                        markNotes: notes?.text ?? null,
                    },
                }),
            );
        }
    }
    if (erParse) {
        const notes = (erParse.result as { notes: Record<string, string> }).notes ?? {};
        for (const q of questions) {
            // Commentary is per question; show it on the whole question (and so to every part through the parent)
            if (q.number === String(questionOf(q.number))) {
                updates.push(db.paperQuestion.update({ where: { id: q.id }, data: { examinerNotes: notes[q.number] ?? null } }));
            }
        }
    }
    if (updates.length) await db.$transaction(updates);
    return { matched, missing };
}

export async function parsePaper(store: StorageAdapter, paperId: string, opts: ParseOptions) {
    const log = opts.log ?? (() => {});
    const paper = await db.paper.findUniqueOrThrow({
        where: { id: paperId },
        select: { id: true, type: true, source: true, sha256: true, storageKey: true, pageKeys: true, mime: true, pageCount: true, sittingId: true, sitting: { select: { ownerId: true } } },
    });
    await db.paper.update({ where: { id: paperId }, data: { parseStatus: "PARSING", parseError: null } });

    let parse = opts.fresh || opts.vision ? null : await cachedParse(paper.sha256, paper.type);
    if (parse) log(`cache hit (${parse.engine})`);
    if (!parse) {
        parse = await runEngines(store, paper, opts);
        await saveParse(paper.sha256, paper.type, parse);
    }

    let report: ValidationReport | null = null;
    if (paper.type === "QP") {
        const parsed = parsedPaperSchema.parse(parse.result);
        report = validateStructure(parsed);
        const written = await writeQuestions(store, paper.id, paper, parsed, !!opts.force);
        if (written.skipped) log("kept existing edited questions");
    }
    const link = await linkSitting(paper.sittingId);
    log(`linked: ${link.matched} parts matched to the mark scheme${link.missing.length ? `, missing ${link.missing.join(", ")}` : ""}`);
    // Tag topics once the scheme is linked (its words help); re-run whenever any document of the sitting changes
    const qp = paper.type === "QP" ? paper.id : (await db.paper.findFirst({ where: { sittingId: paper.sittingId, type: "QP" }, select: { id: true } }))?.id;
    if (qp) {
        const tags = await tagPaperTopics(qp);
        if (tags.total) log(`topics: ${tags.tagged}/${tags.total} parts tagged`);
    }

    // Uploads always get a human check; indexed papers only when validation found problems
    const status =
        paper.type !== "QP" ? "READY" : paper.sitting.ownerId !== null || !report?.ok || report.issues.length > 0 ? "NEEDS_REVIEW" : "READY";
    await db.paper.update({ where: { id: paperId }, data: { parseStatus: status, parseError: null } });
    return { status, engine: parse.engine, report, link };
}
