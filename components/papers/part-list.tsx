import Link from "next/link";
import { SERIES_LABEL, type Series } from "@/lib/papers/filename";
import { cn } from "@/lib/utils";

export type PartListItem = {
    id: string;
    number: string;
    marks: number;
    sittingId: string;
    unitCode: string;
    year: number | null;
    series: string | null;
    title: string | null;
    ownerId: string | null;
    latest?: { marks: number; max: number } | null;
    note?: string;
};

/** A list of past-paper parts from different papers, each linking into attempt mode. */
export function PartList({ items }: { items: PartListItem[] }) {
    return (
        <ul className="divide-y rounded-xl border bg-card shadow-card">
            {items.map((p) => {
                const f = p.latest && p.latest.max > 0 ? p.latest.marks / p.latest.max : null;
                const where = p.ownerId
                    ? (p.title ?? "Your upload")
                    : `${p.series ? SERIES_LABEL[p.series.toLowerCase() as Series] : ""} ${p.year ?? ""}`.trim();
                return (
                    <li key={p.id}>
                        <Link
                            href={`/papers/${p.sittingId}/attempt?part=${p.id}`}
                            className="flex min-h-14 items-center gap-3 px-4 py-2.5 hover:bg-accent focus-visible:outline-3 focus-visible:outline-ring"
                        >
                            <span className="w-16 shrink-0 rounded-[9px] bg-selected px-2 py-0.5 text-center font-display text-[0.8125rem] font-extrabold text-selected-foreground">
                                {p.unitCode}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold">
                                    {where} · Q{p.number}
                                </span>
                                {p.note && <span className="block text-sm text-muted-foreground">{p.note}</span>}
                            </span>
                            <span
                                className={cn(
                                    "num shrink-0 rounded-full px-3 py-0.5 font-display font-extrabold",
                                    f === null ? "bg-muted" : f >= 1 ? "bg-mastery-strong text-on-mastery" : f > 0 ? "bg-mastery-developing text-on-mastery" : "bg-mastery-weak text-on-mastery",
                                )}
                            >
                                {p.latest ? `${p.latest.marks}/${p.latest.max}` : `${p.marks} mk`}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
