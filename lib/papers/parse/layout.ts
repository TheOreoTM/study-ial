// Layout engine: reads a born-digital question paper's text layer (no AI) and recovers the question → part →
// sub-part tree, marks, printed totals, figure captions and where every part sits on the page.
//
// What it relies on (true of Pearson IAL papers):
//   - question numbers ("3.") start a line at the left margin, in sequence
//   - part labels "(a)", "(i)" start a line; deeper levels are indented further right
//   - marks "(4)" sit alone at the right margin, after the part they belong to
//   - "(Total for Question 3 is 9 marks)" and "TOTAL FOR PAPER IS 75 MARKS" are printed
//   - figures are captioned "Figure 1" on a line of their own
// Typeset maths in the text layer comes out jumbled, so stems from this engine are plain text and flagged; the page
// region crop (always produced) shows the real question, and the vision engine can upgrade the stem to LaTeX.
import type { PageText, TextItem } from "@/lib/papers/pdf";
import { isRoman, nextLabel, normaliseNumber } from "@/lib/papers/parse/numbering";
import type { ParsedPaper, ParsedQuestion, Region } from "@/lib/papers/parse/schema";

export type Line = { page: number; y: number; bottom: number; x: number; items: TextItem[]; text: string };

const NOISE_PATTERNS = [
    /^DO NOT WRITE IN THIS AREA$/i,
    /^[_.\s…]+$/,
    /^\*[A-Z0-9]+\*$/, // barcode text, e.g. *P76193A0232*
    /^Turn over\b/i,
    /^Question \d+ continued$/i,
    /^Leave blank$/i,
    /^BLANK PAGE$/i,
];

const isNoiseText = (s: string) => NOISE_PATTERNS.some((re) => re.test(s.trim()));

/** Groups text items into lines (top to bottom), each sorted left to right. Drops margin furniture. */
export function buildLines(page: PageText): Line[] {
    const items = page.items
        .filter((i) => i.str.trim() && !isNoiseText(i.str))
        // Rotated margin text ("DO NOT WRITE IN THIS AREA") sits outside the text column
        .filter((i) => i.x > page.width * 0.03 && i.x < page.width * 0.97)
        .sort((a, b) => a.y - b.y || a.x - b.x);
    const lines: Line[] = [];
    let current: TextItem[] = [];
    let top = -Infinity;
    let bottom = -Infinity;
    const flush = () => {
        if (!current.length) return;
        const sorted = current.slice().sort((a, b) => a.x - b.x);
        const text = joinItems(sorted);
        if (!isNoiseText(text)) {
            lines.push({ page: page.page, y: top, bottom, x: sorted[0].x, items: sorted, text });
        }
        current = [];
    };
    for (const it of items) {
        // Superscripts/subscripts and stacked fractions sit a few points off the baseline: same line if they overlap
        const h = Math.max(it.height, 6);
        if (current.length && it.y > bottom - Math.min(3, h * 0.3)) {
            flush();
        }
        if (!current.length) {
            top = it.y;
            bottom = it.y + h;
        }
        current.push(it);
        top = Math.min(top, it.y);
        bottom = Math.max(bottom, it.y + h);
    }
    flush();
    // Page footers (page numbers, references) live in the bottom 7% of the page
    return lines.filter((l) => !(l.y > page.height * 0.93 && l.text.length < 40));
}

function joinItems(items: TextItem[]) {
    let out = "";
    let lastEnd = -Infinity;
    for (const it of items) {
        const gap = it.x - lastEnd;
        if (out && gap > 1.5 && !out.endsWith(" ") && !it.str.startsWith(" ")) out += " ";
        out += it.str;
        lastEnd = it.x + it.width;
    }
    return out.replace(/\s+/g, " ").trim();
}

