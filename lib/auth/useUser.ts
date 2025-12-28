import { authClient } from "@/lib/auth-client";
import {
    createQuestion,
    searchQuestions,
    getQuestionWithDetails,
    getQuestionsByTopic,
    updateQuestion,
    deleteQuestion,
} from "@/lib/actions/questions";
import {
    createStudyPlan,
    createStudyPlanWithItems,
    getStudyPlanWithItems,
    getUserStudyPlans,
    getActiveStudyPlans,
    getTodaysStudyTasks,
    updateStudyPlanItemStatus,
    getStudyPlanStatistics,
} from "@/lib/actions/studyPlans";
import {
    recordQuestionAttempt,
    getUserProgressStatistics,
    getUserStrugglingQuestions,
    getUserMasteredQuestions,
    getUserRecentProgress,
    getUserStreak,
    getQuestionsForReview,
    resetQuestionProgress,
} from "@/lib/actions/progress";
import { type QuestionInsert, type StudyPlanInsert, type StudyPlanItemInsert } from "@/lib/db";

/**
 * Database operations bound to the current user
 */
interface UserDatabaseOperations {
    // Questions - Reading & Searching
    questions: {
        search: (filters: Parameters<typeof searchQuestions>[0]) => ReturnType<typeof searchQuestions>;
        getById: (id: string) => ReturnType<typeof getQuestionWithDetails>;
        getByTopic: (topicId: string, limit?: number) => ReturnType<typeof getQuestionsByTopic>;
    };

    // Questions - Creating & Modifying
    questionsAdmin: {
        create: (data: Omit<QuestionInsert, "id">) => ReturnType<typeof createQuestion>;
        update: (id: string, data: Partial<QuestionInsert>) => ReturnType<typeof updateQuestion>;
        delete: (id: string) => ReturnType<typeof deleteQuestion>;
    };

    // Study Plans - Reading
    studyPlans: {
        getAll: () => ReturnType<typeof getUserStudyPlans>;
        getActive: () => ReturnType<typeof getActiveStudyPlans>;
        getById: (id: string) => ReturnType<typeof getStudyPlanWithItems>;
        getTodaysTasks: () => ReturnType<typeof getTodaysStudyTasks>;
        getStats: (id: string) => ReturnType<typeof getStudyPlanStatistics>;
    };

    // Study Plans - Creating & Modifying
    studyPlansAdmin: {
        create: (data: Omit<StudyPlanInsert, "userId">) => ReturnType<typeof createStudyPlan>;
        createWithItems: (
            planData: Omit<StudyPlanInsert, "userId">,
            items: StudyPlanItemInsert[]
        ) => ReturnType<typeof createStudyPlanWithItems>;
        markItemDone: (itemId: string) => ReturnType<typeof updateStudyPlanItemStatus>;
        markItemSkipped: (itemId: string) => ReturnType<typeof updateStudyPlanItemStatus>;
    };

    // Progress - Statistics & Analysis
    progress: {
        getStats: () => ReturnType<typeof getUserProgressStatistics>;
        getStrugglingQuestions: (limit?: number) => ReturnType<typeof getUserStrugglingQuestions>;
        getMasteredQuestions: (minCorrect?: number) => ReturnType<typeof getUserMasteredQuestions>;
        getRecentAttempts: (limit?: number) => ReturnType<typeof getUserRecentProgress>;
        getStreak: () => ReturnType<typeof getUserStreak>;
        getForReview: (limit?: number) => ReturnType<typeof getQuestionsForReview>;
    };

    // Progress - Recording Attempts
    progressAdmin: {
        recordAttempt: (questionId: string, isCorrect: boolean) => ReturnType<typeof recordQuestionAttempt>;
        resetQuestion: (questionId: string) => ReturnType<typeof resetQuestionProgress>;
    };
}

/**
 * Custom hook for accessing Clerk user and bound database operations
 *
 * @example
 * ```tsx
 * const { clerkUser, db, isLoaded } = useUser();
 *
 * if (!isLoaded) return <div>Loading...</div>;
 * if (!clerkUser) return <div>Please sign in</div>;
 *
 * // Use database operations
 * const stats = await db.progress.getStats();
 * const { questions } = await db.questions.search({ subjectId: "..." });
 * await db.progressAdmin.recordAttempt(questionId, true);
 * ```
 */
export function useUser() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const userId = user?.id;

    // Database operations bound to userId
    const db: UserDatabaseOperations = {
        // Questions - Reading & Searching
        questions: {
            search: (filters) => searchQuestions(filters),
            getById: (id) => getQuestionWithDetails(id),
            getByTopic: (topicId, limit) => getQuestionsByTopic("", topicId, limit),
        },

        // Questions - Creating & Modifying (typically admin only)
        questionsAdmin: {
            create: (data) =>
                createQuestion({
                    ...data,
                } as any),
            update: (id, data) => updateQuestion(id, data as any),
            delete: (id) => deleteQuestion(id),
        },

        // Study Plans - Reading
        studyPlans: {
            getAll: () => {
                if (!userId) throw new Error("User not authenticated");
                return getUserStudyPlans(userId);
            },
            getActive: () => {
                if (!userId) throw new Error("User not authenticated");
                return getActiveStudyPlans(userId);
            },
            getById: (id) => getStudyPlanWithItems(id),
            getTodaysTasks: () => {
                if (!userId) throw new Error("User not authenticated");
                return getTodaysStudyTasks(userId);
            },
            getStats: (id) => getStudyPlanStatistics(id),
        },

        // Study Plans - Creating & Modifying
        studyPlansAdmin: {
            create: (data) => {
                if (!userId) throw new Error("User not authenticated");
                return createStudyPlan({
                    ...data,
                    userId,
                } as any);
            },
            createWithItems: (planData, items) => {
                if (!userId) throw new Error("User not authenticated");
                return createStudyPlanWithItems(
                    {
                        ...planData,
                        userId,
                    } as any,
                    items
                );
            },
            markItemDone: (itemId) => updateStudyPlanItemStatus(itemId, "done"),
            markItemSkipped: (itemId) => updateStudyPlanItemStatus(itemId, "skipped"),
        },

        // Progress - Statistics & Analysis
        progress: {
            getStats: () => {
                if (!userId) throw new Error("User not authenticated");
                return getUserProgressStatistics(userId);
            },
            getStrugglingQuestions: (limit) => {
                if (!userId) throw new Error("User not authenticated");
                return getUserStrugglingQuestions(userId, limit);
            },
            getMasteredQuestions: (minCorrect) => {
                if (!userId) throw new Error("User not authenticated");
                return getUserMasteredQuestions(userId, minCorrect);
            },
            getRecentAttempts: (limit) => {
                if (!userId) throw new Error("User not authenticated");
                return getUserRecentProgress(userId, limit);
            },
            getStreak: () => {
                if (!userId) throw new Error("User not authenticated");
                return getUserStreak(userId);
            },
            getForReview: (limit) => {
                if (!userId) throw new Error("User not authenticated");
                return getQuestionsForReview(userId, limit);
            },
        },

        // Progress - Recording Attempts
        progressAdmin: {
            recordAttempt: (questionId, isCorrect) => {
                if (!userId) throw new Error("User not authenticated");
                return recordQuestionAttempt(userId, questionId, isCorrect);
            },
            resetQuestion: (questionId) => {
                if (!userId) throw new Error("User not authenticated");
                return resetQuestionProgress(userId, questionId);
            },
        },
    };

    return {
        // Stack user data
        user,
        userId,

        // Database operations
        db,

        // Helper methods
        isAuthenticated: !!user,
        isLoaded: !isPending,
    };
}
