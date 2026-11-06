import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Upload } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { unitDisplayName } from "@/lib/papers/config";
import { PaperCopyrightNote } from "@/components/papers/copyright-note";
import { DocChips } from "@/components/papers/doc-chips";
import { Button } from "@/components/ui/button";
import { paperLabel, SERIES_LABEL } from "@/lib/papers/filename";
import { getMyPapers, seriesKey } from "@/lib/queries/papers";
import { requireUser } from "@/lib/session";
import { UnitChip } from "../subjects/_components/chips";

export const metadata: Metadata = { title: "My papers", robots: { index: false, follow: false } };

const STATUS_LABEL: Record<string, string> = {
    QUEUED: "Waiting to be read",
    PARSING: "Reading questions…",
    NEEDS_REVIEW: "Check the questions",
    READY: "Ready to attempt",
    FAILED: "Couldn't read it",
};

export default async function MyPapersPage() {
    const user = await requireUser();
    const sittings = await getMyPapers(user.id);

    return (
        <>
            <PageHeader
                title="My papers"
                description="Past papers you've added and papers you've uploaded. Only you can see this list."
                actions={
                    <>
                        <Button asChild variant="outline">
                            <Link href="/past-papers">Browse past papers</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/papers/upload">
                                <Upload aria-hidden />
                                Upload a paper
                            </Link>
                        </Button>
                    </>
                }
            />
            {sittings.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="No papers yet"
                    description="Add a sitting from the past-paper index, or upload a paper your teacher sent you."
                    action={
                        <Button asChild variant="outline">
                            <Link href="/past-papers">Browse past papers</Link>
                        </Button>
                    }
                />
            ) : (
                <ul className="grid gap-3 md:grid-cols-2">
                    {sittings.map((s) => {
                        const sk = seriesKey(s.series);
                        const qp = s.papers.find((p) => p.type === "QP");
                        const status = qp && qp.parseStatus !== "NONE" ? STATUS_LABEL[qp.parseStatus] : null;
                        const title = s.ownerId
                            ? (s.title ?? "Uploaded paper")
                            : `${sk ? SERIES_LABEL[sk] : ""} ${s.year ?? ""}${s.paperCode !== "01" ? ` · ${paperLabel(s.paperCode)}` : ""}`;
                        return (
                            <li key={s.id}>
                                <Link
                                    href={`/papers/${s.id}`}
                                    className="flex h-full flex-col gap-3 rounded-lg border bg-card p-4 shadow-card transition-[box-shadow,border-color,translate] duration-200 ease-out-soft hover:-translate-y-px hover:border-border-strong/50 hover:shadow-raised focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5"
                                >
                                    <div className="flex items-start gap-3">
                                        <UnitChip>{s.unitCode}</UnitChip>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-display text-[1.0625rem] font-extrabold">{title}</p>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {s.ownerId ? "Your upload" : unitDisplayName(s.unitCode, s.unit?.name)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <DocChips types={s.papers.map((p) => p.type)} />
                                        {status && <span className="text-sm font-semibold text-muted-foreground">{status}</span>}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
            <PaperCopyrightNote className="mt-12 max-w-3xl" />
        </>
    );
}
