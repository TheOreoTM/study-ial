import "server-only";
import { db } from "@/lib/db";
import { revisionPriority } from "@/lib/mastery";
import { getStudentTopicIds, getTopicMastery } from "@/lib/queries/mastery";
import { selectQuestions } from "./select";
import type { PracticeQuestion, SessionTopic } from "./types";

export type PracticeMode =
    { kind: "topic"; topicId: string } | { kind: "unit"; unitId: string } | { kind: "weak"; unitId?: string };

export type PracticeSession = {
    title: string;
    description: string;
    back: { href: string; label: string };
    questions: PracticeQuestion[];
    topics: SessionTopic[];
};

type SearchParams = { [key: string]: string | string[] | undefined };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export function parseMode(sp: SearchParams): PracticeMode | null {
    const topic = first(sp.topic);
    const unit = first(sp.unit);
    if (first(sp.mode) === "weak") return { kind: "weak", unitId: unit };
    if (topic) return { kind: "topic", topicId: topic };
    if (unit) return { kind: "unit", unitId: unit };
    return null;
}

/** How many of the weakest topics a "weak topics" session draws from (more if they lack questions). */
const WEAK_TOPIC_COUNT = 5;

/** Resolves the mode to topics, then picks questions. Returns null when the topic/unit doesn't exist. */
export async function buildSession(userId: string, mode: PracticeMode, count: number): Promise<PracticeSession | null> {
    let topicIds: string[];
    let title: string;
    let description: string;
    let back: PracticeSession["back"];

    if (mode.kind === "topic") {
        const topic = await db.topic.findUnique({
            where: { id: mode.topicId },
            include: { unit: { include: { subject: true } } },
        });
        if (!topic) return null;
        topicIds = [topic.id];
        title = topic.name;
        description = `${topic.unit.code} · Topic ${topic.code}`;
        back = {
            href: `/subjects/${topic.unit.subject.slug}/${topic.unit.code.toLowerCase()}/${topic.slug}`,
            label: "Back to topic",
        };
    } else if (mode.kind === "unit") {
        const unit = await db.unit.findUnique({
            where: { id: mode.unitId },
            include: { subject: true, topics: { select: { id: true } } },
        });
        if (!unit) return null;
        topicIds = unit.topics.map((t) => t.id);
        title = unit.name;
        description = `${unit.subject.name} · ${unit.code} — mixed topics`;
        back = { href: `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`, label: "Back to unit" };
    } else {
        let scope: string[];
        if (mode.unitId) {
            const unit = await db.unit.findUnique({
                where: { id: mode.unitId },
                include: { subject: true, topics: { select: { id: true } } },
            });
            if (!unit) return null;
            scope = unit.topics.map((t) => t.id);
            description = `${unit.code} · your lowest-mastery topics in this unit`;
            back = { href: `/subjects/${unit.subject.slug}/${unit.code.toLowerCase()}`, label: "Back to unit" };
        } else {
            scope = await getStudentTopicIds(userId);
            description = "Your lowest-mastery topics across your units";
            back = { href: "/progress", label: "View progress" };
        }
        title = "Weak topics";
        topicIds = await weakestTopics(userId, scope, count);
    }

    const candidates = await db.question.findMany({
        where: { topicId: { in: topicIds }, status: "PUBLISHED" },
        select: {
            id: true,
            type: true,
            difficulty: true,
            marks: true,
            stem: true,
            topicId: true,
            options: { select: { id: true, label: true, text: true }, orderBy: { label: "asc" } },
        },
    });

    const latest = await db.attempt.findMany({
        where: { userId, questionId: { in: candidates.map((q) => q.id) } },
        select: { questionId: true, marksAwarded: true, maxMarks: true },
        orderBy: { createdAt: "desc" },
    });
    const history = new Map<string, number>();
    for (const a of latest) {
        if (!history.has(a.questionId)) history.set(a.questionId, a.maxMarks > 0 ? a.marksAwarded / a.maxMarks : 0);
    }

    const questions = selectQuestions(candidates, history, count);
    const usedTopicIds = [...new Set(questions.map((q) => q.topicId))];

    const [topicRows, mastery] = await Promise.all([
        db.topic.findMany({
            where: { id: { in: usedTopicIds } },
            include: { unit: { select: { code: true, subject: { select: { slug: true } } } } },
            orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
        }),
        getTopicMastery(userId, usedTopicIds),
    ]);

    const topics: SessionTopic[] = topicRows.map((t) => ({
        id: t.id,
        code: t.code,
        name: t.name,
        unitCode: t.unit.code,
        href: `/subjects/${t.unit.subject.slug}/${t.unit.code.toLowerCase()}/${t.slug}`,
        before: mastery.get(t.id)!,
    }));

    return { title, description, back, questions, topics };
}

/** Highest revision-priority topics that have published questions, enough to fill `count` questions. */
async function weakestTopics(userId: string, scope: string[], count: number) {
    if (scope.length === 0) return [];
    const counts = await db.question.groupBy({
        by: ["topicId"],
        where: { topicId: { in: scope }, status: "PUBLISHED" },
        _count: { _all: true },
    });
    const withQuestions = counts.filter((c) => c._count._all > 0);
    const mastery = await getTopicMastery(
        userId,
        withQuestions.map((c) => c.topicId),
    );
    const now = new Date();
    const ranked = withQuestions
        .map((c) => ({ id: c.topicId, n: c._count._all, p: revisionPriority(mastery.get(c.topicId)!, now) }))
        .sort((a, b) => b.p - a.p);

    const picked: string[] = [];
    let available = 0;
    for (const t of ranked) {
        if (picked.length >= WEAK_TOPIC_COUNT && available >= count) break;
        picked.push(t.id);
        available += t.n;
    }
    return picked;
}
