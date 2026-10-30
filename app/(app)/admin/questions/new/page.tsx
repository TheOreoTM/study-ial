import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { QuestionEditor } from "@/components/admin/question-editor";
import { aiEnabled } from "@/lib/ai";
import { requireAdmin } from "@/lib/session";
import { getCurriculumTree } from "../../queries";
import { blankOptions, QUESTION_TYPES, type QuestionTypeValue } from "../../validation";

export const metadata: Metadata = { title: "New question · Admin" };

export default async function NewQuestionPage({
    searchParams,
}: {
    searchParams: Promise<{ topic?: string; type?: string; n?: string }>;
}) {
    await requireAdmin();
    const [{ topic, type, n }, tree] = await Promise.all([searchParams, getCurriculumTree()]);
    const topicId = tree.some((s) => s.units.some((u) => u.topics.some((t) => t.id === topic))) ? topic! : "";
    const qType: QuestionTypeValue = QUESTION_TYPES.includes(type as QuestionTypeValue)
        ? (type as QuestionTypeValue)
        : "SHORT";

    return (
        <>
            <PageHeader title="New question" description="Saved as a draft until you publish it." className="mb-6" />
            <QuestionEditor
                // Remount when "Save & add another" navigates here again.
                key={`${topicId}-${qType}-${n ?? ""}`}
                tree={tree}
                aiEnabled={aiEnabled}
                initial={{
                    topicId,
                    type: qType,
                    difficulty: "MEDIUM",
                    marks: qType === "MCQ" ? "1" : "",
                    status: "DRAFT",
                    source: "ORIGINAL",
                    sourceRef: "",
                    stem: "",
                    markScheme: "",
                    explanation: "",
                    options: qType === "MCQ" ? blankOptions() : [],
                }}
            />
        </>
    );
}
