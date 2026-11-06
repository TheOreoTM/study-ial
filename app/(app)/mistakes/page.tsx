import type { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Check, ChevronDown, CircleCheck, RotateCcw, X } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { CardFromMistakeButton } from "@/components/mistakes/card-button";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { parseMarkScheme } from "@/lib/marking";
import { markLevel, masteryTone } from "@/lib/mastery";
import { groupByTopic, missLabel } from "@/lib/mistakes";
import { plainSnippet } from "@/lib/search";
import { getMistakeNotebook, type MistakeEntry } from "@/lib/queries/mistakes";
import { DEFAULT_COUNT } from "../practice/select";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mistakes", robots: { index: false } };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const typeLabel = { MCQ: "Multiple choice", SHORT: "Short answer", CALCULATION: "Calculation", LONG: "Extended" } as const;

export default async function MistakesPage({ searchParams }: { searchParams: SearchParams }) {
    const user = await requireUser();
    const sp = await searchParams;
    const unitParam = typeof sp.unit === "string" && sp.unit.length <= 64 ? sp.unit : undefined;

    const { total, entries, units, unit, held } = await getMistakeNotebook(user.id, { unitId: unitParam });
    const allCount = units.reduce((n, u) => n + u.count, 0);
    const redoHref = `/practice?mode=mistakes${unit ? `&unit=${unit.id}` : ""}`;

    if (allCount === 0) {
        return (
            <>
                <PageHeader title="Mistakes" />
                <EmptyState
                    headingLevel={2}
                    icon={CircleCheck}
                    title="No open mistakes"
                    description={
                        held > 0
                            ? "Your mistakes are on the mock paper you're sitting, so they're hidden until you hand it in."
                            : "When you lose marks on a question it lands here, so you can come back and get it right."
                    }
                    action={
                        <Button asChild>
                            <Link href="/practice?mode=weak">Practise weak topics</Link>
                        </Button>
                    }
                />
            </>
        );
    }

    const groups = groupByTopic(entries.map((e) => ({ ...e, topicId: e.question.topic.id })));

    return (
        <>
            <PageHeader
                title="Mistakes"
                description="Questions you lost marks on last time. Get full marks on one and it leaves the list."
                actions={
                    <Button asChild>
                        <Link href={redoHref}>
                            <RotateCcw className="size-4" />
                            {redoLabel(Math.min(DEFAULT_COUNT, total), unit?.code)}
                        </Link>
                    </Button>
                }
            />

            {units.length > 1 && (
                <nav aria-label="Filter by unit" className="-mx-1 mb-6 flex flex-wrap gap-2 px-1">
                    <FilterChip href="/mistakes" current={!unit} label="All" count={allCount} />
                    {units.map((u) => (
                        <FilterChip
                            key={u.id}
                            href={`/mistakes?unit=${u.id}`}
                            current={unit?.id === u.id}
                            label={u.code}
                            title={u.name}
                            count={u.count}
                        />
                    ))}
                </nav>
            )}

            {held > 0 && (
                <p className="mb-6 rounded-lg bg-muted px-4 py-3 text-[0.9375rem] text-muted-foreground">
                    {held} mistake{held === 1 ? " is" : "s are"} on the mock paper you&apos;re sitting, so{" "}
                    {held === 1 ? "it's" : "they're"} hidden until you hand it in.
                </p>
            )}

            <div className="grid gap-8">
                {groups.map(({ topicId, items }) => {
                    const t = items[0].question.topic;
                    const topicHref = `/subjects/${t.unit.subject.slug}/${t.unit.code.toLowerCase()}/${t.slug}`;
                    return (
                        <section key={topicId} aria-labelledby={`topic-${topicId}`} className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                                <UnitChip code={t.unit.code} size="sm" />
                                <h2 id={`topic-${topicId}`} className="min-w-0 flex-1 text-lg">
                                    <Link
                                        href={topicHref}
                                        className="underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-border-strong"
                                    >
                                        <span className="num mr-2 text-muted-foreground">{t.code}</span>
                                        {t.name}
                                    </Link>
                                </h2>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/practice?mode=mistakes&topic=${topicId}`}>
                                        <RotateCcw />
                                        Redo {items.length === 1 ? "it" : "these"}
                                    </Link>
                                </Button>
                            </div>
                            <ul className="grid gap-2.5">
                                {items.map((e) => (
                                    <MistakeItem key={e.questionId} entry={e} />
                                ))}
                            </ul>
                        </section>
                    );
                })}
            </div>

            {total > entries.length && (
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Showing your newest {entries.length} of {total}. Redo some and older ones will show up here.
                </p>
            )}
        </>
    );
}

function redoLabel(n: number, unitCode?: string) {
    return ["Redo", n, unitCode, n === 1 ? "mistake" : "mistakes"].filter(Boolean).join(" ");
}

function FilterChip({
    href,
    current,
    label,
    count,
    title,
}: {
    href: string;
    current: boolean;
    label: string;
    count: number;
    title?: string;
}) {
    return (
        <Link
            href={href}
            title={title}
            aria-current={current ? "page" : undefined}
            className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-4 font-display font-extrabold transition-colors duration-200 ease-out-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                current ? "bg-selected text-selected-foreground" : "bg-muted text-foreground hover:bg-accent",
            )}
        >
            {label}
            <span className="num text-sm text-muted-foreground">{count}</span>
        </Link>
    );
}

function MistakeItem({ entry: e }: { entry: MistakeEntry }) {
    const q = e.question;
    const level = markLevel(e.lastShare);
    const repeat = missLabel(e.misses);
    const { points, notes } = q.type === "MCQ" ? { points: [], notes: [] } : parseMarkScheme(q.markScheme);

    return (
        // The id lets search link straight to a question; :target outlines it on arrival.
        <li
            id={`q-${q.id}`}
            className="scroll-mt-24 rounded-lg border bg-card target:shadow-[inset_0_0_0_2px_var(--progress)]"
        >
            <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-3 rounded-lg px-4 py-3.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0 flex-1">
                        {/* <summary> only takes phrasing content: a plain-text preview here, the full stem below. */}
                        <span className="line-clamp-3 text-[0.9375rem] group-open:hidden">{plainSnippet(q.stem, 260)}</span>
                        <span className="hidden text-[0.9375rem] font-bold group-open:inline">
                            {q.type === "MCQ" ? "Question" : "Question and mark scheme"}
                        </span>
                        <span className="mt-1.5 block text-[0.8125rem] text-muted-foreground">
                            {typeLabel[q.type]} · {q.marks} mark{q.marks === 1 ? "" : "s"}
                            {repeat && <span className="font-bold text-foreground"> · {repeat}</span>} · last tried{" "}
                            <time dateTime={e.lastAt.toISOString()}>
                                {formatDistanceToNow(e.lastAt, { addSuffix: true })}
                            </time>
                        </span>
                    </div>
                    <span
                        className={cn("num shrink-0 rounded-full px-2.5 py-1 text-sm leading-none", masteryTone[level].badge)}
                    >
                        <span className="sr-only">Last score: </span>
                        {e.lastMarks}/{e.lastMax}
                    </span>
                    <ChevronDown
                        className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out-soft group-open:rotate-180"
                        aria-hidden
                    />
                    <span className="sr-only">Show the answer</span>
                </summary>

                <div className="grid gap-4 border-t px-4 pt-4 pb-5 sm:px-5">
                    <Markdown className="text-[0.9375rem] [&_.katex-display]:my-1 [&_p]:my-1">{q.stem}</Markdown>
                    {q.stemEn && (
                        <div className="rounded-lg bg-muted px-4 py-3">
                            <p className="mb-1 text-xs font-extrabold tracking-[0.05em] text-muted-foreground uppercase">
                                In English
                            </p>
                            <Markdown className="text-[0.9375rem] [&_p]:my-0">{q.stemEn}</Markdown>
                        </div>
                    )}

                    {q.type === "MCQ" ? (
                        <ul className="grid gap-2" aria-label="Options">
                            {q.options.map((o) => {
                                const chosen = e.last?.selectedOptionId === o.id;
                                return (
                                    <li
                                        key={o.id}
                                        className={cn(
                                            "flex items-start gap-3 rounded-lg px-3 py-2.5",
                                            o.isCorrect
                                                ? "bg-mastery-strong-pale"
                                                : chosen
                                                  ? "bg-mastery-weak-pale"
                                                  : "bg-muted/60 text-muted-foreground",
                                        )}
                                    >
                                        <span className="num grid size-7 shrink-0 place-items-center rounded-[9px] bg-card text-sm">
                                            {o.label}
                                        </span>
                                        <Markdown className="min-w-0 flex-1 pt-0.5 text-[0.9375rem] [&_p]:my-0">
                                            {o.text}
                                        </Markdown>
                                        {o.isCorrect ? (
                                            <span className="inline-flex shrink-0 items-center gap-1 pt-0.5 text-sm font-bold text-mastery-strong-text">
                                                <Check className="size-4" aria-hidden /> Correct
                                            </span>
                                        ) : chosen ? (
                                            <span className="inline-flex shrink-0 items-center gap-1 pt-0.5 text-sm font-bold text-mastery-weak-text">
                                                <X className="size-4" aria-hidden /> Your answer
                                            </span>
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <>
                            {e.last?.answer && (
                                <div>
                                    <h3 className="mb-1 text-base">Your answer</h3>
                                    <p className="rounded-lg bg-muted px-4 py-3 text-[0.9375rem] whitespace-pre-wrap">
                                        {e.last.answer}
                                    </p>
                                </div>
                            )}
                            <div>
                                <h3 className="mb-1 text-base">Mark scheme</h3>
                                <ul className="grid gap-1.5">
                                    {points.map((p, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Markdown className="min-w-0 flex-1 text-[0.9375rem] [&_p]:my-0">
                                                {p.text}
                                            </Markdown>
                                            <span className="num shrink-0 text-sm text-muted-foreground">
                                                {p.marks} mark{p.marks === 1 ? "" : "s"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                {notes.length > 0 && (
                                    <Markdown className="mt-2 text-sm text-muted-foreground [&_p]:my-0">
                                        {notes.join("\n\n")}
                                    </Markdown>
                                )}
                                {q.markSchemeEn && (
                                    <Markdown className="mt-2 rounded-lg bg-muted px-4 py-3 text-sm [&_p]:my-0">
                                        {q.markSchemeEn}
                                    </Markdown>
                                )}
                            </div>
                            {e.last?.feedback && (
                                <div>
                                    <h3 className="mb-1 text-base">Feedback</h3>
                                    <Markdown className="text-[0.9375rem] [&_p]:my-1">{e.last.feedback}</Markdown>
                                </div>
                            )}
                        </>
                    )}

                    {q.explanation && (
                        <div className="rounded-lg bg-muted px-4 py-3">
                            <h3 className="mb-1 text-base">Explanation</h3>
                            <Markdown className="text-[0.9375rem] [&_p]:my-1">{q.explanation}</Markdown>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <CardFromMistakeButton questionId={q.id} />
                    </div>
                </div>
            </details>
        </li>
    );
}
