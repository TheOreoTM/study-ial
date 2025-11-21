"use server";

import { eq, and, desc } from "drizzle-orm";
import { dbClient } from "../db/client";
import {
  ingestionJobs,
  sourcePapers,
  IngestionJob,
  IngestionJobInsert,
  SourcePaperInsert,
} from "../db/schema";
import { createQuestion } from "./questions";

/**
 * Create a source paper (past paper)
 */
export async function createSourcePaper(data: SourcePaperInsert) {
  const [paper] = await dbClient
    .insert(sourcePapers)
    .values(data)
    .returning();

  return paper;
}

/**
 * Get source papers by subject
 */
export async function getSourcePapersBySubject(subjectId: string) {
  const papers = await dbClient
    .select()
    .from(sourcePapers)
    .where(eq(sourcePapers.subjectId, subjectId))
    .orderBy(desc(sourcePapers.year), desc(sourcePapers.session));

  return papers;
}

/**
 * Get source papers by year and session
 */
export async function getSourcePapersByYearSession(
  subjectId: string,
  year: number,
  session: string
) {
  const papers = await dbClient
    .select()
    .from(sourcePapers)
    .where(
      and(
        eq(sourcePapers.subjectId, subjectId),
        eq(sourcePapers.year, year),
        eq(sourcePapers.session, session)
      )
    );

  return papers;
}

/**
 * Create an ingestion job for tracking bulk imports
 */
export async function createIngestionJob(data: IngestionJobInsert) {
  const [job] = await dbClient
    .insert(ingestionJobs)
    .values(data)
    .returning();

  return job;
}

/**
 * Get ingestion job
 */
export async function getIngestionJob(jobId: string) {
  const [job] = await dbClient
    .select()
    .from(ingestionJobs)
    .where(eq(ingestionJobs.id, jobId));

  return job;
}

/**
 * Update ingestion job progress
 */
export async function updateIngestionJobProgress(
  jobId: string,
  data: Partial<IngestionJob>
) {
  const [updated] = await dbClient
    .update(ingestionJobs)
    .set(data as any)
    .where(eq(ingestionJobs.id, jobId))
    .returning();

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
    type: "diagram" | "graph" | "table_image" | "formula_image" | "photo";
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
    difficulty = "medium",
  }: {
    sourcePaperId: string;
    subjectId: string;
    primaryTopicId: string;
    difficulty?: "easy" | "medium" | "hard" | "very_hard";
  }
) {
  const errorLog: string[] = [];
  let processedCount = 0;

  try {
    for (const extracted of extractedQuestions) {
      try {
        // Determine if question has special content
        const hasMath =
          extracted.prompt.latex && extracted.prompt.latex.length > 0;
        const parts = extracted.parts || [];
        const questionType =
          parts.length > 1
            ? "structured"
            : parts.some((p) => p.options)
            ? "mcq"
            : "calculation";

        // Create the question
        await createQuestion({
          subjectId,
          primaryTopicId,
          difficulty: difficulty as any,
          questionType: questionType as any,
          hasDiagram: (extracted.assets || []).some(
            (a) => a.type === "diagram"
          ),
          hasMath,
          hasTable: (extracted.assets || []).some(
            (a) => a.type === "table_image"
          ),
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
      errorLog: [
        ...errorLog,
        `Fatal error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    });

    throw error;
  }
}

/**
 * Get recent ingestion jobs
 */
export async function getRecentIngestionJobs(limit = 20) {
  const jobs = await dbClient
    .select()
    .from(ingestionJobs)
    .orderBy(desc(ingestionJobs.createdAt))
    .limit(limit);

  return jobs;
}

/**
 * Get ingestion jobs for a source paper
 */
export async function getIngestionJobsForPaper(sourcePaperId: string) {
  const jobs = await dbClient
    .select()
    .from(ingestionJobs)
    .where(eq(ingestionJobs.sourcePaperId, sourcePaperId))
    .orderBy(desc(ingestionJobs.createdAt));

  return jobs;
}

/**
 * Get pending ingestion jobs
 */
export async function getPendingIngestionJobs() {
  const jobs = await dbClient
    .select()
    .from(ingestionJobs)
    .where(eq(ingestionJobs.status, "pending") as any)
    .orderBy(desc(ingestionJobs.createdAt));

  return jobs;
}

/**
 * Delete a source paper and all associated questions
 */
export async function deleteSourcePaper(sourcePaperId: string) {
  // This will cascade delete all questions and related data
  await dbClient
    .delete(sourcePapers)
    .where(eq(sourcePapers.id, sourcePaperId));
}

/**
 * Get ingestion statistics
 */
export async function getIngestionStatistics() {
  const allJobs = await dbClient.select().from(ingestionJobs);

  const totalJobs = allJobs.length;
  const completedJobs = allJobs.filter((j) => j.status === "completed").length;
  const failedJobs = allJobs.filter((j) => j.status === "failed").length;
  const pendingJobs = allJobs.filter((j) => j.status === "pending").length;
  const processingJobs = allJobs.filter((j) => j.status === "processing").length;

  const totalQuestionsProcessed = allJobs.reduce(
    (sum, j) => sum + (j.processedQuestions || 0),
    0
  );

  return {
    totalJobs,
    completedJobs,
    failedJobs,
    pendingJobs,
    processingJobs,
    totalQuestionsProcessed,
    averageQuestionsPerJob:
      completedJobs > 0 ? totalQuestionsProcessed / completedJobs : 0,
  };
}

/**
 * Validate extracted question structure
 */
export function validateExtractedQuestion(
  question: ExtractedQuestion
): { valid: boolean; errors: string[] } {
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
export function validateExtractedQuestions(
  questions: ExtractedQuestion[]
): {
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