// A leading "*" marks a question assessing extended writing ("*18")
const QUESTION_RE = /^\*?(\d{1,2})\s*\.$/;
const LABEL_RE = /^\*?\(([a-z]{1,4})\)$/;
const MARKS_RE = /^\((\d{1,2})\)$/;
// "(Total for Question 3 is 9 marks)" (maths), "(Total for Question 3 = 9 marks)" (sciences)
const TOTAL_Q_RE = /\(?\s*Total for Question (\d{1,2})\s*(?:is|=)\s*(\d{1,3}) marks?\s*\)?/i;
// Older papers: "(Total 8 marks)" or "Q3 (Total 8 marks)" after the last part
const TOTAL_Q_OLD_RE = /^(?:Q(\d{1,2})\s*)?\(\s*Total\s+(\d{1,3})\s+marks?\s*\)$/i;
const TOTAL_PAPER_RE = /TOTAL FOR PAPER(?:\s*IS|\s*=|:)?\s*(\d{1,3})\s*MARKS/i;
const FIGURE_RE = /^(?:Figure|Fig\.|Diagram)\s*(\d{1,2})$/i;

type Node = {
    number: string;
    parent: string | null;
    labels: string[];
    xs: number[];
    textLines: { text: string; page: number; y: number }[];
    marks: number;
    regions: Map<number, { top: number; bottom: number }>;
    figures: Region[];
    closed: boolean;
};

export type LayoutResult = ParsedPaper & {
    engine: "layout";
    /** Share of stems that probably contain maths the text layer garbled */
    garbledShare: number;
    pageCount: number;
};

/** "(ii) the tension…" or "3. A particle…" arrive as one text run: split the label off into its own item. */
function splitLeadingLabels(items: TextItem[]): TextItem[] {
    const out: TextItem[] = [];
    let leading = true;
    for (const it of items) {
        if (leading) {
            const m = /^\s*(\*?\(([a-z]{1,4})\)|\*?\d{1,2}\.)\s+(\S.*)$/.exec(it.str);
            if (m) {
                const share = m[1].length / it.str.length;
                out.push({ ...it, str: m[1], width: it.width * share });
                out.push({ ...it, str: m[3], x: it.x + it.width * share, width: it.width * (1 - share) });
                continue;
            }
            if (!/^\s*(\([a-z]{1,4}\)|\d{1,2}\.?)\s*$/.test(it.str)) leading = false;
        }
        out.push(it);
    }
    return out;
}

/** A "prose" line: real sentence text rather than labels inside a diagram. */
const isProse = (l: Line) => l.text.split(/\s+/).filter((w) => /[a-z]{3,}/i.test(w)).length >= 3;

