import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CalendarPlus, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { MasteryBreakdown, summarizeMastery } from "@/components/mastery";
import { GradeTile } from "@/components/mock/grade-tile";
import { PageHeader } from "@/components/page-header";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { addSummaries, summarize } from "@/lib/checklist";
import { db } from "@/lib/db";
import { openMistakes } from "@/lib/mistakes";
import { indicativeGrade, lengthAvailable } from "@/lib/mock-exam";
import { getSpecRatings } from "@/lib/queries/checklist";
import { getQuestionCounts } from "@/lib/queries/curriculum";
import { getTopicMastery } from "@/lib/queries/mastery";
import { getQuestionHistory } from "@/lib/queries/mistakes";
import { daysUntil } from "@/lib/queries/plans";
import { coverage, nextStep, phaseFor, phaseHint, phaseLabel } from "@/lib/readiness";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Exams", robots: { index: false } };

const DAY = 86_400_000;

export default async function ExamsPage() {
    const user = await requireUser();
    const now = new Date();

    const userUnits = await db.userUnit.findMany({
        where: { userId: user.id },
        include: { unit: { include: { subject: { select: { slug: true } }, topics: { orderBy: { order: "asc" } } } } },
        orderBy: [{ examDate: { sort: "asc", nulls: "last" } }, { unit: { order: "asc" } }],
    });
    const topics = userUnits.flatMap((uu) => uu.unit.topics);
    const topicIds = topics.map((t) => t.id);
    const unitIds = userUnits.map((uu) => uu.unitId);

    const [mastery, counts, history, ratings] = await Promise.all([
        getTopicMastery(user.id, topicIds),
        getQuestionCounts(topicIds),
        getQuestionHistory(user.id),
        getSpecRatings(user.id, topics),
    ]);
    // Sequential: the local dev Postgres drops connections beyond ~5 concurrent ones.
    const [mocks, marks] = await Promise.all([
        db.mockExam.findMany({
            where: { userId: user.id, unitId: { in: unitIds }, status: "FINISHED" },
            orderBy: { finishedAt: "desc" },
            select: { id: true, unitId: true, finishedAt: true, marksAwarded: true, totalMarks: true },
        }),
        db.question.groupBy({
            by: ["unitId"],
            where: { unitId: { in: unitIds }, status: "PUBLISHED" },
            _sum: { marks: true },
        }),
    ]);
    const marksByUnit = new Map(marks.map((m) => [m.unitId, m._sum?.marks ?? 0]));
    const unitOfTopic = new Map(topics.map((t) => [t.id, t.unitId]));
    const mistakesByUnit = new Map<string, number>();
    for (const mk of openMistakes(history)) {
        const u = unitOfTopic.get(mk.topicId);
        if (u) mistakesByUnit.set(u, (mistakesByUnit.get(u) ?? 0) + 1);
    }

    const cards = userUnits.map(({ unit, examDate }) => {
        const unitHref = `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`;
        const daysLeft = examDate ? daysUntil(examDate, now) : null;
        const lastMock = mocks.find((m) => m.unitId === unit.id) ?? null;
        const rTopics = unit.topics.map((t) => ({
            id: t.id,
            name: t.name,
            order: t.order,
            href: `${unitHref}/${t.slug}`,
            hasQuestions: (counts.get(t.id) ?? 0) > 0,
            mastery: mastery.get(t.id)!,
        }));
        const openCount = mistakesByUnit.get(unit.id) ?? 0;
        const step = nextStep(
            {
                unitId: unit.id,
                daysLeft,
                topics: rTopics,
                openMistakes: openCount,
                daysSinceMock: lastMock?.finishedAt
                    ? Math.floor((now.getTime() - lastMock.finishedAt.getTime()) / DAY)
                    : null,
                mockAvailable: lengthAvailable("short", marksByUnit.get(unit.id) ?? 0),
                fullMockAvailable: lengthAvailable("full", marksByUnit.get(unit.id) ?? 0),
            },
            now,
        );
        const checklist = unit.topics.reduce(
            (acc, t) => addSummaries(acc, summarize(t.specPoints.length, ratings.get(t.id)?.values() ?? [])),
            summarize(0, []),
        );
        return {
            unit,
            unitHref,
            examDate,
            daysLeft,
            cover: coverage(rTopics),
            summary: summarizeMastery(rTopics.map((t) => t.mastery)),
            openCount,
            lastMock,
            step,
            checklist,
        };
    });

    const upcoming = cards.filter((c) => c.daysLeft !== null && c.daysLeft >= 0);
    const next = upcoming[0];
    const undated = cards.filter((c) => c.daysLeft === null).length;

    if (cards.length === 0) {
        return (
            <>
                <PageHeader title="Exams" />
                <EmptyState
                    icon={CalendarPlus}
                    title="No units yet"
                    description="Add the units you're sitting and their exam dates to see your countdown."
                    action={
                        <Button asChild>
                            <Link href="/settings">Add units</Link>
                        </Button>
                    }
                />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Exams"
                description={
                    next
                        ? `${next.unit.code} is ${next.daysLeft === 0 ? "today" : next.daysLeft === 1 ? "tomorrow" : `in ${next.daysLeft} days`}. Here's where you stand on each paper, and one thing to do next.`
                        : "Add exam dates in Settings to see a countdown for each paper."
                }
                actions={
                    <Button asChild variant="outline">
                        <Link href="/mock">
                            <ClipboardList />
                            Mock papers
                        </Link>
                    </Button>
                }
            />

            {undated > 0 && (
                <p className="mb-6 rounded-lg bg-muted px-4 py-3 text-[0.9375rem] text-muted-foreground">
                    {undated} unit{undated === 1 ? " has" : "s have"} no exam date yet.{" "}
                    <Link
                        href="/settings"
                        className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                    >
                        Set dates in Settings
                    </Link>
                    .
                </p>
            )}

            <ul className="grid gap-5">
                {cards.map((c, i) => {
                    const phase = c.daysLeft === null ? null : phaseFor(c.daysLeft);
                    const isNext = c === next;
                    return (
                        <li
                            key={c.unit.id}
                            className={cn(
                                "grid gap-5 rounded-xl border bg-card p-5 shadow-card sm:p-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8",
                                phase === "passed" && "opacity-80",
                            )}
                        >
                            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-1">
                                <p className="num text-[3.25rem] leading-none">
                                    {c.daysLeft === null ? "–" : Math.abs(c.daysLeft)}
                                </p>
                                <div>
                                    <p className="font-bold">
                                        {c.daysLeft === null
                                            ? "No date yet"
                                            : c.daysLeft < 0
                                              ? "days ago"
                                              : c.daysLeft === 1
                                                ? "day to go"
                                                : "days to go"}
                                    </p>
                                    {c.examDate && (
                                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <CalendarDays className="size-3.5" aria-hidden />
                                            <time dateTime={c.examDate.toISOString().slice(0, 10)}>
                                                {formatExamDate(c.examDate)}
                                            </time>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="min-w-0">
                                <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <UnitChip code={c.unit.code} />
                                    <h2 className="min-w-0 text-lg leading-tight">
                                        <Link
                                            href={c.unitHref}
                                            className="underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-border-strong"
                                        >
                                            {c.unit.name}
                                        </Link>
                                    </h2>
                                    {phase && (
                                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                                            {phaseLabel[phase]}
                                        </span>
                                    )}
                                </div>
                                {phase && (
                                    <p className="mb-4 text-[0.9375rem] text-muted-foreground">
                                        {/* Coverage advice is moot once every topic has been tried. */}
                                        {phaseHint[phase === "early" && c.cover.untried === 0 ? "revision" : phase]}
                                    </p>
                                )}

                                <dl className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <Fact label="Topics strong" value={`${c.cover.strong}/${c.cover.total}`} />
                                    <Fact
                                        label="Not tried yet"
                                        value={c.cover.untried}
                                        href={c.cover.untried > 0 ? c.unitHref : undefined}
                                    />
                                    <Fact
                                        label="Open mistakes"
                                        value={c.openCount}
                                        href={c.openCount > 0 ? `/mistakes?unit=${c.unit.id}` : undefined}
                                    />
                                    <div className="rounded-lg bg-muted px-3.5 py-2.5">
                                        <dt className="text-[0.8125rem] font-bold text-muted-foreground">Last mock</dt>
                                        <dd className="mt-1">
                                            {c.lastMock && c.lastMock.marksAwarded !== null ? (
                                                <Link
                                                    href={`/mock/${c.lastMock.id}`}
                                                    className="flex items-center gap-2 underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-border-strong"
                                                >
                                                    <GradeTile
                                                        grade={indicativeGrade(c.lastMock.marksAwarded, c.lastMock.totalMarks)}
                                                        size="sm"
                                                    />
                                                    <span className="num">
                                                        {Math.round((c.lastMock.marksAwarded / c.lastMock.totalMarks) * 100)}%
                                                    </span>
                                                </Link>
                                            ) : (
                                                <span className="num text-xl leading-none text-muted-foreground">–</span>
                                            )}
                                        </dd>
                                    </div>
                                </dl>

                                {c.summary.started > 0 && (
                                    <MasteryBreakdown counts={c.summary.counts} className="mb-4" />
                                )}

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {c.checklist.total > 0 && (
                                            <Link
                                                href={`${c.unitHref}/checklist`}
                                                className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                                            >
                                                Checklist
                                            </Link>
                                        )}
                                        {c.checklist.total > 0 &&
                                            ` · ${c.checklist.green} of ${c.checklist.total} points “Got it”`}
                                    </p>
                                    <Button asChild variant={isNext || (!next && i === 0) ? "default" : "outline"}>
                                        <Link href={c.step.href}>
                                            {c.step.label}
                                            <ArrowRight />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

function Fact({ label, value, href }: { label: string; value: React.ReactNode; href?: string }) {
    return (
        <div className="relative rounded-lg bg-muted px-3.5 py-2.5 has-[a:hover]:shadow-[inset_0_0_0_1.5px_var(--border-strong)]">
            <dt className="text-[0.8125rem] font-bold text-muted-foreground">{label}</dt>
            <dd className="num mt-1 text-xl leading-none">
                {href ? (
                    // The link covers the whole tile; the dt/dd structure stays valid.
                    <Link
                        href={href}
                        className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
                    >
                        {value}
                        <span className="sr-only"> {label.toLowerCase()}</span>
                    </Link>
                ) : (
                    value
                )}
            </dd>
        </div>
    );
}

/** Exam dates are stored as calendar days (00:00Z), so format them in UTC. */
function formatExamDate(d: Date) {
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
