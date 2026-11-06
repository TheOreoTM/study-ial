import { Markdown } from "@/components/markdown";
import { db } from "@/lib/db";

/**
 * Public sample of the topic's ORIGINAL published questions (never past-paper content), for students and search
 * engines. Mark schemes are behind a disclosure so the page still works as practice.
 */
export async function SampleQuestions({ topicId }: { topicId: string }) {
    const questions = await db.question.findMany({
        where: { topicId, status: "PUBLISHED", source: "ORIGINAL", type: { not: "MCQ" } },
        orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
        take: 3,
        select: { id: true, stem: true, marks: true, markScheme: true, stemEn: true },
    });
    const usable = questions.filter((q) => !q.stemEn); // Dhivehi questions stay in practice
    if (usable.length === 0) return null;
    return (
        <section aria-labelledby="sample-questions" className="mt-10">
            <h2 id="sample-questions" className="mb-1 text-xl">
                Sample questions
            </h2>
            <p className="mb-4 text-muted-foreground">Original practice questions written in the style of the exam.</p>
            <ol className="space-y-3">
                {usable.map((q, i) => (
                    <li key={q.id} className="rounded-xl border bg-card p-5 shadow-card">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="font-display font-extrabold">Question {i + 1}</span>
                            <span className="num rounded-full bg-muted px-3 py-0.5 font-display font-extrabold">
                                {q.marks} mark{q.marks === 1 ? "" : "s"}
                            </span>
                        </div>
                        <Markdown>{q.stem}</Markdown>
                        <details className="mt-3 rounded-lg bg-muted px-4 py-3">
                            <summary className="cursor-pointer text-sm font-bold">Mark scheme</summary>
                            <div className="mt-2 text-[0.9375rem]">
                                <Markdown>{q.markScheme}</Markdown>
                            </div>
                        </details>
                    </li>
                ))}
            </ol>
        </section>
    );
}
