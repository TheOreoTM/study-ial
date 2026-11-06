import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { SearchDoc } from "@/lib/search";

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

/** Published question counts keyed by unitId. */
export const getUnitQuestionCounts = cache(async (unitIds: string[]) => {
    const rows = await db.question.groupBy({
        by: ["unitId"],
        where: { unitId: { in: unitIds }, status: "PUBLISHED" },
        _count: { _all: true },
    });
    return new Map(rows.map((r) => [r.unitId, r._count._all]));
});

/** Published question counts for one topic, by question type. */
export const getTopicQuestionTypeCounts = cache(async (topicId: string) => {
    const rows = await db.question.groupBy({
        by: ["type"],
        where: { topicId, status: "PUBLISHED" },
        _count: { _all: true },
    });
    return new Map(rows.map((r) => [r.type, r._count._all]));
});

/** Every subject → unit → topic path, for the sitemap. */
export const getCurriculumPaths = cache(() =>
    db.subject.findMany({
        orderBy: { order: "asc" },
        select: {
            slug: true,
            units: {
                orderBy: { order: "asc" },
                select: { code: true, topics: { orderBy: { order: "asc" }, select: { slug: true } } },
            },
        },
    }),
);

/** Every subject, unit and topic as search documents (see lib/search.ts). About 300 rows, read per request. */
export const getSearchDocs = cache(async (): Promise<SearchDoc[]> => {
    const subjects = await db.subject.findMany({
        orderBy: [{ isLocal: "asc" }, { order: "asc" }],
        select: {
            id: true,
            slug: true,
            code: true,
            name: true,
            description: true,
            units: {
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    code: true,
                    name: true,
                    description: true,
                    topics: {
                        orderBy: { order: "asc" },
                        select: { id: true, slug: true, code: true, name: true, summary: true, specPoints: true },
                    },
                },
            },
        },
    });
    const docs: SearchDoc[] = [];
    for (const s of subjects) {
        docs.push({
            kind: "subject",
            id: s.id,
            href: `/subjects/${s.slug}`,
            name: s.name,
            code: s.code,
            context: `${s.units.length} units`,
            summary: s.description,
        });
        for (const u of s.units) {
            const unitHref = `/subjects/${s.slug}/${u.code.toLowerCase()}`;
            docs.push({
                kind: "unit",
                id: u.id,
                href: unitHref,
                name: u.name,
                code: u.code,
                context: s.name,
                summary: u.description,
            });
            for (const t of u.topics) {
                docs.push({
                    kind: "topic",
                    id: t.id,
                    href: `${unitHref}/${t.slug}`,
                    name: t.name,
                    code: t.code,
                    context: `${s.name} · ${u.code}`,
                    summary: t.summary,
                    specPoints: t.specPoints,
                });
            }
        }
    }
    return docs;
});
