import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PartList } from "@/components/papers/part-list";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { latestPaperScores } from "@/lib/queries/paper-progress";
import { requireUser } from "@/lib/session";
import { Breadcrumbs } from "../../../subjects/_components/breadcrumbs";

export const metadata: Metadata = { title: "Past-paper questions by topic", robots: { index: false, follow: false } };

/** Every past-paper part tagged with a topic, across all indexed papers and the student's uploads: weakest first. */
export default async function TopicPapersPage({ params, searchParams }: { params: Promise<{ topicId: string }>; searchParams: Promise<{ only?: string }> }) {
    const [{ topicId }, { only }] = await Promise.all([params, searchParams]);
    const user = await requireUser();
    const topic = await db.topic.findUnique({ where: { id: topicId }, include: { unit: { include: { subject: true } } } });
    if (!topic) notFound();
    const [parts, latest] = await Promise.all([
        db.paperQuestion.findMany({
            where: {
                topicId,
                children: { none: {} },
                paper: { type: "QP", sitting: { OR: [{ ownerId: null }, { ownerId: user.id }] } },
            },
            select: { id: true, number: true, marks: true, paper: { select: { sitting: { select: { id: true, unitCode: true, year: true, series: true, title: true, ownerId: true } } } } },
            take: 500,
        }),
        latestPaperScores(user.id),
    ]);
    const items = parts
        .map((p) => {
            const s = p.paper.sitting;
            const l = latest.get(p.id);
            return { id: p.id, number: p.number, marks: p.marks, sittingId: s.id, unitCode: s.unitCode, year: s.year, series: s.series, title: s.title, ownerId: s.ownerId, latest: l ? { marks: l.marks, max: l.max } : null };
        })
        .filter((p) => only !== "weak" || (p.latest && p.latest.marks < p.latest.max))
        .sort((a, b) => {
            // Dropped marks first (worst first), then never tried (newest papers first), then full marks
            const fa = a.latest ? a.latest.marks / Math.max(1, a.latest.max) : 1.5;
            const fb = b.latest ? b.latest.marks / Math.max(1, b.latest.max) : 1.5;
            const ra = a.latest && fa >= 1 ? 3 : fa;
            const rb = b.latest && fb >= 1 ? 3 : fb;
            return ra - rb || (b.year ?? 0) - (a.year ?? 0);
        });
    const weak = items.filter((i) => i.latest && i.latest.marks < i.latest.max).length;
    const here = `/papers/topics/${topicId}`;

    return (
        <>
            <Breadcrumbs
                items={[
                    { href: `/subjects/${topic.unit.subject.slug}/${topic.unit.code.toLowerCase()}/${topic.slug}`, label: `${topic.unit.code} ${topic.code}` },
                    { label: "Past-paper questions" },
                ]}
            />
            <PageHeader
                title={topic.name}
                description={`${items.length} past-paper part${items.length === 1 ? "" : "s"} on this topic across every paper${weak ? `; ${weak} where you dropped marks come first` : ""}. Topics are tagged automatically, so a few may be off.`}
                actions={
                    weak > 0 ? (
                        <Button asChild variant={only === "weak" ? "default" : "outline"}>
                            <Link href={only === "weak" ? here : `${here}?only=weak`}>{only === "weak" ? "Show all" : "Only my weak ones"}</Link>
                        </Button>
                    ) : null
                }
            />
            {items.length === 0 ? (
                <EmptyState icon={FileText} title="No past-paper parts tagged yet" description="Parts are tagged when papers are read. Check back as more papers are added." />
            ) : (
                <PartList items={items.slice(0, 200)} />
            )}
        </>
    );
}
