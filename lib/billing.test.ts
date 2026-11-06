import { describe, expect, it } from "vitest";
import {
    addMonth,
    canCheckout,
    canResume,
    canStartTrial,
    cronAction,
    entitlement,
    formatMvr,
    graceEnd,
    invoiceNumber,
    nextPeriod,
    priceWithGst,
    trialEnd,
    trialReminderDue,
    type Sub,
} from "./billing";

const H = 3_600_000;
const D = 24 * H;
const now = new Date("2026-11-06T03:00:00Z");
const at = (ms: number) => new Date(now.getTime() + ms);

function sub(overrides: Partial<Sub>): Sub {
    return {
        status: "ACTIVE",
        trialEndsAt: null,
        currentPeriodEnd: at(10 * D),
        graceEndsAt: null,
        cancelAtPeriodEnd: false,
        cardToken: "tok_1",
        lastAttemptAt: null,
        ...overrides,
    };
}

describe("priceWithGst / formatMvr", () => {
    it("adds 8% GST to MVR 99", () => {
        expect(priceWithGst()).toEqual({ net: 9900, gst: 792, total: 10692 });
        expect(formatMvr(10692)).toBe("MVR 106.92");
    });

    it("rounds GST to the nearest laari", () => {
        expect(priceWithGst(1006).gst).toBe(80); // 80.48
        expect(priceWithGst(1007).gst).toBe(81); // 80.56
    });

    it("formats zero, small, large and negative amounts", () => {
        expect(formatMvr(0)).toBe("MVR 0.00");
        expect(formatMvr(5)).toBe("MVR 0.05");
        expect(formatMvr(123456789)).toBe("MVR 1,234,567.89");
        expect(formatMvr(-10692)).toBe("-MVR 106.92");
    });
});

describe("addMonth", () => {
    it("moves one calendar month, same time of day", () => {
        expect(addMonth(new Date("2026-11-06T03:00:00Z")).toISOString()).toBe("2026-12-06T03:00:00.000Z");
        expect(addMonth(new Date("2026-12-15T10:30:00Z")).toISOString()).toBe("2027-01-15T10:30:00.000Z");
    });

    it("clamps to the last day of a shorter month", () => {
        expect(addMonth(new Date("2027-01-31T00:00:00Z")).toISOString()).toBe("2027-02-28T00:00:00.000Z");
        expect(addMonth(new Date("2028-01-31T00:00:00Z")).toISOString()).toBe("2028-02-29T00:00:00.000Z");
        expect(addMonth(new Date("2026-10-31T00:00:00Z")).toISOString()).toBe("2026-11-30T00:00:00.000Z");
    });

    it("does not mutate its input", () => {
        const d = new Date("2026-01-31T00:00:00Z");
        addMonth(d);
        expect(d.toISOString()).toBe("2026-01-31T00:00:00.000Z");
    });
});

describe("entitlement", () => {
    it("is Free without a subscription", () => {
        expect(entitlement(null, now)).toEqual({ pro: false, reason: "free" });
    });

    it("gives Pro during a trial and stops exactly at its end", () => {
        const s = sub({ status: "TRIALING", trialEndsAt: at(H), currentPeriodEnd: null });
        expect(entitlement(s, now)).toEqual({ pro: true, reason: "trial", until: at(H) });
        expect(entitlement(s, at(H))).toEqual({ pro: false, reason: "expired" });
    });

    it("gives Pro for a paid month, marked canceling when it won't renew", () => {
        expect(entitlement(sub({}), now)).toMatchObject({ pro: true, reason: "active" });
        expect(entitlement(sub({ cancelAtPeriodEnd: true }), now)).toMatchObject({ pro: true, reason: "canceling" });
        expect(entitlement(sub({}), at(10 * D))).toEqual({ pro: false, reason: "expired" });
    });

    it("keeps Pro through the grace period after a failed renewal", () => {
        const s = sub({ status: "PAST_DUE", currentPeriodEnd: at(-D), graceEndsAt: at(2 * D) });
        expect(entitlement(s, now)).toEqual({ pro: true, reason: "grace", until: at(2 * D) });
        expect(entitlement(s, at(2 * D)).pro).toBe(false);
    });

    it("is expired for EXPIRED or a row missing its dates", () => {
        expect(entitlement(sub({ status: "EXPIRED" }), now).pro).toBe(false);
        expect(entitlement(sub({ currentPeriodEnd: null }), now).pro).toBe(false);
        expect(entitlement(sub({ status: "TRIALING", trialEndsAt: null }), now).pro).toBe(false);
    });
});

