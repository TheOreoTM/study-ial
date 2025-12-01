"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { Difficulty, QuestionType } from "@/lib/generated/prisma/client";

// Types
type QuestionInsert = Prisma.QuestionCreateInput;
type QuestionPartInsert = Prisma.QuestionPartCreateInput;
type AnswerOptionInsert = Prisma.AnswerOptionCreateInput;
type QuestionAssetInsert = Prisma.QuestionAssetCreateInput;

/**
 * Create a new question with all its parts and assets
 */
export async function createQuestion(data: any) {
    const { parts, assets, ...questionData } = data;

    // Prepare nested create for parts and assets
    const createData: Prisma.QuestionCreateInput = {
        ...questionData,
        parts:
            parts && parts.length > 0
                ? {
                      create: parts.map((part: any, index: number) => ({
                          ...part,
                          order: index, // Ensure order is set
                          options:
                              part.options && part.options.length > 0
                                  ? {
                                        create: part.options,
                                    }
                                  : undefined,
                      })),
                  }
                : undefined,
        assets:
            assets && assets.length > 0
                ? {
                      create: assets,
                  }
                : undefined,
    };

    const question = await prisma.question.create({
        data: createData,
        include: {
            parts: {
                include: {
                    options: true,
                },
            },
            assets: true,
        },
    });

    return { question, parts: question.parts };
}

/**
 * Get a question with all its related data
 */
export async function getQuestionWithDetails(questionId: string) {
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            parts: {
                orderBy: {
                    order: "asc",
                },
                include: {
                    options: true,
                },
            },
            assets: true,
        },
    });

    return question;
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

    const where: Prisma.QuestionWhereInput = {};

    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.primaryTopicId = topicId;
    if (difficulty) where.difficulty = difficulty as Difficulty;
    if (questionType) where.questionType = questionType as QuestionType;
    if (hasDiagram !== undefined) where.hasDiagram = hasDiagram;
    if (hasMath !== undefined) where.hasMath = hasMath;
    if (hasTable !== undefined) where.hasTable = hasTable;

    if (searchText) {
        // Search in question parts promptPlain
        where.parts = {
            some: {
                promptPlain: {
                    contains: searchText,
                    mode: "insensitive",
                },
            },
        };
    }

    const [questions, total] = await Promise.all([
        prisma.question.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
            include: {
                parts: {
                    select: {
                        promptPlain: true,
                    },
                },
            },
        }),
        prisma.question.count({ where }),
    ]);

    return { questions, total };
}

/**
 * Get questions by topic for a subject
 */
export async function getQuestionsByTopic(subjectId: string, topicId: string, limit = 50) {
    const questions = await prisma.question.findMany({
        where: {
            subjectId,
            primaryTopicId: topicId,
        },
        take: limit,
    });

    return questions;
}

/**
 * Update question metadata and properties
 */
export async function updateQuestion(questionId: string, data: Prisma.QuestionUpdateInput) {
    const updated = await prisma.question.update({
        where: { id: questionId },
        data,
    });

    return updated;
}

/**
 * Bulk update questions (useful for tagging, difficulty updates, etc.)
 */
export async function bulkUpdateQuestions(questionIds: string[], updates: Prisma.QuestionUpdateInput) {
    if (questionIds.length === 0) return [];

    await prisma.question.updateMany({
        where: {
            id: { in: questionIds },
        },
        data: updates as any, // updateMany accepts a subset of UpdateInput, casting might be needed for complex types but simple fields work
    });

    // Return updated questions
    return await prisma.question.findMany({
        where: {
            id: { in: questionIds },
        },
    });
}

/**
 * Delete a question and all related data
 */
export async function deleteQuestion(questionId: string) {
    await prisma.question.delete({
        where: { id: questionId },
    });
}

/**
 * Add a question asset (diagram, graph, etc.)
 */
export async function addQuestionAsset(data: any) {
    const asset = await prisma.questionAsset.create({
        data,
    });

    return asset;
}

/**
 * Get questions by source paper
 */
export async function getQuestionsBySourcePaper(sourcePaperId: string, limit = 100) {
    const questions = await prisma.question.findMany({
        where: { sourcePaperId },
        orderBy: [{ sourcePage: "asc" }, { sourceQuestionNumber: "asc" }],
        take: limit,
    });

    return questions;
}

/**
 * Get question statistics for a subject
 */
export async function getQuestionStatistics(subjectId: string) {
    const [total, easy, medium, hard, veryHard, withDiagrams, withMath, mcq, structured, essay, mixed] =
        await Promise.all([
            prisma.question.count({ where: { subjectId } }),
            prisma.question.count({ where: { subjectId, difficulty: "EASY" } }),
            prisma.question.count({ where: { subjectId, difficulty: "MEDIUM" } }),
            prisma.question.count({ where: { subjectId, difficulty: "HARD" } }),
            prisma.question.count({ where: { subjectId, difficulty: "VERY_HARD" } }),
            prisma.question.count({ where: { subjectId, hasDiagram: true } }),
            prisma.question.count({ where: { subjectId, hasMath: true } }),
            prisma.question.count({ where: { subjectId, questionType: "MCQ" } }),
            prisma.question.count({ where: { subjectId, questionType: "STRUCTURED" } }),
            prisma.question.count({ where: { subjectId, questionType: "ESSAY" } }),
            prisma.question.count({ where: { subjectId, questionType: "MIXED" } }),
        ]);

    return {
        total,
        byDifficulty: {
            easy,
            medium,
            hard,
            very_hard: veryHard,
        },
        withDiagrams,
        withMath,
        byType: {
            mcq,
            structured,
            essay,
            mixed,
        },
    };
}

/**
 * Get questions with filter for complexity (has multiple parts, assets, etc.)
 */
export async function getComplexQuestions(subjectId: string, minParts = 2) {
    // Prisma doesn't support filtering by relation count directly in `where` easily without raw query or aggregation.
    // We can fetch questions and filter, or use groupBy on parts.

    // Approach: Group by questionId in parts table to find questions with >= minParts
    const partsCounts = await prisma.questionPart.groupBy({
        by: ["questionId"],
        _count: {
            id: true,
        },
        where: {
            question: {
                subjectId,
            },
        },
        having: {
            id: {
                _count: {
                    gte: minParts,
                },
            },
        },
    });

    const questionIds = partsCounts.map((p) => p.questionId);

    if (questionIds.length === 0) return [];

    const questions = await prisma.question.findMany({
        where: {
            id: { in: questionIds },
        },
    });

    return questions;
}

/**
 * Create a question part with options
 */
export async function createQuestionPart(questionId: string, data: any) {
    const { options, ...partData } = data;

    const part = await prisma.questionPart.create({
        data: {
            ...partData,
            questionId,
            options:
                options && options.length > 0
                    ? {
                          create: options,
                      }
                    : undefined,
        },
        include: {
            options: true,
        },
    });

    return part;
}

/**
 * Export questions in various formats for ingestion results
 */
export async function exportQuestionsData(questionIds: string[]) {
    const questions = await prisma.question.findMany({
        where: {
            id: { in: questionIds },
        },
        include: {
            parts: {
                include: {
                    options: true,
                },
            },
            assets: true,
        },
    });

    return questions;
}
