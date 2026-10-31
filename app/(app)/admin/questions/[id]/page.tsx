import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { QuestionEditor } from "@/components/admin/question-editor";
import { aiEnabled } from "@/lib/ai";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { getCurriculumTree } from "../../queries";

export const metadata: Metadata = { title: "Edit question · Admin" };

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
    await requireAdmin();
    const { id } = await params;
    const [question, tree] = await Promise.all([
        db.question.findUnique({
            where: { id },
            include: {
                options: { orderBy: { label: "asc" } },
                topic: { select: { slug: true, code: true, name: true } },
                unit: { select: { code: true, subject: { select: { slug: true } } } },
                _count: { select: { attempts: true } },
            },
        }),
        getCurriculumTree(),
    ]);
    if (!question) notFound();

    return (
        <>
            <PageHeader
                title="Edit question"
                description={`${question.unit.code} · ${question.topic.code} ${question.topic.name}`}
                className="mb-6"
            />
            <QuestionEditor
                key={question.updatedAt.toISOString()}
                tree={tree}
                questionId={question.id}
                aiEnabled={aiEnabled}
                meta={{
                    seedKey: question.seedKey,
                    attempts: question._count.attempts,
                    updatedAt: `${question.updatedAt.toISOString().slice(0, 16).replace("T", " ")} UTC`,
                    publicHref: `/subjects/${question.unit.subject.slug}/${question.unit.code.toLowerCase()}/${question.topic.slug}`,
                }}
                initial={{
                    topicId: question.topicId,
                    type: question.type,
                    difficulty: question.difficulty,
                    marks: String(question.marks),
                    status: question.status,
                    source: question.source,
                    sourceRef: question.sourceRef ?? "",
                    stem: question.stem,
                    markScheme: question.markScheme,
                    explanation: question.explanation ?? "",
                    options: question.options.map((o) => ({
                        label: o.label as "A",
                        text: o.text,
                        isCorrect: o.isCorrect,
                    })),
                }}
            />
        </>
    );
}
