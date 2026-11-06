// Examiner reports: split the text into per-question commentary ("Question 3" headings). Pure, unit-tested.
import type { PageText } from "@/lib/papers/pdf";
import { buildLines } from "@/lib/papers/parse/layout";

const HEADING_RE = /^(?:Question|Q)\s*(?:No\.?\s*)?(\d{1,2})\b(.*)$/i;

export function parseExaminerReport(pages: PageText[]): Record<string, string> {
    const out = new Map<string, string[]>();
    let current: string | null = null;
    for (const page of pages) {
        for (const line of buildLines(page)) {
            const m = HEADING_RE.exec(line.text);
            // A heading is short ("Question 3", "Question 3 (a)") — not a sentence that mentions a question
            if (m && line.text.length < 40) {
                current = String(Number(m[1]));
                const rest = m[2].trim();
                if (rest) out.set(current, [...(out.get(current) ?? []), rest]);
                continue;
            }
            if (current && !/^Pearson Education Limited|^Registered company|^\d+$/i.test(line.text)) {
                out.set(current, [...(out.get(current) ?? []), line.text]);
            }
        }
    }
    return Object.fromEntries(
        [...out.entries()].map(([k, v]) => [k, v.join(" ").replace(/\s+/g, " ").trim().slice(0, 4000)]),
    );
}
