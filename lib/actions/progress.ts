"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { ProgressStatus } from "@/lib/generated/prisma/client";

/**
 * Get or create user question progress
 */
export async function getUserQuestionProgress(userId: string, questionId: string) {
    const progress = await prisma.userQuestionProgress.findFirst({
        where: {
            userId,
            questionId,
        },
    });

    if (!progress) {
        return await createUserQuestionProgress(userId, questionId);
    }

    return progress;
}

/**
 * Create user question progress record
 */
export async function createUserQuestionProgress(userId: string, questionId: string) {
    const progress = await prisma.userQuestionProgress.create({
        data: {
            userId,
            questionId,
            status: "NOT_ATTEMPTED",
            timesAttempted: 0,
            timesCorrect: 0,
        },
    });

    return progress;
}

/**
 * Update question attempt (mark as attempted, correct, or incorrect)
 */
export async function recordQuestionAttempt(userId: string, questionId: string, isCorrect: boolean) {
    const progress = await getUserQuestionProgress(userId, questionId);

    const newStatus: ProgressStatus = isCorrect ? "CORRECT" : "INCORRECT";
    const newTimesAttempted = (progress.timesAttempted || 0) + 1;
    const newTimesCorrect = isCorrect ? (progress.timesCorrect || 0) + 1 : progress.timesCorrect || 0;

    const updated = await prisma.userQuestionProgress.update({
        where: { id: progress.id },
        data: {
            status: newStatus,
            timesAttempted: newTimesAttempted,
            timesCorrect: newTimesCorrect,
            lastAnsweredAt: new Date(),
        },
    });

    return updated;
}

/**
 * Get user's progress for a set of questions
 */
export async function getUserProgressForQuestions(userId: string, questionIds: string[]) {
    if (questionIds.length === 0) return [];

    const progress = await prisma.userQuestionProgress.findMany({
        where: {
            userId,
            questionId: { in: questionIds },
        },
    });

    return progress;
}

/**
 * Get user's progress for a subject (statistics)
 */
export async function getUserProgressForSubject(userId: string, subjectId: string) {
    const allProgress = await prisma.userQuestionProgress.findMany({
        where: {
            userId,
            question: {
                subjectId,
            },
        },
    });

    return allProgress;
}

/**
 * Mark question as attempted (first view)
 */
export async function markQuestionAttempted(userId: string, questionId: string) {
    const progress = await getUserQuestionProgress(userId, questionId);

    if (progress.status === "NOT_ATTEMPTED") {
        const updated = await prisma.userQuestionProgress.update({
            where: { id: progress.id },
            data: {
                status: "ATTEMPTED",
                timesAttempted: 1,
                lastAnsweredAt: new Date(),
            },
        });

        return updated;
    }

    return progress;
}

/**
 * Get user's recent progress (last N questions attempted)
 */
export async function getUserRecentProgress(userId: string, limit = 20) {
    const progress = await prisma.userQuestionProgress.findMany({
        where: { userId },
        orderBy: { lastAnsweredAt: "desc" },
        take: limit,
    });

    return progress;
}

/**
 * Get user's statistics summary
 */
export async function getUserProgressStatistics(userId: string) {
    const allProgress = await prisma.userQuestionProgress.findMany({
        where: { userId },
    });

    if (allProgress.length === 0) {
        return {
            totalQuestionsAttempted: 0,
            totalQuestionsCorrect: 0,
            totalQuestionsFailed: 0,
            totalAttemptsCount: 0,
            averageAttemptsPerQuestion: 0,
            successRate: 0,
            questionsNotAttempted: 0,
        };
    }

    const totalQuestionsAttempted = allProgress.filter((p) => p.status !== "NOT_ATTEMPTED").length;
    const totalQuestionsCorrect = allProgress.filter((p) => p.status === "CORRECT").length;
    const totalQuestionsFailed = allProgress.filter((p) => p.status === "INCORRECT").length;
    const totalAttemptsCount = allProgress.reduce((sum, p) => sum + (p.timesAttempted || 0), 0);
    const questionsNotAttempted = allProgress.filter((p) => p.status === "NOT_ATTEMPTED").length;

    return {
        totalQuestionsAttempted,
        totalQuestionsCorrect,
        totalQuestionsFailed,
        totalAttemptsCount,
        averageAttemptsPerQuestion: totalQuestionsAttempted > 0 ? totalAttemptsCount / totalQuestionsAttempted : 0,
        successRate: totalQuestionsAttempted > 0 ? (totalQuestionsCorrect / totalQuestionsAttempted) * 100 : 0,
        questionsNotAttempted,
    };
}

/**
 * Get questions the user struggled with (incorrect attempts)
 */
export async function getUserStrugglingQuestions(userId: string, limit = 20) {
    const struggled = await prisma.userQuestionProgress.findMany({
        where: {
            userId,
            status: "INCORRECT",
        },
        orderBy: { timesAttempted: "desc" },
        take: limit,
    });

    return struggled;
}

/**
 * Get questions the user mastered (multiple correct attempts)
 */
export async function getUserMasteredQuestions(userId: string, minCorrectAttempts = 2) {
    const mastered = await prisma.userQuestionProgress.findMany({
        where: {
            userId,
            status: "CORRECT",
            timesCorrect: {
                gte: minCorrectAttempts,
            },
        },
    });

    return mastered;
}

/**
 * Update progress difficulty estimate (personalized difficulty)
 */
export async function updateDifficultyEstimate(userId: string, questionId: string, estimate: number) {
    // We need to find the record first to get ID
    const progress = await getUserQuestionProgress(userId, questionId);

    const updated = await prisma.userQuestionProgress.update({
        where: { id: progress.id },
        data: {
            difficultyEstimate: new Prisma.Decimal(estimate),
        },
    });

    return updated;
}

/**
 * Reset user progress for a question
 */
export async function resetQuestionProgress(userId: string, questionId: string) {
    const progress = await getUserQuestionProgress(userId, questionId);

    const updated = await prisma.userQuestionProgress.update({
        where: { id: progress.id },
        data: {
            status: "NOT_ATTEMPTED",
            timesAttempted: 0,
            timesCorrect: 0,
            lastAnsweredAt: null,
            difficultyEstimate: null,
        },
    });

    return updated;
}

/**
 * Reset all user progress (dangerous - use with caution)
 */
export async function resetAllUserProgress(userId: string) {
    await prisma.userQuestionProgress.updateMany({
        where: { userId },
        data: {
            status: "NOT_ATTEMPTED",
            timesAttempted: 0,
            timesCorrect: 0,
            lastAnsweredAt: null,
            difficultyEstimate: null, // Prisma handles null for nullable fields
        },
    });
}

/**
 * Get user streak (consecutive correct answers)
 */
export async function getUserStreak(userId: string) {
    const progress = await prisma.userQuestionProgress.findMany({
        where: { userId },
        orderBy: { lastAnsweredAt: "desc" },
    });

    let streak = 0;
    for (const p of progress) {
        if (p.status === "CORRECT") {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Get questions for review (attempted but still showing difficulties)
 */
export async function getQuestionsForReview(userId: string, limit = 20) {
    const progress = await prisma.userQuestionProgress.findMany({
        where: {
            userId,
            status: "INCORRECT",
        },
        orderBy: [{ timesCorrect: "asc" }, { lastAnsweredAt: "desc" }],
        take: limit,
    });

    return progress;
}
