"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client/client";
import { Difficulty, QuestionType, AssetType } from "@/generated/prisma/client/enums";

// Re-export types for compatibility
export type Question = Prisma.QuestionGetPayload<{}>;
export type QuestionInsert = Prisma.QuestionCreateInput;
export type QuestionPart = Prisma.QuestionPartGetPayload<{}>;
export type QuestionPartInsert = Prisma.QuestionPartCreateInput;
export type AnswerOptionInsert = Prisma.AnswerOptionCreateInput;
export type QuestionAssetInsert = Prisma.QuestionAssetCreateInput;

/**
 * Create a new question with all its parts and assets
 */
export async function createQuestion(data: any) {
    const { parts, assets, ...questionData } = data;

    const question = await prisma.question.create({
        data: {
            subjectId: questionData.subjectId,
            unitId: questionData.unitId,
            primaryTopicId: questionData.primaryTopicId,
            difficulty: questionData.difficulty as Difficulty,
            questionType: questionData.questionType as QuestionType,
            hasDiagram: questionData.hasDiagram ?? false,
            hasMath: questionData.hasMath ?? false,
            hasTable: questionData.hasTable ?? false,
            metadata: questionData.metadata ?? Prisma.JsonNull,
            sourcePaperId: questionData.sourcePaperId,
            sourcePage: questionData.sourcePage,
            sourceQuestionNumber: questionData.sourceQuestionNumber,
            questionParts: {
                create: parts?.map((part: any, index: number) => ({
                    label: part.label,
                    promptPlain: part.promptPlain,
                    promptRich: part.promptRich ?? Prisma.JsonNull,
                    marks: part.marks,
                    answerExplanationRich: part.answerExplanationRich ?? Prisma.JsonNull,
                    order: index,
                    answerOptions: {
                        create: part.options?.map((opt: any) => ({
                            label: opt.label,
                            contentRich: opt.contentRich ?? Prisma.JsonNull,
                            contentPlain: opt.contentPlain,
                            isCorrect: opt.isCorrect,
                        })),
                    },
                })),
            },
            questionAssets: {
                create: assets?.map((asset: any) => ({
                    type: asset.type as AssetType,
                    storageUrl: asset.storageUrl,
                    altText: asset.altText,
                    bboxData: asset.bboxData ?? Prisma.JsonNull,
                    metadata: asset.metadata ?? Prisma.JsonNull,
                })),
            },
        },
        include: {
            questionParts: {
                include: {
                    answerOptions: true,
                },
            },
            questionAssets: true,
        },
    });

    return { question, parts: question.questionParts };
}

/**
 * Get a question with all its related data
 */
export async function getQuestionWithDetails(questionId: string) {
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            questionParts: {
                orderBy: { order: "asc" },
                include: {
                    answerOptions: true,
                },
            },
            questionAssets: true,
        },
    });

    if (!question) return null;

    return {
        ...question,
        parts: question.questionParts.map((part) => ({
            ...part,
            options: part.answerOptions,
        })),
        assets: question.questionAssets,
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

    const where: Prisma.QuestionWhereInput = {};

    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.primaryTopicId = topicId;
    if (difficulty) where.difficulty = difficulty as Difficulty;
    if (questionType) where.questionType = questionType as QuestionType;
    if (hasDiagram !== undefined) where.hasDiagram = hasDiagram;
    if (hasMath !== undefined) where.hasMath = hasMath;
    if (hasTable !== undefined) where.hasTable = hasTable;

    if (searchText) {
        where.questionParts = {
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
        }),
        prisma.question.count({ where }),
    ]);

    return { questions, total };
}

/**
 * Get questions by topic for a subject
 */
export async function getQuestionsByTopic(subjectId: string, topicId: string, limit = 50) {
    const result = await prisma.question.findMany({
        where: {
            subjectId,
            primaryTopicId: topicId,
        },
        take: limit,
    });

    return result;
}

/**
 * Update question metadata and properties
 */
export async function updateQuestion(questionId: string, data: Partial<Question>) {
    const updated = await prisma.question.update({
        where: { id: questionId },
        data: {
            ...data,
            metadata: data.metadata ?? undefined,
            difficulty: data.difficulty as Difficulty,
            questionType: data.questionType as QuestionType,
        },
    });

    return updated;
}

/**
 * Bulk update questions (useful for tagging, difficulty updates, etc.)
 */
