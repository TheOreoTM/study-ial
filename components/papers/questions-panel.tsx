import Link from "next/link";
import { AlertTriangle, ListChecks, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiEnabled } from "@/lib/ai";
import { db } from "@/lib/db";
import { canEditSittingQuestions, type Viewer } from "@/lib/papers/permissions";
import { leaves } from "@/lib/papers/tree";
import { ParsePoller, RequestParseButton } from "@/components/papers/parse-controls";

type Paper = { id: string; type: string; parseStatus: string; parseError: string | null };

/** The question paper's parsed questions: status, review entry point and the way into attempt mode. */
export async function QuestionsPanel({
    sittingId,
    qp,
    hasMarkScheme,
    viewer,
    ownerId,
}: {
    sittingId: string;
    qp: Paper | undefined;
    hasMarkScheme: boolean;
    viewer: NonNullable<Viewer>;
    ownerId: string | null;
}) {
    if (!qp) {
        return (
            <Panel>
                <p className="text-muted-foreground">There&apos;s no question paper in this sitting.</p>
            </Panel>
        );
    }
    const canEdit = canEditSittingQuestions(viewer, { ownerId });
    const rows = await db.paperQuestion.findMany({
        where: { paperId: qp.id },
        orderBy: { order: "asc" },
        select: { id: true, parentId: true, number: true, order: true, marks: true, markPoints: true },
    });
    const parts = leaves(rows);
    const total = rows.reduce((a, r) => a + r.marks, 0);
    const withScheme = parts.filter((p) => p.markPoints || rows.find((r) => r.id === p.parentId)?.markPoints).length;
    const questionCount = rows.filter((r) => !r.parentId).length;
    const busy = qp.parseStatus === "QUEUED" || qp.parseStatus === "PARSING";

    return (
        <Panel>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl">Questions</h2>
                    {rows.length > 0 ? (
                        <p className="mt-1 text-muted-foreground">
                            <span className="num text-foreground">{questionCount}</span> questions ·{" "}
                            <span className="num text-foreground">{parts.length}</span> parts ·{" "}
                            <span className="num text-foreground">{total}</span> marks
                            {hasMarkScheme && (
                                <>
                                    {" "}
                                    · mark scheme matched for <span className="num text-foreground">{withScheme}</span> of {parts.length}
                                </>
                            )}
                        </p>
                    ) : (
                        <p className="mt-1 text-muted-foreground">Read the paper into separate questions to attempt them one by one and get marked.</p>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {rows.length > 0 && !busy && (
                        <>
                            <Button asChild variant="outline">
                                <Link href={`/papers/${sittingId}/exam`}>
                                    <Timer aria-hidden />
                                    Timed exam
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/papers/${sittingId}/attempt`}>
                                    <ListChecks aria-hidden />
                                    Attempt questions
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {busy && <ParsePoller paperId={qp.id} status={qp.parseStatus} />}
                {qp.parseStatus === "NONE" && <RequestParseButton paperId={qp.id} variant="default" />}
                {qp.parseStatus === "FAILED" && (
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="size-4" aria-hidden /> {qp.parseError ?? "Reading this paper failed."}
                        </p>
                        <RequestParseButton paperId={qp.id} label="Try again" />
                    </div>
                )}
                {qp.parseStatus === "NEEDS_REVIEW" && (
                    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted p-4">
                        <p className="min-w-0 flex-1">
                            {canEdit
                                ? "Check what we read before you rely on it: question numbers, marks and the crop of each part."
                                : "These questions haven't been checked yet, so numbering or marks may be off."}
                        </p>
                        {canEdit && (
                            <Button asChild variant="outline">
                                <Link href={`/papers/${sittingId}/review`}>Check questions</Link>
                            </Button>
                        )}
                    </div>
                )}
                {qp.parseStatus === "READY" && canEdit && (
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/papers/${sittingId}/review`}>Edit questions</Link>
                        </Button>
                        {aiEnabled && <RequestParseButton paperId={qp.id} vision />}
                    </div>
                )}
            </div>
        </Panel>
    );
}

function Panel({ children }: { children: React.ReactNode }) {
    return <section className="mb-8 rounded-xl border bg-card p-5 shadow-card sm:p-6">{children}</section>;
}
