import { openai, MODELS, generateEmbedding } from "./client";
import { getDb } from "@/lib/db";
import { questions, resourceChunks, resources } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";

interface StudyPlanParams {
    userId: string;
    subject: string;
    goal: string;
    durationWeeks: number;
    hoursPerDay: number;
    topics?: string[];
    pdfContext?: string; // Legacy, can be removed or kept for direct text
}

interface DailyPlan {
    day: number;
    topics: string[];
    description: string;
    questionIds?: string[];
    resourceContext?: string[]; // New: Context from textbooks
}

export async function generateStudyPlan(params: StudyPlanParams) {
    // 1. Draft (Lite)
    const draftPlan = await generateDraft(params);

    // 2. Enrich with Questions (RAG - Questions)
    const planWithQuestions = await enrichWithQuestions(draftPlan, params.subject);

    // 3. Enrich with Resources (RAG - Textbooks)
    const planWithResources = await enrichWithResources(planWithQuestions, params.subject, params.userId);

    // 4. Refine (Premium - Thinking)
    const finalPlan = await refinePlan(planWithResources, params);

    return finalPlan;
}

async function generateDraft(params: StudyPlanParams): Promise<DailyPlan[]> {
    const prompt = `
    You are an expert academic counselor. Create a study plan for:
    Subject: ${params.subject}
    Goal: ${params.goal}
    Duration: ${params.durationWeeks} weeks
    Daily Commitment: ${params.hoursPerDay} hours
    Topics: ${params.topics?.join(", ") || "All core topics"}

    Return a JSON array of daily schedules.
    Format:
    [
        {
            "day": 1,
            "topics": ["Topic A", "Topic B"],
            "description": "Read chapter 1..."
        }
    ]
    `;

    const completion = await openai.chat.completions.create({
        model: MODELS.flashLite,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error("No response from AI");

    // Handle potential wrapping in { "days": [...] } or just array
    try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) return parsed;
        if (parsed.days) return parsed.days;
        // Fallback if wrapped in some other key, try to find array
        const values = Object.values(parsed);
        const array = values.find((v) => Array.isArray(v));
        return (array as DailyPlan[]) || [];
    } catch (e) {
        console.error("Failed to parse draft plan", e);
        return [];
    }
}

async function enrichWithQuestions(plan: DailyPlan[], subject: string): Promise<DailyPlan[]> {
    const db = getDb();
    const enrichedPlan = [...plan];

    await Promise.all(
        enrichedPlan.map(async (day) => {
            const dayQuestions: string[] = [];

            // For each topic in the day, find relevant questions concurrently
            await Promise.all(
                day.topics.map(async (topic) => {
                    try {
                        const embedding = await generateEmbedding(`${subject}: ${topic}`);

                        if (!embedding || embedding.length === 0) return;

                        // Vector search
                        const similarQuestions = await db
                            .select({ id: questions.id })
                            .from(questions)
                            .orderBy(sql`${questions.embedding} <-> ${JSON.stringify(embedding)}`)
                            .limit(2);

                        dayQuestions.push(...similarQuestions.map((q) => q.id));
                    } catch (error) {
                        console.error(`Failed to find questions for topic: ${topic}`, error);
                    }
                })
            );

            // Deduplicate and assign
            day.questionIds = Array.from(new Set(dayQuestions));
        })
    );

    return enrichedPlan;
}

async function enrichWithResources(plan: DailyPlan[], subject: string, userId: string): Promise<DailyPlan[]> {
    const db = getDb();
    const enrichedPlan = [...plan];

    await Promise.all(
        enrichedPlan.map(async (day) => {
            const dayContext: string[] = [];

            await Promise.all(
                day.topics.map(async (topic) => {
                    try {
                        const embedding = await generateEmbedding(`${subject}: ${topic}`);
                        if (!embedding || embedding.length === 0) return;

                        // Search resource chunks
                        const similarChunks = await db
                            .select({ content: resourceChunks.content })
                            .from(resourceChunks)
                            .innerJoin(resources, eq(resourceChunks.resourceId, resources.id))
                            .where(eq(resources.userId, userId))
                            .orderBy(sql`${resourceChunks.embedding} <-> ${JSON.stringify(embedding)}`)
                            .limit(2); // Get top 2 chunks per topic

                        dayContext.push(...similarChunks.map((c) => c.content));
                    } catch (error) {
                        console.error(`Failed to find resources for topic: ${topic}`, error);
                    }
                })
            );
            day.resourceContext = Array.from(new Set(dayContext));
        })
    );
    return enrichedPlan;
}

async function refinePlan(plan: DailyPlan[], params: StudyPlanParams): Promise<DailyPlan[]> {
    // Collect all context for the prompt
    const globalContext = plan
        .map((d) => `Day ${d.day} (${d.topics.join(", ")}): ${d.resourceContext?.join(" ") || ""}`)
        .join("\n\n")
        .slice(0, 20000); // Hard limit

    const prompt = `
    Review and refine this study plan.
    
    Textbook Context (Relevant Excerpts):
    ${globalContext}
    
    Current Plan (JSON):
    ${JSON.stringify(plan.map(({ resourceContext, ...rest }) => rest))} 

    Task:
    1. Check if the pacing is realistic for ${params.hoursPerDay} hours/day.
    2. Ensure topics flow logically.
    3. Use the Textbook Context to ensure the description matches the actual content.
    4. If the context mentions specific sub-topics or examples, include them in the description.
    
    Return the refined JSON array in the same format.
    `;

    const completion = await openai.chat.completions.create({
        model: MODELS.flashThinking,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) return plan;

    try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) return parsed;
        if (parsed.days) return parsed.days;
        const values = Object.values(parsed);
        const array = values.find((v) => Array.isArray(v));
        return (array as DailyPlan[]) || plan;
    } catch (e) {
        console.error("Failed to parse refined plan", e);
        return plan;
    }
}
