// Question tree helpers shared by the review screen and attempt mode. Pure, unit-tested.
export type TreeRow = { id: string; parentId: string | null; number: string; order: number; marks: number };

/** Leaf parts in paper order: the units a student answers and gets marked on. */
export function leaves<T extends TreeRow>(rows: T[]): T[] {
    const parents = new Set(rows.map((r) => r.parentId).filter(Boolean));
    return rows.filter((r) => !parents.has(r.id)).sort((a, b) => a.order - b.order);
}

/** Ancestors from the whole question down to the direct parent: the context a part needs. */
export function ancestors<T extends TreeRow>(rows: T[], id: string): T[] {
    const byId = new Map(rows.map((r) => [r.id, r]));
    const out: T[] = [];
    let cur = byId.get(id)?.parentId ?? null;
    while (cur) {
        const r = byId.get(cur);
        if (!r) break;
        out.unshift(r);
        cur = r.parentId;
    }
    return out;
}

/** Marks a leaf is worth: its own, or (when marks are printed once for a group of sub-parts) its share of the parent's. */
export function leafMarks<T extends TreeRow>(rows: T[], leaf: T): number {
    if (leaf.marks > 0) return leaf.marks;
    const parent = rows.find((r) => r.id === leaf.parentId);
    if (!parent || parent.marks === 0) return 0;
    const siblings = rows.filter((r) => r.parentId === parent.id);
    return siblings.every((s) => s.marks === 0) ? (siblings[siblings.length - 1].id === leaf.id ? parent.marks : 0) : 0;
}

/** Total marks of a paper (sum of every node's own marks). */
export const paperTotal = (rows: TreeRow[]) => rows.reduce((a, r) => a + r.marks, 0);
