import { NextResponse, type NextRequest } from "next/server";
import { billingEnabled } from "@/lib/payments";
import { confirmCheckout } from "@/lib/payments/service";
import { getUser } from "@/lib/session";

// Where the payment provider sends the student back. The query only says which of *our* payments to look at; the
// outcome comes from asking the provider (confirmCheckout), never from parameters the provider appended.
export async function GET(req: NextRequest) {
    const user = await getUser();
    if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));
    const paymentId = req.nextUrl.searchParams.get("payment") ?? "";
    let status = "missing";
    if (billingEnabled && /^[a-z0-9]{10,40}$/i.test(paymentId)) {
        try {
            status = await confirmCheckout(paymentId, user.id);
        } catch (e) {
            console.error("[billing] couldn't confirm a checkout", e);
            status = "pending";
        }
    }
    return NextResponse.redirect(new URL(`/billing?status=${status}`, req.url), 303);
}
