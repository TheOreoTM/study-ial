// Server-only write helpers for the question bank. Actions call these after assertAdmin();
// kept separate so they can be exercised directly from scripts/tests.
import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { ImportItem, OptionInput, ParsedRow, QuestionInput } from "./validation";

type Tx = Prisma.TransactionClient;

/**
 * Brings a question's options in line with `options`, matching by label so existing option ids
 * (referenced by student attempts) survive edits.
 */
async function syncOptions(tx: Tx, questionId: string, options: OptionInput[]) {
    const labels = options.map((o) => o.label);
    await tx.questionOption.deleteMany({ where: { questionId, label: { notIn: labels } } });
    for (const o of options) {
        await tx.questionOption.upsert({
            where: { questionId_label: { questionId, label: o.label } },
            create: { questionId, label: o.label, text: o.text, isCorrect: o.isCorrect },
            update: { text: o.text, isCorrect: o.isCorrect },
        });
    }
}

function contentData(q: Omit<QuestionInput, "id" | "topicId" | "status"> | ImportItem) {
    return {
        type: q.type,
        difficulty: q.difficulty,
        marks: q.marks,
        stem: q.stem,
        markScheme: q.markScheme,
        explanation: q.explanation,
        source: q.source,
        sourceRef: q.sourceRef,
    };
}

export class AdminDataError extends Error {}

/** Creates or updates a question from validated editor input. Returns the question id. */
export async function saveQuestionData(input: QuestionInput) {
    const topic = await db.topic.findUnique({ where: { id: input.topicId }, select: { id: true, unitId: true } });
    if (!topic) throw new AdminDataError("Topic not found");
    const data = { ...contentData(input), status: input.status, topicId: topic.id, unitId: topic.unitId };

    return db.$transaction(async (tx) => {
        let id = input.id;
        if (id) {
            const existing = await tx.question.findUnique({ where: { id }, select: { id: true } });
            if (!existing) throw new AdminDataError("Question not found");
            await tx.question.update({ where: { id }, data });
        } else {
            id = (await tx.question.create({ data })).id;
        }
        await syncOptions(tx, id, input.options);
        return id;
    });
}

export async function setQuestionStatusData(ids: string[], status: "DRAFT" | "PUBLISHED") {
    const res = await db.question.updateMany({ where: { id: { in: ids } }, data: { status } });
    return res.count;
}

export async function deleteQuestionData(id: string) {
    const { count } = await db.question.deleteMany({ where: { id } });
    return count > 0;
}

// ─── Import ──────────────────────────────────────────────────────────────────

export type ResolvedRow =
    | {
          index: number;
          ok: true;
          item: ImportItem;
          warnings: string[];
          topicId: string;
          unitId: string;
          topicName: string;
          /** Set when a question with this seedKey already exists (it will be updated). */
          existingId: string | null;
      }
    | { index: number; ok: false; errors: string[]; raw: unknown };

/** Adds DB checks (unit/topic exist, seedKey already present) to rows that passed schema validation. */
export async function resolveImportRows(rows: ParsedRow[]): Promise<ResolvedRow[]> {
    const valid = rows.filter((r) => r.ok);
    const unitCodes = [...new Set(valid.map((r) => r.item.unitCode))];
    const seedKeys = valid.map((r) => r.item.seedKey).filter((k): k is string => Boolean(k));

    const [units, existing] = await Promise.all([
        db.unit.findMany({
            where: { code: { in: unitCodes } },
            select: { id: true, code: true, topics: { select: { id: true, slug: true, name: true } } },
        }),
        seedKeys.length
            ? db.question.findMany({ where: { seedKey: { in: seedKeys } }, select: { id: true, seedKey: true } })
            : Promise.resolve([]),
    ]);
    const unitByCode = new Map(units.map((u) => [u.code, u]));
    const existingByKey = new Map(existing.map((q) => [q.seedKey!, q.id]));

    return rows.map((row): ResolvedRow => {
        if (!row.ok) return row;
        const unit = unitByCode.get(row.item.unitCode);
        if (!unit)
            return { index: row.index, ok: false, errors: [`Unknown unitCode "${row.item.unitCode}"`], raw: row.item };
        const topic = unit.topics.find((t) => t.slug === row.item.topicSlug);
        if (!topic) {
            return {
                index: row.index,
                ok: false,
                errors: [`Unknown topicSlug "${row.item.topicSlug}" in ${unit.code}`],
                raw: row.item,
            };
        }
        return {
            ...row,
            topicId: topic.id,
            unitId: unit.id,
            topicName: topic.name,
            existingId: row.item.seedKey ? (existingByKey.get(row.item.seedKey) ?? null) : null,
        };
    });
}

/**
 * Writes resolved rows. New questions get `status`; existing ones (matched by seedKey) keep their
 * current status unless publishing, so a re-import never silently unpublishes content.
 */
export async function importRowsData(rows: ResolvedRow[], status: "DRAFT" | "PUBLISHED") {
    let created = 0;
    let updated = 0;
    for (const row of rows) {
        if (!row.ok) continue;
        const data = { ...contentData(row.item), topicId: row.topicId, unitId: row.unitId };
        await db.$transaction(async (tx) => {
            let id: string;
            const key = row.item.seedKey;
            if (key) {
                const before = await tx.question.findUnique({ where: { seedKey: key }, select: { id: true } });
                const q = await tx.question.upsert({
                    where: { seedKey: key },
                    create: { ...data, seedKey: key, status },
                    update: status === "PUBLISHED" ? { ...data, status } : data,
                });
                id = q.id;
                if (before) updated++;
                else created++;
            } else {
                id = (await tx.question.create({ data: { ...data, status } })).id;
                created++;
            }
            await syncOptions(tx, id, row.item.options);
        });
    }
    return { created, updated };
}
