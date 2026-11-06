import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { enabledPaperSubjects } from "@/lib/papers/config";
import { sittingOrdinal, type Series } from "@/lib/papers/filename";
import type { PaperDocType, PaperSeries } from "@/lib/generated/prisma/client";

export const seriesKey = (s: PaperSeries | null): Series | null => (s ? (s.toLowerCase() as Series) : null);

/** Subject a sitting is shown under: its curriculum unit's subject when linked, else the indexer's subject. */
export const displaySubject = (s: { subject: string; unit: { subject: { slug: string } } | null }) =>
    s.unit?.subject.slug ?? s.subject;

/** Public index overview: allowlisted subjects → units with sitting counts. Metadata only. */
export const getPaperIndex = cache(async () => {
    const sittings = await db.paperSitting.findMany({
        where: { ownerId: null, papers: { some: {} } },
        select: {
            unitCode: true,
            subject: true,
            year: true,
            series: true,
            unit: { select: { name: true, order: true, subject: { select: { slug: true } } } },
        },
    });
    const subjects = enabledPaperSubjects().map((s) => ({ slug: s.slug, name: s.name }));
    const units = new Map<
        string,
        { code: string; subject: string; name: string | null; order: number; sittings: number; latest: number; earliest: number }
    >();
    for (const s of sittings) {
        const ord = s.year && s.series ? sittingOrdinal({ year: s.year, series: seriesKey(s.series)! }) : 0;
        const u = units.get(s.unitCode) ?? {
            code: s.unitCode,
            subject: displaySubject(s),
            name: s.unit?.name ?? null,
            order: s.unit?.order ?? 1000,
            sittings: 0,
            latest: 0,
            earliest: Infinity,
        };
        u.sittings++;
        u.latest = Math.max(u.latest, ord);
        u.earliest = Math.min(u.earliest, ord);
        units.set(s.unitCode, u);
    }
    return subjects.map((s) => ({
        ...s,
        units: [...units.values()]
            .filter((u) => u.subject === s.slug)
            // Current-spec units (linked to the curriculum) first, then legacy units
            .sort((a, b) => a.order - b.order || a.code.localeCompare(b.code)),
    }));
});

export type SittingRow = Awaited<ReturnType<typeof getUnitSittings>>[number];

/** Every public sitting of a unit, newest first, with which documents exist. Metadata only. */
export const getUnitSittings = cache(async (unitCode: string) => {
    const rows = await db.paperSitting.findMany({
        where: { ownerId: null, unitCode: unitCode.toUpperCase(), papers: { some: {} } },
        select: {
            id: true,
            unitCode: true,
            paperCode: true,
            year: true,
            series: true,
            spec: true,
            subject: true,
            unit: { select: { name: true, subject: { select: { slug: true, name: true } } } },
            papers: { select: { type: true } },
        },
    });
    return rows
        .map((r) => ({
            ...r,
            types: new Set<PaperDocType>(r.papers.map((p) => p.type)),
            ordinal: r.year && r.series ? sittingOrdinal({ year: r.year, series: seriesKey(r.series)! }) : 0,
        }))
        .sort((a, b) => b.ordinal - a.ordinal || a.paperCode.localeCompare(b.paperCode));
});

/** A sitting with its files (no question text). Callers must check canViewSittingContent first. */
export const getSitting = cache((id: string) =>
    db.paperSitting.findUnique({
        where: { id },
        include: {
            unit: { select: { name: true, code: true, subject: { select: { slug: true, name: true } } } },
            papers: {
                select: {
                    id: true,
                    type: true,
                    source: true,
                    pageCount: true,
                    parseStatus: true,
                    parseError: true,
                    sourceUrl: true,
                    mime: true,
                    _count: { select: { questions: true } },
                },
            },
        },
    }),
);

export const getSavedSittingIds = cache(async (userId: string) => {
    const rows = await db.userPaper.findMany({ where: { userId }, select: { sittingId: true } });
    return new Set(rows.map((r) => r.sittingId));
});

/** The student's workspace: saved index sittings and their own uploads. */
export const getMyPapers = cache(async (userId: string) => {
    const rows = await db.userPaper.findMany({
        where: { userId },
        orderBy: { addedAt: "desc" },
        include: {
            sitting: {
                include: {
                    unit: { select: { name: true } },
                    papers: { select: { id: true, type: true, parseStatus: true, _count: { select: { questions: true } } } },
                },
            },
        },
    });
    return rows.map((r) => r.sitting);
});
