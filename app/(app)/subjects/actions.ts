"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertUser } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };

const input = z.object({
    topicId: z.string().min(1).max(64),
    point: z.number().int().min(0).max(200),
    /** null clears the rating */
    rating: z.enum(["RED", "AMBER", "GREEN"]).nullable(),
});

/** Sets (or clears) the student's confidence on one spec point. */
export async function rateSpecPoint(raw: { topicId: string; point: number; rating: "RED" | "AMBER" | "GREEN" | null }): Promise<Result> {
    const user = await assertUser();
    const parsed = input.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Invalid rating." };
    const { topicId, point, rating } = parsed.data;

    const topic = await db.topic.findUnique({
        where: { id: topicId },
        select: { slug: true, specPoints: true, unit: { select: { code: true, subject: { select: { slug: true } } } } },
    });
    const text = topic?.specPoints[point];
    if (!topic || text === undefined) return { ok: false, error: "That specification point doesn't exist." };

    const key = { userId_topicId_point: { userId: user.id, topicId, point } };
    if (rating === null) {
        await db.specPointRating.deleteMany({ where: { userId: user.id, topicId, point } });
    } else {
        await db.specPointRating.upsert({
            where: key,
            create: { userId: user.id, topicId, point, text, rating },
            update: { text, rating },
        });
    }

    const unitPath = `/subjects/${topic.unit.subject.slug}/${topic.unit.code.toLowerCase()}`;
    revalidatePath(`${unitPath}/${topic.slug}`);
    revalidatePath(`${unitPath}/checklist`);
    revalidatePath(unitPath);
    return { ok: true };
}
