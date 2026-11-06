import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AttemptPart } from "@/components/papers/attempt-part";
import { QuestionCrops, SchemeBlock } from "@/components/papers/question-blocks";
import { Button } from "@/components/ui/button";
import { aiEnabled } from "@/lib/ai";
import { db } from "@/lib/db";
import { paperLabel, SERIES_LABEL } from "@/lib/papers/filename";
import { loadPaperParts, markContextFor } from "@/lib/papers/context";
import { ancestors } from "@/lib/papers/tree";
import { seriesKey } from "@/lib/queries/papers";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../../../subjects/_components/breadcrumbs";
import { UnitChip } from "../../../subjects/_components/chips";

export const metadata: Metadata = { title: "Attempt", robots: { index: false, follow: false } };

export default async function AttemptPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ part?: string; session?: string }>;
}) {
    const [{ id }, { part: partId, session: sessionParam }] = await Promise.all([params, searchParams]);
    const user = await requireUser();
    const loaded = await loadPaperParts(id, user);
    if (!loaded) notFound();
    const { sitting, qp, rows, parts } = loaded;
    if (parts.length === 0) redirect(`/papers/${id}`);

    const attempts = await db.paperAttempt.findMany({
        where: { userId: user.id, questionId: { in: parts.map((p) => p.id) } },
        orderBy: { createdAt: "desc" },
        select: { questionId: true, marksAwarded: true, maxMarks: true },
    });
    const latest = new Map<string, { marksAwarded: number | null; maxMarks: number }>();
    for (const a of attempts) if (!latest.has(a.questionId)) latest.set(a.questionId, a);

    const index = Math.max(0, partId ? parts.findIndex((p) => p.id === partId) : parts.findIndex((p) => !latest.has(p.id)));
    const leaf = parts[index] ?? parts[0];
    const ctx = markContextFor(rows, leaf);
    // Marking a timed exam: start from the answer handed in, and record marks against that exam
    const examSession = sessionParam
        ? await db.paperExamSession.findFirst({ where: { id: sessionParam, userId: user.id, sittingId: id }, select: { id: true } })
        : null;
    const handedIn = examSession
        ? await db.paperAttempt.findFirst({ where: { sessionId: examSession.id, questionId: leaf.id, userId: user.id }, orderBy: { createdAt: "asc" }, select: { answer: true } })
        : null;
    const chain = ancestors(rows, leaf.id);
    const href = (i: number) => `/papers/${id}/attempt?part=${parts[i].id}`;
    const sk = seriesKey(sitting.series);
    const title = sitting.ownerId ? (sitting.title ?? "Uploaded paper") : `${sk ? SERIES_LABEL[sk] : ""} ${sitting.year ?? ""}${sitting.paperCode !== "01" ? ` · ${paperLabel(sitting.paperCode)}` : ""}`;
    const scored = [...latest.values()].reduce((a, l) => a + (l.marksAwarded ?? 0), 0);
    const scoredMax = [...latest.values()].reduce((a, l) => a + l.maxMarks, 0);

    return (
        <>
            <Breadcrumbs items={[{ href: "/papers", label: "My papers" }, { href: `/papers/${id}`, label: `${sitting.unitCode} ${title}` }, { label: `Question ${leaf.number}` }]} />
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <UnitChip>{sitting.unitCode}</UnitChip>
                <h1 className="text-[1.625rem] leading-tight sm:text-[2rem]">Question {leaf.number}</h1>
                <span className="num rounded-full bg-muted px-3 py-1 font-display font-extrabold">
                    {ctx.maxMarks} mark{ctx.maxMarks === 1 ? "" : "s"}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0 space-y-6">
                    <section aria-label="Question" className="rounded-xl border bg-card p-4 shadow-card sm:p-6">
                        <QuestionCrops qpPaperId={qp.id} chain={chain} part={leaf} />
                    </section>
                    <AttemptPart
                        key={leaf.id}
                        questionId={leaf.id}
                        number={leaf.number}
                        maxMarks={ctx.maxMarks}
                        points={ctx.points.map((p) => ({ code: p.code, marks: p.marks }))}
                        hasMarkScheme={ctx.hasMarkScheme}
                        aiEnabled={aiEnabled}
                        nextHref={index + 1 < parts.length ? href(index + 1) : null}
                        sessionId={examSession?.id ?? null}
                        initialAnswer={handedIn?.answer ?? ""}
                        backHref={examSession ? `/papers/${id}/exam/${examSession.id}` : null}
                        scheme={<SchemeBlock msPaperId={ctx.msPaperId} entries={ctx.entries} guidance={ctx.guidance} examinerNotes={ctx.examinerNotes} />}
                    />
                    <div className="flex justify-between gap-2">
                        {index > 0 ? (
                            <Button asChild variant="ghost">
                                <Link href={href(index - 1)}>
                                    <ChevronLeft aria-hidden /> {parts[index - 1].number}
                                </Link>
                            </Button>
                        ) : (
                            <span />
                        )}
                        {index + 1 < parts.length && (
                            <Button asChild variant="ghost">
                                <Link href={href(index + 1)}>
                                    {parts[index + 1].number} <ChevronRight aria-hidden />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <aside aria-label="Parts" className="h-fit rounded-xl bg-muted p-4 lg:sticky lg:top-24">
                    <p className="mb-3 font-display font-extrabold">
                        {latest.size}/{parts.length} parts tried
                        {scoredMax > 0 && (
                            <span className="num ml-2 text-muted-foreground">
                                {scored}/{scoredMax}
                            </span>
                        )}
                    </p>
                    <ol className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-4">
                        {parts.map((p, i) => {
                            const l = latest.get(p.id);
                            const f = l && l.maxMarks > 0 ? (l.marksAwarded ?? 0) / l.maxMarks : null;
                            return (
                                <li key={p.id}>
                                    <Link
                                        href={href(i)}
                                        aria-current={i === index ? "step" : undefined}
                                        aria-label={`${p.number}${l ? `, ${l.marksAwarded}/${l.maxMarks}` : ", not tried"}`}
                                        className={cn(
                                            "flex min-h-11 items-center justify-center rounded-md px-1 font-display text-[0.8125rem] font-extrabold focus-visible:outline-3 focus-visible:outline-ring",
                                            i === index && "shadow-[inset_0_0_0_2px_var(--progress)]",
                                            f === null ? "bg-card" : f >= 1 ? "bg-mastery-strong text-on-mastery" : f > 0 ? "bg-mastery-developing text-on-mastery" : "bg-mastery-weak text-on-mastery",
                                        )}
                                    >
                                        {p.number}
                                    </Link>
                                </li>
                            );
                        })}
                    </ol>
                </aside>
            </div>
        </>
    );
}
