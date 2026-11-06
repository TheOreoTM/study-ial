import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { UploadForm } from "@/components/papers/upload-form";
import { db } from "@/lib/db";
import { uploadLimits } from "@/lib/papers/upload";
import { requireUser } from "@/lib/session";
import { Breadcrumbs } from "../../subjects/_components/breadcrumbs";

export const metadata: Metadata = { title: "Upload a paper", robots: { index: false, follow: false } };

export default async function UploadPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
    const user = await requireUser();
    const { to } = await searchParams;
    let sittingId: string | undefined;
    if (to) {
        const s = await db.paperSitting.findUnique({ where: { id: to }, select: { ownerId: true } });
        if (!s || s.ownerId !== user.id) notFound();
        sittingId = to;
    }
    const units = await db.unit.findMany({
        where: { subject: { isLocal: false } },
        orderBy: [{ subject: { order: "asc" } }, { order: "asc" }],
        select: { code: true, name: true, subject: { select: { name: true } } },
    });
    const limits = uploadLimits();

    return (
        <div className="max-w-2xl">
            <Breadcrumbs items={[{ href: "/papers", label: "My papers" }, { label: sittingId ? "Add mark scheme" : "Upload" }]} />
            <PageHeader
                title={sittingId ? "Add the mark scheme" : "Upload a paper"}
                description="A PDF or phone photos of a paper from class. We read the questions so you can attempt them one by one and get them marked. Check what we read before you start."
            />
            <UploadForm
                units={units.map((u) => ({ code: u.code, name: u.name, subject: u.subject.name }))}
                maxMb={Math.round(limits.maxBytes / 1024 / 1024)}
                sittingId={sittingId}
                defaultType={sittingId ? "MS" : "QP"}
            />
            <p className="mt-10 text-sm text-muted-foreground">
                Up to {limits.perDay} uploads a day, {limits.maxPdfPages} pages per PDF and {limits.maxImages} photos per paper. Only
                upload papers you&apos;re allowed to use for your own study.
            </p>
        </div>
    );
}
