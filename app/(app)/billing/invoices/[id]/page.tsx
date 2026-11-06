import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/checklist/print-button";
import { Button } from "@/components/ui/button";
import { formatMvr, invoiceNumber } from "@/lib/billing";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Tax invoice", robots: { index: false } };

const date = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Indian/Maldives" });

/** A GST tax invoice for one paid charge. Everything on it was copied in when it was issued. */
export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const user = await requireUser();
    const { id } = await params;
    const invoice = await db.invoice.findFirst({
        where: { id, userId: user.id },
        include: { payment: { select: { paidAt: true, provider: true } } },
    });
    if (!invoice) notFound();
    const number = invoiceNumber(invoice.seq, invoice.issuedAt);
    const rate = `${invoice.gstRateBps / 100}%`;

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <Button variant="ghost" size="sm" className="-ml-3" asChild>
                    <Link href="/billing">
                        <ArrowLeft />
                        Your plan
                    </Link>
                </Button>
                <PrintButton />
            </div>

            <article className="rounded-xl border bg-card p-6 shadow-card sm:p-10 print:border-0 print:p-0 print:shadow-none">
                <header className="flex flex-col gap-6 sm:flex-row sm:justify-between">
                    <div>
                        <h1 className="text-[1.75rem] leading-tight">Tax invoice</h1>
                        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                            <dt className="text-muted-foreground">Invoice no.</dt>
                            <dd className="num font-bold">{number}</dd>
                            <dt className="text-muted-foreground">Date</dt>
                            <dd>{date(invoice.issuedAt)}</dd>
                        </dl>
                    </div>
                    <div className="text-sm sm:text-right">
                        <p className="font-bold">{invoice.businessName}</p>
                        <p className="whitespace-pre-line text-muted-foreground">{invoice.businessAddress}</p>
                        <p className="mt-1">
                            <span className="text-muted-foreground">TIN </span>
                            <span className="num">{invoice.businessTin}</span>
                        </p>
                    </div>
                </header>

                <section className="mt-8 text-sm">
                    <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Billed to</h2>
                    <p className="mt-1 font-semibold">{invoice.customerName}</p>
                    <p className="text-muted-foreground">{invoice.customerEmail}</p>
                </section>

                <table className="mt-8 w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-muted-foreground">
                            <th scope="col" className="pb-2 font-semibold">
                                Description
                            </th>
                            <th scope="col" className="pb-2 text-right font-semibold whitespace-nowrap">
                                Amount ({invoice.currency})
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-3 pr-4">{invoice.description}</td>
                            <td className="num py-3 text-right whitespace-nowrap">
                                {formatMvr(invoice.net).replace(/^MVR /, "")}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" className="pt-3 text-right font-normal text-muted-foreground">
                                Subtotal (excluding GST)
                            </th>
                            <td className="num whitespace-nowrap pt-3 text-right">{formatMvr(invoice.net)}</td>
                        </tr>
                        <tr>
                            <th scope="row" className="pt-1 text-right font-normal text-muted-foreground">
                                GST at {rate}
                            </th>
                            <td className="num whitespace-nowrap pt-1 text-right">{formatMvr(invoice.gst)}</td>
                        </tr>
                        <tr className="text-base">
                            <th scope="row" className="pt-3 text-right">
                                Total
                            </th>
                            <td className="num whitespace-nowrap pt-3 text-right font-extrabold">
                                {formatMvr(invoice.total)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <p className="mt-8 text-sm text-muted-foreground">
                    Paid by card{invoice.payment.paidAt ? ` on ${date(invoice.payment.paidAt)}` : ""}. Thank you.
                </p>
            </article>
        </div>
    );
}
