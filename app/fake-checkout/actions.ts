"use server";

import { z } from "zod";
import { fakeBilling } from "@/lib/payments";
import { decideFakeCheckout, type FakeOutcome } from "@/lib/payments/fake";
import { assertUser } from "@/lib/session";

/**
 * The test provider's approve/decline buttons. Only exists while BILLING_PROVIDER=fake (never on Vercel). Returns the
 * URL to send the browser back to; the page does a full navigation there, as a real gateway's redirect would.
 */
export async function decideFake(input: { ref: string; outcome: FakeOutcome }): Promise<string> {
    await assertUser();
    if (!fakeBilling) throw new Error("The test payment provider is off.");
    const parsed = z
        .object({ ref: z.string().min(1).max(64), outcome: z.enum(["approve", "approve-renewals-fail", "decline"]) })
        .safeParse(input);
    if (!parsed.success) throw new Error("Bad test checkout request.");
    return decideFakeCheckout(parsed.data.ref, parsed.data.outcome) ?? "/billing?status=missing";
}
