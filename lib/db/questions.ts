import { eq, and, inArray, like, desc, asc } from "drizzle-orm";
import { dbClient } from "./client";
import {
  questions,
  questionParts,
  answerOptions,
  questionAssets,
  Question,
  QuestionInsert,
  QuestionPart,
  QuestionPartInsert,
  QuestionPartInsert as QuestionPartInsertType,
  AnswerOptionInsert,
  QuestionAssetInsert,
} from "./schema";

/**
 * Create a new question with all its parts and assets
 */
export async function createQuestion(
  data: QuestionInsert & {
    parts?: (QuestionPartInsert & {
      options?: AnswerOptionInsert[];
    })[];
    assets?: QuestionAssetInsert[];
  }
) {
  const { parts, assets, ...questionData } = data;

  // Create the main question
  const [question] = await dbClient
    .insert(questions)
    .values(questionData)
    .returning();

  // Create question parts if provided
  const createdParts: QuestionPart[] = [];
  if (parts && parts.length > 0) {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const [createdPart] = await dbClient
        .insert(questionParts)
        .values({
          ...part,
          questionId: question.id,
          order: i,
        })
        .returning();

      createdParts.push(createdPart);

      // Create answer options if this is an MCQ
      if (part.options && part.options.length > 0) {
        await dbClient
          .insert(answerOptions)
          .values(
            part.options.map((opt) => ({
              ...opt,
              questionPartId: createdPart.id,
            }))
          );
      }
    }
  }

  // Create question assets if provided
  if (assets && assets.length > 0) {
    await dbClient
      .insert(questionAssets)
      .values(
        assets.map((asset) => ({
          ...asset,
          questionId: question.id,
        }))
      );
  }

  return { question, parts: createdParts };
}

/**
 * Get a question with all its related data
 */
export async function getQuestionWithDetails(questionId: string) {
  const [question] = await dbClient
    .select()
    .from(questions)
    .where(eq(questions.id, questionId));

  if (!question) return null;

  const parts = await dbClient
    .select()
    .from(questionParts)
    .where(eq(questionParts.questionId, questionId))
    .orderBy(asc(questionParts.order));

  // For each part, get options if it's an MCQ
  const partsWithOptions = await Promise.all(
    parts.map(async (part) => {
      const options = await dbClient
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.questionPartId, part.id));

      return { ...part, options };
    })
  );

  const assets = await dbClient
    .select()
    .from(questionAssets)
    .where(eq(questionAssets.questionId, questionId));

  return {
    ...question,
    parts: partsWithOptions,
    assets,
  };
}

/**
 * Search questions by various filters
 */
