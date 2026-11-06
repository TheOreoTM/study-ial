// Database-backed job queue for parsing (no extra infrastructure). Jobs are claimed atomically with
// FOR UPDATE SKIP LOCKED, retried with backoff, and a stale lock (crashed runner) is reclaimed after 10 minutes.
// Runners: `after()` right after an upload, the cron route, the "check again" poll on the paper page, and
// scripts/run-paper-jobs.ts locally.
import { db } from "@/lib/db";
import { parsePaper } from "@/lib/papers/parse/pipeline";
import { storage } from "@/lib/storage";

export const MAX_ATTEMPTS = 3;

export async function enqueueParse(
    paperId: string,
    opts: { userId?: string | null; vision?: boolean; force?: boolean; fresh?: boolean } = {},
) {
    const existing = await db.paperJob.findFirst({ where: { paperId, kind: "parse", status: { in: ["QUEUED", "RUNNING"] } } });
    if (existing) return existing;
    const [job] = await db.$transaction([
        db.paperJob.create({
            data: { kind: "parse", paperId, userId: opts.userId ?? null, state: { vision: !!opts.vision, force: !!opts.force, fresh: !!opts.fresh } },
        }),
        db.paper.update({ where: { id: paperId }, data: { parseStatus: "QUEUED", parseError: null } }),
    ]);
    return job;
}

type ClaimedJob = { id: string; kind: string; paperId: string; attempts: number; userId: string | null; state: unknown };

export async function claimNextJob(): Promise<ClaimedJob | null> {
    const rows = await db.$queryRaw<ClaimedJob[]>`
        UPDATE "PaperJob" SET status = 'RUNNING', "lockedAt" = now(), attempts = attempts + 1, "updatedAt" = now()
        WHERE id = (
            SELECT id FROM "PaperJob"
            WHERE (status = 'QUEUED' AND "runAfter" <= now())
               OR (status = 'RUNNING' AND "lockedAt" < now() - interval '10 minutes')
            ORDER BY "createdAt"
            LIMIT 1
            FOR UPDATE SKIP LOCKED
        )
        RETURNING id, kind, "paperId", attempts, "userId", state`;
    return rows[0] ?? null;
}

export async function runJob(job: ClaimedJob, log?: (m: string) => void) {
    const state = (job.state ?? {}) as { vision?: boolean; force?: boolean; fresh?: boolean };
    try {
        if (job.kind !== "parse") throw new Error(`Unknown job kind ${job.kind}`);
        await parsePaper(storage(), job.paperId, { userId: job.userId, vision: state.vision, force: state.force, fresh: state.fresh, log });
        await db.paperJob.update({ where: { id: job.id }, data: { status: "DONE", lockedAt: null, error: null } });
        return true;
    } catch (err) {
        const message = (err as Error).message.slice(0, 500);
        const final = job.attempts >= MAX_ATTEMPTS || /needs AI|quota|limit reached/i.test(message);
        await db.paperJob.update({
            where: { id: job.id },
            data: {
                status: final ? "FAILED" : "QUEUED",
                lockedAt: null,
                error: message,
                // 1, 4, 9 minutes
                runAfter: new Date(Date.now() + job.attempts * job.attempts * 60_000),
            },
        });
        if (final) await db.paper.update({ where: { id: job.paperId }, data: { parseStatus: "FAILED", parseError: message } });
        log?.(`job ${job.id} failed: ${message}`);
        return false;
    }
}

/** Runs queued jobs until the queue is empty or the time budget is spent. */
export async function runJobs({ budgetMs = 45_000, log }: { budgetMs?: number; log?: (m: string) => void } = {}) {
    const started = Date.now();
    let done = 0;
    let failed = 0;
    while (Date.now() - started < budgetMs) {
        const job = await claimNextJob();
        if (!job) break;
        if (await runJob(job, log)) done++;
        else failed++;
    }
    return { done, failed };
}
