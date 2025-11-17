import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { dbClient } from "./client";
import { userQuestionProgress } from "./schema";

/**
 * Get or create user question progress
 */
export async function getUserQuestionProgress(
  userId: string,
  questionId: string
) {
  const [progress] = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        eq(userQuestionProgress.questionId, questionId)
      )
    );

  if (!progress) {
    return await createUserQuestionProgress(userId, questionId);
  }

  return progress;
}

/**
 * Create user question progress record
 */
export async function createUserQuestionProgress(
  userId: string,
  questionId: string
) {
  const [progress] = await dbClient
    .insert(userQuestionProgress)
    .values({
      userId,
      questionId,
      status: "not_attempted",
      timesAttempted: 0,
      timesCorrect: 0,
    } as any)
    .returning();

  return progress;
}

/**
 * Update question attempt (mark as attempted, correct, or incorrect)
 */
export async function recordQuestionAttempt(
  userId: string,
  questionId: string,
  isCorrect: boolean
) {
  let progress = await getUserQuestionProgress(userId, questionId);

  const newStatus = isCorrect ? "correct" : "incorrect";
  const newTimesAttempted = (progress.timesAttempted || 0) + 1;
  const newTimesCorrect = isCorrect ? (progress.timesCorrect || 0) + 1 : progress.timesCorrect || 0;

  const [updated] = await dbClient
    .update(userQuestionProgress)
    .set({
      status: newStatus as any,
      timesAttempted: newTimesAttempted,
      timesCorrect: newTimesCorrect,
      lastAnsweredAt: new Date(),
    })
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        eq(userQuestionProgress.questionId, questionId)
      )
    )
    .returning();

  return updated;
}

/**
 * Get user's progress for a set of questions
 */
export async function getUserProgressForQuestions(
  userId: string,
  questionIds: string[]
) {
  if (questionIds.length === 0) return [];

  const progress = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        inArray(userQuestionProgress.questionId, questionIds)
      )
    );

  return progress;
}

/**
 * Get user's progress for a subject (statistics)
 */
export async function getUserProgressForSubject(
  userId: string,
  subjectId: string
) {
  // This would typically require a JOIN with questions table
  // For now, we'll return a summary that needs to be computed
  const allProgress = await dbClient.select().from(userQuestionProgress).where(
    eq(userQuestionProgress.userId, userId)
  );

  return allProgress; // You'd need to filter by subject in your query layer
}

/**
 * Mark question as attempted (first view)
 */
export async function markQuestionAttempted(userId: string, questionId: string) {
  const progress = await getUserQuestionProgress(userId, questionId);

  if (progress.status === "not_attempted") {
    const [updated] = await dbClient
      .update(userQuestionProgress)
      .set({
        status: "attempted" as any,
        timesAttempted: 1,
        lastAnsweredAt: new Date(),
      })
      .where(
        and(
          eq(userQuestionProgress.userId, userId),
          eq(userQuestionProgress.questionId, questionId)
        )
      )
      .returning();

    return updated;
  }

  return progress;
}

/**
 * Get user's recent progress (last N questions attempted)
 */
export async function getUserRecentProgress(userId: string, limit = 20) {
  const progress = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(eq(userQuestionProgress.userId, userId))
    .orderBy(desc(userQuestionProgress.lastAnsweredAt))
    .limit(limit);

  return progress;
}

/**
 * Get user's statistics summary
 */
export async function getUserProgressStatistics(userId: string) {
  const allProgress = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(eq(userQuestionProgress.userId, userId));

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

  const totalQuestionsAttempted = allProgress.filter(
    (p) => p.status !== "not_attempted"
  ).length;
  const totalQuestionsCorrect = allProgress.filter(
    (p) => p.status === "correct"
  ).length;
  const totalQuestionsFailed = allProgress.filter(
    (p) => p.status === "incorrect"
  ).length;
  const totalAttemptsCount = allProgress.reduce(
    (sum, p) => sum + (p.timesAttempted || 0),
    0
  );
  const questionsNotAttempted = allProgress.filter(
    (p) => p.status === "not_attempted"
  ).length;

  return {
    totalQuestionsAttempted,
    totalQuestionsCorrect,
    totalQuestionsFailed,
    totalAttemptsCount,
    averageAttemptsPerQuestion:
      totalQuestionsAttempted > 0
        ? totalAttemptsCount / totalQuestionsAttempted
        : 0,
    successRate:
      totalQuestionsAttempted > 0
        ? (totalQuestionsCorrect / totalQuestionsAttempted) * 100
        : 0,
    questionsNotAttempted,
  };
}

/**
 * Get questions the user struggled with (incorrect attempts)
 */
export async function getUserStrugglingQuestions(userId: string, limit = 20) {
  const struggled = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        eq(userQuestionProgress.status, "incorrect")
      )
    )
    .orderBy(desc(userQuestionProgress.timesAttempted))
    .limit(limit);

  return struggled;
}

/**
 * Get questions the user mastered (multiple correct attempts)
 */
export async function getUserMasteredQuestions(
  userId: string,
  minCorrectAttempts = 2
) {
  const allProgress = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        eq(userQuestionProgress.status, "correct")
      )
    );

  // Filter client-side
  const mastered = allProgress.filter(
    (p) => (p.timesCorrect || 0) >= minCorrectAttempts
  );

  return mastered;
}

/**
 * Update progress difficulty estimate (personalized difficulty)
 */
export async function updateDifficultyEstimate(
  userId: string,
  questionId: string,
  estimate: number
) {
  const [updated] = await dbClient
    .update(userQuestionProgress)
    .set({
      difficultyEstimate: estimate.toString() as any,
    })
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        eq(userQuestionProgress.questionId, questionId)
      )
    )
    .returning();

  return updated;
}

/**
 * Reset user progress for a question
 */
export async function resetQuestionProgress(
  userId: string,
  questionId: string
) {
  const [updated] = await dbClient
    .update(userQuestionProgress)
    .set({
      status: "not_attempted" as any,
      timesAttempted: 0,
      timesCorrect: 0,
      lastAnsweredAt: null,
      difficultyEstimate: null,
    })
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        eq(userQuestionProgress.questionId, questionId)
      )
    )
    .returning();

  return updated;
}

/**
 * Reset all user progress (dangerous - use with caution)
 */
export async function resetAllUserProgress(userId: string) {
  await dbClient
    .update(userQuestionProgress)
    .set({
      status: "not_attempted" as any,
      timesAttempted: 0,
      timesCorrect: 0,
      lastAnsweredAt: null,
      difficultyEstimate: null,
    })
    .where(eq(userQuestionProgress.userId, userId));
}

/**
 * Get user streak (consecutive correct answers)
 */
export async function getUserStreak(userId: string) {
  const progress = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(eq(userQuestionProgress.userId, userId))
    .orderBy(desc(userQuestionProgress.lastAnsweredAt));

  let streak = 0;
  for (const p of progress) {
    if (p.status === "correct") {
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
  const progress = await dbClient
    .select()
    .from(userQuestionProgress)
    .where(
      and(
        eq(userQuestionProgress.userId, userId),
        eq(userQuestionProgress.status, "incorrect")
      )
    )
    .orderBy(asc(userQuestionProgress.timesCorrect), desc(userQuestionProgress.lastAnsweredAt))
    .limit(limit);

  return progress;
}
