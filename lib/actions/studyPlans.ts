"use server";

import { Prisma } from "@/generated/prisma/client/client";
import { Status, type TaskType } from "@/generated/prisma/client/enums";
import { prisma } from "@/lib/prisma";

// Re-export types for compatibility
export type StudyPlan = Prisma.StudyPlanGetPayload<{}>;
export type StudyPlanInsert = Prisma.StudyPlanCreateInput;
export type StudyPlanItem = Prisma.StudyPlanItemGetPayload<{}>;
export type StudyPlanItemInsert = Prisma.StudyPlanItemCreateInput;

/**
 * Create a new study plan
 */
export async function createStudyPlan(data: any) {
    const plan = await prisma.studyPlan.create({
        data: {
            userId: data.userId,
            name: data.name,
            subjectId: data.subjectId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            totalTargetHours: data.totalTargetHours,
            settings: data.settings ?? Prisma.JsonNull,
            generatedByModel: data.generatedByModel,
            isPublic: data.isPublic ?? false,
        },
    });

    return plan;
}

/**
 * Create a study plan with items
 */
export async function createStudyPlanWithItems(planData: any, items: any[]) {
    const plan = await prisma.studyPlan.create({
        data: {
            userId: planData.userId,
            name: planData.name,
            subjectId: planData.subjectId,
            startDate: new Date(planData.startDate),
            endDate: new Date(planData.endDate),
            totalTargetHours: planData.totalTargetHours,
            settings: planData.settings ?? Prisma.JsonNull,
            generatedByModel: planData.generatedByModel,
            isPublic: planData.isPublic ?? false,
            studyPlanItems: {
                create: items.map((item) => ({
                    subjectId: item.subjectId,
                    topicIds: item.topicIds ?? Prisma.JsonNull,
                    questionIds: item.questionIds ?? Prisma.JsonNull,
                    taskType: item.taskType as TaskType,
                    status: item.status as Status,
                    dueDate: new Date(item.dueDate),
                    targetQuestionsCount: item.targetQuestionsCount,
                    targetMinutes: item.targetMinutes,
                    metadata: item.metadata ?? Prisma.JsonNull,
                })),
            },
        },
        include: {
            studyPlanItems: true,
        },
    });

    return { plan, items: plan.studyPlanItems };
}

/**
 * Get a study plan with all its items
 */
export async function getStudyPlanWithItems(planId: string) {
    const plan = await prisma.studyPlan.findUnique({
        where: { id: planId },
        include: {
            studyPlanItems: {
                orderBy: { dueDate: "asc" },
            },
        },
    });

    if (!plan) return null;

    // Enrich items with topic information
    const enrichedItems = await Promise.all(
        plan.studyPlanItems.map(async (item) => {
            const topicIds = (item.topicIds as string[]) || [];
            const topicList = topicIds.length
                ? await prisma.topic.findMany({
                      where: { id: { in: topicIds } },
                  })
                : [];

            return { ...item, topics: topicList };
        })
    );

    return { ...plan, items: enrichedItems };
}

/**
 * Get all study plans for a user with filtering and sorting
 */
export async function getUserStudyPlans(
    userId: string,
    options: {
        search?: string;
        sortBy?: "createdAt" | "name" | "endDate";
        sortOrder?: "asc" | "desc";
        filterStatus?: "active" | "upcoming" | "completed" | "archived" | "all";
        limit?: number;
    } = {}
) {
    const { search, sortBy = "createdAt", sortOrder = "desc", filterStatus = "all", limit = 50 } = options;

    const where: Prisma.StudyPlanWhereInput = {
        userId,
    };

    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }

    const now = new Date();

    // Status filtering logic
    if (filterStatus !== "all") {
        if (filterStatus === "archived") {
            where.settings = { path: ["isArchived"], equals: true };
        } else {
            // For other statuses, ensure it's NOT archived
            // Prisma JSON filtering for "not true" is tricky, usually implies checking for false or null
            // Simplified: we'll filter in application code if complex JSON logic is needed,
            // but Prisma supports basic JSON path filtering.
            // Assuming isArchived is a boolean in the JSON.
            where.AND = [
                {
                    OR: [
                        { settings: { path: ["isArchived"], equals: false } },
                        { settings: { path: ["isArchived"], equals: Prisma.JsonNull } }, // or missing
                        // Prisma doesn't easily support "key missing" in all providers, but for PG it works
                    ],
                },
            ];

            if (filterStatus === "active") {
                where.startDate = { lte: now };
                where.endDate = { gte: now };
            } else if (filterStatus === "upcoming") {
                where.startDate = { gt: now };
            } else if (filterStatus === "completed") {
                where.endDate = { lt: now };
            }
        }
    }

    const plans = await prisma.studyPlan.findMany({
        where,
        orderBy: {
            [sortBy]: sortOrder,
        },
        take: limit,
    });

    return plans;
}

