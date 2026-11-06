"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { billingEnabled } from "@/lib/payments";
import { beginCheckout, setCancelAtPeriodEnd, startTrial } from "@/lib/payments/service";
import { assertUser } from "@/lib/session";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const OFF = "Pro isn't available yet.";

// Pages that change once a student has Pro (AI buttons and prompts). Practice and mock pages read access per request.
function revalidateBilling() {
    revalidatePath("/billing");
    revalidatePath("/practice");
    revalidatePath("/mock", "layout");
}

/** "Start your free week": once per account, no card. */
export async function startTrialAction(): Promise<Result<{ trialEndsAt: string }>> {
    const user = await assertUser();
    if (!billingEnabled) return { ok: false, error: OFF };
    const res = await startTrial(user.id);
    if (!res.ok) return res;
    revalidateBilling();
    return { ok: true, trialEndsAt: res.trialEndsAt.toISOString() };
}

/** Opens the provider's payment page for one month of Pro (and saves the card for renewals). */
export async function subscribeAction(): Promise<Result> {
    const user = await assertUser();
    if (!billingEnabled) return { ok: false, error: OFF };
    const res = await beginCheckout(user.id);
    if (!res.ok) return res;
    redirect(res.url);
}

/** Cancel: Pro runs to the end of the paid month, then stops. No partial refunds. */
export async function cancelAction(): Promise<Result> {
    const user = await assertUser();
    if (!(await setCancelAtPeriodEnd(user.id, true)))
        return { ok: false, error: "There's no renewing plan to cancel." };
    revalidateBilling();
    return { ok: true };
}

export async function resumeAction(): Promise<Result> {
    const user = await assertUser();
    if (!(await setCancelAtPeriodEnd(user.id, false)))
        return { ok: false, error: "This plan can't be resumed. Subscribe again instead." };
    revalidateBilling();
    return { ok: true };
}
