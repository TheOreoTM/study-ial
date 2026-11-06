// The mistake notebook: questions whose latest attempt lost marks. Pure functions (unit-tested); the DB read lives in
// lib/queries/mistakes.ts.
//
// A question is "open" while the student's most recent attempt at it scored less than full marks. Getting full
// marks on it once closes it, because the latest attempt is what mastery trusts too.

/** One row per question the student has attempted (already aggregated by the query). */
export type QuestionHistory = {
    questionId: string;
    topicId: string;
    /** Latest attempt */
    lastMarks: number;
    lastMax: number;
    lastAt: Date;
    /** All attempts at this question, and how many of them lost marks */
    attempts: number;
    misses: number;
};

export type Mistake = QuestionHistory & {
    /** 0–1 share of marks on the latest attempt */
    lastShare: number;
};

export function isMistake(h: Pick<QuestionHistory, "lastMarks" | "lastMax">) {
    return h.lastMax > 0 && h.lastMarks < h.lastMax;
}

/**
 * Open mistakes. `order: "recent"` lists the newest first (the notebook page); `order: "redo"` puts the oldest
 * first, so a redo session clears the mistakes that have waited longest, with repeat offenders ahead on ties.
 */
export function openMistakes(history: QuestionHistory[], order: "recent" | "redo" = "recent"): Mistake[] {
    const open = history.filter(isMistake).map((h) => ({ ...h, lastShare: h.lastMarks / h.lastMax }));
    return open.sort((a, b) => {
        const t = a.lastAt.getTime() - b.lastAt.getTime();
        if (order === "recent") return -t || a.questionId.localeCompare(b.questionId);
        return t || b.misses - a.misses || a.questionId.localeCompare(b.questionId);
    });
}

/** Picks up to `count` mistakes for a redo session, oldest first. */
export function pickRedo(history: QuestionHistory[], count: number): Mistake[] {
    return openMistakes(history, "redo").slice(0, Math.max(0, count));
}

/** Groups mistakes by topic, keeping each group's order and ordering groups by their first entry. */
export function groupByTopic<T extends { topicId: string }>(items: T[]): { topicId: string; items: T[] }[] {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        const list = groups.get(item.topicId);
        if (list) list.push(item);
        else groups.set(item.topicId, [item]);
    }
    return [...groups].map(([topicId, list]) => ({ topicId, items: list }));
}

/** "Missed twice", "Missed 3 times" — only when it's been missed more than once. */
export function missLabel(misses: number) {
    if (misses <= 1) return null;
    return misses === 2 ? "Missed twice" : `Missed ${misses} times`;
}
