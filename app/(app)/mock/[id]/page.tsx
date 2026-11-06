import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, NotebookPen, RotateCcw, X } from "lucide-react";
import { readAnswers } from "../answers";
import { GradeTile } from "@/components/mock/grade-tile";
import { MockMarking } from "@/components/mock/mock-marking";
import { MockSitting } from "@/components/mock/mock-sitting";
import { MasteryTile } from "@/components/mastery";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { aiEnabled, remainingAiQuota } from "@/lib/ai";
import { hasThaana } from "@/lib/dhivehi";
import { parseMarkScheme } from "@/lib/marking";
import { plainSnippet } from "@/lib/search";
import { markLevel, masteryTone } from "@/lib/mastery";
import {
    formatDuration,
    indicativeGrade,
    isPastDeadline,
    marksToNextGrade,
    MOCK_LENGTH_LABEL,
    type MockLength,
} from "@/lib/mock-exam";
import { getLockedQuestionIds, getMockPaper, type MockPaper } from "@/lib/queries/mock-exams";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mock paper", robots: { index: false } };

type Params = Promise<{ id: string }>;

export default async function MockPaperPage({ params }: { params: Params }) {
    const user = await requireUser();
    const { id } = await params;
    const paper = await getMockPaper(user.id, id);
    if (!paper) notFound();
    const { mock, questions } = paper;
    const title = `${mock.unit.code} ${MOCK_LENGTH_LABEL[mock.length as MockLength] ?? "paper"}`;
    const meta = `${mock.unit.name} · ${mock.totalMarks} marks · ${formatDuration(mock.durationMinutes)}`;

    if (mock.status === "IN_PROGRESS") {
        const now = new Date();
        return (
            <>
                <PageHeader title={title} description={meta} />
                <MockSitting
                    mockId={mock.id}
                    questions={questions.map((q) => ({
                        id: q.id,
                        type: q.type,
                        marks: q.marks,
                        stem: q.stem,
                        stemEn: q.stemEn,
                        options: q.options.map((o) => ({ id: o.id, label: o.label, text: o.text })),
                    }))}
                    initialAnswers={readAnswers(mock.answers)}
                    endsAt={new Date(mock.startedAt.getTime() + mock.durationMinutes * 60_000).toISOString()}
                    serverNow={now.toISOString()}
                    expired={isPastDeadline(mock.startedAt, mock.durationMinutes, now)}
                />
            </>
        );
    }

    const answers = readAnswers(mock.answers);

    if (mock.status === "MARKING") {
        const mcq = questions.filter((q) => q.type === "MCQ");
        const aiLeft = aiEnabled ? await remainingAiQuota(user.id, "marking") : 0;
        const mcqMarks = paper.attempts.reduce((n, a) => n + a.marksAwarded, 0);
        return (
            <>
                <PageHeader title={`Mark your paper`} description={`${title} · ${meta}`} />
                <MockMarking
                    mockId={mock.id}
                    mcqMarks={mcqMarks}
                    mcqPossible={mcq.reduce((n, q) => n + q.marks, 0)}
                    questions={questions.flatMap((q, i) => {
                        const answer = answers[q.id]?.answer;
                        if (q.type === "MCQ" || !answer) return [];
                        const { points, notes } = parseMarkScheme(q.markScheme ?? "");
                        return [
                            {
                                id: q.id,
                                number: i + 1,
                                marks: q.marks,
                                stem: q.stem,
                                answer,
                                points,
                                notes,
                                translation: q.markSchemeEn ?? null,
                                aiAllowed: aiLeft > 0 && !hasThaana(q.stem),
                            },
                        ];
                    })}
                />
            </>
        );
    }

    // A later paper being sat now may repeat some of these questions; keep their answers hidden until it's handed in.
    const locked = await getLockedQuestionIds(user.id);
    return <MockResult paper={paper} title={title} meta={meta} locked={locked} />;
}

