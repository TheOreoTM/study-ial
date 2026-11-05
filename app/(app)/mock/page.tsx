import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { GradeTile } from "@/components/mock/grade-tile";
import { StartMock } from "@/components/mock/start-mock";
import { PageHeader } from "@/components/page-header";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { formatDuration, indicativeGrade, MOCK_LENGTH_LABEL, type MockLength } from "@/lib/mock-exam";
import { daysUntil } from "@/lib/queries/plans";
import { getMockHome } from "@/lib/queries/mock-exams";
import { requireUser } from "@/lib/session";
import { APP_TIME_ZONE } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mock papers", robots: { index: false } };

export default async function MockPage() {
    const user = await requireUser();
    const { units, papers } = await getMockHome(user.id);
    const firstReady = units.find((u) => u.availableMarks >= 16);

    return (
        <>
            <PageHeader
                title="Mock papers"
                description="Sit a timed paper for one of your units, with no feedback until you hand it in. Then mark it and see an indicative grade."
            />

            {units.length === 0 ? (
                <EmptyState
                    icon={BookOpen}
                    title="No units yet"
                    description="Add the units you're sitting, then come back to sit a mock paper."
                    action={
                        <Button asChild>
                            <Link href="/settings">Add units</Link>
                        </Button>
                    }
                />
            ) : (
                <ul className="grid gap-4 lg:grid-cols-2">
                    {units.map((u) => {
                        const days = u.examDate ? daysUntil(u.examDate) : null;
                        return (
                            <li key={u.id} className="min-w-0 rounded-xl border bg-card p-5 shadow-card sm:p-6">
                                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <UnitChip code={u.code} />
                                    <h2 className="min-w-0 flex-1 text-lg leading-tight">{u.name}</h2>
                                    {days !== null && days >= 0 && (
                                        <span className="w-full text-sm font-bold text-muted-foreground sm:w-auto">
                                            Exam in <span className="num text-foreground">{days}</span> day
                                            {days === 1 ? "" : "s"}
                                        </span>
                                    )}
                                </div>
                                {u.availableMarks === 0 ? (
                                    <p className="rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                                        No questions in this unit yet.
                                    </p>
                                ) : (
                                    <StartMock
                                        unitId={u.id}
                                        subjectSlug={u.subjectSlug}
                                        availableMarks={u.availableMarks}
                                        primary={u.id === firstReady?.id}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <section aria-labelledby="past-papers" className="mt-10">
                <h2 id="past-papers" className="mb-3 text-xl">
                    Your papers
                </h2>
                {papers.length === 0 ? (
                    <EmptyState
                        icon={ClipboardList}
                        title="No papers yet"
                        description="Your mock papers and their indicative grades will be listed here."
                        className="py-8"
                    />
                ) : (
                    <ul className="grid gap-2">
                        {papers.map((p) => {
                            const finished = p.status === "FINISHED" && p.marksAwarded !== null;
                            const pct = finished ? Math.round((p.marksAwarded! / p.totalMarks) * 100) : null;
                            const state = finished
                                ? null
                                : p.status === "MARKING"
                                  ? "Waiting to be marked"
                                  : p.expired
                                    ? "Time's up — open to hand in"
                                    : "In progress";
                            return (
                                <li key={p.id}>
                                    <Link
                                        href={`/mock/${p.id}`}
                                        className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-3.5 transition-[border-color,box-shadow] duration-200 ease-out-soft hover:border-border-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5"
                                    >
                                        {finished ? (
                                            <GradeTile grade={indicativeGrade(p.marksAwarded!, p.totalMarks)} />
                                        ) : (
                                            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-muted text-muted-foreground">
                                                <ClipboardList className="size-5" aria-hidden />
                                            </span>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold">
                                                {p.unit.code} · {MOCK_LENGTH_LABEL[p.length as MockLength] ?? "Paper"}
                                            </p>
                                            <p className="text-[0.8125rem] text-muted-foreground">
                                                <time dateTime={p.startedAt.toISOString()}>
                                                    {formatInZone(p.startedAt)}
                                                </time>{" "}
                                                · {p.totalMarks} marks · {formatDuration(p.durationMinutes)}
                                            </p>
                                        </div>
                                        {finished ? (
                                            <span className="num shrink-0 text-right text-lg leading-none">
                                                {p.marksAwarded}/{p.totalMarks}
                                                <span className="block text-xs text-muted-foreground">{pct}%</span>
                                            </span>
                                        ) : (
                                            <span
                                                className={cn(
                                                    "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
                                                    p.status === "MARKING" || p.expired
                                                        ? "bg-primary-soft text-foreground"
                                                        : "bg-selected text-selected-foreground",
                                                )}
                                            >
                                                {state}
                                            </span>
                                        )}
                                        <ArrowRight
                                            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5"
                                            aria-hidden
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                    Grades are estimates from the IAL&apos;s uniform-mark thresholds (A 80%, B 70%, C 60%, D 50%, E
                    40%). Real grade boundaries change from paper to paper.
                </p>
            </section>
        </>
    );
}

/** "5 Nov, 19:40" in Maldives time. */
function formatInZone(d: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: APP_TIME_ZONE,
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}
