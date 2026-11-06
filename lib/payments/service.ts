import "server-only";
import {
    canCheckout,
    canStartTrial,
    cronAction,
    entitlement,
    formatMvr,
    graceEnd,
    GST_RATE,
    nextPeriod,
    priceWithGst,
    trialEnd,
    trialReminderDue,
    CURRENCY,
} from "@/lib/billing";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { Prisma } from "@/lib/generated/prisma/client";
import { site } from "@/lib/site";
import { paymentProvider } from "./index";
import type { ChargeResult, PaymentProvider } from "./types";

// Money movement for the Pro plan. Pure rules live in lib/billing.ts; this file applies them to the database and the
// provider. Every state change is guarded (`updateMany ... where status/lastAttemptAt`) so a double-clicked return
// page, a webhook racing the return page, or a rerun of the daily job can't settle or charge twice.

const DESCRIPTION = `${site.name} Pro, 1 month`;

function provider(): PaymentProvider {
    if (!paymentProvider) throw new Error("Billing is off (no BILLING_PROVIDER).");
    return paymentProvider;
}

const appUrl = (path: string) => new URL(path, site.url).toString();

const dateLabel = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Indian/Maldives" });

/** Fire-and-log: a failed email must never undo or block a payment. */
async function email(to: string | null | undefined, subject: string, text: string) {
    if (!to) return;
    try {
        await sendEmail({ to, subject, text });
    } catch (e) {
        console.error("[billing] email failed", subject, e);
    }
}

// ─── Trial ───────────────────────────────────────────────────────────────────

export async function startTrial(userId: string, now = new Date()) {
    const existing = await db.subscription.findUnique({ where: { userId } });
    if (!canStartTrial(existing)) return { ok: false as const, error: "You've already used your free week." };
    try {
        const sub = await db.subscription.create({ data: { userId, status: "TRIALING", trialEndsAt: trialEnd(now) } });
        return { ok: true as const, trialEndsAt: sub.trialEndsAt! };
    } catch (e) {
        // Two tabs racing: the userId primary key lets only one trial through.
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
            return { ok: false as const, error: "You've already used your free week." };
        throw e;
    }
}

// ─── Checkout (first month, or paying again) ─────────────────────────────────

export async function beginCheckout(userId: string, now = new Date()) {
    const sub = await db.subscription.findUnique({ where: { userId } });
    if (!canCheckout(sub, now)) return { ok: false as const, error: "Your Pro plan renews by itself; nothing to pay." };
    const p = provider();
    const price = priceWithGst();
    const payment = await db.payment.create({
        data: { userId, kind: "SUBSCRIBE", ...price, currency: CURRENCY, provider: p.name },
    });
    try {
        const { providerRef, url } = await p.createCheckout({
            paymentId: payment.id,
            amount: price.total,
            currency: CURRENCY,
            description: DESCRIPTION,
            returnUrl: appUrl(`/billing/return?payment=${payment.id}`),
            saveCard: true,
        });
        await db.payment.update({ where: { id: payment.id }, data: { providerRef } });
        return { ok: true as const, url };
    } catch (e) {
        console.error("[billing] checkout failed to start", e);
        await db.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED", failureReason: "The payment page couldn't be opened." },
        });
        return { ok: false as const, error: "The payment page couldn't be opened. Try again in a minute." };
    }
}

/** After the student comes back from the provider: ask the provider what happened and apply it. */
export async function confirmCheckout(paymentId: string, userId: string) {
    const payment = await db.payment.findFirst({ where: { id: paymentId, userId, kind: "SUBSCRIBE" } });
    if (!payment) return "missing" as const;
    if (payment.status !== "PENDING") return payment.status === "PAID" ? ("paid" as const) : ("failed" as const);
    if (!payment.providerRef) return "failed" as const;
    const result = await provider().getCheckout(payment.providerRef);
    return settlePayment(paymentId, result);
}

// ─── Settling a charge ───────────────────────────────────────────────────────

/**
 * Applies a provider result to a PENDING payment exactly once. Paid → the subscription gets its next month (starting
 * when current access ends, so no paid days are lost), the card is kept for renewals, and a tax invoice is issued.
 */
