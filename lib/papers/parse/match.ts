// Mark-scheme matching: attaches mark-scheme entries to question-paper parts by question number. The question paper's
// structure is the truth; a scheme entry for "3" can serve "3(a)" and "3(b)" when the scheme doesn't split them, and a
// scheme entry for "3(a)(i)" folds into "3(a)" when the paper doesn't have sub-parts. Pure, unit-tested.
import { compareNumbers, parentNumber, questionOf } from "@/lib/papers/parse/numbering";
import type { MarkSchemeEntry } from "@/lib/papers/parse/schema";

export type MatchResult = {
    /** QP number → the scheme entries that mark it (usually one) */
    matched: Map<string, MarkSchemeEntry[]>;
    /** How each QP number was matched, for review */
    how: Map<string, "exact" | "ancestor" | "descendants">;
    /** Scheme entries that couldn't be placed on any question part */
    unmatched: MarkSchemeEntry[];
    /** Leaf parts (with marks) that have no scheme */
    missing: string[];
};

export function matchMarkScheme(
    questions: { number: string; marks: number }[],
    entries: MarkSchemeEntry[],
): MatchResult {
    const qNumbers = new Set(questions.map((q) => q.number));
    const byNumber = new Map(entries.map((e) => [e.number, e]));
    const matched = new Map<string, MarkSchemeEntry[]>();
    const how = new Map<string, "exact" | "ancestor" | "descendants">();
    const used = new Set<string>();

    // 1. Exact matches
    for (const q of questions) {
        const e = byNumber.get(q.number);
        if (e) {
            matched.set(q.number, [e]);
            how.set(q.number, "exact");
            used.add(e.number);
        }
    }
    // 2. Scheme entries deeper than the paper ("3(a)(i)" when the paper only has "3(a)"): fold into the nearest
    //    ancestor that exists on the paper
    for (const e of entries) {
        if (used.has(e.number)) continue;
        let p = parentNumber(e.number);
        while (p && !qNumbers.has(p)) p = parentNumber(p);
        if (p && !matched.has(p)) {
            matched.set(p, [e]);
            how.set(p, "descendants");
            used.add(e.number);
        } else if (p && how.get(p) === "descendants") {
            matched.get(p)!.push(e);
            used.add(e.number);
        }
    }
    // 3. Paper parts without their own entry borrow the nearest ancestor's entry ("3" marks both "3(a)" and "3(b)")
    for (const q of questions) {
        if (matched.has(q.number)) continue;
        let p = parentNumber(q.number);
        while (p) {
            const e = byNumber.get(p);
            if (e) {
                matched.set(q.number, [e]);
                how.set(q.number, "ancestor");
                used.add(e.number);
                break;
            }
            p = parentNumber(p);
        }
    }

    const hasChildren = new Set(questions.map((q) => parentNumber(q.number)).filter(Boolean) as string[]);
    const missing = questions
        .filter((q) => !hasChildren.has(q.number) && !matched.has(q.number))
        .map((q) => q.number)
        .sort(compareNumbers);
    const unmatched = entries.filter((e) => !used.has(e.number) && !qNumbers.has(e.number));
    // Entries for questions the paper doesn't have at all are noise from the guidance pages
    return { matched, how, unmatched: unmatched.filter((e) => qNumbers.has(String(questionOf(e.number)))), missing };
}
