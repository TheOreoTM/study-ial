import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCS = [
    { type: "QP", short: "QP", label: "Question paper" },
    { type: "MS", short: "MS", label: "Mark scheme" },
    { type: "ER", short: "ER", label: "Examiner report" },
] as const;

/** QP / MS / ER availability for a sitting: a sand pill when the document exists, a muted outline when it doesn't. */
export function DocChips({ types, className }: { types: Set<string> | string[]; className?: string }) {
    const has = (t: string) => (types instanceof Set ? types.has(t) : types.includes(t));
    return (
        <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Documents">
            {DOCS.map((d) => {
                const ok = has(d.type);
                return (
                    <li
                        key={d.type}
                        title={`${d.label}${ok ? "" : " not available"}`}
                        className={cn(
                            "inline-flex h-7 items-center gap-1 rounded-full px-2.5 font-display text-[0.8125rem] font-extrabold",
                            ok ? "bg-muted text-foreground" : "text-muted-foreground shadow-[inset_0_0_0_1.5px_var(--border)]",
                        )}
                    >
                        {ok ? <Check className="size-3.5 text-success" aria-hidden /> : <Minus className="size-3.5" aria-hidden />}
                        {d.short}
                        <span className="sr-only">{ok ? `: ${d.label} available` : `: no ${d.label.toLowerCase()}`}</span>
                    </li>
                );
            })}
        </ul>
    );
}
