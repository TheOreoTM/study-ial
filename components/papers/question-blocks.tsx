import { Markdown } from "@/components/markdown";
import { RegionImage } from "@/components/papers/region-image";
import type { MarkSchemeEntry } from "@/lib/papers/parse/schema";

type Part = { id: string; number: string; stem: string; page: number | null; bbox: number[]; figures: unknown };

const hasLatex = (s: string) => /\$[^$]+\$/.test(s);

/** The printed question: context parts first (lighter), then this part, as crops of the real page. */
export function QuestionCrops({ qpPaperId, chain, part }: { qpPaperId: string; chain: Part[]; part: Part }) {
    const all = [...chain, part];
    const latex = all.some((p) => hasLatex(p.stem));
    return (
        <div className="space-y-3">
            {all.map((p) => {
                const figures = (p.figures as { page: number; bbox: number[] }[]) ?? [];
                const isPart = p.id === part.id;
                return (
                    <div key={p.id} className={isPart ? "" : "opacity-80"}>
                        {p.page && p.bbox.length === 4 ? (
                            <RegionImage
                                src={`/api/papers/pages/${qpPaperId}/${p.page}`}
                                bbox={p.bbox}
                                alt={`${isPart ? "Question" : "Context for"} ${p.number}, as printed`}
                                className={isPart ? "border shadow-card" : "border"}
                            />
                        ) : (
                            p.stem && <Markdown>{p.stem}</Markdown>
                        )}
                        {/* Figures outside the crop (e.g. on the page before) */}
                        {figures
                            .filter((f) => f.page !== p.page || (p.bbox.length === 4 && (f.bbox[1] < p.bbox[1] || f.bbox[3] > p.bbox[3])))
                            .map((f, i) => (
                                // eslint-disable-next-line @next/next/no-img-element -- private figure crop
                                <img key={i} src={`/api/papers/figures/${p.id}/${i}`} alt={`Figure for ${p.number}`} className="mt-2 w-full rounded-md border" />
                            ))}
                    </div>
                );
            })}
            {all.some((p) => p.stem) && (
                <details className="rounded-lg bg-muted px-4 py-3" open={latex}>
                    <summary className="cursor-pointer text-sm font-bold">Text version</summary>
                    <div className="mt-2 space-y-2 text-[0.9375rem]">
                        {all.map((p) => p.stem && <Markdown key={p.id}>{p.stem}</Markdown>)}
                        {!latex && <p className="text-xs text-muted-foreground">Read from the PDF: maths may be jumbled, so trust the printed question above.</p>}
                    </div>
                </details>
            )}
        </div>
    );
}

/** Mark-scheme rows for the part (crops of the real scheme), mark codes, guidance and examiner comments. */
export function SchemeBlock({
    msPaperId,
    entries,
    guidance,
    examinerNotes,
}: {
    msPaperId: string | null;
    entries: MarkSchemeEntry[];
    guidance: string | null;
    examinerNotes: string | null;
}) {
    if (!msPaperId || entries.length === 0) {
        return (
            <p className="text-muted-foreground">
                No mark scheme is matched to this part. Open the mark scheme beside the paper, or let AI estimate your marks.
            </p>
        );
    }
    return (
        <div className="space-y-3">
            {entries.map((e) => (
                <div key={e.number} className="space-y-2">
                    <p className="text-sm font-bold">
                        {e.number} · {e.points.map((p) => p.code).join(" ")}
                        {e.marks ? ` · ${e.marks} mark${e.marks === 1 ? "" : "s"}` : ""}
                    </p>
                    {e.regions.slice(0, 3).map((r, i) => (
                        <RegionImage key={i} src={`/api/papers/pages/${msPaperId}/${r.page}`} bbox={r.bbox} alt={`Mark scheme for ${e.number}`} className="border" />
                    ))}
                </div>
            ))}
            {guidance && (
                <details className="rounded-lg bg-card px-4 py-3">
                    <summary className="cursor-pointer text-sm font-bold">Marking guidance</summary>
                    <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">{guidance.slice(0, 3000)}</p>
                </details>
            )}
            {examinerNotes && (
                <details className="rounded-lg bg-card px-4 py-3">
                    <summary className="cursor-pointer text-sm font-bold">What examiners noticed</summary>
                    <p className="mt-2 text-sm text-muted-foreground">{examinerNotes.slice(0, 2500)}</p>
                </details>
            )}
        </div>
    );
}
