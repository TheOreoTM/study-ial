// The one interface the app uses to take money. Everything else (subscriptions, periods, invoices) is ours, so
// another gateway, or prepaid months instead of auto-renew, replaces only the adapter. See
// docs/decisions/2026-11-payments.md.

/** A card the provider saved for repeat charges. Only the provider can charge it. */
export type SavedCard = { token: string; label: string };

export type ChargeResult =
    | { status: "paid"; providerRef: string; card?: SavedCard }
    | { status: "failed"; providerRef?: string; reason: string }
    | { status: "pending"; providerRef: string };

export type CheckoutRequest = {
    /** Our Payment id, sent as the provider's merchant reference so its records can be matched to ours */
    paymentId: string;
    /** In laari */
    amount: number;
    currency: string;
    description: string;
    /** Where the provider sends the student back to (our /billing/return) */
    returnUrl: string;
    /** Ask the provider to keep the card for renewals */
    saveCard: boolean;
};

export type SavedCardCharge = {
    paymentId: string;
    amount: number;
    currency: string;
    description: string;
    cardToken: string;
};

export interface PaymentProvider {
    readonly name: "fake" | "bml";
    /** Starts a hosted checkout; the student is sent to `url`. */
    createCheckout(req: CheckoutRequest): Promise<{ providerRef: string; url: string }>;
    /**
     * The checkout's outcome, asked server-to-server. Return pages and webhooks only tell us to look; their query
     * strings and bodies are never trusted for the result.
     */
    getCheckout(providerRef: string): Promise<ChargeResult>;
    /** Merchant-initiated charge of a saved card (renewals). Should settle to paid/failed before returning. */
    chargeSavedCard(req: SavedCardCharge): Promise<ChargeResult>;
}