describe("trial", () => {
    it("can be started only when there has never been a subscription", () => {
        expect(canStartTrial(null)).toBe(true);
        expect(canStartTrial(sub({ status: "EXPIRED" }))).toBe(false);
    });

    it("lasts 7 days", () => {
        expect(trialEnd(now)).toEqual(at(7 * D));
    });
});

describe("nextPeriod", () => {
    it("starts now when Free or expired", () => {
        expect(nextPeriod(null, now)).toEqual({ start: now, end: addMonth(now) });
        expect(nextPeriod(sub({ status: "EXPIRED" }), now).start).toEqual(now);
    });

    it("starts when the trial ends, so trial days aren't lost", () => {
        const s = sub({ status: "TRIALING", trialEndsAt: at(3 * D), currentPeriodEnd: null });
        expect(nextPeriod(s, now)).toEqual({ start: at(3 * D), end: addMonth(at(3 * D)) });
    });

    it("starts when the paid month ends (early renewal)", () => {
        expect(nextPeriod(sub({}), now).start).toEqual(at(10 * D));
    });

    it("starts now when paying during grace (grace days were not paid for)", () => {
        const s = sub({ status: "PAST_DUE", currentPeriodEnd: at(-D), graceEndsAt: at(2 * D) });
        expect(nextPeriod(s, now).start).toEqual(now);
    });
});

describe("cronAction", () => {
    it("expires trials that have ended and leaves running ones", () => {
        expect(cronAction(sub({ status: "TRIALING", trialEndsAt: at(-H) }), now)).toBe("expire");
        expect(cronAction(sub({ status: "TRIALING", trialEndsAt: at(H) }), now)).toBe("none");
    });

    it("renews within a day of the period end", () => {
        expect(cronAction(sub({ currentPeriodEnd: at(2 * D) }), now)).toBe("none");
        expect(cronAction(sub({ currentPeriodEnd: at(20 * H) }), now)).toBe("renew");
        expect(cronAction(sub({ currentPeriodEnd: at(-H) }), now)).toBe("renew");
    });

    it("doesn't charge twice when the job reruns the same day", () => {
        const s = sub({ currentPeriodEnd: at(20 * H), lastAttemptAt: at(-2 * H) });
        expect(cronAction(s, now)).toBe("none");
        expect(cronAction({ ...s, lastAttemptAt: at(-21 * H) }, now)).toBe("renew");
    });

    it("lets canceled or card-less subscriptions run out, then expires them", () => {
        expect(cronAction(sub({ cancelAtPeriodEnd: true, currentPeriodEnd: at(H) }), now)).toBe("none");
        expect(cronAction(sub({ cancelAtPeriodEnd: true, currentPeriodEnd: at(-H) }), now)).toBe("expire");
        expect(cronAction(sub({ cardToken: null, currentPeriodEnd: at(-H) }), now)).toBe("expire");
        expect(cronAction(sub({ currentPeriodEnd: null }), now)).toBe("expire");
    });

    it("retries past-due cards once a day and expires after grace", () => {
        const s = sub({ status: "PAST_DUE", currentPeriodEnd: at(-D), graceEndsAt: at(2 * D) });
        expect(cronAction({ ...s, lastAttemptAt: at(-D) }, now)).toBe("retry");
        expect(cronAction({ ...s, lastAttemptAt: at(-H) }, now)).toBe("none");
        expect(cronAction({ ...s, cardToken: null }, now)).toBe("none");
        expect(cronAction({ ...s, graceEndsAt: at(-H) }, now)).toBe("expire");
        expect(cronAction({ ...s, graceEndsAt: null }, now)).toBe("expire");
    });

    it("ignores expired subscriptions", () => {
        expect(cronAction(sub({ status: "EXPIRED" }), now)).toBe("none");
    });
});

