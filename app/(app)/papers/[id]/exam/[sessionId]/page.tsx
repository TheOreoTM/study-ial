import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { loadPaperParts, markContextFor } from "@/lib/papers/context";
import { SERIES_LABEL } from "@/lib/papers/filename";
import { gradeFor, marksToNextGrade, type UnitGrades } from "@/lib/papers/grades";
import { seriesKey } from "@/lib/queries/papers";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../../../../subjects/_components/breadcrumbs";

export const metadata: Metadata = { title: "Exam results", robots: { index: false, follow: false } };

export default async function ExamResultsPage({ params }: { params: Promise<{ id: string; sessionId: string }> }) {
    const { id, sessionId } = await params;
    const user = await requireUser();
    const [loaded, session] = await Promise.all([
        loadPaperParts(id, user),
        db.paperExamSession.findFirst({ where: { id: sessionId, userId: user.id, sittingId: id } }),
    ]);
    if (!loaded || !session) notFound();
    const { sitting, rows, parts } = loaded;

    const attempts = await db.paperAttempt.findMany({ where: { sessionId: session.id, userId: user.id }, orderBy: { createdAt: "asc" } });
    // Per part: the latest marked attempt in this session, else the unmarked answer handed in
    const byPart = new Map<string, (typeof attempts)[number]>();
    for (const a of attempts) {
        const prev = byPart.get(a.questionId);
        if (!prev || a.marksAwarded !== null || prev.marksAwarded === null) byPart.set(a.questionId, a);
    }
    const max = parts.reduce((a, p) => a + markContextFor(rows, p).maxMarks, 0);
    const marked = parts.filter((p) => byPart.get(p.id)?.marksAwarded != null || !byPart.has(p.id));
    const score = parts.reduce((a, p) => a + (byPart.get(p.id)?.marksAwarded ?? 0), 0);
    const complete = marked.length === parts.length;

    // Boundaries for this exact sitting, else the most recent ones for the unit
    const boundary =
        (sitting.year && sitting.series
            ? await db.gradeBoundary.findUnique({ where: { unitCode_paperCode_year_series: { unitCode: sitting.unitCode, paperCode: sitting.paperCode, year: sitting.year, series: sitting.series } } })
            : null) ??
        (await db.gradeBoundary.findFirst({ where: { unitCode: sitting.unitCode, paperCode: "01" }, orderBy: [{ year: "desc" }, { series: "desc" }] }));
    const grades = boundary?.grades as UnitGrades | undefined;
    const scaled = boundary && max > 0 ? Math.round((score / max) * boundary.maxMark) : score;
    const grade = complete && grades ? gradeFor(scaled, grades) : null;
    const next = complete && grades ? marksToNextGrade(scaled, grades) : null;

    if (complete && (session.totalMarks !== score || session.grade !== grade)) {
        await db.paperExamSession.update({
            where: { id: session.id },
            data: { totalMarks: score, maxMarks: max, grade, summary: { boundarySource: boundary?.sourceUrl ?? null } as Prisma.InputJsonValue },
        });
    }

    return (
        <>
            <Breadcrumbs items={[{ href: `/papers/${id}`, label: sitting.unitCode }, { href: `/papers/${id}/exam`, label: "Timed exam" }, { label: "Results" }]} />
            <PageHeader
                title="Your exam"
                description={complete ? "Every part is marked." : `Mark each part to get your total and an estimated grade. ${parts.length - marked.length} left.`}
            />
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 shadow-card">
                    <p className="text-sm font-bold text-muted-foreground">Score</p>
                    <p className="num font-display text-4xl font-extrabold">
                        {score}
                        <span className="text-xl text-muted-foreground">/{max}</span>
                    </p>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-card">
                    <p className="text-sm font-bold text-muted-foreground">Estimated grade</p>
                    <p className="font-display text-4xl font-extrabold">{grade ? grade.toUpperCase() : "—"}</p>
                    {next && <p className="text-sm text-muted-foreground">{next.marks} more for {next.grade.toUpperCase()}</p>}
                </div>
                <div className="rounded-xl bg-muted p-5 text-sm text-muted-foreground">
                    {boundary ? (
                        <>
                            From Pearson&apos;s {SERIES_LABEL[seriesKey(boundary.series)!]} {boundary.year} unit boundaries (raw mark out of {boundary.maxMark}).{" "}
                            <a href={boundary.sourceUrl} className="font-semibold underline underline-offset-2" target="_blank" rel="noreferrer">
                                Source
                            </a>
                            . An estimate only: your real grade depends on the whole series.
                        </>
                    ) : (
                        "No published grade boundaries for this unit yet."
                    )}
                </div>
            </section>
            <ul className="divide-y rounded-xl border bg-card shadow-card">
                {parts.map((p) => {
                    const a = byPart.get(p.id);
                    const pmax = markContextFor(rows, p).maxMarks;
                    const f = a?.marksAwarded != null && pmax > 0 ? a.marksAwarded / pmax : null;
                    return (
                        <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                            <span className="w-20 font-display font-extrabold">{p.number}</span>
                            <span className="min-w-0 flex-1 truncate text-muted-foreground">{a?.answer ?? "No answer"}</span>
                            <span
                                className={cn(
                                    "num rounded-full px-3 py-0.5 font-display font-extrabold",
                                    f === null ? "bg-muted" : f >= 1 ? "bg-mastery-strong text-on-mastery" : f > 0 ? "bg-mastery-developing text-on-mastery" : "bg-mastery-weak text-on-mastery",
                                )}
                            >
                                {a?.marksAwarded != null ? `${a.marksAwarded}/${pmax}` : a ? `?/${pmax}` : `0/${pmax}`}
                            </span>
                            {a && a.marksAwarded == null && (
                                <Button asChild size="sm" variant="outline">
                                    <Link href={`/papers/${id}/attempt?part=${p.id}&session=${session.id}`}>Mark</Link>
                                </Button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
