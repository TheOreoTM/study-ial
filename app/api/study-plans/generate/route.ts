import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/ai/plan-generator";
import { getDb } from "@/lib/db";
import { studyPlans, studyPlanItems, subjects } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        const user = session?.user;
        const userId = user?.id;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        console.log(body);
        const { subjectCode, subjectName, goal, duration, hoursPerDay, topics } = body;

        if (!subjectCode || !subjectName) {
            return new NextResponse("Missing subjectCode or subjectName", { status: 400 });
        }

        const db = getDb();

        let subjectId: string;
        const existingSubject = await db.query.subjects.findFirst({
            where: eq(subjects.code, subjectCode),
        });

        if (existingSubject) {
            subjectId = existingSubject.id;
        } else {
            // Create new subject if it doesn't exist
            const [newSubject] = await db
                .insert(subjects)
                .values({
                    code: subjectCode,
                    name: subjectName,
                })
                .returning();
            subjectId = newSubject.id;
        }

        // 1. Generate the plan using AI
        const generatedPlan = await generateStudyPlan({
            userId,
            subject: subjectName,
            goal,
            durationWeeks: duration,
            hoursPerDay,
            topics,
        });

        // Create the main plan record
        const [plan] = await db
            .insert(studyPlans)
            .values({
                userId,
                name: `${subjectName} Study Plan`,
                subjectId: subjectId,
                startDate: new Date(),
                endDate: new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000),
                totalTargetHours: (duration * 7 * hoursPerDay).toString(),
                settings: { goal, hoursPerDay, topics },
                generatedByModel: "gemini-2.5-flash-lite",
            })
            .returning();

        // Create daily items
        // Note: We are storing the AI-generated topics in metadata for now
        // In a real app, we would try to match these strings to actual Topic IDs in the DB
        const itemsToInsert = generatedPlan.map((day) => ({
            planId: plan.id,
            subjectId: subjectId,
            taskType: "revise" as const,
            dueDate: new Date(Date.now() + day.day * 24 * 60 * 60 * 1000),
            topicIds: [],
            questionIds: day.questionIds,
            metadata: {
                description: day.description,
                topics: day.topics,
            },
        }));

        if (itemsToInsert.length > 0) {
            await db.insert(studyPlanItems).values(itemsToInsert);
        }

        return NextResponse.json({ id: plan.id });
    } catch (error) {
        console.error("Error generating plan:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
