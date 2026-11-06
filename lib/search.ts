// Search over the curriculum (subjects, units, topics, spec points), app pages and actions, and, for a signed-in
// student, the questions they've attempted and their mock papers. Pure functions (unit-tested). It runs in the
// browser on every keystroke: build the index once with `prepareDocs`, then call `searchPrepared`. Unseen question
// stems are never indexed: they'd leak practice content (and drafts).

export type SearchKind = "subject" | "unit" | "topic" | "page" | "question" | "mock";

export type SearchDoc = {
    kind: SearchKind;
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
    /** Extra words it should be found by (e.g. "settings" for "Share your progress") */
    keywords?: string[];
    /** A secondary action, e.g. Practise for a topic or question */
    action?: { label: string; href: string };
};

/** A signed-in student's own search data, from /api/search/personal. */
export type PersonalSearch = {
    /** Mastery for every topic the student has practised; missing topics are "not started" */
    mastery: Record<string, { level: "new" | "weak" | "developing" | "strong"; score: number | null }>;
    /** Topics practised most recently, newest first */
    recentTopicIds: string[];
    /** Questions they've answered and their mock papers, as search documents */
    docs: SearchDoc[];
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

/** A document with its text normalized once, so each keystroke only scans. */
export type PreparedDoc = {
    doc: SearchDoc;
    name: string;
    code: string;
    context: string;
    summary: string;
    keywords: string;
    points: string[];
};

export function prepareDoc(doc: SearchDoc): PreparedDoc {
    return {
        doc,
        name: normalize(doc.name),
        code: doc.code.toLowerCase(),
        context: normalize(doc.context),
        summary: doc.summary ? normalize(doc.summary) : "",
        keywords: doc.keywords?.length ? normalize(doc.keywords.join(" ")) : "",
        points: (doc.specPoints ?? []).map(normalize),
    };
}

export function prepareDocs(docs: SearchDoc[]): PreparedDoc[] {
    return docs.map(prepareDoc);
}

/** Small nudges so equal matches order sensibly: a code search finds the unit before its topics. */
const KIND_BONUS: Record<SearchKind, number> = { subject: 2, unit: 1, topic: 0, page: 1, question: 0, mock: 0 };

/**
 * Scores one prepared document. Every query word must appear somewhere in it (as the start of a word), otherwise it
 * doesn't match. Names count most, then codes and keywords, then summaries, then spec points.
 */
export function scorePrepared(p: PreparedDoc, tokens: string[]): SearchHit | null {
    if (tokens.length === 0) return null;
    const phrase = tokens.join(" ");

    let score = 0;
    for (const t of tokens) {
        let found = false;
        if (p.code === t) {
            score += 80;
            found = true;
        }
        if (wordStart(p.name, t)) {
            score += 20;
            found = true;
        }
        if (p.keywords && wordStart(p.keywords, t)) {
            score += 15;
            found = true;
        }
        if (p.summary && wordStart(p.summary, t)) {
            score += 5;
            found = true;
        }
        if (wordStart(p.context, t)) {
            score += 2;
            found = true;
        }
        if (!found && !p.points.some((pt) => wordStart(pt, t))) return null;
    }
    // Spec points: credit the one that matches the most words.
    let best: { index: number; hits: number } | null = null;
    for (let index = 0; index < p.points.length; index++) {
        let hits = 0;
        for (const t of tokens) if (wordStart(p.points[index], t)) hits++;
        if (hits > 0 && (!best || hits > best.hits)) best = { index, hits };
    }
    if (best) score += 3 * best.hits;

    if (p.name === phrase) score += 100;
    else if (p.name.startsWith(phrase)) score += 60;
    else if (phrase.length > 3 && p.name.includes(phrase)) score += 30;

    score += KIND_BONUS[p.doc.kind];

    const nameMatched = tokens.some((t) => wordStart(p.name, t) || p.code === t);
    return {
        doc: p.doc,
        score,
        point: best && !nameMatched ? { index: best.index, text: p.doc.specPoints![best.index] } : null,
    };
}

export function scoreDoc(doc: SearchDoc, tokens: string[]): SearchHit | null {
    return scorePrepared(prepareDoc(doc), tokens);
}

export function searchPrepared(prepared: PreparedDoc[], query: string, limit = 30): SearchHit[] {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];
    const hits: SearchHit[] = [];
    for (const p of prepared) {
        const h = scorePrepared(p, tokens);
        if (h) hits.push(h);
    }
    return hits.sort((a, b) => b.score - a.score || a.doc.name.localeCompare(b.doc.name)).slice(0, limit);
}

export function search(docs: SearchDoc[], query: string, limit = 30): SearchHit[] {
    return searchPrepared(prepareDocs(docs), query, limit);
}

export const KIND_LABEL: Record<SearchKind, string> = {
    page: "Go to",
    topic: "Topics",
    unit: "Units",
    subject: "Subjects",
    question: "Questions you've answered",
    mock: "Your mock papers",
};

/**
 * Groups hits by kind for display: at most `perKind[kind]` each, groups ordered by their best hit (so the strongest
 * match is always at the top), hits keep their score order.
 */
export function groupHits(
    hits: SearchHit[],
    perKind: Partial<Record<SearchKind, number>> = {},
): { kind: SearchKind; hits: SearchHit[] }[] {
    const groups = new Map<SearchKind, SearchHit[]>();
    for (const h of hits) {
        const list = groups.get(h.doc.kind) ?? [];
        if (list.length < (perKind[h.doc.kind] ?? Infinity)) list.push(h);
        groups.set(h.doc.kind, list);
    }
    return [...groups]
        .map(([kind, list]) => ({ kind, hits: list }))
        .filter((g) => g.hits.length > 0)
        .sort((a, b) => b.hits[0].score - a.hits[0].score);
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
        // LaTeX spacing commands (\, \; \: \! and "\ ") are spaces, not punctuation.
        .replace(/\\[,;:! ]/g, " ")
        .replace(/\\(frac|text|mathrm)\{([^}]*)\}/g, "$2")
        .replace(/\\([A-Za-z]+)/g, (m, name: string) => LATEX_SYMBOLS[name] ?? m)
        .replace(/[*_`#>\\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return plain.length > max ? `${plain.slice(0, max - 1).trimEnd()}…` : plain;
}
