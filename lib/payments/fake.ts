import "server-only";
import { randomBytes } from "node:crypto";
import type { ChargeResult, CheckoutRequest, PaymentProvider, SavedCardCharge } from "./types";

// Dev/test stand-in for the real gateway (BILLING_PROVIDER=fake, never on Vercel: see ./index.ts). Checkouts go to
// /fake-checkout, where you approve or decline. Its state lives in this process's memory, so a restart forgets
// open checkouts (start a new one) and saved cards (renewals of those then fail, as an expired card would).

export type FakeOutcome = "approve" | "approve-renewals-fail" | "decline";

type Checkout = CheckoutRequest & { ref: string; result: ChargeResult | null };
type Store = { checkouts: Map<string, Checkout>; cards: Map<string, { failRenewals: boolean }> };

const g = globalThis as unknown as { __fakePayments?: Store };
const store: Store = (g.__fakePayments ??= { checkouts: new Map(), cards: new Map() });

const id = (prefix: string) => `${prefix}_${randomBytes(9).toString("base64url")}`;

/** What the fake checkout page shows. */
export function fakeCheckout(ref: string) {
    const c = store.checkouts.get(ref);
    return c
        ? {
              ref,
              amount: c.amount,
              currency: c.currency,
              description: c.description,
              returnUrl: c.returnUrl,
              saveCard: c.saveCard,
              done: c.result !== null,
          }
        : null;
}

/** The student's choice on the fake checkout page. Returns where to send them back to. */
export function decideFakeCheckout(ref: string, outcome: FakeOutcome) {
    const c = store.checkouts.get(ref);
    if (!c) return null;
    if (c.result) return c.returnUrl;
    if (outcome === "decline") {
        c.result = { status: "failed", providerRef: ref, reason: "Card declined (test card)." };
    } else {
        const card = c.saveCard ? { token: id("fake_card"), label: "Test card •••• 4242" } : undefined;
        if (card) store.cards.set(card.token, { failRenewals: outcome === "approve-renewals-fail" });
        c.result = { status: "paid", providerRef: ref, card };
    }
    return c.returnUrl;
}

export const fakeProvider: PaymentProvider = {
    name: "fake",
    async createCheckout(req) {
        const ref = id("fake_txn");
        store.checkouts.set(ref, { ...req, ref, result: null });
        return { providerRef: ref, url: `/fake-checkout?ref=${encodeURIComponent(ref)}` };
    },
    async getCheckout(ref) {
        const c = store.checkouts.get(ref);
        if (!c)
            return { status: "failed", providerRef: ref, reason: "This test checkout was lost (server restarted)." };
        return c.result ?? { status: "pending", providerRef: ref };
    },
    async chargeSavedCard(req: SavedCardCharge) {
        const ref = id("fake_txn");
        const card = store.cards.get(req.cardToken);
        if (!card)
            return { status: "failed", providerRef: ref, reason: "Saved card not found (test provider restarted)." };
        if (card.failRenewals) return { status: "failed", providerRef: ref, reason: "Card declined (test card)." };
        return { status: "paid", providerRef: ref };
    },
};
