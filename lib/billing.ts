// Billing rules for the Pro plan. Pure functions (unit-tested in billing.test.ts); the database and the payment
// provider live in lib/queries/billing.ts, lib/payments/* and app/(app)/billing/actions.ts.
// Decisions: docs/decisions/2026-11-payments.md. Money is always in laari (1/100 MVR) as integers.

import { localDayKey } from "./time";

export const PRO_PRICE_LAARI = 9900; // MVR 99.00, before GST
export const GST_RATE = 0.08;
export const CURRENCY = "MVR";
export const TRIAL_DAYS = 7;
export const GRACE_DAYS = 3;
/** Renew this long before the paid month ends, so a failed charge can be retried before access lapses. */
export const RENEW_AHEAD_MS = 24 * 60 * 60 * 1000;
/** A failed charge is retried at most once a day (the cron runs daily; this stops double charges on reruns). */
export const RETRY_AFTER_MS = 20 * 60 * 60 * 1000;

const DAY = 86_400_000;

export type SubStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "EXPIRED";

/** What the billing code needs from a stored subscription. */
export type Sub = {
    status: SubStatus;
    trialEndsAt: Date | null;
    currentPeriodEnd: Date | null;
    graceEndsAt: Date | null;
    cancelAtPeriodEnd: boolean;
    /** The provider's saved-card token, when the student has paid with a card that can be charged again */
    cardToken: string | null;
    lastAttemptAt: Date | null;
};

export type Price = { net: number; gst: number; total: number };

/** Net price, GST and total in laari. GST is rounded to the nearest laari. */
export function priceWithGst(net = PRO_PRICE_LAARI, rate = GST_RATE): Price {
    const gst = Math.round(net * rate);
    return { net, gst, total: net + gst };
}

/** "MVR 106.92" */
export function formatMvr(laari: number) {
    const sign = laari < 0 ? "-" : "";
    const abs = Math.abs(laari);
    return `${sign}${CURRENCY} ${Math.floor(abs / 100).toLocaleString("en-GB")}.${String(abs % 100).padStart(2, "0")}`;
}

/** One calendar month later, clamped to the month's last day (31 Jan → 28/29 Feb), same time of day. */
export function addMonth(from: Date): Date {
    const d = new Date(from.getTime());
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + 1);
    const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, lastDay));
    return d;
}

/**
 * What the Pro gate shows a student for AI marking and the tutor: "pro" (has Pro, or billing is off so AI works as
 * before), "trial" (no Pro, free week still available) or "upgrade" (trial used; send them to /billing).
 */
export type ProAccess = "pro" | "trial" | "upgrade";

export type Entitlement =
    | { pro: false; reason: "free" | "expired" }
    | { pro: true; reason: "trial" | "active" | "grace" | "canceling"; until: Date };

/** Whether the student has Pro right now, and why. A missing subscription is Free. */
export function entitlement(sub: Sub | null, now: Date): Entitlement {
    if (!sub) return { pro: false, reason: "free" };
    const t = now.getTime();
    if (sub.status === "TRIALING" && sub.trialEndsAt && sub.trialEndsAt.getTime() > t) {
        return { pro: true, reason: "trial", until: sub.trialEndsAt };
    }
    if (sub.status === "ACTIVE" && sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() > t) {
        return { pro: true, reason: sub.cancelAtPeriodEnd ? "canceling" : "active", until: sub.currentPeriodEnd };
    }
    if (sub.status === "PAST_DUE" && sub.graceEndsAt && sub.graceEndsAt.getTime() > t) {
        return { pro: true, reason: "grace", until: sub.graceEndsAt };
    }
    return { pro: false, reason: "expired" };
}

/** A trial can be started once per account: only when there has never been a subscription. */
export function canStartTrial(sub: Sub | null) {
    return sub === null;
}

export function trialEnd(now: Date) {
    return new Date(now.getTime() + TRIAL_DAYS * DAY);
}

/**
 * The new paid period after a successful payment. Paying while still on Pro (trial or a paid month ending) starts the
 * new month when the current access ends, so no paid days are lost; otherwise it starts now.
 */
export function nextPeriod(sub: Sub | null, now: Date): { start: Date; end: Date } {
    const e = entitlement(sub, now);
    const start = e.pro && e.reason !== "grace" ? e.until : now;
    return { start, end: addMonth(start) };
}

/**
 * Whether the student may start a checkout. Everyone can, except while a paid month with a saved card is running
 * (it renews itself; a cancelled one is resumed instead of paid again).
 */
export function canCheckout(sub: Sub | null, now: Date) {
    if (!sub || sub.status !== "ACTIVE" || !sub.cardToken) return true;
    return !sub.currentPeriodEnd || sub.currentPeriodEnd.getTime() <= now.getTime();
}

/** A cancelled paid month can be switched back on until it ends. */
export function canResume(sub: Sub | null, now: Date) {
    const e = entitlement(sub, now);
    return e.pro && e.reason === "canceling" && Boolean(sub?.cardToken);
}

/** The "your free week ends tomorrow" email: once, in the last day of the trial. */
export function trialReminderDue(sub: Sub & { remindedAt: Date | null }, now: Date) {
    if (sub.status !== "TRIALING" || !sub.trialEndsAt || sub.remindedAt) return false;
    const left = sub.trialEndsAt.getTime() - now.getTime();
    return left > 0 && left <= DAY;
}

export type CronAction = "renew" | "retry" | "expire" | "none";

/** What the daily job should do with one subscription. */
export function cronAction(sub: Sub, now: Date): CronAction {
    const t = now.getTime();
    switch (sub.status) {
        case "TRIALING":
            return sub.trialEndsAt && sub.trialEndsAt.getTime() <= t ? "expire" : "none";
        case "ACTIVE": {
            if (!sub.currentPeriodEnd) return "expire";
            const end = sub.currentPeriodEnd.getTime();
            if (sub.cancelAtPeriodEnd || !sub.cardToken) return end <= t ? "expire" : "none";
            if (end - t > RENEW_AHEAD_MS) return "none";
            // Don't charge twice on a rerun of the same day's job.
            if (sub.lastAttemptAt && t - sub.lastAttemptAt.getTime() < RETRY_AFTER_MS) return "none";
            return "renew";
        }
        case "PAST_DUE": {
            if (!sub.graceEndsAt || sub.graceEndsAt.getTime() <= t) return "expire";
            if (!sub.cardToken) return "none";
            if (sub.lastAttemptAt && t - sub.lastAttemptAt.getTime() < RETRY_AFTER_MS) return "none";
            return "retry";
        }
        default:
            return "none";
    }
}

/** After a renewal charge fails: keep Pro for the grace period from the end of the paid month (or from now). */
export function graceEnd(sub: Sub, now: Date): Date {
    if (sub.status === "PAST_DUE" && sub.graceEndsAt) return sub.graceEndsAt;
    const from = sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() > now.getTime() ? sub.currentPeriodEnd : now;
    return new Date(from.getTime() + GRACE_DAYS * DAY);
}

/** Tax invoice number from the invoice's sequence number and (Maldives) year, e.g. "SIAL-2026-000042". */
export function invoiceNumber(seq: number, issuedAt: Date) {
    return `SIAL-${localDayKey(issuedAt).slice(0, 4)}-${String(seq).padStart(6, "0")}`;
}
