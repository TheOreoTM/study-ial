// Polite HTTP client for the indexer: one request at a time per host with a minimum gap, robots.txt respected,
// a generic descriptive User-Agent, and an on-disk cache for listing/JSON responses so re-runs don't re-request.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { INDEXER_USER_AGENT, MIN_REQUEST_GAP_MS } from "@/lib/papers/config";
import { isAllowedByRobots, parseRobots, type RobotsRules } from "@/lib/papers/access";

export class RobotsDisallowedError extends Error {
    constructor(public url: string) {
        super(`robots.txt disallows ${url}`);
    }
}

type CacheEntry = { status: number; contentType: string | null; body: string; fetchedAt: number };

export type PoliteFetcherOptions = {
    cacheDir?: string;
    /** How long cached text responses are reused */
    cacheTtlMs?: number;
    minGapMs?: number;
    userAgent?: string;
    log?: (msg: string) => void;
};

export class PoliteFetcher {
    private readonly lastRequest = new Map<string, number>();
    private readonly robots = new Map<string, RobotsRules>();
    private queue: Promise<unknown> = Promise.resolve();
    private readonly cacheDir: string;
    private readonly cacheTtlMs: number;
    private readonly minGapMs: number;
    private readonly userAgent: string;
    private readonly log: (msg: string) => void;
    requests = 0;

    constructor(opts: PoliteFetcherOptions = {}) {
        this.cacheDir = opts.cacheDir ?? path.join(process.cwd(), ".cache", "http");
        this.cacheTtlMs = opts.cacheTtlMs ?? 24 * 60 * 60 * 1000;
        this.minGapMs = Math.max(opts.minGapMs ?? MIN_REQUEST_GAP_MS, MIN_REQUEST_GAP_MS);
        this.userAgent = opts.userAgent ?? INDEXER_USER_AGENT;
        this.log = opts.log ?? (() => {});
    }

    /** Serialises every request through one queue: no parallel hammering, ever. */
    private enqueue<T>(fn: () => Promise<T>): Promise<T> {
        const run = this.queue.then(fn, fn);
        this.queue = run.catch(() => {});
        return run;
    }

    private async waitForHost(host: string) {
        const last = this.lastRequest.get(host) ?? 0;
        const wait = last + this.minGapMs - Date.now();
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        this.lastRequest.set(host, Date.now());
    }

    private async rawFetch(url: string, init: RequestInit = {}) {
        const host = new URL(url).host;
        await this.waitForHost(host);
        this.requests++;
        this.log(`${init.method ?? "GET"} ${url}`);
        return fetch(url, {
            ...init,
            redirect: init.redirect ?? "follow",
            headers: { "User-Agent": this.userAgent, ...(init.headers ?? {}) },
            signal: init.signal ?? AbortSignal.timeout(60_000),
        });
    }

    private async robotsFor(url: URL): Promise<RobotsRules> {
        const origin = url.origin;
        const cached = this.robots.get(origin);
        if (cached) return cached;
        let rules: RobotsRules = { allow: [], disallow: [] };
        try {
            const text = await this.cachedText(`${origin}/robots.txt`, { skipRobots: true });
            if (text.status === 200) rules = parseRobots(text.body, this.userAgent);
        } catch {
            // Unreachable robots.txt: treat as no rules (standard behaviour), but keep the rate limit.
        }
        this.robots.set(origin, rules);
        return rules;
    }

    async assertAllowed(url: string) {
        const u = new URL(url);
        const rules = await this.robotsFor(u);
        if (!isAllowedByRobots(rules, u.pathname + u.search)) throw new RobotsDisallowedError(url);
    }

    private cachePath(key: string) {
        return path.join(this.cacheDir, `${createHash("sha256").update(key).digest("hex")}.json`);
    }

    /** GET/POST returning text, cached on disk. Use for listings and JSON, not for PDFs. */
    async cachedText(
        url: string,
        opts: { method?: "GET" | "POST"; body?: string; headers?: Record<string, string>; skipRobots?: boolean; ttlMs?: number } = {},
    ): Promise<CacheEntry> {
        const key = `${opts.method ?? "GET"} ${url} ${opts.body ?? ""}`;
        const file = this.cachePath(key);
        try {
            const hit = JSON.parse(await readFile(file, "utf8")) as CacheEntry;
            if (Date.now() - hit.fetchedAt < (opts.ttlMs ?? this.cacheTtlMs)) return hit;
        } catch {
            // cache miss
        }
        // robots.txt is fetched through the same queue, so check it before taking a queue slot
        if (!opts.skipRobots) await this.assertAllowed(url);
        return this.enqueue(async () => {
            const res = await this.rawFetch(url, { method: opts.method, body: opts.body, headers: opts.headers });
            const entry: CacheEntry = {
                status: res.status,
                contentType: res.headers.get("content-type"),
                body: await res.text(),
                fetchedAt: Date.now(),
            };
            if (res.status < 500) {
                await mkdir(this.cacheDir, { recursive: true });
                await writeFile(file, JSON.stringify(entry));
            }
            return entry;
        });
    }

    /**
     * Downloads binary content (PDFs). Successful downloads are cached on disk too, so a run that fails after the
     * download (or is interrupted) never requests the same file twice.
     */
    async download(url: string, maxBytes = 40 * 1024 * 1024) {
        const base = this.cachePath(`FILE ${url}`).replace(/\.json$/, "");
        try {
            const meta = JSON.parse(await readFile(`${base}.meta.json`, "utf8")) as { contentType: string | null; finalUrl: string };
            const body = new Uint8Array(await readFile(`${base}.bin`));
            return { status: 200, contentType: meta.contentType, finalUrl: meta.finalUrl, body };
        } catch {
            // cache miss
        }
        await this.assertAllowed(url);
        return this.enqueue(async () => {
            const res = await this.rawFetch(url);
            const len = Number(res.headers.get("content-length") ?? 0);
            if (len > maxBytes) throw new Error(`File too large (${len} bytes): ${url}`);
            const body = new Uint8Array(await res.arrayBuffer());
            if (body.byteLength > maxBytes) throw new Error(`File too large (${body.byteLength} bytes): ${url}`);
            const out = { status: res.status, contentType: res.headers.get("content-type"), finalUrl: res.url || url, body };
            if (res.status === 200) {
                await mkdir(this.cacheDir, { recursive: true });
                await writeFile(`${base}.bin`, body);
                await writeFile(`${base}.meta.json`, JSON.stringify({ contentType: out.contentType, finalUrl: out.finalUrl }));
            }
            return out;
        });
    }

    /** HEAD request (falls back to a ranged GET when HEAD isn't supported), for the link checker. */
    async head(url: string) {
        await this.assertAllowed(url);
        return this.enqueue(async () => {
            let res = await this.rawFetch(url, { method: "HEAD" });
            if (res.status === 405 || res.status === 501) {
                res = await this.rawFetch(url, { headers: { Range: "bytes=0-1023" } });
                await res.body?.cancel();
            }
            return { status: res.status, contentType: res.headers.get("content-type"), finalUrl: res.url || url };
        });
    }
}
