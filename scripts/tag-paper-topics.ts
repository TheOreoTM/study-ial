// Re-tags parsed question papers with curriculum topics (heuristic, no AI). Parsing already does this; run it after
// changing topics or the tagger.   pnpm papers:tag [--unit WMA11]
import "dotenv/config";
import { parseArgs } from "node:util";
import { db } from "../lib/db";
import { tagPaperTopics } from "../lib/papers/tag-paper";

async function main() {
    const { values } = parseArgs({ options: { unit: { type: "string" } } });
    const papers = await db.paper.findMany({
        where: { type: "QP", questions: { some: {} }, ...(values.unit ? { sitting: { unitCode: { in: values.unit.toUpperCase().split(",") } } } : {}) },
        select: { id: true },
    });
    let tagged = 0;
    let total = 0;
    for (const p of papers) {
        const r = await tagPaperTopics(p.id);
        tagged += r.tagged;
        total += r.total;
    }
    console.log(`${papers.length} papers · ${tagged}/${total} parts tagged (${total ? Math.round((tagged / total) * 100) : 0}%)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
