import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

/** Subject → unit → topic tree with just what the admin selects/filters need. */
export const getCurriculumTree = cache(() =>
    db.subject.findMany({
        orderBy: [{ isLocal: "asc" }, { order: "asc" }],
        select: {
            id: true,
            slug: true,
            name: true,
            units: {
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    code: true,
                    name: true,
                    topics: { orderBy: { order: "asc" }, select: { id: true, code: true, name: true, slug: true } },
                },
            },
        },
    }),
);

export type CurriculumTree = Awaited<ReturnType<typeof getCurriculumTree>>;
