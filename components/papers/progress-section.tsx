import Link from "next/link";
import { FileText } from "lucide-react";
import { SERIES_LABEL, type Series } from "@/lib/papers/filename";
import { dueReviewCount, paperProgress } from "@/lib/queries/paper-progress";

/** Past-paper practice on the progress page: marks by unit (30 days), recent timed exams, weakest topics. */
export async function PaperProgressSection({ userId }: { userId: string }) {
    const [p, due] = await Promise.all([paperProgress(userId), dueReviewCount(userId)]);
    if (p.parts === 0 && p.exams.length === 0) return null;
    const pct = (m: number, x: number) => (x ? Math.round((m / x) * 100) : 0);
    return (
        <section aria-labelledby="paper-progress" className="mt-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 id="paper-progress" className="flex items-center gap-2 text-xl">
                    <FileText className="size-5 text-selected-foreground" aria-hidden /> Past papers
                </h2>
                {due > 0 && (
                    <Link href="/papers/review" className="text-sm font-bold text-selected-foreground underline decoration-2 underline-offset-4">
                        {due} question{due === 1 ? "" : "s"} to review
                    </Link>
                )}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 shadow-card">
                    <p className="text-sm font-bold text-muted-foreground">Last 30 days</p>
                    <p className="num font-display text-4xl font-extrabold">{pct(p.marks, p.max)}%</p>
                    <p className="text-muted-foreground">
                        of {p.max} marks across {p.parts} parts, on {p.activeDays} day{p.activeDays === 1 ? "" : "s"}
                    </p>
                    {p.units.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-sm">
                            {p.units.map((u) => (
                                <li key={u.code} className="flex items-center gap-2">
                                    <span className="w-14 font-display font-extrabold">{u.code}</span>
                                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-track">
                                        <span className="block h-full rounded-full bg-progress" style={{ width: `${pct(u.marks, u.max)}%` }} />
                                    </span>
                                    <span className="num w-10 text-right">{pct(u.marks, u.max)}%</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-card">
                    <p className="mb-2 text-sm font-bold text-muted-foreground">Timed exams</p>
                    {p.exams.length === 0 ? (
                        <p className="text-muted-foreground">None yet. Sit a whole paper against the clock from any paper page.</p>
                    ) : (
                        <ul className="space-y-1.5">
                            {p.exams.map((e) => (
                                <li key={e.id}>
                                    <Link href={`/papers/${e.sittingId}/exam/${e.id}`} className="flex justify-between gap-2 hover:underline">
                                        <span className="font-semibold">
                                            {e.sitting.unitCode} {e.sitting.series ? SERIES_LABEL[e.sitting.series.toLowerCase() as Series] : ""} {e.sitting.year}
                                        </span>
                                        <span className="num">
                                            {e.totalMarks !== null ? `${e.totalMarks}/${e.maxMarks}${e.grade ? ` · ${e.grade.toUpperCase()}` : ""}` : "unmarked"}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-card">
                    <p className="mb-2 text-sm font-bold text-muted-foreground">Weakest topics in papers</p>
                    {p.weakest.length === 0 ? (
                        <p className="text-muted-foreground">Answer a few more tagged questions to see these.</p>
                    ) : (
                        <ul className="space-y-1.5">
                            {p.weakest.map((t) => (
                                <li key={t.topicId}>
                                    <Link href={`/papers/topics/${t.topicId}?only=weak`} className="flex justify-between gap-2 hover:underline">
                                        <span className="min-w-0 truncate font-semibold">
                                            {t.unitCode} · {t.name}
                                        </span>
                                        <span className="num shrink-0">{pct(t.share * 100, 100)}%</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}
