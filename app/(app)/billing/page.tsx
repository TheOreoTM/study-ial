import type { Metadata } from "next";
import Link from "next/link";
import { Check, CircleAlert, CircleCheck, Clock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CancelButton, ResumeButton, StartTrialButton, SubscribeButton } from "@/components/billing/billing-controls";
import {
    canCheckout,
    canResume,
    canStartTrial,
    entitlement,
    formatMvr,
    invoiceNumber,
    priceWithGst,
    PRO_PRICE_LAARI,
    TRIAL_DAYS,
    type Entitlement,
} from "@/lib/billing";
import { billingEnabled } from "@/lib/payments";
import { getBillingOverview } from "@/lib/queries/billing";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pro plan" };

const PRICE = priceWithGst();
const DAY = 86_400_000;

const date = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Indian/Maldives" });

const FLASH: Record<string, { tone: "success" | "error" | "info"; text: string }> = {
    paid: { tone: "success", text: "Payment received. You have Pro, and your tax invoice is below." },
    failed: {
        tone: "error",
        text: "The payment didn't go through, and you haven't been charged. Try again or use another card.",
    },
    pending: {
        tone: "info",
        text: "Your payment is still being confirmed. This page will show it once the bank confirms.",
    },
    missing: { tone: "error", text: "We couldn't find that payment." },
};

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const user = await requireUser();
    const { status } = await searchParams;
    const flash = status ? FLASH[status] : undefined;

    if (!billingEnabled) {
        return (
            <div className="mx-auto max-w-3xl">
                <PageHeader title="Pro plan" description="AI marking and the AI tutor." />
                <Card>
                    <CardHeader>
                        <CardTitle>Pro isn&apos;t on sale yet</CardTitle>
                        <CardDescription>
                            Until it is, AI marking and the AI tutor are free for everyone, with daily limits.
                            Everything else on Study-IAL is free and stays free.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const now = new Date();
    const { sub, payments } = await getBillingOverview(user.id);
    const e = entitlement(sub, now);

    return (
        <div className="mx-auto max-w-3xl">
            <PageHeader
                title="Pro plan"
                description="AI marking and the AI tutor. Practice, self-marking, plans and everything else stay free."
            />
            <div className="flex flex-col gap-6">
                {flash && (
                    <Alert variant={flash.tone === "error" ? "destructive" : "default"} role="status">
                        {flash.tone === "success" ? (
                            <CircleCheck className="text-success" />
                        ) : flash.tone === "error" ? (
                            <CircleAlert />
                        ) : (
                            <Clock />
                        )}
                        <AlertDescription className={cn(flash.tone === "success" && "text-foreground")}>
                            {flash.text}
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Your plan</p>
                        <CardTitle className="text-2xl">{headline(e)}</CardTitle>
                        <CardDescription className="text-base">{detail(e, sub, now)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {canStartTrial(sub) && <StartTrialButton />}
                        {canResume(sub, now) && <ResumeButton />}
                        {canCheckout(sub, now) && (
                            <SubscribeButton
                                variant={canStartTrial(sub) ? "outline" : "default"}
                                label={
                                    e.reason === "grace"
                                        ? `Pay ${formatMvr(PRICE.total)} now`
                                        : e.pro
                                          ? `Subscribe: ${formatMvr(PRICE.total)} a month`
                                          : `Get Pro: ${formatMvr(PRICE.total)} a month`
                                }
                            />
                        )}
                        {e.pro && e.reason === "active" && sub?.cardToken && <CancelButton until={date(e.until)} />}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>What&apos;s in Pro</CardTitle>
                        <CardDescription>
                            {formatMvr(PRO_PRICE_LAARI)} + 8% GST ({formatMvr(PRICE.gst)}) ={" "}
                            <span className="font-bold text-foreground">{formatMvr(PRICE.total)} a month</span>. Renews
                            monthly with your saved card. Cancel any time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-2">
                            {[
                                "AI marking of written answers against the mark scheme, with examiner-style feedback",
                                "AI mark suggestions when you self-mark a mock paper",
                                "The AI tutor: plain-language explanations of any specification point or question",
                            ].map((t) => (
                                <li key={t} className="flex gap-2.5">
                                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                                    {t}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-sm text-muted-foreground">
                            New here? Your first {TRIAL_DAYS} days are free, no card needed. If a renewal fails you keep
                            Pro for 3 more days while we retry. Cancelling stops the next renewal; there are no partial
                            refunds, but if you were charged by mistake (say, twice), we&apos;ll refund it.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payments and invoices</CardTitle>
                        <CardDescription>Every payment comes with a GST tax invoice.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {payments.length === 0 ? (
                            <p className="text-muted-foreground">No payments yet.</p>
                        ) : (
                            <ul className="divide-y">
                                {payments.map((p) => (
                                    <li key={p.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold">
                                                {p.kind === "RENEWAL" ? "Monthly renewal" : "Pro, 1 month"}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {date(p.createdAt)}
                                                {p.status === "FAILED" &&
                                                    ` · Failed${p.failureReason ? `: ${p.failureReason}` : ""}`}
                                            </div>
                                        </div>
                                        <span
                                            className={cn(
                                                "num",
                                                p.status === "FAILED" && "text-muted-foreground line-through",
                                            )}
                                        >
                                            {formatMvr(p.total)}
                                        </span>
                                        {p.invoice && (
                                            <Link
                                                href={`/billing/invoices/${p.invoice.id}`}
                                                className="text-sm font-bold underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                                            >
                                                Invoice {invoiceNumber(p.invoice.seq, p.invoice.issuedAt)}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function headline(e: Entitlement) {
    if (!e.pro) return e.reason === "free" ? "Free" : "Free (Pro ended)";
    if (e.reason === "trial") return "Pro: free week";
    if (e.reason === "grace") return "Pro: payment needed";
    return "Pro";
}

function detail(
    e: Entitlement,
    sub: { cardLabel: string | null; cardToken: string | null } | null,
    now: Date,
): React.ReactNode {
    if (!e.pro) {
        return e.reason === "free"
            ? `Try AI marking and the AI tutor free for ${TRIAL_DAYS} days. No card needed.`
            : "AI marking and the AI tutor are off. Everything else is still here.";
    }
    const until = date(e.until);
    switch (e.reason) {
        case "trial": {
            const days = Math.max(1, Math.ceil((e.until.getTime() - now.getTime()) / DAY));
            return `${days} day${days === 1 ? "" : "s"} left, until ${until}. Subscribe now and your paid month starts when the free week ends.`;
        }
        case "grace":
            return `We couldn't charge your card for this month. You keep Pro until ${until} while we retry once a day, or pay now with another card.`;
        case "canceling":
            return `Pro runs until ${until} and won't renew.`;
        case "active":
            return sub?.cardToken
                ? `Renews on ${until} for ${formatMvr(PRICE.total)} with ${sub.cardLabel ?? "your saved card"}.`
                : `Paid until ${until}. Pay again before then to keep Pro.`;
    }
}
