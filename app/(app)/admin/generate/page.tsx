import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { GeneratedActions } from "@/components/admin/generated-actions";
import { GenerateForm } from "@/components/admin/generate-form";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { aiEnabled } from "@/lib/ai";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import type { SelfCheck } from "@/lib/generate";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Generate · Admin" };

type Generation = { model: string; finalAnswer?: string; selfCheck?: SelfCheck; similarity?: { score: number; label: string } | null; issues?: string[] };

export default async function GeneratePage() {
    await requireAdmin();
    const [units, drafts] = await Promise.all([
        db.unit.findMany({
            where: { subject: { isLocal: false }, topics: { some: {} } },
            orderBy: [{ subject: { order: "asc" } }, { order: "asc" }],
            select: { code: true, name: true, subject: { select: { name: true } }, topics: { orderBy: { order: "asc" }, select: { id: true, code: true, name: true } } },
        }),
        db.question.findMany({
            where: { status: "DRAFT", source: "ORIGINAL", generation: { not: Prisma.DbNull } },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: { topic: { select: { name: true, code: true } }, unit: { select: { code: true } }, options: true },
        }),
    ]);

    return (
        <>
            <PageHeader
                title="Original questions"
                description="AI-written practice questions in IAL style, never paraphrases of real papers. Every one is a draft until you publish it; published questions appear on the public topic pages."
            />
            <GenerateForm units={units.map((u) => ({ code: u.code, name: u.name, subject: u.subject.name, topics: u.topics }))} enabled={aiEnabled} />

            <h2 className="mt-10 mb-4 text-xl">Review queue</h2>
            {drafts.length === 0 ? (
                <EmptyState icon={Sparkles} title="Nothing to review" description="Generated drafts land here with their self-check result." />
            ) : (
                <ul className="space-y-4">
                    {drafts.map((q) => {
                        const g = q.generation as Generation;
                        const issues = g.issues ?? [];
                        return (
                            <li key={q.id} className="rounded-xl border bg-card p-5 shadow-card">
                                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                                    <span className="rounded-[9px] bg-selected px-2 py-0.5 font-display font-extrabold text-selected-foreground">{q.unit.code}</span>
                                    <span className="font-semibold">
                                        {q.topic.code} {q.topic.name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        · {q.type.toLowerCase()} · {q.difficulty.toLowerCase()} · {q.marks} marks
                                    </span>
                                    <span
                                        className={cn(
                                            "ml-auto rounded-full px-2.5 py-0.5 font-bold",
                                            g.selfCheck?.status === "agree" ? "bg-muted text-success" : g.selfCheck?.status === "disagree" ? "bg-muted text-destructive" : "bg-muted text-warning",
                                        )}
                                    >
                                        {g.selfCheck?.status === "agree" ? "Solver agrees" : g.selfCheck?.status === "disagree" ? "Solver disagrees" : "Unchecked"}
                                    </span>
                                </div>
                                <Markdown>{q.stem}</Markdown>
                                {q.options.length > 0 && (
                                    <ol className="mt-2 space-y-1">
                                        {q.options.map((o) => (
                                            <li key={o.id} className={o.isCorrect ? "font-bold" : ""}>
                                                {o.label}. {o.text}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                                {issues.length > 0 && (
                                    <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm text-destructive">
                                        {issues.map((i) => (
                                            <li key={i}>{i}</li>
                                        ))}
                                    </ul>
                                )}
                                <details className="mt-3 rounded-lg bg-muted px-4 py-3">
                                    <summary className="cursor-pointer text-sm font-bold">Mark scheme, solution and self-check</summary>
                                    <div className="mt-2 space-y-3 text-[0.9375rem]">
                                        <Markdown>{q.markScheme}</Markdown>
                                        {q.explanation && <Markdown>{q.explanation}</Markdown>}
                                        <p className="text-sm text-muted-foreground">
                                            Expected <strong>{g.finalAnswer ?? "?"}</strong> · solver got <strong>{g.selfCheck?.solverAnswer || "—"}</strong>
                                            {g.selfCheck?.notes ? ` · ${g.selfCheck.notes}` : ""}
                                            {g.similarity ? ` · closest past paper: ${g.similarity.label} (${Math.round(g.similarity.score * 100)}%)` : ""} · {g.model}
                                        </p>
                                    </div>
                                </details>
                                <div className="mt-4">
                                    <GeneratedActions id={q.id} flagged={issues.length > 0} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}
