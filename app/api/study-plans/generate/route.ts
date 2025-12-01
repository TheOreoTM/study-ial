import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/ai/plan-generator";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma/client";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
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

        let subjectId: string;
        const existingSubject = await prisma.subject.findUnique({
            where: { code: subjectCode },
        });

        if (existingSubject) {
            subjectId = existingSubject.id;
        } else {
            // Create new subject if it doesn't exist
            const newSubject = await prisma.subject.create({
                data: {
                    code: subjectCode,
                    name: subjectName,
                },
            });
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
        const plan = await prisma.studyPlan.create({
            data: {
                userId,
                name: `${subjectName} Study Plan`,
                subjectId: subjectId,
                startDate: new Date(),
                endDate: new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000),
                totalTargetHours: new Prisma.Decimal(duration * 7 * hoursPerDay),
                goal,
                topics,
                hoursPerDay: new Prisma.Decimal(hoursPerDay),
                generatedByModel: "gemini-2.5-flash-lite",
            },
        });

        // Create daily items
        // Note: We are storing the AI-generated topics in metadata for now
        // In a real app, we would try to match these strings to actual Topic IDs in the DB
        const itemsToInsert = generatedPlan.map((day) => ({
            planId: plan.id,
            subjectId: subjectId,
            taskType: "REVISE" as const, // Enum value
            dueDate: new Date(Date.now() + day.day * 24 * 60 * 60 * 1000),
            topicIds: [],
            questionIds: day.questionIds || [],
            metadata: {
                description: day.description,
                topics: day.topics,
            },
        }));

        if (itemsToInsert.length > 0) {
            await prisma.studyPlanItem.createMany({
                data: itemsToInsert,
            });
        }

        return NextResponse.json({ id: plan.id });
    } catch (error) {
        console.error("Error generating plan:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