/**
 * Toggle study plan archive status
 */
export async function toggleStudyPlanArchive(planId: string, isArchived: boolean) {
    const plan = await prisma.studyPlan.findUnique({
        where: { id: planId },
        select: { settings: true },
    });

    if (!plan) throw new Error("Study plan not found");

    const currentSettings = (plan.settings as Record<string, any>) || {};

    const updated = await prisma.studyPlan.update({
        where: { id: planId },
        data: {
            settings: { ...currentSettings, isArchived },
        },
    });

    return updated;
}

/**
 * Get active study plans for a user (between start and end dates)
 */
export async function getActiveStudyPlans(userId: string) {
    const now = new Date();

    const plans = await prisma.studyPlan.findMany({
        where: {
            userId,
            startDate: { lte: now },
            endDate: { gte: now },
        },
        orderBy: { endDate: "asc" },
    });

    return plans;
}

/**
 * Update a study plan
 */
export async function updateStudyPlan(planId: string, data: Partial<StudyPlan>) {
    const updated = await prisma.studyPlan.update({
        where: { id: planId },
        data: {
            ...data,
            // Handle JSON fields if necessary, but Partial<StudyPlan> might match
            settings: data.settings ?? undefined,
        },
    });

    return updated;
}

/**
 * Delete a study plan (cascade deletes items)
 */
export async function deleteStudyPlan(planId: string) {
    await prisma.studyPlan.delete({
        where: { id: planId },
    });
}

/**
 * Get study plan items for a specific date range
 */
