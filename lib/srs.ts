// Flashcard spaced repetition: a small SM-2 variant with three grades. Pure functions (unit-tested); DB access lives
// in lib/queries/flashcards.ts. Days are "YYYY-MM-DD" keys in the app's time zone (lib/time.ts), like plan tasks.

import { addDays } from "@/components/focus/stats-math";

export type Grade = "again" | "good" | "easy";
export const GRADES: readonly Grade[] = ["again", "good", "easy"];

export type CardState = {
    intervalDays: number;
    ease: number;
    reps: number;
    lapses: number;
    /** "YYYY-MM-DD" */
    dueDay: string;
};

export const START_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_INTERVAL_DAYS = 180;
/** New cards a student starts per day, so a big deck never becomes a wall of due cards. */
export const NEW_CARDS_PER_DAY = 10;

/**
 * The next state after grading a card on `today`. `prev` is null for a card seen for the first time.
 * "Again" keeps the card due today (the session shows it once more) and, for a learnt card, counts a lapse.
 */
export function scheduleCard(prev: CardState | null, grade: Grade, today: string): CardState {
    const ease0 = prev?.ease ?? START_EASE;
    const reps0 = prev?.reps ?? 0;
    const lapses0 = prev?.lapses ?? 0;
    const interval0 = prev?.intervalDays ?? 0;

    if (grade === "again") {
        return {
            intervalDays: 0,
            ease: reps0 > 0 ? Math.max(MIN_EASE, ease0 - 0.2) : ease0,
            reps: 0,
            lapses: reps0 > 0 ? lapses0 + 1 : lapses0,
            dueDay: today,
        };
    }

    const ease = grade === "easy" ? ease0 + 0.15 : ease0;
    let interval: number;
    if (reps0 === 0) interval = grade === "easy" ? 4 : 1;
    else if (reps0 === 1) interval = grade === "easy" ? 6 : 3;
    else interval = Math.round(interval0 * ease * (grade === "easy" ? 1.3 : 1));
    // Always move forward by at least a day, and never schedule further out than the cap.
    interval = Math.min(MAX_INTERVAL_DAYS, Math.max(interval, interval0 + 1));

    return { intervalDays: interval, ease, reps: reps0 + 1, lapses: lapses0, dueDay: addDays(today, interval) };
}

export type QueueCard = { id: string; topicId: string };

/**
 * Today's review order: every due card (most overdue first), then new cards from the highest-priority topics
 * (weakest first, see `revisionPriority`) up to the daily cap minus new cards already started today.
 */
export function buildQueue({
    due,
    unseen,
    topicPriority,
    introducedToday,
    newLimit = NEW_CARDS_PER_DAY,
}: {
    due: (QueueCard & { dueDay: string })[];
    /** Cards never reviewed, in deck order */
    unseen: QueueCard[];
    topicPriority: Map<string, number>;
    introducedToday: number;
    newLimit?: number;
}): { due: string[]; fresh: string[] } {
    const dueIds = [...due].sort((a, b) => a.dueDay.localeCompare(b.dueDay)).map((c) => c.id);
    const room = Math.max(0, newLimit - introducedToday);
    const fresh = unseen
        .map((c, i) => ({ c, i, p: topicPriority.get(c.topicId) ?? 0 }))
        .sort((a, b) => b.p - a.p || a.i - b.i)
        .slice(0, room)
        .map(({ c }) => c.id);
    return { due: dueIds, fresh };
}

/** Days from `today` until `day` (negative when overdue). */
export function daysBetween(today: string, day: string) {
    return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}
