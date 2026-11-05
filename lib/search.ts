// Curriculum search over subjects, units, topics and specification points. Pure functions (unit-tested); the page
// loads the documents and calls `search`. Question stems are deliberately not searchable: they'd leak practice
// content (and drafts) onto a public page.

export type SearchDoc = {
    kind: "subject" | "unit" | "topic";
    id: string;
    href: string;
    /** Display name, e.g. "Motion and kinematics" */
    name: string;
    /** Paper or topic code, e.g. "WPH11" or "1.1" */
    code: string;
    /** Where it lives, e.g. "Physics · WPH11" */
    context: string;
    summary?: string | null;
    specPoints?: string[];
};

export type SearchHit = {
    doc: SearchDoc;
    score: number;
    /** The best-matching spec point, when that's what matched */
    point: { index: number; text: string } | null;
};

const MAX_TOKENS = 8;

/** Lower-case, accents and Markdown/LaTeX markup removed, whitespace collapsed. */
export function normalize(text: string) {
    return text
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/\\(frac|text|mathrm|left|right|times|cdot)\b/g, " ")
        .replace(/[$*_`#>{}\\^~|[\]()]/g, " ")
        .replace(/[–—-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/** Query words, de-duplicated; codes like "1.2" and "wph11" stay whole. */
export function tokenize(query: string) {
    const words = normalize(query)
        .split(" ")
        .map((w) => w.replace(/^[.,;:!?'"]+|[.,;:!?'"]+$/g, ""))
        .filter(Boolean);
    return [...new Set(words)].slice(0, MAX_TOKENS);
}

/** Whether `token` starts a word in `text` (both normalized). */
function wordStart(text: string, token: string) {
    let i = text.indexOf(token);
    while (i !== -1) {
        if (i === 0 || !/[a-z0-9]/.test(text[i - 1])) return true;
        i = text.indexOf(token, i + 1);
    }
    return false;
}

/**
 * Scores one document. Every query word must appear somewhere in it (as the start of a word), otherwise it doesn't
 * match. Names count most, then codes, then summaries, then spec points.
 */
export function scoreDoc(doc: SearchDoc, tokens: string[]): SearchHit | null {
    if (tokens.length === 0) return null;
    const name = normalize(doc.name);
    const code = doc.code.toLowerCase();
    const context = normalize(doc.context);
    const summary = doc.summary ? normalize(doc.summary) : "";
    const points = (doc.specPoints ?? []).map(normalize);
    const phrase = tokens.join(" ");

    let score = 0;
    let bestPoint: { index: number; hits: number } | null = null;
    for (const t of tokens) {
        let found = false;
        if (code === t) {
            score += 80;
            found = true;
        }
        if (wordStart(name, t)) {
            score += 20;
            found = true;
        }
        if (wordStart(summary, t)) {
            score += 5;
            found = true;
        }
        if (wordStart(context, t)) {
            score += 2;
            found = true;
        }
        if (!found && points.some((p) => wordStart(p, t))) found = true;
        if (!found) return null;
    }
    // Spec points: credit the one that matches the most words.
    points.forEach((p, index) => {
        const hits = tokens.filter((t) => wordStart(p, t)).length;
        if (hits > 0 && (!bestPoint || hits > bestPoint.hits)) bestPoint = { index, hits };
    });
    const bp = bestPoint as { index: number; hits: number } | null;
    if (bp) score += 3 * bp.hits;

    if (name === phrase) score += 100;
    else if (name.startsWith(phrase)) score += 60;
    else if (phrase.length > 3 && name.includes(phrase)) score += 30;

    // Codes are short and exact, so a code search finds the unit before its topics.
    if (doc.kind === "unit") score += 1;
    if (doc.kind === "subject") score += 2;

    const nameMatched = tokens.some((t) => wordStart(name, t) || code === t);
    return {
        doc,
        score,
        point: bp && !nameMatched ? { index: bp.index, text: doc.specPoints![bp.index] } : null,
    };
}

export function search(docs: SearchDoc[], query: string, limit = 30): SearchHit[] {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];
    return docs
        .map((d) => scoreDoc(d, tokens))
        .filter((h): h is SearchHit => h !== null)
        .sort((a, b) => b.score - a.score || a.doc.name.localeCompare(b.doc.name))
        .slice(0, limit);
}

export type Segment = { text: string; match: boolean };

/**
 * Splits plain text into matched and unmatched runs for <mark> highlighting. Matching is case-insensitive and on
 * word starts, like the search itself.
 */
export function highlight(text: string, tokens: string[]): Segment[] {
    const lower = text.toLowerCase();
    const marks = new Array<boolean>(text.length).fill(false);
    for (const t of tokens) {
        if (!t) continue;
        let i = lower.indexOf(t);
        while (i !== -1) {
            if (i === 0 || !/[a-z0-9]/i.test(text[i - 1])) for (let k = i; k < i + t.length; k++) marks[k] = true;
            i = lower.indexOf(t, i + 1);
        }
    }
    const out: Segment[] = [];
    for (let i = 0; i < text.length; i++) {
        const last = out[out.length - 1];
        if (last && last.match === marks[i]) last.text += text[i];
        else out.push({ text: text[i], match: marks[i] });
    }
    return out;
}

const LATEX_SYMBOLS: Record<string, string> = {
    alpha: "α",
    beta: "β",
    gamma: "γ",
    Delta: "Δ",
    delta: "δ",
    epsilon: "ε",
    varepsilon: "ε",
    theta: "θ",
    lambda: "λ",
    mu: "μ",
    pi: "π",
    rho: "ρ",
    sigma: "σ",
    Sigma: "Σ",
    phi: "φ",
    omega: "ω",
    Omega: "Ω",
    times: "×",
    cdot: "·",
    approx: "≈",
    leq: "≤",
    geq: "≥",
    le: "≤",
    ge: "≥",
    circ: "°",
    sqrt: "√",
    propto: "∝",
    rightarrow: "→",
    to: "→",
};

/** Spec points and summaries as readable plain text for result snippets, trimmed to about `max` characters. */
export function plainSnippet(text: string, max = 180) {
    const plain = text
        .replace(/\$([^$]*)\$/g, "$1")
        .replace(/\\(frac|text|mathrm)\{([^}]*)\}/g, "$2")
        .replace(/\\([A-Za-z]+)/g, (m, name: string) => LATEX_SYMBOLS[name] ?? m)
        .replace(/[*_`#>\\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return plain.length > max ? `${plain.slice(0, max - 1).trimEnd()}…` : plain;
}
