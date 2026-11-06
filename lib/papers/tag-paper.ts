// Tags a parsed question paper's parts with curriculum topics (heuristic, no AI). Leaves are tagged from their own
// text plus their question's context and matched mark-scheme text; a parent takes its children's majority topic.
import { db } from "@/lib/db";
import type { MarkSchemeEntry } from "@/lib/papers/parse/schema";
import { buildTagger } from "@/lib/papers/tagging";
import { ancestors, leaves } from "@/lib/papers/tree";

export async function tagPaperTopics(paperId: string) {
    const paper = await db.paper.findUnique({
        where: { id: paperId },
        select: { type: true, sitting: { select: { unitId: true } } },
    });
    if (!paper || paper.type !== "QP" || !paper.sitting.unitId) return { tagged: 0, total: 0 };
    const [topics, rows] = await Promise.all([
        db.topic.findMany({ where: { unitId: paper.sitting.unitId }, select: { id: true, name: true, summary: true, specPoints: true } }),
        db.paperQuestion.findMany({
            where: { paperId },
            select: { id: true, parentId: true, number: true, order: true, marks: true, stem: true, markPoints: true, topicId: true, edited: true },
        }),
    ]);
    if (topics.length === 0) return { tagged: 0, total: 0 };
    const tag = buildTagger(topics);
    const result = new Map<string, string | null>();
    const parts = leaves(rows);
    for (const leaf of parts) {
        const scheme = ((leaf.markPoints as { entries?: MarkSchemeEntry[] } | null)?.entries ?? []).map((e) => e.text).join(" ");
        // The part's own words count double: context is shared by every part of the question
        const text = [leaf.stem, leaf.stem, ...ancestors(rows, leaf.id).map((a) => a.stem), scheme].join(" ");
        result.set(leaf.id, tag(text)?.topicId ?? null);
    }
    for (const r of rows) {
        if (result.has(r.id)) continue;
        const kids = rows.filter((k) => k.parentId === r.id).map((k) => result.get(k.id)).filter(Boolean) as string[];
        const counts = new Map<string, number>();
        for (const k of kids) counts.set(k, (counts.get(k) ?? 0) + 1);
        const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
        result.set(r.id, top ? top[0] : (tag(r.stem)?.topicId ?? null));
    }
    const updates = rows
        .filter((r) => !(r.edited && r.topicId) && result.get(r.id) !== r.topicId)
        .map((r) => db.paperQuestion.update({ where: { id: r.id }, data: { topicId: result.get(r.id) ?? null } }));
    if (updates.length) await db.$transaction(updates);
    return { tagged: parts.filter((p) => result.get(p.id)).length, total: parts.length };
}
