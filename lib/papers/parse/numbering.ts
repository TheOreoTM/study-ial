// Question numbering: normalising "3 (b) (ii)" → "3(b)(ii)", parents, ordering and continuity. Pure, unit-tested.

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];

export function isRoman(s: string) {
    return ROMAN.includes(s.toLowerCase());
}

export function romanValue(s: string) {
    return ROMAN.indexOf(s.toLowerCase()) + 1;
}

/** "Q3 (b)(ii)", "3b(ii)", "3.b.ii" → "3(b)(ii)". Returns null if it doesn't look like a question number. */
export function normaliseNumber(raw: string): string | null {
    const s = raw.trim().toLowerCase().replace(/^q(?:uestion)?\s*/, "").replace(/\s+/g, "");
    const m = /^(\d{1,2})[.:]?((?:\(?[a-z]{1,4}\)?[.]?){0,3})$/.exec(s);
    if (!m) return null;
    const parts: string[] = [];
    let rest = m[2].replace(/\./g, "");
    while (rest) {
        const p = /^\(([a-z]{1,4})\)/.exec(rest) ?? /^([a-z])(?![a-z]*\))/.exec(rest) ?? /^([ivx]{1,4})/.exec(rest);
        if (!p) return null;
        parts.push(p[1]);
        rest = rest.slice(p[0].length);
    }
    if (parts.length > 3) return null;
    return `${Number(m[1])}${parts.map((p) => `(${p})`).join("")}`;
}

export function splitNumber(n: string): { question: number; parts: string[] } {
    const m = /^(\d+)((?:\([a-z]+\))*)$/.exec(n);
    if (!m) return { question: NaN, parts: [] };
    return { question: Number(m[1]), parts: [...m[2].matchAll(/\(([a-z]+)\)/g)].map((x) => x[1]) };
}

export function parentNumber(n: string): string | null {
    const { question, parts } = splitNumber(n);
    if (!Number.isFinite(question) || parts.length === 0) return null;
    return `${question}${parts
        .slice(0, -1)
        .map((p) => `(${p})`)
        .join("")}`;
}

export function questionOf(n: string) {
    return splitNumber(n).question;
}

/** Siblings are either all letters or all roman numerals: compare numerals by value, letters alphabetically. */
function compareLabels(p: string, q: string) {
    if (isRoman(p) && isRoman(q)) return romanValue(p) - romanValue(q);
    return p < q ? -1 : p > q ? 1 : 0;
}

/** Sort comparator: 2 < 2(a) < 2(a)(i) < 2(a)(ii) < 2(b) < 10. */
export function compareNumbers(a: string, b: string) {
    const x = splitNumber(a);
    const y = splitNumber(b);
    if (x.question !== y.question) return x.question - y.question;
    for (let i = 0; i < Math.max(x.parts.length, y.parts.length); i++) {
        if (x.parts[i] === undefined) return -1;
        if (y.parts[i] === undefined) return 1;
        if (x.parts[i] !== y.parts[i]) return compareLabels(x.parts[i], y.parts[i]);
    }
    return 0;
}

/** The label expected after `prev` at the same depth ("a" → "b", "ii" → "iii"). */
export function nextLabel(prev: string, roman: boolean) {
    if (roman) return ROMAN[romanValue(prev)] ?? null;
    return prev.length === 1 && prev < "z" ? String.fromCharCode(prev.charCodeAt(0) + 1) : null;
}
