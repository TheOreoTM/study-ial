// Verifies every stored paper's source URL still resolves to an open PDF and reports 404s / redirects to login.
//
//   pnpm papers:check-links [--subject mathematics] [--limit 50]
//
// Results are saved on each Paper (lastCheckedAt / lastCheckOk / lastCheckNote) and shown in /admin/papers.
import "dotenv/config";
import { parseArgs } from "node:util";
import { db } from "../lib/db";
import { isRestrictedPath } from "../lib/papers/access";
import { PoliteFetcher } from "../lib/papers/http";

async function main() {
    const { values } = parseArgs({ options: { subject: { type: "string" }, limit: { type: "string" } } });
    const papers = await db.paper.findMany({
        where: { sourceUrl: { not: null }, ...(values.subject ? { sitting: { subject: values.subject } } : {}) },
        select: { id: true, sourceUrl: true },
        // Least recently checked first, so repeated partial runs cover everything
        orderBy: [{ lastCheckedAt: { sort: "asc", nulls: "first" } }],
        take: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    });
    const fetcher = new PoliteFetcher();
    const broken: { url: string; note: string }[] = [];
    for (const p of papers) {
        const url = p.sourceUrl!;
        let ok = false;
        let note: string;
        try {
            const res = await fetcher.head(url);
            const ct = (res.contentType ?? "").toLowerCase();
            ok = res.status === 200 && ct.includes("pdf") && !isRestrictedPath(res.finalUrl);
            note = ok ? "ok" : `${res.status} ${ct || "no content-type"}${res.finalUrl !== url ? ` → ${res.finalUrl}` : ""}`;
        } catch (err) {
            note = (err as Error).message;
        }
        await db.paper.update({ where: { id: p.id }, data: { lastCheckedAt: new Date(), lastCheckOk: ok, lastCheckNote: note } });
        if (!ok) {
            broken.push({ url, note });
            console.log(`✗ ${url} — ${note}`);
        }
    }
    console.log(`\nChecked ${papers.length} · broken ${broken.length}`);
    if (broken.length) process.exitCode = 2;
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