describe("graceEnd", () => {
    it("runs 3 days from the end of the paid month when that's still ahead", () => {
        expect(graceEnd(sub({ currentPeriodEnd: at(20 * H) }), now)).toEqual(at(20 * H + 3 * D));
    });

    it("runs 3 days from now when the month already ended", () => {
        expect(graceEnd(sub({ currentPeriodEnd: at(-H) }), now)).toEqual(at(3 * D));
    });

    it("never extends an existing grace period on later failures", () => {
        const s = sub({ status: "PAST_DUE", graceEndsAt: at(D) });
        expect(graceEnd(s, now)).toEqual(at(D));
    });
});

describe("invoiceNumber", () => {
    it("pads the sequence and uses the Maldives calendar year", () => {
        expect(invoiceNumber(42, now)).toBe("SIAL-2026-000042");
        expect(invoiceNumber(1234567, new Date("2027-01-01T00:00:00Z"))).toBe("SIAL-2027-1234567");
        // 20:00 UTC on 31 Dec is already 1 Jan in Malé (UTC+5)
        expect(invoiceNumber(7, new Date("2026-12-31T20:00:00Z"))).toBe("SIAL-2027-000007");
    });
});

describe("canCheckout / canResume", () => {
    it("allows checkout unless a saved-card month is running", () => {
        expect(canCheckout(null, now)).toBe(true);
        expect(canCheckout(sub({ status: "TRIALING", trialEndsAt: at(D) }), now)).toBe(true);
        expect(canCheckout(sub({ status: "PAST_DUE", graceEndsAt: at(D) }), now)).toBe(true);
        expect(canCheckout(sub({ status: "EXPIRED" }), now)).toBe(true);
        expect(canCheckout(sub({ cardToken: null }), now)).toBe(true);
        expect(canCheckout(sub({}), now)).toBe(false);
        expect(canCheckout(sub({ cancelAtPeriodEnd: true }), now)).toBe(false);
        expect(canCheckout(sub({ currentPeriodEnd: at(-H) }), now)).toBe(true);
    });

    it("resumes only a cancelled month that is still running", () => {
        expect(canResume(sub({ cancelAtPeriodEnd: true }), now)).toBe(true);
        expect(canResume(sub({}), now)).toBe(false);
        expect(canResume(sub({ cancelAtPeriodEnd: true, currentPeriodEnd: at(-H) }), now)).toBe(false);
        expect(canResume(sub({ cancelAtPeriodEnd: true, cardToken: null }), now)).toBe(false);
        expect(canResume(null, now)).toBe(false);
    });
});

describe("trialReminderDue", () => {
    const trial = (ends: Date, remindedAt: Date | null = null) => ({
        ...sub({ status: "TRIALING", trialEndsAt: ends, currentPeriodEnd: null }),
        remindedAt,
    });

    it("is due once, in the trial's last day", () => {
        expect(trialReminderDue(trial(at(2 * D)), now)).toBe(false);
        expect(trialReminderDue(trial(at(20 * H)), now)).toBe(true);
        expect(trialReminderDue(trial(at(20 * H), at(-H)), now)).toBe(false);
        expect(trialReminderDue(trial(at(-H)), now)).toBe(false);
    });

    it("isn't sent for paid subscriptions", () => {
        expect(trialReminderDue({ ...sub({ trialEndsAt: at(H) }), remindedAt: null }, now)).toBe(false);
    });
});