export async function getStudyPlanItemsByDateRange(planId: string, startDate: Date, endDate: Date) {
    const items = await prisma.studyPlanItem.findMany({
        where: {
            planId,
            dueDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { dueDate: "asc" },
    });

    return items;
}

/**
 * Get pending items for a study plan
 */
export async function getPendingStudyPlanItems(planId: string) {
    const items = await prisma.studyPlanItem.findMany({
        where: {
            planId,
            status: Status.pending,
        },
        orderBy: { dueDate: "asc" },
    });

    return items;
}

/**
 * Get overdue items for a study plan
 */
export async function getOverdueStudyPlanItems(planId: string) {
    const now = new Date();
    const items = await prisma.studyPlanItem.findMany({
        where: {
            planId,
            status: Status.pending,
            dueDate: { lte: now },
        },
        orderBy: { dueDate: "asc" },
    });

    return items;
}

/**
 * Update a study plan item status
 */
export async function updateStudyPlanItemStatus(
    itemId: string,
    status: "pending" | "in_progress" | "done" | "skipped"
) {
    const updated = await prisma.studyPlanItem.update({
        where: { id: itemId },
        data: {
            status: status as Status,
            completedAt: status === "done" ? new Date() : null,
        },
    });

    return updated;
}

/**
 * Update multiple study plan items status
 */
export async function updateStudyPlanItemsStatus(
    itemIds: string[],
    status: "pending" | "in_progress" | "done" | "skipped"
) {
    if (itemIds.length === 0) return [];

    const updated = await prisma.studyPlanItem.updateMany({
        where: {
            id: { in: itemIds },
        },
        data: {
            status: status as Status,
            completedAt: status === "done" ? new Date() : null,
        },
    });

    // updateMany returns a count, typically we want to return the updated items or just the count.
    // The original code returned the updated items.
    // To match that behavior, we fetch them again.
    const items = await prisma.studyPlanItem.findMany({
        where: { id: { in: itemIds } },
    });

    return items;
}

/**
 * Create a new study plan item
 */
export async function createStudyPlanItem(data: any) {
    const item = await prisma.studyPlanItem.create({
        data: {
            planId: data.planId,
            subjectId: data.subjectId,
            topicIds: data.topicIds ?? Prisma.JsonNull,
            questionIds: data.questionIds ?? Prisma.JsonNull,
            taskType: data.taskType as TaskType,
            status: data.status as Status,
            dueDate: new Date(data.dueDate),
            targetQuestionsCount: data.targetQuestionsCount,
            targetMinutes: data.targetMinutes,
            metadata: data.metadata ?? Prisma.JsonNull,
        },
    });

    return item;
}

/**
 * Update a study plan item
 */
export async function updateStudyPlanItem(itemId: string, data: Partial<StudyPlanItem>) {
    const updated = await prisma.studyPlanItem.update({
        where: { id: itemId },
        data: {
            ...data,
            topicIds: data.topicIds ?? undefined,
            questionIds: data.questionIds ?? undefined,
            metadata: data.metadata ?? undefined,
        },
    });

    return updated;
}

/**
 * Delete a study plan item
 */
export async function deleteStudyPlanItem(itemId: string) {
    await prisma.studyPlanItem.delete({
        where: { id: itemId },
    });
}

/**
 * Get study plan statistics
 */
export async function getStudyPlanStatistics(planId: string) {
    const items = await prisma.studyPlanItem.findMany({
        where: { planId },
    });

    const total = items.length;
    const completed = items.filter((i) => i.status === Status.done).length;
    const inProgress = items.filter((i) => i.status === Status.in_progress).length;
    const pending = items.filter((i) => i.status === Status.pending).length;
    const skipped = items.filter((i) => i.status === Status.skipped).length;

    const totalMinutes = items.reduce((acc, item) => acc + (item.targetMinutes || 0), 0);
    const completedMinutes = items
        .filter((i) => i.status === Status.done)
        .reduce((acc, item) => acc + (item.targetMinutes || 0), 0);

    const completionPercentage = total > 0 ? (completed / total) * 100 : 0;

    return {
        total,
        completed,
        inProgress,
        pending,
        skipped,
        completionPercentage,
        totalTasks: total,
        completedTasks: completed,
        totalMinutes,
        completedMinutes,
    };
}

/**
 * Reschedule study plan items
 */
export async function rescheduleStudyPlanItems(
    planId: string,
    offset: number // days to shift
) {
    const items = await prisma.studyPlanItem.findMany({
        where: { planId },
    });

    const shiftedItems = items.map((item) => ({
        ...item,
        dueDate: new Date(item.dueDate.getTime() + offset * 24 * 60 * 60 * 1000),
    }));

    // Update items one by one
    for (const item of shiftedItems) {
        await prisma.studyPlanItem.update({
            where: { id: item.id },
            data: { dueDate: item.dueDate },
        });
    }

    return shiftedItems;
}

/**
 * Get today's study plan tasks for a user
 */
export async function getTodaysStudyTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const items = await prisma.studyPlanItem.findMany({
        where: {
            plan: {
                userId,
            },
            dueDate: {
                gte: today,
                lte: tomorrow,
            },
        },
        orderBy: { dueDate: "asc" },
    });

    return items;
}

/**
 * Get a single study plan item with details
 */
export async function getStudyPlanItem(itemId: string) {
    const item = await prisma.studyPlanItem.findUnique({
        where: { id: itemId },
        include: {
            plan: {
                select: {
                    name: true,
                    userId: true,
                    isPublic: true,
                },
            },
        },
    });

    if (!item) return null;

    // Enrich with topic information
    const topicIds = (item.topicIds as string[]) || [];
    const topicList = topicIds.length
        ? await prisma.topic.findMany({
              where: { id: { in: topicIds } },
          })
        : [];

    return {
        ...item,
        topics: topicList,
        planName: item.plan.name,
        userId: item.plan.userId,
        isPublic: item.plan.isPublic,
    };
}

