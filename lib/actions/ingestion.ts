"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { createQuestion } from "./questions";

// Types
type SourcePaperInsert = Prisma.SourcePaperCreateInput;
type IngestionJobInsert = Prisma.IngestionJobCreateInput;

/**
 * Create a source paper (past paper)
 */
export async function createSourcePaper(data: any) {
    const paper = await prisma.sourcePaper.create({
        data,
    });

    return paper;
}

/**
 * Get source papers by subject
 */
export async function getSourcePapersBySubject(subjectId: string) {
    const papers = await prisma.sourcePaper.findMany({
        where: { subjectId },
        orderBy: [{ year: "desc" }, { session: "desc" }],
    });

    return papers;
}

/**
 * Get source papers by year and session
 */
export async function getSourcePapersByYearSession(subjectId: string, year: number, session: string) {
    const papers = await prisma.sourcePaper.findMany({
        where: {
            subjectId,
            year,
            session,
        },
    });

    return papers;
}

/**
 * Create an ingestion job for tracking bulk imports
 */
export async function createIngestionJob(data: any) {
    const job = await prisma.ingestionJob.create({
        data,
    });

    return job;
}

/**
 * Get ingestion job
 */
export async function getIngestionJob(jobId: string) {
    const job = await prisma.ingestionJob.findUnique({
        where: { id: jobId },
    });

    return job;
}

/**
 * Update ingestion job progress
 */
export async function updateIngestionJobProgress(jobId: string, data: Prisma.IngestionJobUpdateInput) {
    const updated = await prisma.ingestionJob.update({
        where: { id: jobId },
        data,
    });

    return updated;
}

/**
 * Type definition for Gemini-extracted question structure
 */
export interface ExtractedQuestion {
    questionNumber: string;
    prompt: {
        text: string;
        latex?: string[];
    };
    parts?: Array<{
        label: string;
        prompt: {
            text: string;
            latex?: string[];
        };
        marks?: number;
        options?: Array<{
            label: string;
            content: {
                text: string;
                latex?: string[];
            };
            isCorrect?: boolean;
        }>;
        answer?: {
            text: string;
            latex?: string[];
        };
    }>;
    assets?: Array<{
        type: "DIAGRAM" | "GRAPH" | "TABLE_IMAGE" | "FORMULA_IMAGE" | "PHOTO";
        storageUrl: string;
        bbox?: {
            page: number;
            x: number;
            y: number;
            width: number;
            height: number;
        };
        altText?: string;
    }>;
}

/**
 * Process extracted questions from Gemini and insert into database
 * This is the main ingestion function you'll call after Gemini processes the PDF
 */
export async function ingestionQuestions(
    jobId: string,
    extractedQuestions: ExtractedQuestion[],
    {
        sourcePaperId,
        subjectId,
        primaryTopicId,
        difficulty = "MEDIUM",
    }: {
        sourcePaperId: string;
        subjectId: string;
        primaryTopicId: string;
        difficulty?: "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";
    }
) {
    const errorLog: string[] = [];
    let processedCount = 0;

    try {
        for (const extracted of extractedQuestions) {
            try {
                // Determine if question has special content
                const hasMath = extracted.prompt.latex && extracted.prompt.latex.length > 0;
                const parts = extracted.parts || [];
                const questionType =
                    parts.length > 1 ? "STRUCTURED" : parts.some((p) => p.options) ? "MCQ" : "CALCULATION";

                // Create the question
                await createQuestion({
                    subjectId,
                    primaryTopicId,
                    difficulty: difficulty as any,
                    questionType: questionType as any,
                    hasDiagram: (extracted.assets || []).some((a) => a.type === "DIAGRAM"),
                    hasMath,
                    hasTable: (extracted.assets || []).some((a) => a.type === "TABLE_IMAGE"),
                    metadata: {
                        tags: [],
                        source: "gemini_extraction",
                    },
                    sourcePaperId,
                    sourceQuestionNumber: extracted.questionNumber,
                    parts: parts.map((part, idx) => ({
                        label: part.label,
                        promptPlain: part.prompt.text,
                        promptRich: {
                            blocks: [
                                { type: "text", content: part.prompt.text },
                                ...(part.prompt.latex || []).map((latex: string) => ({
                                    type: "math",
                                    latex,
                                })),
                            ],
                        } as any,
                        marks: part.marks || null,
                        answerExplanationRich: part.answer
                            ? {
                                  blocks: [
                                      { type: "text", content: part.answer.text },
                                      ...(part.answer.latex || []).map((latex: string) => ({
                                          type: "math",
                                          latex,
                                      })),
                                  ],
                              }
                            : null,
                        order: idx,
                        options: (part.options || []).map((opt) => ({
                            label: opt.label,
                            contentRich: {
                                blocks: [
                                    { type: "text", content: opt.content.text },
                                    ...(opt.content.latex || []).map((latex: string) => ({
                                        type: "math",
                                        latex,
                                    })),
                                ],
                            } as any,
                            contentPlain: opt.content.text,
                            isCorrect: opt.isCorrect || false,
                        })),
                    })) as any,
                    assets: (extracted.assets || []).map((asset) => ({
                        type: asset.type as any,
                        storageUrl: asset.storageUrl,
                        altText: asset.altText || null,
                        bboxData: (asset.bbox || null) as any,
                        metadata: {} as any,
                    })) as any,
                });

                processedCount++;

                // Update job progress
                await updateIngestionJobProgress(jobId, {
                    processedQuestions: processedCount,
                });
            } catch (error) {
                const errorMsg = `Error processing question ${extracted.questionNumber}: ${
                    error instanceof Error ? error.message : String(error)
                }`;
                errorLog.push(errorMsg);
                console.error(errorMsg);
            }
        }

        // Mark job as completed
        await updateIngestionJobProgress(jobId, {
            status: "completed",
            completedAt: new Date(),
            errorLog: errorLog.length > 0 ? (errorLog as any) : null,
            totalQuestions: extractedQuestions.length,
        });

        return {
            success: true,
            processed: processedCount,
            failed: extractedQuestions.length - processedCount,
            errors: errorLog,
        };
    } catch (error) {
        // Mark job as failed
        await updateIngestionJobProgress(jobId, {
            status: "failed",
            completedAt: new Date(),
            errorLog: [...errorLog, `Fatal error: ${error instanceof Error ? error.message : String(error)}`],
        });

        throw error;
    }
}

