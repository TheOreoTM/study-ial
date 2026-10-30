import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getSubjects = cache(() =>
    db.subject.findMany({
        orderBy: [{ isLocal: "asc" }, { order: "asc" }],
        include: { units: { orderBy: { order: "asc" }, include: { _count: { select: { topics: true } } } } },
    }),
);

export const getSubjectBySlug = cache((slug: string) =>
    db.subject.findUnique({
        where: { slug },
        include: {
            units: {
                orderBy: { order: "asc" },
                include: { topics: { orderBy: { order: "asc" } } },
            },
        },
    }),
);

/** Unit by its paper code (case-insensitive in URLs, stored upper-case). */
export const getUnitByCode = cache((code: string) =>
    db.unit.findUnique({
        where: { code: code.toUpperCase() },
        include: { subject: true, topics: { orderBy: { order: "asc" } } },
    }),
);

export const getTopic = cache((unitCode: string, slug: string) =>
    db.topic.findFirst({
        where: { slug, unit: { code: unitCode.toUpperCase() } },
        include: { unit: { include: { subject: true } } },
    }),
);

/** Published question counts keyed by topicId. */
export const getQuestionCounts = cache(async (topicIds: string[]) => {
    const rows = await db.question.groupBy({
        by: ["topicId"],
        where: { topicId: { in: topicIds }, status: "PUBLISHED" },
        _count: { _all: true },
    });
    return new Map(rows.map((r) => [r.topicId, r._count._all]));
});
