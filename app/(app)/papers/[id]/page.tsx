import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { unitDisplayName } from "@/lib/papers/config";
import { AddPaperButton } from "@/components/papers/add-paper-button";
import { PaperCopyrightNote } from "@/components/papers/copyright-note";
import { PaperViewer, type ViewerDoc } from "@/components/papers/paper-viewer";
import { DOC_TYPE_LABEL, paperLabel, SERIES_LABEL } from "@/lib/papers/filename";
import { canViewSittingContent } from "@/lib/papers/permissions";
import { getSavedSittingIds, getSitting, seriesKey } from "@/lib/queries/papers";
import { requireUser } from "@/lib/session";
import { Breadcrumbs } from "../../subjects/_components/breadcrumbs";
import { UnitChip } from "../../subjects/_components/chips";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Paper", robots: { index: false, follow: false } };

const ORDER = { QP: 0, MS: 1, ER: 2 } as const;

export default async function PaperPage({ params }: { params: Params }) {
    const { id } = await params;
    const user = await requireUser();
    const sitting = await getSitting(id);
    if (!sitting || !canViewSittingContent(user, sitting)) notFound();
    const saved = await getSavedSittingIds(user.id);

    const sk = seriesKey(sitting.series);
    const when = sk && sitting.year ? `${SERIES_LABEL[sk]} ${sitting.year}` : null;
    const title = sitting.ownerId ? (sitting.title ?? "Uploaded paper") : `${when ?? ""}${sitting.paperCode !== "01" ? ` · ${paperLabel(sitting.paperCode)}` : ""}`;
    const docs: ViewerDoc[] = sitting.papers
        .slice()
        .sort((a, b) => ORDER[a.type] - ORDER[b.type])
        .map((p) => ({
            id: p.id,
            type: p.type,
            label: DOC_TYPE_LABEL[p.type],
            pageCount: p.pageCount,
            images: p.mime.startsWith("image/"),
        }));

    return (
        <>
            <Breadcrumbs
                items={[
                    { href: "/papers", label: "My papers" },
                    ...(sitting.ownerId ? [] : [{ href: `/past-papers/${sitting.unitCode.toLowerCase()}`, label: sitting.unitCode }]),
                    { label: title || "Paper" },
                ]}
            />
            <PageHeader
                title={
                    <span className="flex flex-wrap items-center gap-3">
                        <UnitChip>{sitting.unitCode}</UnitChip>
                        {title}
                    </span>
                }
                description={sitting.ownerId ? "Your upload. Only you can see it." : unitDisplayName(sitting.unitCode, sitting.unit?.name)}
                actions={
                    sitting.ownerId ? null : (
                        <AddPaperButton sittingId={sitting.id} saved={saved.has(sitting.id)} signedIn showOpen={false} next={`/papers/${sitting.id}`} />
                    )
                }
            />
            <PaperViewer docs={docs} />
            <PaperCopyrightNote className="mt-10 max-w-3xl" />
        </>
    );
}
