import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, SearchX } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { QuestionFilters } from "@/components/admin/question-filters";
import { QuestionsTable } from "@/components/admin/questions-table";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { requireAdmin } from "@/lib/session";
import { getCurriculumTree } from "../queries";
import { DIFFICULTIES, QUESTION_TYPES, STATUSES } from "../validation";

export const metadata: Metadata = { title: "Questions · Admin" };

const PAGE_SIZE = 25;

type SearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const pick = <T extends string>(v: string | undefined, allowed: readonly T[]) =>
    allowed.includes(v as T) ? (v as T) : undefined;

export default async function AdminQuestionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    await requireAdmin();
    const sp = await searchParams;
    const filters = {
        subject: one(sp.subject),
        unit: one(sp.unit)?.toUpperCase(),
        topic: one(sp.topic),
        type: pick(one(sp.type), QUESTION_TYPES),
        difficulty: pick(one(sp.difficulty), DIFFICULTIES),
        status: pick(one(sp.status), STATUSES),
        q: one(sp.q)?.slice(0, 200),
    };
    const page = Math.max(1, Number.parseInt(one(sp.page) ?? "1", 10) || 1);

    const where: Prisma.QuestionWhereInput = {
        ...(filters.topic ? { topicId: filters.topic } : {}),
        ...(filters.unit ? { unit: { code: filters.unit } } : {}),
        ...(filters.subject && !filters.unit ? { unit: { subject: { slug: filters.subject } } } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.q
            ? {
                  OR: [
                      { stem: { contains: filters.q, mode: "insensitive" } },
                      { seedKey: { contains: filters.q, mode: "insensitive" } },
                      { sourceRef: { contains: filters.q, mode: "insensitive" } },
                  ],
              }
            : {}),
    };

    const [tree, total, questions] = await Promise.all([
        getCurriculumTree(),
        db.question.count({ where }),
        db.question.findMany({
            where,
            orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            select: {
                id: true,
                type: true,
                difficulty: true,
                marks: true,
                stem: true,
                status: true,
                source: true,
                seedKey: true,
                updatedAt: true,
                unit: { select: { code: true } },
                topic: { select: { code: true, name: true } },
                _count: { select: { attempts: true } },
            },
        }),
    ]);
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageHref = (p: number) => {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(filters)) if (v) params.set(k, v);
        if (p > 1) params.set("page", String(p));
        const s = params.toString();
        return `/admin/questions${s ? `?${s}` : ""}`;
    };
    const filtered = Object.values(filters).some(Boolean);

    return (
        <>
            <PageHeader
                title="Questions"
                description={`${total} question${total === 1 ? "" : "s"}${filtered ? " match these filters" : " in the bank"}.`}
                className="mb-5"
                actions={
                    <Button asChild>
                        <Link
                            href={
                                filters.topic ? `/admin/questions/new?topic=${filters.topic}` : "/admin/questions/new"
                            }
                        >
                            <Plus /> New question
                        </Link>
                    </Button>
                }
            />

            <QuestionFilters tree={tree} values={filters} />

            {questions.length === 0 ? (
                <EmptyState
                    icon={SearchX}
                    title={filtered ? "No questions match" : "No questions yet"}
                    description={
                        filtered
                            ? "Try clearing some filters."
                            : "Write one or import a batch from JSON to get started."
                    }
                    action={
                        filtered ? (
                            <Button asChild variant="outline">
                                <Link href="/admin/questions">Clear filters</Link>
                            </Button>
                        ) : (
                            <Button asChild>
                                <Link href="/admin/import">Import JSON</Link>
                            </Button>
                        )
                    }
                />
            ) : (
                <QuestionsTable
                    questions={questions.map((q) => ({
                        id: q.id,
                        type: q.type,
                        difficulty: q.difficulty,
                        marks: q.marks,
                        stem: q.stem.length > 200 ? `${q.stem.slice(0, 200)}…` : q.stem,
                        status: q.status,
                        source: q.source,
                        seedKey: q.seedKey,
                        updatedAt: q.updatedAt.toISOString(),
                        unitCode: q.unit.code,
                        topic: `${q.topic.code} ${q.topic.name}`,
                        attempts: q._count.attempts,
                    }))}
                />
            )}

            {pages > 1 && (
                <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">
                        Page {page} of {pages}
                    </span>
                    <div className="flex gap-2">
                        {page > 1 ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={pageHref(page - 1)}>
                                    <ChevronLeft /> Previous
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                <ChevronLeft /> Previous
                            </Button>
                        )}
                        {page < pages ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={pageHref(page + 1)}>
                                    Next <ChevronRight />
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                Next <ChevronRight />
                            </Button>
                        )}
                    </div>
                </nav>
            )}
        </>
    );
}
