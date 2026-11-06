import "server-only";
import { cache } from "react";
import { canStartTrial, entitlement, type ProAccess } from "@/lib/billing";
import { db } from "@/lib/db";
import { billingEnabled } from "@/lib/payments";

/** The student's ProAccess (see lib/billing.ts). Cached per request. */
export const getProAccess = cache(async (userId: string): Promise<ProAccess> => {
    if (!billingEnabled) return "pro";
    const sub = await db.subscription.findUnique({ where: { userId } });
    if (entitlement(sub, new Date()).pro) return "pro";
    return canStartTrial(sub) ? "trial" : "upgrade";
});

export const PRO_REQUIRED = "AI marking and the AI tutor are part of Pro.";

export async function getBillingOverview(userId: string) {
    const [sub, payments] = await Promise.all([
        db.subscription.findUnique({ where: { userId } }),
        db.payment.findMany({
            where: { userId, status: { not: "PENDING" } },
            orderBy: { createdAt: "desc" },
            take: 24,
            select: {
                id: true,
                kind: true,
                status: true,
                total: true,
                createdAt: true,
                failureReason: true,
                invoice: { select: { id: true, seq: true, issuedAt: true } },
            },
        }),
    ]);
    return { sub, payments };
}
