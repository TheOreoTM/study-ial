// Pure question selection for a practice session (unit-tested in select.test.ts).

export type Candidate = { id: string };
/** Latest result per question as a 0–1 share of marks; absent = never attempted. */
export type History = Map<string, number>;

export const DEFAULT_COUNT = 10;
export const MAX_COUNT = 30;

export function parseCount(raw: string | string[] | undefined) {
    const n = Number.parseInt(Array.isArray(raw) ? raw[0] : (raw ?? ""), 10);
    if (!Number.isFinite(n)) return DEFAULT_COUNT;
    return Math.min(Math.max(n, 1), MAX_COUNT);
}

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Picks `count` questions: never-attempted first, then the ones answered worst (latest attempt),
 * with ties broken randomly. The chosen set is shuffled so topics and types interleave.
 */
export function selectQuestions<T extends Candidate>(
    candidates: T[],
    history: History,
    count: number,
    rng: () => number = Math.random,
): T[] {
    const keyed = shuffle(candidates, rng).map((q) => ({ q, score: history.get(q.id) ?? -1 }));
    // Stable sort keeps the random order within equal scores.
    keyed.sort((a, b) => a.score - b.score);
    return shuffle(
        keyed.slice(0, count).map((k) => k.q),
        rng,
    );
}
