import type { SubjectMinutes } from "@/lib/analytics";
import { formatMinutes } from "./format";

/** Focus time per subject: one horizontal bar each, in the progress colour, with the value as text. */
export function SubjectTime({ rows }: { rows: SubjectMinutes[] }) {
    const max = Math.max(...rows.map((r) => r.minutes), 1);
    return (
        <ul className="space-y-3.5">
            {rows.map((r) => (
                <li key={r.slug ?? "none"}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className={r.slug ? "font-bold" : "font-semibold text-muted-foreground"}>{r.name}</span>
                        <span className="num shrink-0 text-[0.9375rem]">{formatMinutes(r.minutes)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-track" aria-hidden>
                        <div
                            className={
                                r.slug ? "h-full rounded-full bg-progress" : "h-full rounded-full bg-border-strong"
                            }
                            style={{ width: `${Math.max(2, (r.minutes / max) * 100)}%` }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}