function MockResult({
    paper,
    title,
    meta,
    locked,
}: {
    paper: MockPaper;
    title: string;
    meta: string;
    locked: Set<string>;
}) {
    const { mock, questions, attempts } = paper;
    const answers = readAnswers(mock.answers);
    const byQuestion = new Map(attempts.map((a) => [a.questionId, a]));
    const earned = mock.marksAwarded ?? attempts.reduce((n, a) => n + a.marksAwarded, 0);
    const pct = mock.totalMarks > 0 ? Math.round((earned / mock.totalMarks) * 100) : 0;
    const grade = indicativeGrade(earned, mock.totalMarks);
    const next = marksToNextGrade(earned, mock.totalMarks);
    const taken =
        mock.submittedAt && mock.startedAt
            ? Math.min(mock.durationMinutes, Math.max(1, Math.round((mock.submittedAt.getTime() - mock.startedAt.getTime()) / 60_000)))
            : null;
    const blank = questions.filter((q) => !byQuestion.has(q.id)).length;
    const lost = questions.filter((q) => {
        const a = byQuestion.get(q.id);
        return a && a.marksAwarded < a.maxMarks;
    }).length;
    const unitHref = `/subjects/${mock.unit.subject.slug}/${mock.unit.code.toLowerCase()}`;

    // Per-topic totals in spec order.
    const topics = new Map<string, { code: string; name: string; href: string; order: number; earned: number; possible: number }>();
    for (const q of questions) {
        const t =
            topics.get(q.topic.id) ??
            {
                code: q.topic.code,
                name: q.topic.name,
                href: `${unitHref}/${q.topic.slug}`,
                order: q.topic.order,
                earned: 0,
                possible: 0,
            };
        t.earned += byQuestion.get(q.id)?.marksAwarded ?? 0;
        t.possible += q.marks;
        topics.set(q.topic.id, t);
    }
    const topicRows = [...topics.values()].sort((a, b) => a.order - b.order);

    return (
        <>
            <Link
                href="/mock"
                className="mb-4 inline-flex min-h-6 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" aria-hidden /> Mock papers
            </Link>
            <PageHeader title={title} description={meta} />

            <section
                aria-label="Result"
                className="mb-6 grid gap-6 rounded-xl border bg-card p-6 shadow-card sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-8"
            >
                <GradeTile grade={grade} size="lg" />
                <div className="min-w-0">
                    <p className="num text-[2.75rem] leading-none">
                        {earned}/{mock.totalMarks}
                        <span className="ml-3 text-2xl text-muted-foreground">{pct}%</span>
                    </p>
                    <p className="mt-2 text-[1.0625rem] text-muted-foreground">
                        Indicative grade <span className="font-bold text-foreground">{grade}</span>
                        {next ? (
                            <>
                                {" "}
                                · <span className="num text-foreground">{next.marks}</span> more mark
                                {next.marks === 1 ? "" : "s"} for a {next.grade}
                            </>
                        ) : (
                            " · top grade"
                        )}
                        {taken !== null && <> · handed in after {formatDuration(taken)}</>}
                    </p>
                    {blank > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {blank} question{blank === 1 ? " was" : "s were"} left blank. They score 0 here but
                            don&apos;t change your mastery.
                        </p>
                    )}
                </div>
            </section>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {lost > 0 && (
                    <Button asChild>
                        <Link href={`/mistakes?unit=${mock.unitId}`}>
                            <NotebookPen />
                            Review the {lost} you lost marks on
                        </Link>
                    </Button>
                )}
                <Button asChild variant="outline">
                    <Link href={`/practice?mode=weak&unit=${mock.unitId}`}>
                        <RotateCcw />
                        Practise this unit&apos;s weak topics
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/mock">Sit another paper</Link>
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                <section aria-labelledby="questions" className="min-w-0">
                    <h2 id="questions" className="mb-3 text-xl">
                        Question by question
                    </h2>
                    <ol className="grid gap-2.5">
                        {questions.map((q, i) => {
                            const a = byQuestion.get(q.id);
                            const share = a && a.maxMarks > 0 ? a.marksAwarded / a.maxMarks : 0;
                            const chosen = q.options.find((o) => o.id === answers[q.id]?.optionId);
                            const correct = q.options.find((o) => o.isCorrect);
                            return (
                                <li key={q.id} className="rounded-lg border bg-card">
                                    <details className="group">
                                        <summary className="flex cursor-pointer list-none items-start gap-3 rounded-lg px-4 py-3.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5 [&::-webkit-details-marker]:hidden">
                                            <span className="num w-6 shrink-0 pt-0.5 text-muted-foreground">{i + 1}</span>
                                            {/* <summary> only takes phrasing content: plain text here, the full stem below. */}
                                            <span className="line-clamp-2 min-w-0 flex-1 text-[0.9375rem]">
                                                {plainSnippet(q.stem, 220)}
                                            </span>
                                            <span
                                                className={cn(
                                                    "num shrink-0 rounded-full px-2.5 py-1 text-sm leading-none",
                                                    a ? masteryTone[markLevel(share)].badge : "bg-muted text-muted-foreground",
                                                )}
                                            >
                                                <span className="sr-only">{a ? "Marks: " : "Not answered: "}</span>
                                                {a?.marksAwarded ?? 0}/{q.marks}
                                            </span>
                                        </summary>
                                        <div className="grid gap-3 border-t px-4 pt-3 pb-4 text-[0.9375rem] sm:px-5">
                                            <Markdown className="[&_.katex-display]:my-1 [&_p]:my-1">{q.stem}</Markdown>
                                            {locked.has(q.id) ? (
                                                <p className="rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                                                    This question is also on the paper you&apos;re sitting now, so its
                                                    answer is hidden until you hand that one in.
                                                </p>
                                            ) : q.type === "MCQ" ? (
                                                <>
                                                    {chosen && chosen.id !== correct?.id && (
                                                        <p className="flex items-start gap-2">
                                                            <X className="mt-0.5 size-4 shrink-0 text-mastery-weak-text" aria-hidden />
                                                            <span>
                                                                You chose <strong>{chosen.label}</strong>
                                                            </span>
                                                        </p>
                                                    )}
                                                    {correct && (
                                                        <div className="flex items-start gap-2">
                                                            <Check className="mt-0.5 size-4 shrink-0 text-mastery-strong-text" aria-hidden />
                                                            <span className="min-w-0">
                                                                Answer <strong>{correct.label}</strong>:{" "}
                                                                <Markdown className="inline [&_p]:inline">{correct.text}</Markdown>
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {answers[q.id]?.answer ? (
                                                        <p className="rounded-lg bg-muted px-4 py-3 whitespace-pre-wrap">
                                                            {answers[q.id]?.answer}
                                                        </p>
                                                    ) : (
                                                        <p className="text-muted-foreground">Not answered.</p>
                                                    )}
                                                    <ul className="grid gap-1">
                                                        {parseMarkScheme(q.markScheme ?? "").points.map((p, j) => (
                                                            <li key={j} className="flex gap-3">
                                                                <Markdown className="min-w-0 flex-1 [&_p]:my-0">{p.text}</Markdown>
                                                                <span className="num shrink-0 text-sm text-muted-foreground">{p.marks}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {q.explanation && !locked.has(q.id) && (
                                                <Markdown className="rounded-lg bg-muted px-4 py-3 [&_p]:my-1">
                                                    {q.explanation}
                                                </Markdown>
                                            )}
                                        </div>
                                    </details>
                                </li>
                            );
                        })}
                    </ol>
                </section>

                <aside aria-labelledby="by-topic" className="rounded-xl bg-muted p-5 lg:sticky lg:top-24">
                    <h2 id="by-topic" className="mb-3 text-lg">
                        By topic
                    </h2>
                    <ul className="grid gap-2">
                        {topicRows.map((t) => {
                            const level = markLevel(t.possible > 0 ? t.earned / t.possible : 0);
                            return (
                                <li key={t.href}>
                                    <Link
                                        href={t.href}
                                        className="flex items-center gap-3 rounded-lg bg-card p-2.5 pr-3.5 transition-shadow hover:shadow-[inset_0_0_0_1.5px_var(--border-strong)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                    >
                                        <MasteryTile code={t.code} level={level} size="sm" />
                                        <span className="min-w-0 flex-1 text-[0.9375rem] leading-snug font-bold">{t.name}</span>
                                        <span className={cn("num shrink-0", masteryTone[level].text)}>
                                            {t.earned}/{t.possible}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="mt-4 text-[0.8125rem] text-muted-foreground">
                        <UnitChip code={mock.unit.code} size="sm" className="mr-1.5 align-middle" />
                        Answers from this paper count towards your mastery like any practice.
                    </p>
                </aside>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
                The grade is an estimate from the IAL&apos;s uniform-mark thresholds (A 80%, B 70%, C 60%, D 50%, E
                40%). Real raw-mark boundaries move from paper to paper, and our questions are original practice
                questions rather than past papers.
            </p>
        </>
    );
}
