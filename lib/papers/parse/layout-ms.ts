// Layout engine for mark schemes: reads the "Question Number | Scheme | Marks" tables from the text layer and
// produces one entry per question part with its mark codes (M1, A1, B1, dM1, A1ft…), the part's printed marks, the
// scheme text, the examiner guidance ("Notes") and where it all sits on the page.
import type { PageText, TextItem } from "@/lib/papers/pdf";
import { buildLines, type Line } from "@/lib/papers/parse/layout";
import { isRoman } from "@/lib/papers/parse/numbering";
import type { MarkPoint, ParsedMarkScheme, Region } from "@/lib/papers/parse/schema";

const CODE_RE = /(?<![A-Za-z])([dD]?)([MABE])(\d{1,2})(\*|ft|cso|cao|oe)?(?![a-z])/g;
const CODES_ONLY_RE = /^(?:\s*[dD]?[MABE]\d{1,2}(?:\*|ft|cso|cao|oe)?\s*)+$/;
const PART_TOTAL_RE = /^\((\d{1,2})\)$/;
const Q_TOTAL_RE = /^\(?(\d{1,3})(?: marks?)?\)?$/i;
const LABEL_RE = /^(\d{1,2})?((?:\([a-z]{1,4}\)){0,3})$/;

/** "A1A1A1" → three 1-mark points; "dM1" keeps its d (dependent) prefix. Pure, unit-tested. */
export function parseMarkCodes(s: string): MarkPoint[] {
    const out: MarkPoint[] = [];
    for (const m of s.matchAll(CODE_RE)) {
        out.push({ code: `${m[1]}${m[2]}${m[3]}${m[4] ?? ""}`, marks: Number(m[3]), text: "" });
    }
    return out;
}

type Entry = {
    number: string;
    points: MarkPoint[];
    marks: number | null;
    text: string[];
    regions: Map<number, { top: number; bottom: number }>;
};

function touch(regions: Map<number, { top: number; bottom: number }>, line: Line) {
    const r = regions.get(line.page);
    if (r) {
        r.top = Math.min(r.top, line.y);
        r.bottom = Math.max(r.bottom, line.bottom);
    } else regions.set(line.page, { top: line.y, bottom: line.bottom });
}

/** Resolves a left-column label against the current question/part: "2(a)" absolute, "(b)" or "(ii)" relative. */
export function resolveLabel(label: string, current: string | null): string | null {
    // "1." and "2.(a)" in some years' tables
    const m = LABEL_RE.exec(label.replace(/\s+/g, "").replace(/^(\d{1,2})\./, "$1").toLowerCase());
    if (!m || (!m[1] && !m[2])) return null;
    const parts = [...m[2].matchAll(/\(([a-z]{1,4})\)/g)].map((x) => x[1]);
    if (m[1]) return `${Number(m[1])}${parts.map((p) => `(${p})`).join("")}`;
    if (!current) return null;
    const q = /^(\d+)/.exec(current)![1];
    const curParts = [...current.matchAll(/\(([a-z]+)\)/g)].map((x) => x[1]);
    // A roman numeral under a lettered part nests inside it; anything else replaces the top-level part
    if (parts.length === 1 && isRoman(parts[0]) && curParts.length >= 1 && !isRoman(curParts[0])) {
        const letter = curParts[0];
        if (!(parts[0] === "i" && letter === "h")) return `${q}(${letter})(${parts[0]})`;
    }
    return `${q}${parts.map((p) => `(${p})`).join("")}`;
}

