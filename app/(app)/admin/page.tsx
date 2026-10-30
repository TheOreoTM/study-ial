import type { Metadata } from "next";
import Link from "next/link";
import { FileUp, ListChecks, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";
import { getCurriculumTree } from "./queries";

export const metadata: Metadata = { title: "Admin" };

type Counts = { published: number; draft: number };
const empty = (): Counts => ({ published: 0, draft: 0 });

export default async function AdminOverviewPage() {
    await requireAdmin();
    const [tree, byUnit, byTopic] = await Promise.all([
        getCurriculumTree(),
        db.question.groupBy({ by: ["unitId", "status"], _count: { _all: true } }),
        db.question.groupBy({ by: ["topicId", "status"], _count: { _all: true } }),
    ]);

    const unitCounts = new Map<string, Counts>();
    for (const row of byUnit) {
        const c = unitCounts.get(row.unitId) ?? empty();
        c[row.status === "PUBLISHED" ? "published" : "draft"] += row._count._all;
        unitCounts.set(row.unitId, c);
    }
    const topicCounts = new Map<string, Counts>();
    for (const row of byTopic) {
        const c = topicCounts.get(row.topicId) ?? empty();
        c[row.status === "PUBLISHED" ? "published" : "draft"] += row._count._all;
        topicCounts.set(row.topicId, c);
    }

    let totalPublished = 0;
    let totalDraft = 0;
    for (const c of unitCounts.values()) {
        totalPublished += c.published;
        totalDraft += c.draft;
    }
    const allTopics = tree.flatMap((s) => s.units.flatMap((u) => u.topics));
    const coveredTopics = allTopics.filter((t) => (topicCounts.get(t.id)?.published ?? 0) > 0).length;

    // Content to-do list: units that still have topics without a single published question.
    const todo = tree.flatMap((s) =>
        s.units
            .map((u) => ({
                subject: s.name,
                unit: u,
                topics: u.topics.filter((t) => !topicCounts.get(t.id)?.published),
            }))
            .filter((u) => u.topics.length > 0),
    );

    return (
        <>
            <PageHeader
                title="Question bank"
                description="Coverage across the curriculum. Topics with no published questions are your to-do list."
                actions={
                    <>
                        <Button asChild variant="outline">
                            <Link href="/admin/import">
                                <FileUp /> Import JSON
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/questions/new">
                                <Plus /> New question
                            </Link>
                        </Button>
                    </>
                }
            />

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Published" value={totalPublished} href="/admin/questions?status=PUBLISHED" />
                <Stat label="Drafts" value={totalDraft} href="/admin/questions?status=DRAFT" />
                <Stat label="Topics covered" value={`${coveredTopics} / ${allTopics.length}`} />
                <Stat
                    label="Topics to do"
                    value={allTopics.length - coveredTopics}
                    tone={allTopics.length > coveredTopics ? "warning" : undefined}
                />
            </div>

            <section className="mb-10" aria-labelledby="coverage-heading">
                <h2 id="coverage-heading" className="mb-3 text-lg font-semibold">
                    Coverage by unit
                </h2>
                {tree.length === 0 ? (
                    <EmptyState
                        icon={ListChecks}
                        title="No curriculum yet"
                        description="Run the seed to add subjects."
                    />
                ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                        {tree.map((subject) => (
                            <Card key={subject.id} className="gap-0 py-0">
                                <CardHeader className="border-b py-3">
                                    <CardTitle className="text-base">{subject.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-2 py-1">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Unit</TableHead>
                                                <TableHead className="text-right">Published</TableHead>
                                                <TableHead className="text-right">Draft</TableHead>
                                                <TableHead className="text-right">Covered</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subject.units.map((u) => {
                                                const c = unitCounts.get(u.id) ?? empty();
                                                const covered = u.topics.filter(
                                                    (t) => (topicCounts.get(t.id)?.published ?? 0) > 0,
                                                ).length;
                                                return (
                                                    <TableRow key={u.id}>
                                                        <TableCell className="max-w-56 truncate">
                                                            <Link
                                                                href={`/admin/questions?subject=${subject.slug}&unit=${u.code}`}
                                                                className="hover:underline"
                                                            >
                                                                <span className="font-mono text-xs text-muted-foreground">
                                                                    {u.code}
                                                                </span>{" "}
                                                                {u.name}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="text-right tabular-nums">
                                                            {c.published}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                                            {c.draft}
                                                        </TableCell>
                                                        <TableCell
                                                            className={cn(
                                                                "text-right tabular-nums",
                                                                covered < u.topics.length && "text-warning",
                                                                u.topics.length > 0 &&
                                                                    covered === u.topics.length &&
                                                                    "text-success",
                                                            )}
                                                        >
                                                            {covered} / {u.topics.length}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <section aria-labelledby="todo-heading">
                <h2 id="todo-heading" className="mb-1 text-lg font-semibold">
                    Topics with no published questions
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                    Students see an empty practice set for these. Drafts waiting for review are noted.
                </p>
                {todo.length === 0 ? (
                    <EmptyState
                        icon={ListChecks}
                        title="Every topic has published questions"
                        description="Nice. Keep adding variety and harder questions."
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {todo.map(({ subject, unit, topics }) => (
                            <Card key={unit.id} className="gap-2 py-4">
                                <CardHeader className="px-4">
                                    <CardTitle className="text-sm">
                                        <span className="font-mono text-xs text-muted-foreground">{unit.code}</span>{" "}
                                        {unit.name}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {subject} · {topics.length} of {unit.topics.length} topics empty
                                    </p>
                                </CardHeader>
                                <CardContent className="px-4">
                                    <ul className="divide-y text-sm">
                                        {topics.map((t) => {
                                            const drafts = topicCounts.get(t.id)?.draft ?? 0;
                                            return (
                                                <li key={t.id} className="flex items-center gap-2 py-1.5">
                                                    <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">
                                                        {t.code}
                                                    </span>
                                                    <span className="min-w-0 flex-1 truncate" title={t.name}>
                                                        {t.name}
                                                    </span>
                                                    {drafts > 0 && (
                                                        <Link
                                                            href={`/admin/questions?unit=${unit.code}&topic=${t.id}&status=DRAFT`}
                                                            className="shrink-0 text-xs text-warning hover:underline"
                                                        >
                                                            {drafts} draft{drafts === 1 ? "" : "s"}
                                                        </Link>
                                                    )}
                                                    <Button asChild size="icon-xs" variant="ghost">
                                                        <Link
                                                            href={`/admin/questions/new?topic=${t.id}`}
                                                            aria-label={`Add question to ${t.name}`}
                                                        >
                                                            <Plus />
                                                        </Link>
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

function Stat({
    label,
    value,
    href,
    tone,
}: {
    label: string;
    value: React.ReactNode;
    href?: string;
    tone?: "warning";
}) {
    const body = (
        <>
            <div className="text-xs font-medium text-muted-foreground">{label}</div>
            <div className={cn("mt-1 text-2xl font-semibold tabular-nums", tone === "warning" && "text-warning")}>
                {value}
            </div>
        </>
    );
    const cls = "rounded-xl border bg-card px-4 py-3";
    return href ? (
        <Link href={href} className={cn(cls, "transition-colors hover:bg-muted/50")}>
            {body}
        </Link>
    ) : (
        <div className={cls}>{body}</div>
    );
}