export function parseQuestionPaperLayout(pages: PageText[], meta: { unit?: string | null; series?: string | null } = {}): LayoutResult {
    const nodes: Node[] = [];
    const byNumber = new Map<string, Node>();
    const totals: { paper: number | null; questions: Record<string, number> } = { paper: null, questions: {} };
    let question = 0;
    let stack: { label: string; x: number; roman: boolean }[] = [];
    let current = null as Node | null;
    let pending: Line[] = []; // text between one part's marks and the next label (intro for the next part)
    const dims = new Map(pages.map((p) => [p.page, { w: p.width, h: p.height }]));

    const touch = (node: Node, line: Line) => {
        const r = node.regions.get(line.page);
        if (r) {
            r.top = Math.min(r.top, line.y);
            r.bottom = Math.max(r.bottom, line.bottom);
        } else node.regions.set(line.page, { top: line.y, bottom: line.bottom });
    };

    const open = (number: string, parent: string | null, labels: string[], xs: number[], line: Line) => {
        const node: Node = { number, parent, labels, xs, textLines: [], marks: 0, regions: new Map(), figures: [], closed: false };
        nodes.push(node);
        byNumber.set(number, node);
        for (const p of pending) {
            touch(node, p);
            node.textLines.push({ text: p.text, page: p.page, y: p.y });
        }
        pending = [];
        touch(node, line);
        current = node;
        return node;
    };

    for (const page of pages) {
        const lines = buildLines(page);
        for (let li = 0; li < lines.length; li++) {
            const line = lines[li];
            const tq = TOTAL_Q_RE.exec(line.text) ?? TOTAL_Q_OLD_RE.exec(line.text);
            if (tq) {
                const qn = tq[1] ? Number(tq[1]) : question;
                if (qn > 0) totals.questions[String(qn)] = Number(tq[2]);
                if (current) current.closed = true;
                pending = [];
                continue;
            }
            const tp = TOTAL_PAPER_RE.exec(line.text);
            if (tp) {
                totals.paper = Number(tp[1]);
                continue;
            }

            let items = splitLeadingLabels(line.items);
            // Question start: "3." (sometimes split into "3" + ".") at the left margin, next in sequence
            const firstTwo = items.length > 1 ? `${items[0].str}${items[1].str}`.trim() : "";
            const qm = QUESTION_RE.exec(items[0].str.trim()) ?? (QUESTION_RE.test(firstTwo) ? QUESTION_RE.exec(firstTwo) : null);
            // Science papers print the number without a dot ("12 A man dives…"): only at the margin, followed by text
            const bare = !qm && /^\*?\d{1,2}$/.test(items[0].str.trim()) && items.length > 1 && items[0].x < page.width * 0.12 ? items[0].str.trim().replace("*", "") : null;
            if ((qm || bare) && items[0].x < page.width * 0.2 && Number(qm ? qm[1] : bare) === question + 1) {
                question = Number(qm ? qm[1] : bare);
                stack = [];
                pending = [];
                items = items.slice(qm && !QUESTION_RE.test(items[0].str.trim()) ? 2 : 1);
                open(String(question), null, [], [], line);
            }
            if (question === 0) continue; // cover page and instructions

            // Part labels at the start of the line (possibly two, as in "(ii) (a)")
            while (items.length && items[0].x < page.width * 0.3) {
                const lm = LABEL_RE.exec(items[0].str.trim());
                if (!lm) break;
                const label = lm[1];
                const x = items[0].x;
                // Close siblings and deeper levels: anything indented at or right of this label
                const trial = stack.slice();
                while (trial.length && trial[trial.length - 1].x >= x - 4) trial.pop();
                const prevSibling = stack.length > trial.length ? stack[trial.length] : null;
                let roman: boolean;
                let ok: boolean;
                if (prevSibling) {
                    roman = prevSibling.roman;
                    ok = nextLabel(prevSibling.label, roman) === label;
                    // "(i)" after "(h)" is a letter; after nothing at a new depth it's a numeral
                } else {
                    roman = label === "i";
                    ok = label === "a" || label === "i";
                }
                if (!ok || trial.length >= 3) break;
                stack = [...trial, { label, x, roman }];
                const number = `${question}${stack.map((s) => `(${s.label})`).join("")}`;
                if (byNumber.has(number)) break;
                const parent = stack.length > 1 ? `${question}${stack.slice(0, -1).map((s) => `(${s.label})`).join("")}` : String(question);
                open(number, parent, stack.map((s) => s.label), stack.map((s) => s.x), line);
                items = items.slice(1);
            }

            if (!current) continue;
            const node: Node = current;

            // Marks "(n)" at the right margin close the current part
            const last = items[items.length - 1];
            const mm = last ? MARKS_RE.exec(last.str.trim()) : null;
            if (mm && last.x > page.width * 0.75) {
                items = items.slice(0, -1);
                const rest = joinItems(items);
                if (rest) node.textLines.push({ text: rest, page: line.page, y: line.y });
                touch(node, line);
                // "(i) … (ii) … (iii) … (3)": one mark total printed after the last sub-part, none before it, means
                // the marks are for the parent part as a whole.
                const siblings = nodes.filter((n) => n.parent === node.parent && n !== node && node.parent !== null);
                const parentNode = node.parent ? byNumber.get(node.parent) : undefined;
                if (parentNode && parentNode.parent !== null && siblings.length && siblings.every((s) => s.marks === 0 && !s.closed)) {
                    parentNode.marks += Number(mm[1]);
                } else {
                    node.marks += Number(mm[1]);
                }
                node.closed = true;
                continue;
            }

            const text = joinItems(items);
            if (!text) continue;

            const fig = FIGURE_RE.exec(text);
            if (fig) {
                // The figure spans from the last prose line above it (or the top margin) down to its caption
                let top = page.height * 0.03;
                for (let k = li - 1; k >= 0; k--) {
                    if (isProse(lines[k])) {
                        top = lines[k].bottom + 2;
                        break;
                    }
                }
                const d = dims.get(page.page)!;
                const bbox: [number, number, number, number] = [0.08, Math.max(0, top / d.h), 0.92, Math.min(1, (line.bottom + 2) / d.h)];
                node.figures.push({ page: page.page, bbox });
                touch(node, { ...line, y: top });
                // Labels inside the diagram ("O", "3.4 cm", axis letters) aren't part of the stem
                node.textLines = node.textLines.filter((t) => t.page !== page.page || t.y < top - 1);
                pending = pending.filter((t) => t.page !== page.page || t.y < top - 1);
                continue;
            }

            if (node.closed) {
                // After a part's marks: either answer space (filtered already) or the intro to the next part
                if (isProse(line) || pending.length) pending.push(line);
                continue;
            }
            node.textLines.push({ text, page: line.page, y: line.y });
            touch(node, line);
        }
        // Text left pending at the end of a page belongs to the question it's in (e.g. "Given that…" before a part
        // that starts on the next page): keep it pending.
    }

    // Multiple-choice questions print no "(1)": their only mark is the printed total
    for (const [qn, total] of Object.entries(totals.questions)) {
        const own = nodes.filter((n) => n.number === qn || n.number.startsWith(`${qn}(`));
        const root = byNumber.get(qn);
        if (root && own.length === 1 && root.marks === 0) root.marks = total;
    }

    const questions: ParsedQuestion[] = nodes.map((n) => {
        const stem = n.textLines
            .map((t) => t.text)
            .join("\n")
            .trim();
        const regions: Region[] = [...n.regions.entries()].map(([page, r]) => {
            const d = dims.get(page)!;
            return { page, bbox: [0.06, Math.max(0, (r.top - 5) / d.h), 0.94, Math.min(1, (r.bottom + 9) / d.h)] };
        });
        return {
            number: n.number,
            parent: n.parent,
            stem,
            marks: n.marks,
            latex: false,
            figures: n.figures.slice(0, 12),
            dependsOn: inferDependsOn(n.number, stem),
            regions: regions.slice(0, 8),
        };
    });

    const garbled = questions.filter((q) => looksGarbled(q.stem)).length;
    return {
        engine: "layout",
        paper: { board: "Pearson Edexcel", unit: meta.unit ?? null, series: meta.series ?? null, paperType: "QP" },
        questions,
        totals,
        garbledShare: questions.length ? garbled / questions.length : 0,
        pageCount: pages.length,
    };
}