/**
 * Get all public study plans (Marketplace)
 */
export async function getPublicStudyPlans(
    options: {
        search?: string;
        sortBy?: "createdAt" | "name" | "totalTargetHours" | "subject" | "goal";
        sortOrder?: "asc" | "desc";
        subjectId?: string;
        limit?: number;
    } = {}
) {
    const { search, sortBy = "createdAt", sortOrder = "desc", subjectId, limit = 50 } = options;

    const where: Prisma.StudyPlanWhereInput = {
        isPublic: true,
    };

    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }

    if (subjectId) {
        where.subjectId = subjectId;
    }

    let orderBy: Prisma.StudyPlanOrderByWithRelationInput;
    switch (sortBy) {
        case "name":
            orderBy = { name: sortOrder };
            break;
        case "totalTargetHours":
            orderBy = { totalTargetHours: sortOrder };
            break;
        case "subject":
            orderBy = { subject: { name: sortOrder } };
            break;
        case "goal":
            orderBy = { settings: sortOrder }; // JSON sorting is limited, might not work as expected for nested keys
            break;
        case "createdAt":
        default:
            orderBy = { createdAt: sortOrder };
            break;
    }

    const plans = await prisma.studyPlan.findMany({
        where,
        orderBy,
        take: limit,
        include: {
            subject: {
                select: { name: true },
            },
        },
    });

    // Map result to match expected output structure if needed, or return as is
    return plans.map((plan) => ({
        ...plan,
        subjectName: plan.subject?.name,
    }));
}

/**
 * Toggle study plan privacy
 */
export async function toggleStudyPlanPrivacy(planId: string, isPublic: boolean) {
    const updated = await prisma.studyPlan.update({
        where: { id: planId },
        data: { isPublic },
    });

    return updated;
}

/**
 * Copy a study plan to the current user
 */
export async function copyStudyPlan(planId: string, userId: string) {
    // 1. Fetch the original plan
    const originalPlan = await getStudyPlanWithItems(planId);
    if (!originalPlan) throw new Error("Study plan not found");

    // 2. Create the new plan
    const startDate = new Date();
    const originalEndDate = new Date(originalPlan.endDate);
    const originalStartDate = new Date(originalPlan.startDate);
    const duration = originalEndDate.getTime() - originalStartDate.getTime();
    const endDate = new Date(startDate.getTime() + duration);

    const newPlan = await prisma.studyPlan.create({
        data: {
            userId,
            name: `${originalPlan.name} (Copy)`,
            subjectId: originalPlan.subjectId,
            startDate,
            endDate,
            totalTargetHours: originalPlan.totalTargetHours,
            settings: originalPlan.settings ?? Prisma.JsonNull,
            generatedByModel: originalPlan.generatedByModel,
            isPublic: false,
        },
    });

    // 3. Copy items
    if (originalPlan.items && originalPlan.items.length > 0) {
        const newItemsData = originalPlan.items.map((item) => {
            // Calculate relative due date
            const itemDue = new Date(item.dueDate).getTime();
            const offset = itemDue - originalStartDate.getTime();
            const newDueDate = new Date(startDate.getTime() + offset);

            return {
                planId: newPlan.id,
                subjectId: item.subjectId,
                topicIds: item.topicIds ?? Prisma.JsonNull,
                questionIds: item.questionIds ?? Prisma.JsonNull,
                taskType: item.taskType,
                status: Status.pending,
                dueDate: newDueDate,
                targetQuestionsCount: item.targetQuestionsCount,
                targetMinutes: item.targetMinutes,
                metadata: item.metadata ?? Prisma.JsonNull,
            };
        });

        await prisma.studyPlanItem.createMany({
            data: newItemsData,
        });
    }

    return newPlan;
}
