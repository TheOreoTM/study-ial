"use server";

import { revalidatePath } from "next/cache";
import { generateText, Output } from "ai";
import { z } from "zod";
import { assertAdmin } from "@/lib/session";
import { aiEnabled, AiQuotaError, consumeAiQuota, refundAiQuota, smartModel } from "@/lib/ai";
import { db } from "@/lib/db";
import {
    AdminDataError,
    deleteQuestionData,
    importRowsData,
    resolveImportRows,
    saveQuestionData,
    setQuestionStatusData,
    type ResolvedRow,
} from "./data";
import { checkQuestion, formatZodError, parseImport, questionInputSchema, TYPE_LABELS } from "./validation";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

function revalidateQuestionPages() {
    revalidatePath("/admin", "layout");
    // Public curriculum pages show published question counts.
    revalidatePath("/subjects", "layout");
}

function failure(e: unknown): { ok: false; error: string } {
    if (e instanceof AdminDataError || e instanceof AiQuotaError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Something went wrong. Please try again." };
}

export async function saveQuestion(raw: unknown): Promise<Result<{ id: string; warnings: string[] }>> {
    await assertAdmin();
    const parsed = questionInputSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: formatZodError(parsed.error) };
    try {
        const id = await saveQuestionData(parsed.data);
        revalidateQuestionPages();
        return { ok: true, id, warnings: checkQuestion(parsed.data).warnings };
    } catch (e) {
        return failure(e);
    }
}