export function parseMarkSchemeLayout(pages: PageText[]): ParsedMarkScheme & { engine: "layout" } {
    const entries: Entry[] = [];
    const byNumber = new Map<string, Entry>();
    const notes = new Map<string, { text: string[]; regions: Map<number, { top: number; bottom: number }> }>();
    const totals: { paper: number | null; questions: Record<string, number> } = { paper: null, questions: {} };
    let mode = "intro" as "intro" | "table" | "notes";
    let current = null as Entry | null;
    let notesKey = null as string | null;
    const dims = new Map(pages.map((p) => [p.page, { w: p.width, h: p.height }]));

    const entryFor = (number: string) => {
        let e = byNumber.get(number);
        if (!e) {
            e = { number, points: [], marks: null, text: [], regions: new Map() };
            entries.push(e);
            byNumber.set(number, e);
        }
        return e;
    };

    for (const page of pages) {
        const lines = buildLines(page);
        for (const line of lines) {
            const t = line.text;
            const paperTotal = /total (?:number of )?marks for (?:the )?paper is (\d{1,3})/i.exec(t);
            if (paperTotal && totals.paper === null) totals.paper = Number(paperTotal[1]);
            // Table header: "Question Number | Scheme | Marks", on one line or split over two
            if (
                (/^Question/i.test(t) && /(Scheme|Answer)/i.test(t)) ||
                /^(Question\s*(Number)?|Scheme\s+Marks|Answer\s+Marks?)$/i.test(t)
            ) {
                mode = "table";
                continue;
            }
            if (/^Number$/i.test(t)) continue;
            if (mode === "intro") continue;
            if (/^(Notes?|Guidance|Additional guidance)\b/i.test(t) && t.length < 40) {
                mode = "notes";
                notesKey = current ? /^(\d+)/.exec(current.number)![1] : null;
                continue;
            }

            const left: TextItem[] = [];
            const right: TextItem[] = [];
            const middle: TextItem[] = [];
            for (const it of line.items) {
                // Header words can merge into the first row when a tall fraction stretches the line
                if (/^(Question|Number)$/i.test(it.str.trim())) continue;
                if (it.x < page.width * 0.15) left.push(it);
                else if (it.x > page.width * 0.76) right.push(it);
                else middle.push(it);
            }

            const labelText = left.map((i) => i.str.trim()).join("");
            if (mode === "notes" && current) {
                // A real table row for the next question (label + mark codes) ends the notes without a header
                const abs = /^(\d{1,2})/.exec(labelText)?.[1];
                const curQ = Number(/^(\d+)/.exec(current.number)![1]);
                if (abs && Number(abs) === curQ + 1 && right.some((i) => CODES_ONLY_RE.test(i.str.trim()))) mode = "table";
            }
            if (mode === "notes") {
                // In the notes block a left-column label like "1(a)" says which question the guidance is for
                const resolved = labelText ? resolveLabel(labelText, current?.number ?? null) : null;
                if (resolved) notesKey = /^(\d+)/.exec(resolved)![1];
                if (!notesKey) continue;
                const n = notes.get(notesKey) ?? { text: [] as string[], regions: new Map<number, { top: number; bottom: number }>() };
                n.text.push(t);
                touch(n.regions, line);
                notes.set(notesKey, n);
                continue;
            }

            // Science schemes close each question with "Total for question 13 4"
            const sciTotal = /^Total for question (\d{1,2})\s+(\d{1,3})$/i.exec(t);
            if (sciTotal) {
                totals.questions[String(Number(sciTotal[1]))] = Number(sciTotal[2]);
                continue;
            }

            // Table row
            const resolved = labelText ? resolveLabel(labelText, current?.number ?? null) : null;
            if (resolved) {
                current = entryFor(resolved);
                notesKey = null;
            } else if (labelText && current) {
                middle.unshift(...left);
            }
            if (!current) continue;
            touch(current.regions, line);

            const middleText = middle
                .map((i) => i.str)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
            const hasCodes = current.points.some((p) => /[MABE]\d/.test(p.code));
            for (const it of right) {
                const s = it.str.trim();
                if (!s) continue;
                const pt = PART_TOTAL_RE.exec(s);
                const qt = Q_TOTAL_RE.exec(s);
                const bareNumber = /^\d{1,2}$/.test(s);
                if (pt && hasCodes) current.marks = (current.marks ?? 0) + Number(pt[1]);
                else if (pt) {
                    // Science schemes: "(1)" after each marking point, the point being the text on that line
                    current.points.push({ code: `(${pt[1]})`, marks: Number(pt[1]), text: middleText.slice(0, 400) });
                } else if (bareNumber && (middleText || right.length > 1)) {
                    // Science: a bare number beside a row is the part's marks
                    current.marks = Number(s);
                } else if (qt && !pt && (/marks?/i.test(s) || it.x > page.width * 0.86)) {
                    totals.questions[/^(\d+)/.exec(current.number)![1]] = Number(qt[1]);
                    // The question's table ends at its total; what follows is examiner guidance
                    mode = "notes";
                    notesKey = /^(\d+)/.exec(current.number)![1];
                } else if (CODES_ONLY_RE.test(s)) current.points.push(...parseMarkCodes(s));
                else middle.push(it);
            }
            const text = middle
                .sort((a, b) => a.x - b.x)
                .map((i) => i.str)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
            if (text) current.text.push(text);
        }
    }

    const toRegions = (m: Map<number, { top: number; bottom: number }>): Region[] =>
        [...m.entries()].map(([page, r]) => {
            const d = dims.get(page)!;
            return { page, bbox: [0.03, Math.max(0, (r.top - 4) / d.h), 0.97, Math.min(1, (r.bottom + 4) / d.h)] };
        });

    return {
        engine: "layout",
        entries: entries.map((e) => ({
            number: e.number,
            // Multiple choice ("D is the correct answer" … 1): one point worth the row's marks
            points: (e.points.length || !e.marks ? e.points : [{ code: `(${e.marks})`, marks: e.marks, text: e.text[0]?.slice(0, 400) ?? "" }]).slice(0, 60),
            marks: Math.min(100, e.marks ?? (e.points.length ? e.points.reduce((a, p) => a + p.marks, 0) : 0)) || null,
            text: e.text.join("\n").slice(0, 8000),
            regions: toRegions(e.regions).slice(0, 8),
        })),
        notes: Object.fromEntries(
            [...notes.entries()].map(([k, v]) => [k, { text: v.text.join("\n").slice(0, 12000), regions: toRegions(v.regions).slice(0, 12) }]),
        ),
        totals,
    };
}