export async function bulkUpdateQuestions(questionIds: string[], updates: Partial<Question>) {
    const result = await prisma.question.updateMany({
        where: {
            id: { in: questionIds },
        },
        data: {
            ...updates,
            metadata: updates.metadata ?? undefined,
            difficulty: updates.difficulty as Difficulty,
            questionType: updates.questionType as QuestionType,
            updatedAt: new Date(),
        },
    });

    return result;
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
        data: {
            questionId: data.questionId,
            questionPartId: data.questionPartId,
            type: data.type as AssetType,
            storageUrl: data.storageUrl,
            altText: data.altText,
            bboxData: data.bboxData ?? Prisma.JsonNull,
            metadata: data.metadata ?? Prisma.JsonNull,
        },
    });

    return asset;
}

/**
 * Get questions by source paper
 */
export async function getQuestionsBySourcePaper(sourcePaperId: string, limit = 100) {
    const result = await prisma.question.findMany({
        where: { sourcePaperId },
        orderBy: [{ sourcePage: "asc" }, { sourceQuestionNumber: "asc" }],
        take: limit,
    });

    return result;
}

/**
 * Get question statistics for a subject
 */
export async function getQuestionStatistics(subjectId: string) {
    // Prisma doesn't support complex aggregations in a single query like Drizzle's $count in select
    // We need to run multiple counts or a raw query.
    // For simplicity and readability, we'll use multiple counts here,
    // but for performance on large datasets, a raw query or separate stats table is better.

    const [total, easy, medium, hard, veryHard, withDiagrams, withMath, mcq, structured, essay, mixed] =
        await Promise.all([
            prisma.question.count({ where: { subjectId } }),
            prisma.question.count({ where: { subjectId, difficulty: Difficulty.easy } }),
            prisma.question.count({ where: { subjectId, difficulty: Difficulty.medium } }),
            prisma.question.count({ where: { subjectId, difficulty: Difficulty.hard } }),
            prisma.question.count({ where: { subjectId, difficulty: Difficulty.very_hard } }),
            prisma.question.count({ where: { subjectId, hasDiagram: true } }),
            prisma.question.count({ where: { subjectId, hasMath: true } }),
            prisma.question.count({ where: { subjectId, questionType: QuestionType.mcq } }),
            prisma.question.count({ where: { subjectId, questionType: QuestionType.structured } }),
            prisma.question.count({ where: { subjectId, questionType: QuestionType.essay } }),
            prisma.question.count({ where: { subjectId, questionType: QuestionType.mixed } }),
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
    // Prisma doesn't support filtering by relation count directly in findMany yet (without raw query or extensions)
    // We can fetch questions and filter in memory, or use groupBy first.

    const questionsWithParts = await prisma.questionPart.groupBy({
        by: ["questionId"],
        _count: {
            id: true,
        },
        having: {
            id: {
                _count: {
                    gte: minParts,
                },
            },
        },
    });

    const complexIds = questionsWithParts.map((q) => q.questionId);

    if (complexIds.length === 0) return [];

    const result = await prisma.question.findMany({
        where: {
            subjectId,
            id: { in: complexIds },
        },
    });

    return result;
}

/**
 * Create a question part with options
 */
export async function createQuestionPart(questionId: string, data: any) {
    const { options, ...partData } = data;

    const part = await prisma.questionPart.create({
        data: {
            questionId,
            label: partData.label,
            promptPlain: partData.promptPlain,
            promptRich: partData.promptRich ?? Prisma.JsonNull,
            marks: partData.marks,
            answerExplanationRich: partData.answerExplanationRich ?? Prisma.JsonNull,
            order: partData.order,
            answerOptions: {
                create: options?.map((opt: any) => ({
                    label: opt.label,
                    contentRich: opt.contentRich ?? Prisma.JsonNull,
                    contentPlain: opt.contentPlain,
                    isCorrect: opt.isCorrect,
                })),
            },
        },
    });

    return part;
}

/**
 * Export questions in various formats for ingestion results
 */
export async function exportQuestionsData(questionIds: string[]) {
    const result = await prisma.question.findMany({
        where: {
            id: { in: questionIds },
        },
        include: {
            questionParts: true,
            questionAssets: true,
        },
    });

    // Map to match the expected structure if needed (Prisma returns relations as properties)
    return result.map((q) => ({
        ...q,
        parts: q.questionParts,
        assets: q.questionAssets,
    }));
}