export async function searchQuestions(filters: {
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  questionType?: string;
  hasDiagram?: boolean;
  hasMath?: boolean;
  hasTable?: boolean;
  searchText?: string;
  limit?: number;
  offset?: number;
}) {
  const {
    subjectId,
    topicId,
    difficulty,
    questionType,
    hasDiagram,
    hasMath,
    hasTable,
    searchText,
    limit = 20,
    offset = 0,
  } = filters;

  const conditions = [];

  if (subjectId) {
    conditions.push(eq(questions.subjectId, subjectId));
  }

  if (topicId) {
    conditions.push(eq(questions.primaryTopicId, topicId));
  }

  if (difficulty) {
    conditions.push(eq(questions.difficulty, difficulty as any));
  }

  if (questionType) {
    conditions.push(eq(questions.questionType, questionType as any));
  }

  if (hasDiagram !== undefined) {
    conditions.push(eq(questions.hasDiagram, hasDiagram));
  }

  if (hasMath !== undefined) {
    conditions.push(eq(questions.hasMath, hasMath));
  }

  if (hasTable !== undefined) {
    conditions.push(eq(questions.hasTable, hasTable));
  }

  // For full-text search on question parts
  if (searchText) {
    // This is a basic implementation; for production, use proper full-text search
    const partsWithText = await dbClient
      .select({ questionId: questionParts.questionId })
      .from(questionParts)
      .where(like(questionParts.promptPlain, `%${searchText}%`));

    const questionIds = [...new Set(partsWithText.map((p) => p.questionId))];
    if (questionIds.length > 0) {
      conditions.push(inArray(questions.id, questionIds));
    } else {
      return { questions: [], total: 0 };
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await dbClient
    .select()
    .from(questions)
    .where(whereClause)
    .orderBy(desc(questions.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const [{ count }] = await dbClient
    .select({ count: dbClient.$count(questions.id) as any })
    .from(questions)
    .where(whereClause);

  return { questions: result, total: count || 0 };
}

/**
 * Get questions by topic for a subject
 */
export async function getQuestionsByTopic(
  subjectId: string,
  topicId: string,
  limit = 50
) {
  const result = await dbClient
    .select()
    .from(questions)
    .where(
      and(eq(questions.subjectId, subjectId), eq(questions.primaryTopicId, topicId))
    )
    .limit(limit);

  return result;
}

/**
 * Update question metadata and properties
 */
export async function updateQuestion(
  questionId: string,
  data: Partial<Question>
) {
  const [updated] = await dbClient
    .update(questions)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, questionId))
    .returning();

  return updated;
}

/**
 * Bulk update questions (useful for tagging, difficulty updates, etc.)
 */
export async function bulkUpdateQuestions(
  questionIds: string[],
  updates: Partial<Question>
) {
  const result = await dbClient
    .update(questions)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(inArray(questions.id, questionIds))
    .returning();

  return result;
}

/**
 * Delete a question and all related data
 */
export async function deleteQuestion(questionId: string) {
  await dbClient.delete(questions).where(eq(questions.id, questionId));
  // Cascade delete handles parts and assets
}

/**
 * Add a question asset (diagram, graph, etc.)
 */
export async function addQuestionAsset(data: QuestionAssetInsert) {
  const [asset] = await dbClient
    .insert(questionAssets)
    .values(data)
    .returning();

  return asset;
}

/**
 * Get questions by source paper
 */
export async function getQuestionsBySourcePaper(
  sourcePaperId: string,
  limit = 100
) {
  const result = await dbClient
    .select()
    .from(questions)
    .where(eq(questions.sourcePaperId, sourcePaperId))
    .orderBy(asc(questions.sourcePage), asc(questions.sourceQuestionNumber))
    .limit(limit);

  return result;
}

/**
 * Get question statistics for a subject
 */
export async function getQuestionStatistics(subjectId: string) {
  const stats = await dbClient
    .select({
      total: dbClient.$count(questions.id),
      byDifficulty: {
        easy: dbClient.$count(questions.id),
        medium: dbClient.$count(questions.id),
        hard: dbClient.$count(questions.id),
        very_hard: dbClient.$count(questions.id),
      },
      withDiagrams: dbClient.$count(questions.id),
      withMath: dbClient.$count(questions.id),
      byType: {
        mcq: dbClient.$count(questions.id),
        structured: dbClient.$count(questions.id),
        essay: dbClient.$count(questions.id),
        mixed: dbClient.$count(questions.id),
      },
    })
    .from(questions)
    .where(eq(questions.subjectId, subjectId));

  return stats[0] || null;
}

/**
 * Get questions with filter for complexity (has multiple parts, assets, etc.)
 */
export async function getComplexQuestions(
  subjectId: string,
  minParts = 2
) {
  // Get all questions and their part counts
  const questionsWithParts = await dbClient
    .select({ questionId: questionParts.questionId })
    .from(questionParts)
    .groupBy(questionParts.questionId);

  // Filter client-side for parts count (Drizzle limitation with having)
  const questionIds = questionsWithParts.reduce(
    (acc, q) => {
      if (!acc[q.questionId]) acc[q.questionId] = 0;
      acc[q.questionId]++;
      return acc;
    },
    {} as Record<string, number>
  );

  const complexIds = Object.entries(questionIds)
    .filter(([_, count]) => count >= minParts)
    .map(([id]) => id);

  if (complexIds.length === 0) return [];

  const result = await dbClient
    .select()
    .from(questions)
    .where(
      and(eq(questions.subjectId, subjectId), inArray(questions.id, complexIds))
    );

  return result;
}

/**
 * Create a question part with options
 */
export async function createQuestionPart(
  questionId: string,
  data: QuestionPartInsert & { options?: AnswerOptionInsert[] }
) {
  const { options, ...partData } = data;

  const [part] = await dbClient
    .insert(questionParts)
    .values({
      ...partData,
      questionId,
    })
    .returning();

  if (options && options.length > 0) {
    await dbClient
      .insert(answerOptions)
      .values(
        options.map((opt) => ({
          ...opt,
          questionPartId: part.id,
        }))
      );
  }

  return part;
}

/**
 * Export questions in various formats for ingestion results
 */
export async function exportQuestionsData(questionIds: string[]) {
  const result = await dbClient
    .select()
    .from(questions)
    .where(inArray(questions.id, questionIds));

  // Enrich with related data
  const enriched = await Promise.all(
    result.map(async (q) => {
      const parts = await dbClient
        .select()
        .from(questionParts)
        .where(eq(questionParts.questionId, q.id));

      const assets = await dbClient
        .select()
        .from(questionAssets)
        .where(eq(questionAssets.questionId, q.id));

      return {
        ...q,
        parts,
        assets,
      };
    })
  );

  return enriched;
}
