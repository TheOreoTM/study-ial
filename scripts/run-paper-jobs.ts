// Queues and runs parse jobs locally (production runs them from upload requests and the cron route).
//
//   pnpm papers:parse --unit WMA11            queue every unparsed WMA11 paper (QP, MS, ER) and run the queue
//   pnpm papers:parse --unit WMA11 --vision   re-parse with the vision model (needs OPENROUTER_API_KEY)
//   pnpm papers:parse --unit WMA11 --fresh    ignore the parse cache (after engine changes)
//   pnpm papers:parse                         just run whatever is queued
import "dotenv/config";
import { parseArgs } from "node:util";
import { db } from "../lib/db";
import { enqueueParse, runJobs } from "../lib/papers/jobs";

async function main() {
    const { values } = parseArgs({
        options: {
            unit: { type: "string" },
            limit: { type: "string" },
            vision: { type: "boolean", default: false },
            force: { type: "boolean", default: false },
            all: { type: "boolean", default: false },
            fresh: { type: "boolean", default: false },
        },
    });
    if (values.unit) {
        const papers = await db.paper.findMany({
            where: {
                sitting: { unitCode: { in: values.unit.toUpperCase().split(",") }, ownerId: null },
                ...(values.all || values.vision || values.force || values.fresh ? {} : { parseStatus: { in: ["NONE", "FAILED"] } }),
            },
            // Mark schemes and reports first so question papers link to them as soon as they're written
            orderBy: [{ type: "desc" }, { createdAt: "asc" }],
            take: values.limit ? Number(values.limit) : undefined,
            select: { id: true },
        });
        for (const p of papers) await enqueueParse(p.id, { vision: values.vision, force: values.force, fresh: values.fresh });
        console.log(`Queued ${papers.length} papers`);
    }
    const res = await runJobs({ budgetMs: 60 * 60 * 1000, log: (m) => console.log(`  ${m}`) });
    console.log(`Done ${res.done} · failed ${res.failed}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
