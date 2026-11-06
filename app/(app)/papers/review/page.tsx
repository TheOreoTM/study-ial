import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PartList } from "@/components/papers/part-list";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { latestPaperScores } from "@/lib/queries/paper-progress";
import { requireUser } from "@/lib/session";
import { localDay } from "@/lib/time";
import { Breadcrumbs } from "../../subjects/_components/breadcrumbs";

export const metadata: Metadata = { title: "Questions to review", robots: { index: false, follow: false } };

export default async function PaperReviewPage() {
    const user = await requireUser();
    const [due, latest] = await Promise.all([
        db.paperQuestionReview.findMany({
            where: { userId: user.id, dueDay: { lte: localDay() } },
            orderBy: [{ dueDay: "asc" }, { lapses: "desc" }],
            take: 50,
            select: {
                lapses: true,
                question: {
                    select: { id: true, number: true, marks: true, paper: { select: { sitting: { select: { id: true, unitCode: true, year: true, series: true, title: true, ownerId: true } } } } },
                },
            },
        }),
        latestPaperScores(user.id),
    ]);
    // Only questions the student can still open (an upload may have been deleted, taking its questions with it)
    const items = due
        .filter((d) => d.question.paper.sitting.ownerId === null || d.question.paper.sitting.ownerId === user.id)
        .map((d) => {
            const s = d.question.paper.sitting;
            const l = latest.get(d.question.id);
            return {
                id: d.question.id,
                number: d.question.number,
                marks: d.question.marks,
                sittingId: s.id,
                unitCode: s.unitCode,
                year: s.year,
                series: s.series,
                title: s.title,
                ownerId: s.ownerId,
                latest: l ? { marks: l.marks, max: l.max } : null,
                note: d.lapses > 1 ? `Dropped marks ${d.lapses} times` : undefined,
            };
        });

    return (
        <>
            <Breadcrumbs items={[{ href: "/papers", label: "My papers" }, { label: "Review" }]} />
            <PageHeader
                title="Questions to review"
                description="Past-paper parts where you dropped marks come back here, spaced out as you get them right."
            />
            {items.length === 0 ? (
                <EmptyState
                    icon={RotateCcw}
                    title="Nothing due"
                    description="When you lose marks on a past-paper question, it shows up here the next day."
                    action={
                        <Button asChild variant="outline">
                            <Link href="/papers">My papers</Link>
                        </Button>
                    }
                />
            ) : (
                <PartList items={items} />
            )}
        </>
    );
}