export async function settlePayment(paymentId: string, result: ChargeResult, now = new Date()) {
    if (result.status === "pending") return "pending" as const;

    if (result.status === "failed") {
        await db.payment.updateMany({
            where: { id: paymentId, status: "PENDING" },
            data: { status: "FAILED", failureReason: result.reason.slice(0, 300), providerRef: result.providerRef },
        });
        return "failed" as const;
    }

    const settled = await db.$transaction(async (tx) => {
        const claimed = await tx.payment.updateMany({
            where: { id: paymentId, status: "PENDING" },
            data: { status: "PAID", paidAt: now, providerRef: result.providerRef },
        });
        if (claimed.count === 0) return null;
        const payment = await tx.payment.findUniqueOrThrow({
            where: { id: paymentId },
            include: { user: { select: { name: true, email: true } } },
        });
        if (!payment.userId || !payment.user) return null; // account deleted mid-checkout; kept for the refund
        const sub = await tx.subscription.findUnique({ where: { userId: payment.userId } });
        const period = nextPeriod(sub, now);
        const fields = {
            status: "ACTIVE" as const,
            currentPeriodStart: period.start,
            currentPeriodEnd: period.end,
            graceEndsAt: null,
            cancelAtPeriodEnd: false,
            failedAttempts: 0,
            remindedAt: null,
            lastAttemptAt: now,
            ...(result.card ? { cardToken: result.card.token, cardLabel: result.card.label } : {}),
        };
        await tx.subscription.upsert({
            where: { userId: payment.userId },
            create: { userId: payment.userId, ...fields },
            update: fields,
        });
        await tx.payment.update({
            where: { id: paymentId },
            data: { periodStart: period.start, periodEnd: period.end },
        });
        const invoice = await tx.invoice.create({
            data: {
                paymentId,
                userId: payment.userId,
                issuedAt: now,
                ...businessDetails(),
                customerName: payment.user.name,
                customerEmail: payment.user.email,
                description: `${DESCRIPTION}: ${dateLabel(period.start)} to ${dateLabel(period.end)}`,
                net: payment.net,
                gst: payment.gst,
                total: payment.total,
                gstRateBps: Math.round(GST_RATE * 10_000),
                currency: payment.currency,
            },
        });
        return { payment, period, invoiceId: invoice.id };
    });

    if (settled) {
        const { payment, period, invoiceId } = settled;
        await email(
            payment.user?.email,
            `${site.name} Pro receipt: ${formatMvr(payment.total)}`,
            [
                `Thanks${payment.user?.name ? `, ${payment.user.name.split(" ")[0]}` : ""}. We've received ${formatMvr(payment.total)} (including ${formatMvr(payment.gst)} GST).`,
                ``,
                `Pro runs until ${dateLabel(period.end)}${payment.kind === "RENEWAL" ? "" : " and renews monthly with your saved card"}.`,
                `Tax invoice: ${appUrl(`/billing/invoices/${invoiceId}`)}`,
                `Manage or cancel: ${appUrl("/billing")}`,
            ].join("\n"),
        );
    }
    return "paid" as const;
}

function businessDetails() {
    const name = process.env.BILLING_BUSINESS_NAME?.trim();
    const address = process.env.BILLING_BUSINESS_ADDRESS?.trim();
    const tin = process.env.BILLING_TIN?.trim();
    if (!name || !address || !tin)
        console.error("[billing] BILLING_BUSINESS_NAME/ADDRESS/TIN not set; invoice incomplete");
    return {
        businessName: name || `${site.name} (business name not set)`,
        businessAddress: address || "(address not set)",
        businessTin: tin || "(TIN not set)",
    };
}

// ─── Cancel / resume ─────────────────────────────────────────────────────────

export async function setCancelAtPeriodEnd(userId: string, cancel: boolean, now = new Date()) {
    const updated = await db.subscription.updateMany({
        where: {
            userId,
            status: "ACTIVE",
            currentPeriodEnd: { gt: now },
            cancelAtPeriodEnd: !cancel,
            ...(cancel ? {} : { cardToken: { not: null } }),
        },
        data: { cancelAtPeriodEnd: cancel },
    });
    return updated.count > 0;
}

// ─── The daily job ───────────────────────────────────────────────────────────

export type CronSummary = {
    checked: number;
    renewed: number;
    failed: number;
    expired: number;
    reminded: number;
    /** Checkouts settled here because the student never came back to the return page */
    reconciled: number;
};

const RECONCILE_AFTER_MS = 15 * 60_000;
const ABANDON_AFTER_MS = 2 * 86_400_000;

/**
 * A student who pays and then closes the tab never reaches /billing/return, so the daily job asks the provider about
 * checkouts left PENDING and settles them (they get their Pro and invoice). Ones still open after two days are
 * marked abandoned.
 */
async function reconcileCheckouts(now: Date) {
    let settled = 0;
    const pending = await db.payment.findMany({
        where: {
            status: "PENDING",
            kind: "SUBSCRIBE",
            createdAt: { lt: new Date(now.getTime() - RECONCILE_AFTER_MS) },
        },
        orderBy: { createdAt: "asc" },
        take: 200,
        select: { id: true, providerRef: true, createdAt: true },
    });
    for (const p of pending) {
        try {
            const stale = now.getTime() - p.createdAt.getTime() > ABANDON_AFTER_MS;
            let result: ChargeResult = p.providerRef
                ? await provider().getCheckout(p.providerRef)
                : { status: "failed", reason: "The payment page was never opened." };
            if (result.status === "pending" && stale) result = { status: "failed", reason: "Checkout abandoned." };
            const outcome = await settlePayment(p.id, result, now);
            if (outcome === "paid") settled++;
        } catch (e) {
            console.error("[billing] couldn't reconcile a checkout", p.id, e);
        }
    }
    return settled;
}

