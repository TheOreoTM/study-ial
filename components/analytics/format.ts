/** "45 min", "2 h", "3 h 20 min" */
export function formatMinutes(min: number) {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** "31 Oct" for a "YYYY-MM-DD" key. */
export function shortDay(key: string) {
    return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
    });
}

export const pct = (x: number) => `${Math.round(x * 100)}%`;
