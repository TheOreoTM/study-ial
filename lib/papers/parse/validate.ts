// Validation of a parsed paper: schema, numbering continuity, tree consistency and marks against printed totals.
// Produces a list of issues; "errors" make a parse fail (and trigger a retry/repair for the vision engine), "warnings"
// send it to review. Pure, unit-tested.
import { compareNumbers, nextLabel, parentNumber, questionOf, splitNumber } from "@/lib/papers/parse/numbering";
import { parsedPaperSchema, type ParsedPaper } from "@/lib/papers/parse/schema";

export type Issue = { level: "error" | "warning"; code: string; message: string; number?: string };

export type ValidationReport = {
    ok: boolean;
    issues: Issue[];
    totalMarks: number;
    questionCount: number;
    partCount: number;
};

export function validateParsedPaper(input: unknown): ValidationReport {
    const parsed = parsedPaperSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            issues: parsed.error.issues.slice(0, 20).map((i) => ({
                level: "error" as const,
                code: "schema",
                message: `${i.path.join(".")}: ${i.message}`,
            })),
            totalMarks: 0,
            questionCount: 0,
            partCount: 0,
        };
    }
    return validateStructure(parsed.data);
}

export function validateStructure(paper: ParsedPaper): ValidationReport {
    const issues: Issue[] = [];
    const qs = paper.questions;
    const numbers = qs.map((q) => q.number);
    const set = new Set<string>();
    for (const n of numbers) {
        if (set.has(n)) issues.push({ level: "error", code: "duplicate", message: `Question ${n} appears twice`, number: n });
        set.add(n);
    }

    // Parents exist and match the number's own structure
    for (const q of qs) {
        const expected = parentNumber(q.number);
        if ((q.parent ?? null) !== expected) {
            issues.push({ level: "error", code: "parent", message: `${q.number} should have parent ${expected ?? "none"}, not ${q.parent ?? "none"}`, number: q.number });
        }
        if (expected && !set.has(expected)) {
            issues.push({ level: "warning", code: "orphan", message: `${q.number} has no ${expected} entry`, number: q.number });
        }
        for (const d of q.dependsOn) {
            if (!set.has(d)) issues.push({ level: "warning", code: "depends", message: `${q.number} depends on missing ${d}`, number: q.number });
        }
    }

    // Question numbers run 1, 2, 3… with no gaps; part labels run a, b, c… / i, ii, iii… within each parent
    const top = [...new Set(numbers.map((n) => questionOf(n)))].filter(Number.isFinite).sort((a, b) => a - b);
    top.forEach((n, i) => {
        if (n !== i + 1) {
            issues.push({ level: i === 0 ? "warning" : "error", code: "gap", message: `Question ${i + 1} is missing (found ${n} next)` });
        }
    });
    const children = new Map<string, string[]>();
    for (const n of numbers) {
        const p = parentNumber(n);
        if (p) children.set(p, [...(children.get(p) ?? []), n]);
    }
    for (const [p, kids] of children) {
        const labels = kids.sort(compareNumbers).map((k) => splitNumber(k).parts.at(-1)!);
        const roman = labels[0] === "i" && (labels.length === 1 || labels[1] === "ii");
        let expected: string | null = roman ? "i" : "a";
        for (const l of labels) {
            if (l !== expected) {
                issues.push({ level: "warning", code: "sequence", message: `In ${p}, expected (${expected}) but found (${l})`, number: p });
                break;
            }
            expected = nextLabel(l, roman);
        }
    }

    // Marks: each question's parts sum to its printed total; the paper sums to its printed total
    const totalMarks = qs.reduce((a, q) => a + q.marks, 0);
    for (const [qn, printed] of Object.entries(paper.totals.questions)) {
        const sum = qs.filter((q) => String(questionOf(q.number)) === qn).reduce((a, q) => a + q.marks, 0);
        if (sum !== printed) {
            issues.push({ level: "error", code: "question-total", message: `Question ${qn}: parts add up to ${sum}, paper says ${printed}`, number: qn });
        }
    }
    if (paper.totals.paper !== null && totalMarks !== paper.totals.paper) {
        issues.push({ level: "error", code: "paper-total", message: `Marks add up to ${totalMarks}, paper total is ${paper.totals.paper}` });
    }
    if (paper.totals.paper === null && Object.keys(paper.totals.questions).length === 0) {
        issues.push({ level: "warning", code: "no-totals", message: "No printed totals found to check the marks against" });
    }
    // Leaf parts with no marks are suspicious (except sub-parts whose marks are printed on the parent)
    const parents = new Set(children.keys());
    for (const q of qs) {
        if (!parents.has(q.number) && q.marks === 0) {
            const p = q.parent ? qs.find((x) => x.number === q.parent) : null;
            if (!p || p.marks === 0) issues.push({ level: "warning", code: "no-marks", message: `${q.number} has no marks`, number: q.number });
        }
        if (!q.stem.trim() && !q.figures.length && !parents.has(q.number)) {
            issues.push({ level: "warning", code: "empty", message: `${q.number} has no text`, number: q.number });
        }
    }

    return {
        ok: !issues.some((i) => i.level === "error"),
        issues,
        totalMarks,
        questionCount: top.length,
        partCount: qs.length,
    };
}

/** A short, model-readable list of problems for the repair prompt. */
export function issuesForRepair(report: ValidationReport) {
    return report.issues
        .filter((i) => i.level === "error")
        .map((i) => `- ${i.message}`)
        .join("\n");
}
