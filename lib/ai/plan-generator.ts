import { flashLiteModel, flashThinkingModel, generateEmbedding } from "./client";
import { getDb } from "@/lib/db";
import { questions } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

interface StudyPlanParams {
    subject: string;
    goal: string;
    durationWeeks: number;
    hoursPerDay: number;
    topics?: string[];
    pdfContext?: string; // Extracted text from PDF
}

interface DailyPlan {
    day: number;
    topics: string[];
    questionIds: string[];
    description: string;
}

export async function generateStudyPlan(params: StudyPlanParams) {
    // 1. Draft (Lite)
    const draftPlan = await generateDraft(params);

    // 2. Enrich (RAG)
    const enrichedPlan = await enrichWithQuestions(draftPlan, params.subject);

    // 3. Refine (Premium - Optional/Thinking)
    // If we have PDF context or want "Thinking" optimization
    const finalPlan = await refinePlan(enrichedPlan, params);

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

    const result = await flashLiteModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
    });

    const response = result.response.text();
    return JSON.parse(response) as DailyPlan[];
}

async function enrichWithQuestions(plan: DailyPlan[], subject: string): Promise<DailyPlan[]> {
    const db = getDb();
    const enrichedPlan = [...plan];

    for (const day of enrichedPlan) {
        const dayQuestions: string[] = [];

        // For each topic in the day, find relevant questions
        for (const topic of day.topics) {
            try {
                const embedding = await generateEmbedding(`${subject}: ${topic}`);

                // Vector search
                // Note: This assumes pgvector is enabled and the <-> operator works
                const similarQuestions = await db
                    .select({ id: questions.id })
                    .from(questions)
                    .orderBy(sql`${questions.embedding} <-> ${JSON.stringify(embedding)}`)
                    .limit(2);

                dayQuestions.push(...similarQuestions.map((q) => q.id));
            } catch (error) {
                console.error(`Failed to find questions for topic: ${topic}`, error);
            }
        }

        // Deduplicate and assign
        day.questionIds = Array.from(new Set(dayQuestions));
    }

    return enrichedPlan;
}

async function refinePlan(plan: DailyPlan[], params: StudyPlanParams): Promise<DailyPlan[]> {
    // Use the "Thinking" model to review the plan
    const prompt = `
    Review and refine this study plan.
    Context: ${params.pdfContext || "No textbook context provided."}
    
    Current Plan (JSON):
    ${JSON.stringify(plan)}

    Task:
    1. Check if the pacing is realistic for ${params.hoursPerDay} hours/day.
    2. Ensure topics flow logically.
    3. If PDF context is provided, ensure all key chapters are covered.
    
    Return the refined JSON array in the same format.
    `;

    const result = await flashThinkingModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
    });

    const response = result.response.text();
    return JSON.parse(response) as DailyPlan[];
}
