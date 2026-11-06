import "server-only";
import { fakeProvider } from "./fake";
import type { PaymentProvider } from "./types";

/**
 * The configured payment provider, or null while billing is off. With no provider every student keeps today's AI
 * features (daily quotas still apply), so the Pro gate only switches on once students can actually pay.
 *
 * - `BILLING_PROVIDER=fake`: the test provider. Refused on Vercel (previews included), so a deployment can never
 *   hand out Pro for a fake approval.
 * - `BILLING_PROVIDER=bml`: Bank of Maldives Connect. Not built yet; waits for UAT keys and BML's confirmation that
 *   card-on-file renewals work.
 */
function configured(): PaymentProvider | null {
    const name = process.env.BILLING_PROVIDER?.trim().toLowerCase();
    if (!name) return null;
    if (name === "fake") {
        if (process.env.VERCEL) {
            console.error("[billing] BILLING_PROVIDER=fake is ignored on Vercel; billing is off.");
            return null;
        }
        return fakeProvider;
    }
    console.error(`[billing] BILLING_PROVIDER=${name} isn't available yet; billing is off.`);
    return null;
}

export const paymentProvider = configured();
export const billingEnabled = paymentProvider !== null;
export const fakeBilling = paymentProvider?.name === "fake";
