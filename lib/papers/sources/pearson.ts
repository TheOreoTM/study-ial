// Pearson discovery. The course-materials pages render their document lists in the browser from an Algolia index;
// we call the same Algolia `browse` endpoint (with the search-only key the public page embeds) instead of scraping
// HTML. `mapPearsonHit` is pure and unit-tested.
import { isInRestrictedWindow, isRestrictedPath } from "@/lib/papers/access";
import { restrictedMonths, type PaperSubjectConfig } from "@/lib/papers/config";
import {
    docTypeFromFacet,
    findSittingInText,
    parseListingTitle,
    parsePearsonFilename,
    parseSeriesFacet,
    type Sitting,
} from "@/lib/papers/filename";
import type { PoliteFetcher } from "@/lib/papers/http";
import type { DiscoveryResult, PaperCandidate, Skipped } from "@/lib/papers/sources/types";

export const PEARSON_ORIGIN = "https://qualifications.pearson.com";

export type AlgoliaConfig = { appId: string; apiKey: string; indexName: string };

/** Reads the Algolia app id, search-only key and index name from a course-materials page's hidden inputs. */
export function extractAlgoliaConfig(html: string): AlgoliaConfig | null {
    const read = (cls: string) => {
        const tag = new RegExp(`<input[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, "i").exec(html)?.[0];
        return tag ? (/value="([^"]*)"/i.exec(tag)?.[1] ?? null) : null;
    };
    const appId = read("algoliaAppId");
    const apiKey = read("algoliaAPIKey");
    const indexName = read("algoliaIndexName");
    if (!appId || !apiKey || !indexName) return null;
    if (!/^[A-Z0-9]{6,20}$/i.test(appId) || !/^[a-f0-9]{16,64}$/i.test(apiKey)) return null;
    return { appId, apiKey, indexName };
}

export type AlgoliaHit = {
    url?: string;
    title?: string;
    category?: string[];
    extension?: string;
    gating?: boolean;
};

const facet = (hit: AlgoliaHit, name: string) =>
    (hit.category ?? []).find((c) => c.startsWith(`Pearson-UK:${name}/`))?.slice(`Pearson-UK:${name}/`.length) ?? null;

/** Full, properly encoded URL for a listing path (paths can contain literal spaces in older materials). */
export function pearsonUrl(pathOrUrl: string) {
    return new URL(encodeURI(decodeSafe(pathOrUrl)), PEARSON_ORIGIN).toString();
}

function decodeSafe(s: string) {
    try {
        return decodeURI(s);
    } catch {
        return s;
    }
}

/** Turns one Algolia record into a candidate, or a skip with the reason. */
export function mapPearsonHit(
    hit: AlgoliaHit,
    subject: PaperSubjectConfig,
    spec: string | null,
    now: Date,
): { candidate: PaperCandidate } | { skip: Skipped } | null {
    if (!hit.url) return null;
    const sourceUrl = pearsonUrl(hit.url);
    const title = (hit.title ?? "").trim();
    const skip = (reason: Skipped["reason"], detail?: string) => ({ skip: { sourceUrl, title, reason, detail } });

    const docType = docTypeFromFacet(facet(hit, "Document-Type") ?? "");
    const filename = decodeSafe(hit.url.split("/").pop() ?? "");
    let parsed = parsePearsonFilename(filename);
    if (!parsed && filename.toLowerCase().endsWith(".pdf") && docType) {
        // Free-form filename: take the unit from the listing title instead
        const fromTitle = parseListingTitle(title);
        if (fromTitle) parsed = { ...fromTitle, type: docType, publishedAt: null, updated: false, unused: false };
    }
    if (!parsed) {
        // Not an IAL paper PDF (zip of modified papers, UK A Level paper, Word file, …). Only report IAL-looking ones.
        return /\(\s*W[A-Z]{2}\d{2}\s*\)/.test(title) && docType ? skip("not-a-paper", filename) : null;
    }
    if (!subject.unitPrefixes.some((p) => parsed.unitCode.startsWith(p))) return null; // another subject's unit
    if (isRestrictedPath(sourceUrl) || hit.gating) return skip("restricted-path");
    if (parsed.unused || /\bunused\b/i.test(title)) return skip("not-a-paper", "unused paper (no real sitting)");

    const type = docType ?? parsed.type;
    if (!type) return skip("not-a-paper", filename);
    const seriesFacet = facet(hit, "Exam-Series");
    const sitting: Sitting | null = (seriesFacet && parseSeriesFacet(seriesFacet)) || findSittingInText(title);
    if (sitting && isInRestrictedWindow(sitting, now, restrictedMonths())) {
        return skip("restricted-window", `${sitting.series} ${sitting.year}`);
    }

    return {
        candidate: {
            source: "PEARSON",
            sourceUrl,
            title,
            subject: subject.slug,
            spec,
            unitCode: parsed.unitCode,
            paperCode: parsed.paperCode,
            type,
            year: sitting?.year ?? null,
            series: sitting?.series ?? null,
            publishedAt: parsed.publishedAt,
            preferred: parsed.updated || /\(updated\)/i.test(title),
        },
    };
}

async function browseAll(fetcher: PoliteFetcher, cfg: AlgoliaConfig, filters: string) {
    const url = `https://${cfg.appId.toLowerCase()}-dsn.algolia.net/1/indexes/${encodeURIComponent(cfg.indexName)}/browse`;
    const headers = {
        "X-Algolia-API-Key": cfg.apiKey,
        "X-Algolia-Application-Id": cfg.appId,
        "Content-Type": "application/json",
    };
    const hits: AlgoliaHit[] = [];
    let body: Record<string, unknown> = { query: "", filters, hitsPerPage: 1000 };
    for (let page = 0; page < 50; page++) {
        const res = await fetcher.cachedText(url, { method: "POST", body: JSON.stringify(body), headers });
        if (res.status !== 200) throw new Error(`Algolia browse failed: ${res.status} ${res.body.slice(0, 200)}`);
        const json = JSON.parse(res.body) as { hits: AlgoliaHit[]; cursor?: string };
        hits.push(...json.hits);
        if (!json.cursor) break;
        body = { cursor: json.cursor };
    }
    return hits;
}

/** Discovers every open exam-material PDF for one allowlisted subject. */
export async function discoverPearson(
    fetcher: PoliteFetcher,
    subject: PaperSubjectConfig,
    now = new Date(),
): Promise<DiscoveryResult> {
    const page = await fetcher.cachedText(subject.pearsonListingPage);
    if (page.status !== 200) throw new Error(`Couldn't load ${subject.pearsonListingPage} (${page.status})`);
    const cfg = extractAlgoliaConfig(page.body);
    if (!cfg) throw new Error(`No Algolia configuration found on ${subject.pearsonListingPage}`);

    const candidates: PaperCandidate[] = [];
    const skipped: Skipped[] = [];
    const seen = new Set<string>();
    for (const { code, spec } of subject.pearsonSpecCodes) {
        const filters =
            `category:"Pearson-UK:Specification-Code/${code}" AND category:"Pearson-UK:Category/Exam-materials"` +
            ` AND type:"dam:Asset"`;
        for (const hit of await browseAll(fetcher, cfg, filters)) {
            const mapped = mapPearsonHit(hit, subject, spec, now);
            if (!mapped) continue;
            const url = "candidate" in mapped ? mapped.candidate.sourceUrl : mapped.skip.sourceUrl;
            if (seen.has(url)) continue;
            seen.add(url);
            if ("candidate" in mapped) candidates.push(mapped.candidate);
            else skipped.push(mapped.skip);
        }
    }
    return { candidates, skipped };
}
