import { daysBetween } from "@/lib/srs";

/** "today", "tomorrow", "in 3 days" or "on 12 Nov" for a "YYYY-MM-DD" due day. */
export function formatDueDay(day: string, today: string) {
    const d = daysBetween(today, day);
    if (d <= 0) return "today";
    if (d === 1) return "tomorrow";
    if (d < 7) return `in ${d} days`;
    return `on ${new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}`;
}
