"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { aiEnabled, AiQuotaError } from "@/lib/ai";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { closestPastPaper, generateQuestions, PARAPHRASE_THRESHOLD, selfCheckQuestion } from "@/lib/generate";
import { parseMarkScheme } from "@/lib/marking";
import { assertAdmin } from "@/lib/session";

const input = z.object({
    topicId: z.string().min(1).max(64),
    count: z.number().int().min(1).max(5),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD", "MIXED"]),
    types: z.array(z.enum(["MCQ", "SHORT", "CALCULATION", "LONG"])).min(1).max(4),
});

export type GenerateResult = { ok: true; created: number; flagged: number; skipped: string[] } | { ok: false; error: string };

/** Writes original questions for a topic as DRAFTs, each solved independently and checked against past papers. */
export async function generateForTopic(raw: z.input<typeof input>): Promise<GenerateResult> {
    const admin = await assertAdmin();
    if (!aiEnabled) return { ok: false, error: "AI isn't configured (OPENROUTER_API_KEY)." };
    const parsed = input.safeParse(raw);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    const d = parsed.data;

    const topic = await db.topic.findUnique({
        where: { id: d.topicId },
        include: { unit: { include: { subject: true } } },
    });
    if (!topic) return { ok: false, error: "Topic not found." };
    if (topic.unit.subject.isLocal) return { ok: false, error: "Generation is for IAL subjects only." };

    const [examples, pastParts] = await Promise.all([
        db.question.findMany({ where: { topicId: topic.id, status: "PUBLISHED" }, take: 3, select: { stem: true } }),
        db.paperQuestion.findMany({
            where: { paper: { sitting: { unitCode: topic.unit.code, ownerId: null } }, stem: { not: "" } },
            select: { id: true, stem: true, number: true, paper: { select: { sitting: { select: { year: true, series: true } } } } },
            take: 3000,
        }),
    ]);

    let generated;
    try {
        generated = await generateQuestions(
            admin.id,
            {
                subject: topic.unit.subject.name,
                unitCode: topic.unit.code,
                unitName: topic.unit.name,
                topicCode: topic.code,
                topicName: topic.name,
                specPoints: topic.specPoints,
                styleExamples: examples.map((e) => e.stem),
            },
            d,
        );
    } catch (err) {
        if (err instanceof AiQuotaError) return { ok: false, error: err.message };
        console.error("generation failed", err);
        return { ok: false, error: "The model didn't return usable questions. Try again." };
    }

    const past = pastParts.map((p) => ({
        id: p.id,
        stem: p.stem,
        label: `${topic.unit.code} ${p.paper.sitting.series ?? ""} ${p.paper.sitting.year ?? ""} Q${p.number}`.replace(/\s+/g, " "),
    }));
    let created = 0;
    let flagged = 0;
    const skipped: string[] = [];
    for (const q of generated.questions) {
        if (q.type === "MCQ" && (q.options.length !== 4 || q.options.filter((o) => o.isCorrect).length !== 1)) {
            skipped.push("an MCQ without exactly four options and one answer");
            continue;
        }
        const schemeMarks = parseMarkScheme(q.markScheme).points.reduce((a, p) => a + p.marks, 0);
        const selfCheck = await selfCheckQuestion(admin.id, q);
        const similar = closestPastPaper(q.stem, past);
        const tooSimilar = !!similar && similar.score >= PARAPHRASE_THRESHOLD;
        const issues = [
            selfCheck.status === "disagree" ? "The independent solver got a different answer" : "",
            selfCheck.status === "unclear" ? "The solver couldn't confirm the answer" : "",
            q.type !== "MCQ" && schemeMarks !== q.marks ? `Mark scheme adds up to ${schemeMarks}, question is worth ${q.marks}` : "",
            tooSimilar ? `Too close to ${similar!.label} (${Math.round(similar!.score * 100)}% overlap)` : "",
        ].filter(Boolean);
        if (issues.length) flagged++;
        await db.question.create({
            data: {
                unitId: topic.unitId,
                topicId: topic.id,
                type: q.type,
                difficulty: q.difficulty,
                marks: q.marks,
                stem: q.stem,
                markScheme: q.type === "MCQ" ? (q.markScheme || `${q.options.find((o) => o.isCorrect)!.label} (1)`) : q.markScheme,
                explanation: `${q.workedSolution}\n\n**Answer:** ${q.finalAnswer}`,
                source: "ORIGINAL",
                status: "DRAFT",
                generation: {
                    model: generated.model,
                    generatedAt: new Date().toISOString(),
                    finalAnswer: q.finalAnswer,
                    selfCheck,
                    similarity: similar ? { score: similar.score, label: similar.label } : null,
                    issues,
                } as Prisma.InputJsonValue,
                options: q.type === "MCQ" ? { create: q.options.map((o) => ({ label: o.label, text: o.text, isCorrect: o.isCorrect })) } : undefined,
            },
        });
        created++;
    }
    revalidatePath("/admin/generate");
    return { ok: true, created, flagged, skipped };
}
