// Indexes open-access IAL past papers into private storage.
//
//   pnpm papers:ingest --subject mathematics --units WMA11 --limit 10
//   pnpm papers:ingest --subject mathematics --dry-run
//
// Options: --subject <slug>[,…]  --units <code>[,…]  --types QP,MS,ER  --limit <n>  --source pearson|pmt
//          --dry-run (discover + filter only, no downloads)
// Safe to re-run: files already stored (by source URL, then by content hash) are skipped. Reports go to
// .cache/ingest/<timestamp>.json.
import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { db } from "../lib/db";
import { ingest } from "../lib/papers/ingest";
import { PoliteFetcher } from "../lib/papers/http";
import { storage } from "../lib/storage";
import type { DocType } from "../lib/papers/filename";

const list = (v?: string) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : undefined);

async function main() {
    const { values } = parseArgs({
        options: {
            subject: { type: "string" },
            units: { type: "string" },
            types: { type: "string" },
            limit: { type: "string" },
            source: { type: "string" },
            "dry-run": { type: "boolean", default: false },
            verbose: { type: "boolean", default: false },
        },
    });
    const store = storage();
    const fetcher = new PoliteFetcher({ log: values.verbose ? (m) => console.log(`    ${m}`) : undefined });
    console.log(`Storage: ${store.kind}${store.kind === "local" ? " (R2 not configured)" : ""}`);

    const report = await ingest(db, store, fetcher, {
        subjects: list(values.subject),
        units: list(values.units),
        types: list(values.types)?.map((t) => t.toUpperCase()) as DocType[] | undefined,
        limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
        sources: list(values.source) as ("pearson" | "pmt")[] | undefined,
        dryRun: values["dry-run"],
    });

    const byReason = report.skipped.reduce<Record<string, number>>((acc, s) => {
        acc[s.reason] = (acc[s.reason] ?? 0) + 1;
        return acc;
    }, {});
    console.log(`\nDiscovered ${report.discovered} · stored ${report.stored.length} · already stored ${report.alreadyStored}`);
    console.log(`Duplicates ${report.duplicates.length} · errors ${report.errors.length} · requests ${report.requests}`);
    console.log(`Skipped: ${JSON.stringify(byReason)}`);

    const dir = path.join(process.cwd(), ".cache", "ingest");
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, `${report.startedAt.replace(/[:.]/g, "-")}.json`);
    await writeFile(file, JSON.stringify(report, null, 2));
    console.log(`Report: ${path.relative(process.cwd(), file)}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