const bulkStatusSchema = z.object({
    ids: z.array(z.string().min(1)).min(1, "Select at least one question").max(500),
    status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function setQuestionStatus(raw: unknown): Promise<Result<{ count: number }>> {
    await assertAdmin();
    const parsed = bulkStatusSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: formatZodError(parsed.error) };
    try {
        const count = await setQuestionStatusData(parsed.data.ids, parsed.data.status);
        revalidateQuestionPages();
        return { ok: true, count };
    } catch (e) {
        return failure(e);
    }
}

export async function deleteQuestion(id: unknown): Promise<Result> {
    await assertAdmin();
    const parsed = z.string().min(1).safeParse(id);
    if (!parsed.success) return { ok: false, error: "Invalid question id" };
    try {
        if (!(await deleteQuestionData(parsed.data))) return { ok: false, error: "Question not found" };
        revalidateQuestionPages();
        return { ok: true };
    } catch (e) {
        return failure(e);
    }
}

// ─── Import ──────────────────────────────────────────────────────────────────

export type ImportPreviewRow =
    | {
          index: number;
          ok: true;
          seedKey: string | null;
          unitCode: string;
          topicName: string;
          type: string;
          marks: number;
          stem: string;
          action: "create" | "update";
          warnings: string[];
      }
    | { index: number; ok: false; errors: string[]; label: string };

function toPreview(rows: ResolvedRow[]): ImportPreviewRow[] {
    return rows.map((r) => {
        if (r.ok) {
            return {
                index: r.index,
                ok: true,
                seedKey: r.item.seedKey,
                unitCode: r.item.unitCode,
                topicName: r.topicName,
                type: r.item.type,
                marks: r.item.marks,
                stem: r.item.stem.slice(0, 160),
                action: r.existingId ? "update" : "create",
                warnings: r.warnings,
            };
        }
        const raw = (r.raw ?? {}) as Record<string, unknown>;
        const label =
            typeof raw.seedKey === "string" ? raw.seedKey : typeof raw.stem === "string" ? raw.stem.slice(0, 60) : "";
        return { index: r.index, ok: false, errors: r.errors, label };
    });
}

async function validateImport(text: string) {
    const parsed = parseImport(text);
    if (!parsed.ok) return parsed;
    return { ok: true as const, rows: await resolveImportRows(parsed.rows) };
}

export async function previewImport(text: unknown): Promise<Result<{ rows: ImportPreviewRow[] }>> {
    await assertAdmin();
    if (typeof text !== "string" || !text.trim()) return { ok: false, error: "Paste some JSON first" };
    try {
        const res = await validateImport(text);
        if (!res.ok) return res;
        return { ok: true, rows: toPreview(res.rows) };
    } catch (e) {
        return failure(e);
    }
}

export async function runImport(
    text: unknown,
    publish: unknown,
): Promise<Result<{ created: number; updated: number; skipped: number }>> {
    await assertAdmin();
    if (typeof text !== "string" || !text.trim()) return { ok: false, error: "Paste some JSON first" };
    try {
        // Re-validate server-side: never trust the preview the client saw.
        const res = await validateImport(text);
        if (!res.ok) return res;
        const valid = res.rows.filter((r) => r.ok);
        if (valid.length === 0) return { ok: false, error: "No valid rows to import" };
        const { created, updated } = await importRowsData(res.rows, publish === true ? "PUBLISHED" : "DRAFT");
        revalidateQuestionPages();
        return { ok: true, created, updated, skipped: res.rows.length - valid.length };
    } catch (e) {
        return failure(e);
    }
}

// ─── AI helper ───────────────────────────────────────────────────────────────

const draftSchema = z.object({
    stem: z.string().trim().min(1, "Write the question stem first").max(20_000),
    marks: z.number().int().min(1).max(30),
    type: z.enum(["SHORT", "CALCULATION", "LONG"]),
    topicId: z.string().optional(),
});

export async function draftMarkScheme(raw: unknown): Promise<Result<{ markScheme: string; notes: string | null }>> {
    const admin = await assertAdmin();
    if (!aiEnabled) return { ok: false, error: "AI is not configured" };
    const parsed = draftSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: formatZodError(parsed.error) };
    const { stem, marks, type, topicId } = parsed.data;

    let charged = false;
    try {
        const topic = topicId
            ? await db.topic.findUnique({
                  where: { id: topicId },
                  select: { name: true, specPoints: true, unit: { select: { code: true, name: true } } },
              })
            : null;
        await consumeAiQuota(admin.id, "marking");
        charged = true;

        const context = topic
            ? `Unit ${topic.unit.code} (${topic.unit.name}), topic "${topic.name}".\nSpec points:\n${topic.specPoints.map((s) => `- ${s}`).join("\n")}`
            : "Pearson Edexcel International A Level.";
        const levels = type === "LONG";
        const { output } = await generateText({
            model: smartModel(),
            output: Output.object({
                schema: z.object({
                    points: z
                        .array(z.string())
                        .describe(
                            'Marking points in markdown, each ending with "(1)" (or level descriptors for levels-marked answers)',
                        ),
                    notes: z
                        .string()
                        .nullable()
                        .describe("Brief notes for the examiner, e.g. accepted alternatives, ecf"),
                }),
            }),
            system:
                "You are a senior Pearson Edexcel IAL examiner writing mark schemes in the official style. " +
                "Be concise and precise; use $LaTeX$ for maths and units. Do not restate the question.",
            prompt:
                `${context}\n\nQuestion type: ${TYPE_LABELS[type]}. Total marks: ${marks}.\n\nQuestion:\n${stem}\n\n` +
                (levels
                    ? `Write indicative content points, each ending with "(1)", that together are worth ${marks} marks. ` +
                      "If the question is clearly levels-based, you may add level descriptors in notes."
                    : `Write exactly ${marks} independent marking points, each worth one mark and ending with "(1)". ` +
                      "For calculations, credit method (formula/substitution) and the final answer with unit."),
        });
        const markScheme = output.points
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => {
                const line = p.replace(/^[-*]\s+/, "");
                return `- ${/\(1\)\s*$/.test(line) ? line : `${line} (1)`}`;
            })
            .join("\n");
        return { ok: true, markScheme, notes: output.notes?.trim() || null };
    } catch (e) {
        if (charged) await refundAiQuota(admin.id, "marking");
        return failure(e);
    }
}