/** Renews due subscriptions, retries failed ones, ends trials and grace periods, sends reminders. Safe to rerun. */
export async function runBillingCron(now = new Date()): Promise<CronSummary> {
    const summary: CronSummary = { checked: 0, renewed: 0, failed: 0, expired: 0, reminded: 0, reconciled: 0 };
    summary.reconciled = await reconcileCheckouts(now);
    const subs = await db.subscription.findMany({
        where: { status: { in: ["TRIALING", "ACTIVE", "PAST_DUE"] } },
        include: { user: { select: { email: true, name: true } } },
    });
    for (const sub of subs) {
        summary.checked++;
        try {
            const action = cronAction(sub, now);
            if (action === "expire") {
                if (await expire(sub, now)) summary.expired++;
            } else if (action === "renew" || action === "retry") {
                const outcome = await renew(sub, now);
                if (outcome === "paid") summary.renewed++;
                else if (outcome === "failed") summary.failed++;
            } else if (trialReminderDue(sub, now)) {
                const claimed = await db.subscription.updateMany({
                    where: { userId: sub.userId, remindedAt: null },
                    data: { remindedAt: now },
                });
                if (claimed.count) {
                    summary.reminded++;
                    await email(
                        sub.user.email,
                        `Your ${site.name} free week ends tomorrow`,
                        [
                            `Your free week of Pro (AI marking and the AI tutor) ends on ${dateLabel(sub.trialEndsAt!)}.`,
                            `Keep it for ${formatMvr(priceWithGst().net)} + GST a month: ${appUrl("/billing")}`,
                            ``,
                            `If you don't, nothing else changes: practice, self-marking, plans and everything else stay free.`,
                        ].join("\n"),
                    );
                }
            }
        } catch (e) {
            console.error("[billing] cron failed for a subscription", sub.userId, e);
        }
    }
    return summary;
}

type CronSub = Prisma.SubscriptionGetPayload<{ include: { user: { select: { email: true; name: true } } } }>;

async function expire(sub: Pick<CronSub, "userId" | "status" | "user">, now: Date) {
    const done = await db.subscription.updateMany({
        where: { userId: sub.userId, status: sub.status },
        data: { status: "EXPIRED", graceEndsAt: null, cardToken: null, cardLabel: null, cancelAtPeriodEnd: false },
    });
    if (!done.count) return false;
    const wasTrial = sub.status === "TRIALING";
    await email(
        sub.user.email,
        wasTrial ? `Your ${site.name} free week has ended` : `Your ${site.name} Pro plan has ended`,
        [
            wasTrial
                ? `Your free week of Pro has ended, so AI marking and the AI tutor are off for now.`
                : `Your Pro plan ended on ${dateLabel(now)}, so AI marking and the AI tutor are off for now.`,
            `Everything else stays free. Get Pro again any time: ${appUrl("/billing")}`,
        ].join("\n"),
    );
    return true;
}

async function renew(sub: CronSub, now: Date) {
    // Claim this attempt first: a second run of the job sees the new lastAttemptAt and skips.
    const claimed = await db.subscription.updateMany({
        where: { userId: sub.userId, status: sub.status, lastAttemptAt: sub.lastAttemptAt },
        data: { lastAttemptAt: now },
    });
    if (!claimed.count || !sub.cardToken) return "skipped" as const;

    const p = provider();
    const price = priceWithGst();
    const payment = await db.payment.create({
        data: { userId: sub.userId, kind: "RENEWAL", ...price, currency: CURRENCY, provider: p.name },
    });
    let result: ChargeResult;
    try {
        result = await p.chargeSavedCard({
            paymentId: payment.id,
            amount: price.total,
            currency: CURRENCY,
            description: DESCRIPTION,
            cardToken: sub.cardToken,
        });
    } catch (e) {
        console.error("[billing] renewal charge errored", e);
        result = { status: "failed", reason: "The payment provider didn't respond." };
    }
    const outcome = await settlePayment(payment.id, result, now);
    if (outcome === "failed") await markPastDue(sub, now);
    return outcome;
}

async function markPastDue(sub: CronSub, now: Date) {
    const first = sub.status !== "PAST_DUE";
    const until = graceEnd(sub, now);
    await db.subscription.update({
        where: { userId: sub.userId },
        data: { status: "PAST_DUE", graceEndsAt: until, failedAttempts: { increment: 1 } },
    });
    if (!first) return;
    await email(
        sub.user.email,
        `We couldn't renew your ${site.name} Pro plan`,
        [
            `Your card was declined when we tried to renew Pro (${formatMvr(priceWithGst().total)}).`,
            `You keep Pro until ${dateLabel(until)} while we retry once a day.`,
            `To pay now with another card: ${appUrl("/billing")}`,
        ].join("\n"),
    );
}

/** For the Pro gate: whether this student has Pro now. */
export async function hasProNow(userId: string, now = new Date()) {
    return entitlement(await db.subscription.findUnique({ where: { userId } }), now).pro;
}
