import "server-only";
import { db } from "@/lib/db";
import { MOCK_LENGTH_LABEL, indicativeGrade, type MockLength } from "@/lib/mock-exam";
import { openMistakes } from "@/lib/mistakes";
import { getTopicMastery } from "@/lib/queries/mastery";
import { getQuestionHistory } from "@/lib/queries/mistakes";
import { getLockedQuestionIds } from "@/lib/queries/mock-exams";
import { plainSnippet, type SearchDoc } from "@/lib/search";
import { APP_TIME_ZONE } from "@/lib/time";

/** How many answered questions go into a student's search index (newest first). */
const MAX_QUESTIONS = 300;
const RECENT_TOPICS = 4;

export type PersonalSearch = {
    /** Mastery for every topic the student has practised; missing topics are "not started" */
    mastery: Record<string, { level: string; score: number | null }>;
    /** Topics practised most recently, newest first */
    recentTopicIds: string[];
    /** Questions they've answered and their mock papers, as search documents */
    docs: SearchDoc[];
};

/**
 * Everything personal the search palette needs, in one read. Only questions the student has attempted, never ones
 * on a paper they're sitting (those stay locked until it's handed in).
 */
export async function getPersonalSearch(userId: string): Promise<PersonalSearch> {
    const [history, locked] = await Promise.all([getQuestionHistory(userId), getLockedQuestionIds(userId)]);
    const newest = [...history].sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());
    const topicIds = [...new Set(newest.map((h) => h.topicId))];
    const openIds = new Set(openMistakes(history).map((m) => m.questionId));
    const shown = newest.filter((h) => !locked.has(h.questionId)).slice(0, MAX_QUESTIONS);

    const [mastery, questions, mocks] = await Promise.all([
        getTopicMastery(userId, topicIds),
        db.question.findMany({
            where: { id: { in: shown.map((h) => h.questionId) } },
            select: {
                id: true,
                stem: true,
                topic: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        slug: true,
                        unit: { select: { id: true, code: true, subject: { select: { slug: true } } } },
                    },
                },
            },
        }),
        db.mockExam.findMany({
            where: { userId, status: { in: ["FINISHED", "MARKING"] } },
            orderBy: { startedAt: "desc" },
            take: 30,
            select: {
                id: true,
                length: true,
                status: true,
                startedAt: true,
                marksAwarded: true,
                totalMarks: true,
                unit: { select: { code: true, name: true } },
            },
        }),
    ]);

    const byId = new Map(questions.map((q) => [q.id, q]));
    const questionDocs: SearchDoc[] = shown.flatMap((h) => {
        const q = byId.get(h.questionId);
        if (!q) return [];
        const t = q.topic;
        const topicHref = `/subjects/${t.unit.subject.slug}/${t.unit.code.toLowerCase()}/${t.slug}`;
        const open = openIds.has(q.id);
        return [
            {
                kind: "question" as const,
                id: `q:${q.id}`,
                href: open ? `/mistakes?unit=${t.unit.id}#q-${q.id}` : topicHref,
                name: plainSnippet(q.stem, 140),
                code: "",
                context: `${t.unit.code} ${t.code} ${t.name} · last ${h.lastMarks}/${h.lastMax}${open ? " · open mistake" : ""}`,
                keywords: open ? ["mistake", "wrong"] : [],
                action: { label: "Practise topic", href: `/practice?topic=${t.id}` },
            },
        ];
    });

    const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: APP_TIME_ZONE });
    const mockDocs: SearchDoc[] = mocks.map((m) => {
        const label = MOCK_LENGTH_LABEL[m.length as MockLength] ?? "Paper";
        const finished = m.status === "FINISHED" && m.marksAwarded !== null;
        const grade = finished ? indicativeGrade(m.marksAwarded!, m.totalMarks) : null;
        return {
            kind: "mock",
            id: `mock:${m.id}`,
            href: `/mock/${m.id}`,
            name: `${m.unit.code} ${label.toLowerCase()}`,
            code: "",
            context: finished
                ? `${day.format(m.startedAt)} · ${m.marksAwarded}/${m.totalMarks} · grade ${grade}`
                : `${day.format(m.startedAt)} · waiting to be marked`,
            keywords: ["mock", "paper", m.unit.name, ...(grade ? [`grade ${grade}`] : [])],
        };
    });

    return {
        mastery: Object.fromEntries(
            [...mastery].filter(([, m]) => m.attempts > 0).map(([id, m]) => [id, { level: m.level, score: m.score }]),
        ),
        recentTopicIds: topicIds.slice(0, RECENT_TOPICS),
        docs: [...questionDocs, ...mockDocs],
    };
}
