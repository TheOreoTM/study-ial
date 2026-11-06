// Daily sweep of the parse queue (Vercel Cron). Jobs also run right after uploads and while a paper page polls, so
// this only catches stragglers. Protected by CRON_SECRET (Vercel sends it as a bearer token).
import { runJobs } from "@/lib/papers/jobs";
import { jsonError } from "@/lib/papers/serve";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return jsonError(401, "Unauthorized");
    const result = await runJobs({ budgetMs: 50_000 });
    return Response.json(result);
}