/** "Hence…", "Using your answer to part (a)…" → depends on that part (or the previous sibling for "Hence"). */
export function inferDependsOn(number: string, stem: string): string[] {
    const deps = new Set<string>();
    const q = /^(\d+)/.exec(number)?.[1];
    if (!q) return [];
    for (const m of stem.matchAll(/\bparts?\s*\(([a-z]{1,4})\)(?:\s*\(([ivx]{1,4})\))?/gi)) {
        const n = normaliseNumber(`${q}(${m[1].toLowerCase()})${m[2] ? `(${m[2].toLowerCase()})` : ""}`);
        if (n && n !== number) deps.add(n);
    }
    if (deps.size === 0 && /(^|\n)\s*(hence|using your answer)/i.test(stem)) {
        const labels = [...number.matchAll(/\(([a-z]+)\)/g)].map((m) => m[1]);
        const last = labels[labels.length - 1];
        if (last && last !== "a" && last !== "i") {
            const prev = isRoman(last) && last !== "i" ? romanPrev(last) : String.fromCharCode(last.charCodeAt(0) - 1);
            if (prev) deps.add(`${q}${labels.slice(0, -1).map((l) => `(${l})`).join("")}(${prev})`);
        }
    }
    return [...deps];
}

function romanPrev(r: string) {
    const list = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
    const i = list.indexOf(r);
    return i > 0 ? list[i - 1] : null;
}

/** Typeset maths breaks into many one- or two-character fragments in the text layer. */
export function looksGarbled(stem: string) {
    const tokens = stem.split(/\s+/).filter(Boolean);
    if (tokens.length < 4) return false;
    const tiny = tokens.filter((t) => t.length <= 2 && !/^(a|an|of|to|in|is|as|at|by|on|or|be|it|if|and)$/i.test(t)).length;
    return tiny / tokens.length > 0.3 || /[⌠⌡]/.test(stem);
}
