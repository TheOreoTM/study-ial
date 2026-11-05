import "server-only";
import { db } from "@/lib/db";
import { isPastDeadline } from "@/lib/mock-exam";

/** The student's units with how many marks of published questions each has, plus their papers. */
export async function getMockHome(userId: string) {
    const [userUnits, papers] = await Promise.all([
        db.userUnit.findMany({
            where: { userId },
            include: { unit: { include: { subject: { select: { slug: true, name: true, order: true } } } } },
            orderBy: [{ examDate: { sort: "asc", nulls: "last" } }, { unit: { order: "asc" } }],
        }),
        db.mockExam.findMany({
            where: { userId },
            orderBy: { startedAt: "desc" },
            take: 30,
            include: { unit: { select: { code: true, name: true } } },
        }),
    ]);
    const marks = await db.question.groupBy({
        by: ["unitId"],
        where: { unitId: { in: userUnits.map((u) => u.unitId) }, status: "PUBLISHED" },
        _sum: { marks: true },
    });
    const available = new Map(marks.map((m) => [m.unitId, m._sum?.marks ?? 0]));
    const now = new Date();
    return {
        units: userUnits.map((uu) => ({
            id: uu.unit.id,
            code: uu.unit.code,
            name: uu.unit.name,
            subjectSlug: uu.unit.subject.slug,
            examDate: uu.examDate,
            availableMarks: available.get(uu.unitId) ?? 0,
        })),
        papers: papers.map((p) => ({
            ...p,
            // A paper left running past its deadline is handed in when it's next opened.
            expired: p.status === "IN_PROGRESS" && isPastDeadline(p.startedAt, p.durationMinutes, now),
        })),
    };
}

export type MockHome = Awaited<ReturnType<typeof getMockHome>>;

/** One paper with its questions in paper order. Answers and mark schemes are only included once it's handed in. */
export async function getMockPaper(userId: string, id: string) {
    const mock = await db.mockExam.findFirst({
        where: { id, userId },
        include: { unit: { include: { subject: { select: { slug: true, name: true } } } } },
    });
    if (!mock) return null;
    const handedIn = mock.status !== "IN_PROGRESS";

    const [questions, attempts] = await Promise.all([
        db.question.findMany({
            where: { id: { in: mock.questionIds } },
            select: {
                id: true,
                type: true,
                marks: true,
                stem: true,
                stemEn: true,
                topicId: true,
                markScheme: handedIn,
                markSchemeEn: handedIn,
                explanation: handedIn,
                topic: { select: { id: true, code: true, name: true, slug: true, order: true } },
                options: {
                    select: { id: true, label: true, text: true, isCorrect: handedIn },
                    orderBy: { label: "asc" },
                },
            },
        }),
        handedIn
            ? db.attempt.findMany({
                  where: { mockExamId: mock.id, userId },
                  select: { questionId: true, marksAwarded: true, maxMarks: true, selectedOptionId: true },
              })
            : Promise.resolve([]),
    ]);
    const byId = new Map(questions.map((q) => [q.id, q]));
    return {
        mock,
        questions: mock.questionIds.flatMap((qid) => (byId.has(qid) ? [byId.get(qid)!] : [])),
        attempts,
    };
}

export type MockPaper = NonNullable<Awaited<ReturnType<typeof getMockPaper>>>;