/**
 * Get recent ingestion jobs
 */
export async function getRecentIngestionJobs(limit = 20) {
    const jobs = await prisma.ingestionJob.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return jobs;
}

/**
 * Get ingestion jobs for a source paper
 */
export async function getIngestionJobsForPaper(sourcePaperId: string) {
    const jobs = await prisma.ingestionJob.findMany({
        where: { sourcePaperId },
        orderBy: { createdAt: "desc" },
    });

    return jobs;
}

/**
 * Get pending ingestion jobs
 */
export async function getPendingIngestionJobs() {
    const jobs = await prisma.ingestionJob.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
    });

    return jobs;
}

/**
 * Delete a source paper and all associated questions
 */
export async function deleteSourcePaper(sourcePaperId: string) {
    await prisma.sourcePaper.delete({
        where: { id: sourcePaperId },
    });
}

/**
 * Get ingestion statistics
 */
export async function getIngestionStatistics() {
    const [totalJobs, completedJobs, failedJobs, pendingJobs, processingJobs, totalQuestionsProcessed] =
        await Promise.all([
            prisma.ingestionJob.count(),
            prisma.ingestionJob.count({ where: { status: "completed" } }),
            prisma.ingestionJob.count({ where: { status: "failed" } }),
            prisma.ingestionJob.count({ where: { status: "pending" } }),
            prisma.ingestionJob.count({ where: { status: "processing" } }),
            prisma.ingestionJob
                .aggregate({
                    _sum: { processedQuestions: true },
                })
                .then((res) => res._sum.processedQuestions || 0),
        ]);

    return {
        totalJobs,
        completedJobs,
        failedJobs,
        pendingJobs,
        processingJobs,
        totalQuestionsProcessed,
        averageQuestionsPerJob: completedJobs > 0 ? totalQuestionsProcessed / completedJobs : 0,
    };
}

/**
 * Validate extracted question structure
 */
export function validateExtractedQuestion(question: ExtractedQuestion): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!question.questionNumber) {
        errors.push("Missing questionNumber");
    }

    if (!question.prompt || !question.prompt.text) {
        errors.push("Missing question prompt text");
    }

    if (question.parts) {
        question.parts.forEach((part, idx) => {
            if (!part.label) {
                errors.push(`Part ${idx} missing label`);
            }
            if (!part.prompt || !part.prompt.text) {
                errors.push(`Part ${idx} missing prompt text`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Validate batch of extracted questions
 */
export function validateExtractedQuestions(questions: ExtractedQuestion[]): {
    validQuestions: ExtractedQuestion[];
    invalidQuestions: Array<{ question: ExtractedQuestion; errors: string[] }>;
} {
    const validQuestions: ExtractedQuestion[] = [];
    const invalidQuestions: Array<{
        question: ExtractedQuestion;
        errors: string[];
    }> = [];

    questions.forEach((question) => {
        const validation = validateExtractedQuestion(question);
        if (validation.valid) {
            validQuestions.push(question);
        } else {
            invalidQuestions.push({
                question,
                errors: validation.errors,
            });
        }
    });

    return { validQuestions, invalidQuestions };
}
