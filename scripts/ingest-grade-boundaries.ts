// Loads Pearson's published IAL unit grade boundaries (numbers only, with the source URL) for allowlisted subjects.
// The boundary PDFs are public support documents listed in the same Algolia index as the course materials. They're
// read, not stored. Restricted-window rules still apply to which series we keep.
//
//   pnpm papers:grade-boundaries
import "dotenv/config";
import { db } from "../lib/db";
import { isInRestrictedWindow, isRestrictedPath } from "../lib/papers/access";
import { enabledPaperSubjects, restrictedMonths } from "../lib/papers/config";
import { findSittingInText } from "../lib/papers/filename";
import { parseGradeBoundaryLines } from "../lib/papers/grades";
import { PoliteFetcher } from "../lib/papers/http";
import { buildLines } from "../lib/papers/parse/layout";
import { openPdf, pageTexts } from "../lib/papers/pdf";
import { extractAlgoliaConfig, pearsonUrl } from "../lib/papers/sources/pearson";

const SERIES = { jan: "JAN", jun: "JUN", oct: "OCT" } as const;

async function main() {
    const fetcher = new PoliteFetcher();
    const subjects = enabledPaperSubjects();
    const prefixes = [...new Set(subjects.flatMap((s) => s.unitPrefixes))];
    const page = await fetcher.cachedText(subjects[0].pearsonListingPage);
    const cfg = extractAlgoliaConfig(page.body);
    if (!cfg) throw new Error("No Algolia config");
    const res = await fetcher.cachedText(`https://${cfg.appId.toLowerCase()}-dsn.algolia.net/1/indexes/${encodeURIComponent(cfg.indexName)}/query`, {
        method: "POST",
        headers: { "X-Algolia-API-Key": cfg.apiKey, "X-Algolia-Application-Id": cfg.appId, "Content-Type": "application/json" },
        body: JSON.stringify({ query: "international advanced level grade boundaries", hitsPerPage: 100, attributesToRetrieve: ["title", "url"] }),
    });
    const hits = (JSON.parse(res.body).hits as { title?: string; url?: string }[]).filter(
        (h) => h.url?.endsWith(".pdf") && /grade boundaries/i.test(h.title ?? "") && /international/i.test(h.title ?? "") && h.url.includes("/International-A-level/"),
    );
    let rows = 0;
    for (const h of hits) {
        const sitting = findSittingInText(h.title!);
        const url = pearsonUrl(h.url!);
        if (!sitting || isRestrictedPath(url) || isInRestrictedWindow(sitting, new Date(), restrictedMonths())) continue;
        const existing = await db.gradeBoundary.count({ where: { sourceUrl: url } });
        if (existing > 0) continue;
        const file = await fetcher.download(url);
        if (file.status !== 200 || String.fromCharCode(...file.body.slice(0, 5)) !== "%PDF-") continue;
        const doc = await openPdf(file.body);
        const lines = (await pageTexts(doc)).flatMap((p) => buildLines(p).map((l) => l.text));
        await doc.close();
        for (const r of parseGradeBoundaryLines(lines, prefixes)) {
            const key = { unitCode: r.unitCode, paperCode: r.paperCode, year: sitting.year, series: SERIES[sitting.series] };
            await db.gradeBoundary.upsert({
                where: { unitCode_paperCode_year_series: key },
                create: { ...key, maxMark: r.maxMark, grades: r.grades, sourceUrl: url },
                update: { maxMark: r.maxMark, grades: r.grades, sourceUrl: url },
            });
            rows++;
        }
        console.log(`✓ ${h.title}`);
    }
    console.log(`${rows} unit boundaries from ${hits.length} documents`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
