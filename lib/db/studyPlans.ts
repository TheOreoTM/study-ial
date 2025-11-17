import { eq, and, desc, gte, lte, inArray, asc } from "drizzle-orm";
import { dbClient } from "./client";
import {
  studyPlans,
  studyPlanItems,
  topics,
  StudyPlan,
  StudyPlanInsert,
  StudyPlanItem,
  StudyPlanItemInsert,
} from "./schema";

/**
 * Create a new study plan
 */
export async function createStudyPlan(data: StudyPlanInsert) {
  const [plan] = await dbClient
    .insert(studyPlans)
    .values(data)
    .returning();

  return plan;
}

/**
 * Create a study plan with items
 */
export async function createStudyPlanWithItems(
  planData: StudyPlanInsert,
  items: StudyPlanItemInsert[]
) {
  const [plan] = await dbClient
    .insert(studyPlans)
    .values(planData)
    .returning();

  const createdItems = await dbClient
    .insert(studyPlanItems)
    .values(
      items.map((item) => ({
        ...item,
        planId: plan.id,
      }))
    )
    .returning();

  return { plan, items: createdItems };
}

/**
 * Get a study plan with all its items
 */
export async function getStudyPlanWithItems(planId: string) {
  const [plan] = await dbClient
    .select()
    .from(studyPlans)
    .where(eq(studyPlans.id, planId));

  if (!plan) return null;

  const items = await dbClient
    .select()
    .from(studyPlanItems)
    .where(eq(studyPlanItems.planId, planId))
    .orderBy(asc(studyPlanItems.dueDate));

  // Enrich items with topic information
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      const topicIds = (item.topicIds as string[]) || [];
      const topicList = topicIds.length
        ? await dbClient
            .select()
            .from(topics)
            .where(inArray(topics.id, topicIds))
        : [];

      return { ...item, topics: topicList };
    })
  );

  return { ...plan, items: enrichedItems };
}

/**
 * Get all study plans for a user
 */
export async function getUserStudyPlans(userId: string, limit = 50) {
  const plans = await dbClient
    .select()
    .from(studyPlans)
    .where(eq(studyPlans.userId, userId))
    .orderBy(desc(studyPlans.createdAt))
    .limit(limit);

  return plans;
}

/**
 * Get active study plans for a user (between start and end dates)
 */
export async function getActiveStudyPlans(userId: string) {
  const now = new Date();

  const plans = await dbClient
    .select()
    .from(studyPlans)
    .where(
      and(
        eq(studyPlans.userId, userId),
        lte(studyPlans.startDate, now),
        gte(studyPlans.endDate, now)
      )
    )
    .orderBy(asc(studyPlans.endDate));

  return plans;
}

/**
 * Update a study plan
 */
export async function updateStudyPlan(
  planId: string,
  data: Partial<StudyPlan>
) {
  const [updated] = await dbClient
    .update(studyPlans)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(studyPlans.id, planId))
    .returning();

  return updated;
}

/**
 * Delete a study plan (cascade deletes items)
 */
export async function deleteStudyPlan(planId: string) {
  await dbClient.delete(studyPlans).where(eq(studyPlans.id, planId));
  // CASCADE delete handles items
}

/**
 * Get study plan items for a specific date range
 */
export async function getStudyPlanItemsByDateRange(
  planId: string,
  startDate: Date,
  endDate: Date
) {
  const items = await dbClient
    .select()
    .from(studyPlanItems)
    .where(
      and(
        eq(studyPlanItems.planId, planId),
        gte(studyPlanItems.dueDate, startDate),
        lte(studyPlanItems.dueDate, endDate)
      )
    )
    .orderBy(asc(studyPlanItems.dueDate));

  return items;
}

/**
 * Get pending items for a study plan
 */
export async function getPendingStudyPlanItems(planId: string) {
  const items = await dbClient
    .select()
    .from(studyPlanItems)
    .where(
      and(
        eq(studyPlanItems.planId, planId),
        eq(studyPlanItems.status, "pending")
      )
    )
    .orderBy(asc(studyPlanItems.dueDate));

  return items;
}

/**
 * Get overdue items for a study plan
 */
export async function getOverdueStudyPlanItems(planId: string) {
  const now = new Date();
  const items = await dbClient
    .select()
    .from(studyPlanItems)
    .where(
      and(
        eq(studyPlanItems.planId, planId),
        eq(studyPlanItems.status, "pending"),
        lte(studyPlanItems.dueDate, now)
      )
    )
    .orderBy(asc(studyPlanItems.dueDate));

  return items;
}

/**
 * Update a study plan item status
 */
export async function updateStudyPlanItemStatus(
  itemId: string,
  status: "pending" | "in_progress" | "done" | "skipped"
) {
  const [updated] = await dbClient
    .update(studyPlanItems)
    .set({
      status,
      completedAt: status === "done" ? new Date() : null,
    })
    .where(eq(studyPlanItems.id, itemId))
    .returning();

  return updated;
}

/**
 * Create a new study plan item
 */
export async function createStudyPlanItem(data: StudyPlanItemInsert) {
  const [item] = await dbClient
    .insert(studyPlanItems)
    .values(data)
    .returning();

  return item;
}

/**
 * Update a study plan item
 */
export async function updateStudyPlanItem(
  itemId: string,
  data: Partial<StudyPlanItem>
) {
  const [updated] = await dbClient
    .update(studyPlanItems)
    .set(data)
    .where(eq(studyPlanItems.id, itemId))
    .returning();

  return updated;
}

/**
 * Delete a study plan item
 */
export async function deleteStudyPlanItem(itemId: string) {
  await dbClient.delete(studyPlanItems).where(eq(studyPlanItems.id, itemId));
}

/**
 * Get study plan statistics
 */
export async function getStudyPlanStatistics(planId: string) {
  const items = await dbClient
    .select()
    .from(studyPlanItems)
    .where(eq(studyPlanItems.planId, planId));

  const total = items.length;
  const completed = items.filter((i) => i.status === "done").length;
  const inProgress = items.filter((i) => i.status === "in_progress").length;
  const pending = items.filter((i) => i.status === "pending").length;
  const skipped = items.filter((i) => i.status === "skipped").length;

  const completionPercentage = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    inProgress,
    pending,
    skipped,
    completionPercentage,
  };
}

/**
 * Reschedule study plan items
 */
export async function rescheduleStudyPlanItems(
  planId: string,
  offset: number // days to shift
) {
  const items = await dbClient
    .select()
    .from(studyPlanItems)
    .where(eq(studyPlanItems.planId, planId));

  const shiftedItems = items.map((item) => ({
    ...item,
    dueDate: new Date(item.dueDate.getTime() + offset * 24 * 60 * 60 * 1000),
  }));

  // Update items one by one (or batch with transaction for better performance)
  for (const item of shiftedItems) {
    await dbClient
      .update(studyPlanItems)
      .set({ dueDate: item.dueDate })
      .where(eq(studyPlanItems.id, item.id));
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
  const plans = await dbClient
    .select()
    .from(studyPlans)
    .where(eq(studyPlans.userId, userId));

  const planIds = plans.map((p) => p.id);

  if (planIds.length === 0) return [];

  const items = await dbClient
    .select()
    .from(studyPlanItems)
    .where(
      and(
        inArray(studyPlanItems.planId, planIds),
        gte(studyPlanItems.dueDate, today),
        lte(studyPlanItems.dueDate, tomorrow)
      )
    )
    .orderBy(asc(studyPlanItems.dueDate));

  return items;
}
