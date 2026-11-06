import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ExamRunner } from "@/components/papers/exam-runner";
import { QuestionCrops } from "@/components/papers/question-blocks";
import { StartExamButton } from "@/components/papers/start-exam-button";
import { db } from "@/lib/db";
import { loadPaperParts, markContextFor } from "@/lib/papers/context";
import { ancestors } from "@/lib/papers/tree";
import { requireUser } from "@/lib/session";
import { Breadcrumbs } from "../../../subjects/_components/breadcrumbs";

export const metadata: Metadata = { title: "Timed exam", robots: { index: false, follow: false } };

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await requireUser();
    const loaded = await loadPaperParts(id, user);
    if (!loaded) notFound();
    const { sitting, qp, rows, parts } = loaded;
    if (parts.length === 0) redirect(`/papers/${id}`);

    const [live, past] = await Promise.all([
        db.paperExamSession.findFirst({ where: { userId: user.id, sittingId: id, submittedAt: null, endsAt: { gt: new Date() } }, orderBy: { startedAt: "desc" } }),
        db.paperExamSession.findMany({ where: { userId: user.id, sittingId: id, submittedAt: { not: null } }, orderBy: { startedAt: "desc" }, take: 5 }),
    ]);
    const total = parts.reduce((a, p) => a + markContextFor(rows, p).maxMarks, 0);

    if (live) {
        return (
            <>
                <Breadcrumbs items={[{ href: `/papers/${id}`, label: sitting.unitCode }, { label: "Timed exam" }]} />
                <ExamRunner
                    sessionId={live.id}
                    endsAt={live.endsAt!.toISOString()}
                    resultsHref={`/papers/${id}/exam/${live.id}`}
                    parts={parts.map((p) => ({
                        id: p.id,
                        number: p.number,
                        marks: markContextFor(rows, p).maxMarks,
                        question: <QuestionCrops qpPaperId={qp.id} chain={ancestors(rows, p.id)} part={p} />,
                    }))}
                />
            </>
        );
    }

    return (
        <div className="max-w-2xl">
            <Breadcrumbs items={[{ href: `/papers/${id}`, label: sitting.unitCode }, { label: "Timed exam" }]} />
            <PageHeader
                title="Timed exam"
                description={`Sit the whole paper (${parts.length} parts, ${total} marks) under its real time limit. The clock starts when you press start and the paper hands itself in when time runs out. Mark it afterwards, part by part.`}
                actions={<StartExamButton sittingId={id} />}
            />
            <ul className="mb-8 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Work on paper as you would in the exam, then type your final answers (or just the answer line) here.</li>
                <li>Answers are saved in this browser as you go, so a refresh won&apos;t lose them.</li>
                <li>You&apos;ll get an estimated grade from Pearson&apos;s published grade boundaries for this sitting once every part is marked.</li>
            </ul>
            {past.length > 0 && (
                <section>
                    <h2 className="mb-3 text-lg">Earlier attempts</h2>
                    <ul className="space-y-2">
                        {past.map((s) => (
                            <li key={s.id}>
                                <Link href={`/papers/${id}/exam/${s.id}`} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 font-semibold hover:bg-accent">
                                    <span>{s.startedAt.toISOString().slice(0, 10)}</span>
                                    <span className="num">{s.totalMarks !== null ? `${s.totalMarks}/${s.maxMarks}` : "Not marked yet"}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
