import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { billingEnabled } from "@/lib/payments";
import { runBillingCron } from "@/lib/payments/service";

// The daily billing job (vercel.json "crons", 03:00 UTC = 08:00 in Malé). Vercel sends
// `Authorization: Bearer $CRON_SECRET`; without CRON_SECRET set the route refuses everything.
export const maxDuration = 60;

function authorized(req: NextRequest) {
    const secret = process.env.CRON_SECRET;
    if (!secret) return false;
    const got = Buffer.from(req.headers.get("authorization") ?? "");
    const want = Buffer.from(`Bearer ${secret}`);
    return got.length === want.length && timingSafeEqual(got, want);
}

export async function GET(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!billingEnabled) return NextResponse.json({ ok: true, skipped: "billing is off" });
    const summary = await runBillingCron();
    console.info("[billing] cron", summary);
    return NextResponse.json({ ok: true, ...summary }, { headers: { "Cache-Control": "no-store" } });
}
