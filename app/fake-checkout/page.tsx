import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMvr } from "@/lib/billing";
import { fakeBilling } from "@/lib/payments";
import { fakeCheckout } from "@/lib/payments/fake";
import { requireUser } from "@/lib/session";
import { DecideButtons } from "./decide-buttons";

export const metadata: Metadata = { title: "Test payment", robots: { index: false } };

// Stands in for the bank's hosted payment page while BILLING_PROVIDER=fake. Deliberately plain and outside the app
// shell, so it's obvious you've "left" Study-IAL, as you would for the real gateway.
export default async function FakeCheckoutPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
    if (!fakeBilling) notFound();
    await requireUser();
    const { ref = "" } = await searchParams;
    const checkout = fakeCheckout(ref);

    return (
        <main className="mx-auto grid min-h-dvh max-w-md content-center gap-6 px-4 py-10">
            <div className="flex items-center gap-2 text-sm font-bold text-warning">
                <FlaskConical className="size-4" aria-hidden />
                Test payment provider: no real money moves
            </div>
            {!checkout ? (
                <div className="rounded-xl border bg-card p-6">
                    <h1 className="text-xl">This test checkout has expired</h1>
                    <p className="mt-2 text-muted-foreground">
                        The dev server restarted and forgot it. Go back to your plan and start again.
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/billing">Back to your plan</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-5 rounded-xl border bg-card p-6 shadow-card">
                    <div>
                        <h1 className="text-xl">{checkout.description}</h1>
                        <p className="num mt-1 text-3xl font-extrabold">{formatMvr(checkout.amount)}</p>
                        {checkout.saveCard && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Your card will be saved for monthly renewals.
                            </p>
                        )}
                    </div>
                    {checkout.done ? (
                        <p className="text-muted-foreground">Already decided. Go back to your plan.</p>
                    ) : (
                        <DecideButtons checkoutRef={checkout.ref} />
                    )}
                </div>
            )}
        </main>
    );
}
