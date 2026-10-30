/** Unit code prefix of a past-paper title, e.g. "WPH11 timed past paper #2" → "WPH11" (see lib/planner.ts titles). */
export function unitCodeFromTitle(title: string): string | null {
    return /^([A-Z]{2,5}\d{2})\b/.exec(title)?.[1] ?? null;
}
