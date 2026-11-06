import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { FinishReviewButton } from "@/components/papers/finish-review-button";
import { ReviewQuestionEditor, type ReviewQuestion } from "@/components/papers/review-question";
import { db } from "@/lib/db";
import { parsedPaperSchema } from "@/lib/papers/parse/schema";
import { validateStructure } from "@/lib/papers/parse/validate";
import { canEditSittingQuestions } from "@/lib/papers/permissions";
import { requireUser } from "@/lib/session";
import { Breadcrumbs } from "../../../subjects/_components/breadcrumbs";

export const metadata: Metadata = { title: "Check questions", robots: { index: false, follow: false } };

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await requireUser();
    const sitting = await db.paperSitting.findUnique({
        where: { id },
        select: { id: true, ownerId: true, title: true, unitCode: true, papers: { where: { type: "QP" }, select: { id: true, sha256: true, pageCount: true } } },
    });
    const qp = sitting?.papers[0];
    if (!sitting || !qp || !canEditSittingQuestions(user, sitting)) notFound();

    const [rows, parse] = await Promise.all([
        db.paperQuestion.findMany({ where: { paperId: qp.id }, orderBy: { order: "asc" } }),
        db.paperParse.findUnique({ where: { sha256_docType: { sha256: qp.sha256, docType: "QP" } }, select: { result: true, engine: true } }),
    ]);
    const totals = parse ? (parsedPaperSchema.safeParse(parse.result).data?.totals ?? { paper: null, questions: {} }) : { paper: null, questions: {} };
    // Validate what's in the database now (including edits), not the original parse
    const report = validateStructure({
        paper: { board: "", unit: sitting.unitCode, series: null, paperType: "QP" },
        questions: rows.map((r) => ({
            number: r.number,
            parent: rows.find((p) => p.id === r.parentId)?.number ?? null,
            stem: r.stem,
            marks: r.marks,
            latex: false,
            figures: [],
            dependsOn: r.dependsOn,
            regions: [],
        })),
        totals,
    });
    const issuesFor = (n: string) => report.issues.filter((i) => i.number === n || i.number === n.split("(")[0] && i.code === "question-total").map((i) => i.message);
    const depth = (n: string) => (n.match(/\(/g) ?? []).length;

    const questions: ReviewQuestion[] = rows.map((r) => ({
        id: r.id,
        number: r.number,
        depth: depth(r.number),
        stem: r.stem,
        marks: r.marks,
        page: r.page,
        bbox: r.bbox,
        figures: (r.figures as { page: number; bbox: number[] }[]) ?? [],
        edited: r.edited,
        issues: r.parentId ? issuesFor(r.number).filter((m) => !m.startsWith("Question")) : issuesFor(r.number),
    }));
    const errors = report.issues.filter((i) => i.level === "error");

    return (
        <>
            <Breadcrumbs items={[{ href: "/papers", label: "My papers" }, { href: `/papers/${sitting.id}`, label: sitting.title ?? sitting.unitCode }, { label: "Check questions" }]} />
            <PageHeader
                title="Check the questions"
                description={`Read ${parse?.engine === "vision" ? "with AI" : "from the PDF's text"}. Compare each part with the page, fix the text, marks and crop, then save.`}
                actions={<FinishReviewButton paperId={qp.id} sittingId={sitting.id} />}
            />
            <section aria-label="Checks" className="mb-6 rounded-xl bg-muted p-4 sm:p-5">
                <p className="flex items-center gap-2 font-semibold">
                    {errors.length === 0 ? (
                        <CheckCircle2 className="size-5 text-success" aria-hidden />
                    ) : (
                        <AlertTriangle className="size-5 text-warning" aria-hidden />
                    )}
                    {report.questionCount} questions, {report.partCount} parts, {report.totalMarks} marks
                    {totals.paper !== null && ` (paper says ${totals.paper})`}
                </p>
                {report.issues.length > 0 && (
                    <ul className="mt-2 list-disc space-y-0.5 pl-6 text-sm">
                        {report.issues.slice(0, 12).map((i, k) => (
                            <li key={k} className={i.level === "error" ? "text-destructive" : "text-muted-foreground"}>
                                {i.number ? <a href={`#q-${i.number}`} className="underline underline-offset-2">{i.message}</a> : i.message}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <div className="space-y-4">
                {questions.map((q) => (
                    <ReviewQuestionEditor
                        key={q.id}
                        q={q}
                        paperId={qp.id}
                        pageCount={qp.pageCount}
                        preview={q.stem ? <Markdown>{q.stem}</Markdown> : <p className="text-sm text-muted-foreground">No text</p>}
                    />
                ))}
            </div>
        </>
    );
}
