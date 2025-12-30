import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/ai/plan-generator";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Status, TaskType } from "@/lib/generated/prisma/client";

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
        const { subjectCode, subjectName, goal, duration, hoursPerDay, topics, fileKeys } = body;

        if (fileKeys && fileKeys.length > 0) {
            console.log("Received file keys for AI context:", fileKeys);
        }

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
                totalTargetHours: duration * 7 * hoursPerDay,
                settings: { goal, hoursPerDay, topics },
                generatedByModel: "gemini-2.5-flash-lite",
            },
        });

        // Create daily items
        // Note: We are storing the AI-generated topics in metadata for now
        // In a real app, we would try to match these strings to actual Topic IDs in the DB
        const itemsToInsert = generatedPlan.map((day) => ({
            studyPlanId: plan.id,
            subjectId: subjectId,
            taskType: TaskType.REVISE,
            status: Status.PENDING,
            dueDate: new Date(Date.now() + day.day * 24 * 60 * 60 * 1000),
            topicIds: [] as any,
            questionIds: day.questionIds as any,
            metadata: {
                description: day.description,
                topics: day.topics,
            } as any,
        }));

        if (itemsToInsert.length > 0) {
            await prisma.studyPlanItem.createMany({
                data: itemsToInsert,
            });
        }

        // Handle file uploads (create Note records)
        if (body.files && Array.isArray(body.files) && body.files.length > 0) {
            const files = body.files as any[]; // Type assertion since we don't have the type imported

            await Promise.all(
                files.map(async (file) => {
                    await prisma.note.create({
                        data: {
                            name: file.name,
                            objectKey: file.key,
                            size: file.size,
                            mimeType: file.type,
                            url: process.env.R2_ENDPOINT + "/" + file.key,
                            subjectId: subjectId,
                            userId: userId,
                            studyPlanId: plan.id,
                        },
                    });
                })
            );
        }

        return NextResponse.json({ id: plan.id });
    } catch (error) {
        console.error("Error generating plan:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
