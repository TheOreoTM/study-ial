// Open-access rules for the indexer. Pure and unit-tested: robots.txt matching, the restricted window, and checks
// that a URL / response is an open, real PDF. Anything that fails here is never downloaded or stored.
import { SERIES_END_MONTH, type Sitting } from "@/lib/papers/filename";

// ─── robots.txt ──────────────────────────────────────────────────────────────

export type RobotsRules = { allow: string[]; disallow: string[] };

/** Parses the rules that apply to `userAgent` (falls back to the `*` group). Groups are matched by substring. */
export function parseRobots(text: string, userAgent: string): RobotsRules {
    type Group = { agents: string[]; allow: string[]; disallow: string[] };
    const groups: Group[] = [];
    let current: Group | null = null;
    let lastWasAgent = false;

    for (const raw of text.split(/\r?\n/)) {
        const line = raw.replace(/#.*$/, "").trim();
        if (!line) continue;
        const idx = line.indexOf(":");
        if (idx < 0) continue;
        const field = line.slice(0, idx).trim().toLowerCase();
        const value = line.slice(idx + 1).trim();
        if (field === "user-agent") {
            if (!current || !lastWasAgent) {
                current = { agents: [], allow: [], disallow: [] };
                groups.push(current);
            }
            current.agents.push(value.toLowerCase());
            lastWasAgent = true;
            continue;
        }
        lastWasAgent = false;
        if (!current) continue;
        if (field === "allow" && value) current.allow.push(value);
        if (field === "disallow" && value) current.disallow.push(value);
    }

    const ua = userAgent.toLowerCase();
    const specific = groups.find((g) => g.agents.some((a) => a !== "*" && ua.includes(a)));
    const group = specific ?? groups.find((g) => g.agents.includes("*"));
    return { allow: group?.allow ?? [], disallow: group?.disallow ?? [] };
}

function patternToRegExp(pattern: string) {
    const anchored = pattern.endsWith("$");
    const body = (anchored ? pattern.slice(0, -1) : pattern)
        .split("*")
        .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
        .join(".*");
    return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

/** Longest-match rule wins (Google semantics); ties go to Allow. Paths are compared decoded and raw. */
export function isAllowedByRobots(rules: RobotsRules, path: string): boolean {
    const candidates = new Set([path]);
    try {
        candidates.add(decodeURI(path));
    } catch {
        // keep the raw path only
    }
    let best: { len: number; allow: boolean } | null = null;
    for (const p of candidates) {
        for (const [list, allow] of [
            [rules.disallow, false],
            [rules.allow, true],
        ] as const) {
            for (const rule of list) {
                if (patternToRegExp(rule).test(p)) {
                    const len = rule.length;
                    if (!best || len > best.len || (len === best.len && allow)) best = { len, allow };
                }
            }
        }
    }
    return best ? best.allow : true;
}

// ─── Restricted window & open paths ──────────────────────────────────────────

/** Last day of a sitting's exam window, UTC. */
export function sittingEndDate(s: Sitting) {
    // Day 0 of the next month = last day of the end month
    return new Date(Date.UTC(s.year, SERIES_END_MONTH[s.series], 0));
}

/** True while Pearson still keeps a sitting behind a centre login (within `months` of the end of the sitting). */
export function isInRestrictedWindow(s: Sitting, now: Date, months: number) {
    const end = sittingEndDate(s);
    const openFrom = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + months, end.getUTCDate()));
    return now < openFrom;
}

/** Pearson serves restricted (centre-login) materials from /content/dam/secure/…; open ones from /content/dam/pdf/…. */
export function isRestrictedPath(url: string) {
    let path: string;
    try {
        path = new URL(url).pathname.toLowerCase();
    } catch {
        return true;
    }
    return /\/(secure|gold|silver)\//.test(path) || path.includes("login") || path.includes("signin");
}

export type SkipReason =
    | "restricted-path"
    | "restricted-window"
    | "robots"
    | "not-allowlisted"
    | "not-a-paper"
    | "not-pdf"
    | "login-required";

/** Checks a downloaded response is an actual open PDF (Pearson answers missing/locked files with HTML pages). */
export function checkPdfResponse(res: {
    status: number;
    contentType: string | null;
    finalUrl: string;
    firstBytes: Uint8Array;
}): { ok: true } | { ok: false; reason: SkipReason } {
    if (res.status === 401 || res.status === 403) return { ok: false, reason: "login-required" };
    if (isRestrictedPath(res.finalUrl)) return { ok: false, reason: "login-required" };
    const magic = String.fromCharCode(...res.firstBytes.slice(0, 5));
    if (res.status !== 200 || magic !== "%PDF-") return { ok: false, reason: "not-pdf" };
    const ct = (res.contentType ?? "").toLowerCase();
    if (ct && !ct.includes("pdf") && !ct.includes("octet-stream")) return { ok: false, reason: "not-pdf" };
    return { ok: true };
}
