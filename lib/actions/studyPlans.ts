"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

// Types
type StudyPlanInsert = Prisma.StudyPlanCreateInput;
type StudyPlanItemInsert = Prisma.StudyPlanItemCreateInput;

/**
 * Create a new study plan
 */
export async function createStudyPlan(data: any) {
    // Prisma CreateInput might be slightly different from Drizzle's, so we cast or adjust
    // Assuming data matches Prisma's expected input for now
    const plan = await prisma.studyPlan.create({
        data: {
            ...data,
            // Ensure userId is present
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
            ...planData,
            items: {
                create: items.map((item) => ({
                    ...item,
                    // Remove planId if it's in item, as it's handled by relation
                })),
            },
        },
        include: {
            items: true,
        },
    });

    return plan;
}

/**
 * Get a study plan with all its items
 */
export async function getStudyPlanWithItems(planId: string) {
    const plan = await prisma.studyPlan.findUnique({
        where: { id: planId },
        include: {
            items: {
                orderBy: {
                    dueDate: "asc",
                },
            },
        },
    });

    if (!plan) return null;

    // Enrich items with topic information (if needed, but Prisma can fetch relations if topics are related)
    // In Drizzle version, it fetched topics manually.
    // In Prisma schema, StudyPlanItem has `topicIds` as Json.
    // If we want to fetch topics, we need to do it manually since it's a Json array of IDs, not a relation.

    const enrichedItems = await Promise.all(
        plan.items.map(async (item) => {
            const topicIds = (item.topicIds as string[]) || [];
            const topicList = topicIds.length
                ? await prisma.topic.findMany({
                      where: {
                          id: { in: topicIds },
                      },
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
            // Check if settings->>'isArchived' is true
            // Prisma JSON filtering:
            where.settings = {
                path: ["isArchived"],
                equals: true,
            };
        } else {
            // For other statuses, ensure it's NOT archived
            where.AND = [
                {
                    OR: [
                        { settings: { path: ["isArchived"], equals: false } },
                        { settings: { path: ["isArchived"], equals: Prisma.JsonNull } }, // or missing
                        // Prisma doesn't strictly support "is not true" for JSON path easily without raw query or specific structure
                        // But usually checking equals: false or null works if we assume default is false.
                        // Alternatively, use NOT
                    ],
                },
            ];

            // Actually, cleaner way for "not archived":
            // where.NOT = { settings: { path: ["isArchived"], equals: true } };

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

    const orderBy: Prisma.StudyPlanOrderByWithRelationInput = {};
    if (sortBy === "name") {
        orderBy.name = sortOrder;
    } else if (sortBy === "endDate") {
        orderBy.endDate = sortOrder;
    } else {
        orderBy.createdAt = sortOrder;
    }

    const plans = await prisma.studyPlan.findMany({
        where,
        orderBy,
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
        orderBy: {
            endDate: "asc",
        },
    });

    return plans;
}

/**
 * Update a study plan
 */
export async function updateStudyPlan(planId: string, data: any) {
    const updated = await prisma.studyPlan.update({
        where: { id: planId },
        data,
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
        orderBy: {
            dueDate: "asc",
        },
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
            status: "PENDING",
        },
        orderBy: {
            dueDate: "asc",
        },
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
            status: "PENDING",
            dueDate: { lte: now },
        },
        orderBy: {
            dueDate: "asc",
        },
    });

    return items;
}

/**
 * Update a study plan item status
 */
export async function updateStudyPlanItemStatus(
    itemId: string,
    status: "PENDING" | "IN_PROGRESS" | "DONE" | "SKIPPED"
) {
    const updated = await prisma.studyPlanItem.update({
        where: { id: itemId },
        data: {
            status,
            completedAt: status === "DONE" ? new Date() : null,
        },
    });

    return updated;
}

/**
 * Update multiple study plan items status
 */
export async function updateStudyPlanItemsStatus(
    itemIds: string[],
    status: "PENDING" | "IN_PROGRESS" | "DONE" | "SKIPPED"
) {
    if (itemIds.length === 0) return [];

    // Prisma updateMany doesn't return the updated records, only count.
    // So we update and then fetch, or just return count.
    // The original returned updated items.

    await prisma.studyPlanItem.updateMany({
        where: {
            id: { in: itemIds },
        },
        data: {
            status,
            completedAt: status === "DONE" ? new Date() : null,
        },
    });

    return await prisma.studyPlanItem.findMany({
        where: {
            id: { in: itemIds },
        },
    });
}

/**
 * Create a new study plan item
 */
export async function createStudyPlanItem(data: any) {
    const item = await prisma.studyPlanItem.create({
        data,
    });

    return item;
}

/**
 * Update a study plan item
 */
export async function updateStudyPlanItem(itemId: string, data: any) {
    const updated = await prisma.studyPlanItem.update({
        where: { id: itemId },
        data,
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
    const completed = items.filter((i) => i.status === "DONE").length;
    const inProgress = items.filter((i) => i.status === "IN_PROGRESS").length;
    const pending = items.filter((i) => i.status === "PENDING").length;
    const skipped = items.filter((i) => i.status === "SKIPPED").length;

    const totalMinutes = items.reduce((acc, item) => acc + (item.targetMinutes || 0), 0);
    const completedMinutes = items
        .filter((i) => i.status === "DONE")
        .reduce((acc, item) => acc + (item.targetMinutes || 0), 0);

    const completionPercentage = total > 0 ? (completed / total) * 100 : 0;

    return {
        total,
        completed,
        inProgress,
        pending,
        skipped,
        completionPercentage,
        // New properties for StudyPlanView
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

    // Update items one by one (or batch with transaction for better performance)
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

    // Get all active plans for the user
    const plans = await prisma.studyPlan.findMany({
        where: { userId },
        select: { id: true },
    });

    const planIds = plans.map((p) => p.id);

    if (planIds.length === 0) return [];

    const items = await prisma.studyPlanItem.findMany({
        where: {
            planId: { in: planIds },
            dueDate: {
                gte: today,
                lte: tomorrow,
            },
        },
        orderBy: {
            dueDate: "asc",
        },
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

    const { plan, ...itemData } = item;

    // Enrich with topic information
    const topicIds = (item.topicIds as string[]) || [];
    const topicList = topicIds.length
        ? await prisma.topic.findMany({
              where: { id: { in: topicIds } },
          })
        : [];

    return {
        ...itemData,
        topics: topicList,
        planName: plan.name,
        userId: plan.userId,
        isPublic: plan.isPublic,
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

    const orderBy: Prisma.StudyPlanOrderByWithRelationInput = {};
    switch (sortBy) {
        case "name":
            orderBy.name = sortOrder;
            break;
        case "totalTargetHours":
            orderBy.totalTargetHours = sortOrder;
            break;
        case "subject":
            orderBy.subject = { name: sortOrder };
            break;
        case "goal":
            // Prisma doesn't support sorting by JSON field easily
            // We might need raw query or just sort in memory if dataset is small
            // For now, fallback to createdAt
            orderBy.createdAt = sortOrder;
            break;
        case "createdAt":
        default:
            orderBy.createdAt = sortOrder;
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

    // Map to match expected output structure if needed (e.g. flattening subjectName)
    return plans.map((p) => ({
        ...p,
        subjectName: p.subject?.name,
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
    const newPlanData = {
        userId,
        name: `${originalPlan.name} (Copy)`,
        subjectId: originalPlan.subjectId,
        startDate: new Date(), // Start today
        endDate: new Date(
            Date.now() + (new Date(originalPlan.endDate).getTime() - new Date(originalPlan.startDate).getTime())
        ), // Maintain duration
        totalTargetHours: originalPlan.totalTargetHours,
        settings: originalPlan.settings ?? Prisma.JsonNull,
        generatedByModel: originalPlan.generatedByModel,
        isPublic: false, // Default to private
    };

    const newPlan = await prisma.studyPlan.create({
        data: newPlanData,
    });

    // 3. Copy items
    if (originalPlan.items && originalPlan.items.length > 0) {
        const newItemsData = originalPlan.items.map((item) => {
            // Calculate relative due date
            const originalStart = new Date(originalPlan.startDate).getTime();
            const itemDue = new Date(item.dueDate).getTime();
            const offset = itemDue - originalStart;
            const newDueDate = new Date(newPlan.startDate.getTime() + offset);

            return {
                planId: newPlan.id,
                subjectId: item.subjectId,
                topicIds: item.topicIds ?? Prisma.JsonNull,
                questionIds: item.questionIds ?? Prisma.JsonNull,
                taskType: item.taskType,
                status: "PENDING" as const, // Reset status
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
