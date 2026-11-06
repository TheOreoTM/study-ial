// Grade boundaries (Pearson's published raw-mark boundaries, stored as data with their source) and exam timing.
// Pure and unit-tested.

export type UnitGrades = Partial<Record<"a*" | "a" | "b" | "c" | "d" | "e", number>>;
export type BoundaryRow = { unitCode: string; paperCode: string; maxMark: number; grades: UnitGrades };

// "WMA11 Unit 1A: …", "WMA11 P1: …", "WMA01 C12: …", then "Raw <max> <a*?> a b c d e 0"
const ROW_RE = /^(W[A-Z]{2}\d{2})(?:\s+(?:Unit\s+)?[A-Z]{0,2}\d{1,2}([A-Z])?\b)?.*?\bRaw\s+(\d{2,3})\s+((?:\d{1,3}\s+){5,6})0\b/;

/** Reads unit rows from a grade-boundary document's text lines ("WMA11 Unit 1A: Pure Mathematics 1 Raw 75 55 48 41 35 29 0"). */
export function parseGradeBoundaryLines(lines: string[], unitPrefixes: string[]): BoundaryRow[] {
    const out = new Map<string, BoundaryRow>();
    for (const raw of lines) {
        const line = raw.replace(/\s+/g, " ").trim();
        const m = ROW_RE.exec(line);
        if (!m || !unitPrefixes.some((p) => m[1].startsWith(p))) continue;
        const nums = m[4].trim().split(/\s+/).map(Number);
        const keys = nums.length === 6 ? (["a*", "a", "b", "c", "d", "e"] as const) : (["a", "b", "c", "d", "e"] as const);
        const grades: UnitGrades = {};
        keys.forEach((k, i) => (grades[k] = nums[i]));
        const maxMark = Number(m[3]);
        // Boundaries must fall as grades go down and fit under the max
        if (nums.some((n, i) => n > maxMark || (i > 0 && n > nums[i - 1]))) continue;
        const row = { unitCode: m[1], paperCode: `01${(m[2] ?? "").toLowerCase()}`, maxMark, grades };
        out.set(`${row.unitCode}|${row.paperCode}`, row);
    }
    return [...out.values()];
}

/** Unit grade for a raw mark (a* only exists for A2 units). Below e is u. */
export function gradeFor(raw: number, grades: UnitGrades): string {
    for (const k of ["a*", "a", "b", "c", "d", "e"] as const) {
        const b = grades[k];
        if (b !== undefined && raw >= b) return k;
    }
    return "u";
}

/** Marks needed for the next grade up, or null at the top. */
export function marksToNextGrade(raw: number, grades: UnitGrades): { grade: string; marks: number } | null {
    const order = (["e", "d", "c", "b", "a", "a*"] as const).filter((k) => grades[k] !== undefined);
    for (const k of order) {
        const b = grades[k]!;
        if (raw < b) return { grade: k, marks: b - raw };
    }
    return null;
}

/** "Time: 1 hour 30 minutes", "(Time: 2 hours)", "Time 1 hour 20 minutes" on a cover page → minutes. */
export function parseExamDuration(text: string): number | null {
    const m = /Time:?\s*(?:(\d)\s*hours?)?\s*(?:(\d{1,2})\s*minutes?)?/i.exec(text);
    if (!m || (!m[1] && !m[2])) return null;
    const minutes = Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0);
    return minutes >= 15 && minutes <= 240 ? minutes : null;
}
