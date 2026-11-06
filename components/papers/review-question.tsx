"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RegionImage } from "@/components/papers/region-image";
import { saveQuestion } from "@/app/(app)/papers/actions";
import { cn } from "@/lib/utils";

export type ReviewQuestion = {
    id: string;
    number: string;
    depth: number;
    stem: string;
    marks: number;
    page: number | null;
    bbox: number[];
    figures: { page: number; bbox: number[] }[];
    edited: boolean;
    issues: string[];
};

const pct = (v: number) => Math.round(v * 1000) / 10;

export function ReviewQuestionEditor({ q, paperId, pageCount, preview }: { q: ReviewQuestion; paperId: string; pageCount: number; preview: React.ReactNode }) {
    const router = useRouter();
    const [stem, setStem] = useState(q.stem);
    const [marks, setMarks] = useState(String(q.marks));
    const [page, setPage] = useState(q.page ?? 1);
    const [top, setTop] = useState(q.bbox[1] ?? 0);
    const [bottom, setBottom] = useState(q.bbox[3] ?? 0.2);
    const [keep, setKeep] = useState(q.figures.map((_, i) => i));
    const [add, setAdd] = useState<{ page: number; bbox: number[] }[]>([]);
    const [pending, start] = useTransition();
    const [saved, setSaved] = useState(false);
    const bbox = [0.04, Math.min(top, bottom - 0.01), 0.96, Math.max(bottom, top + 0.01)];
    const pageSrc = (p: number) => `/api/papers/pages/${paperId}/${p}`;

    const save = () =>
        start(async () => {
            const m = Number.parseInt(marks, 10);
            const res = await saveQuestion({
                questionId: q.id,
                stem,
                marks: Number.isFinite(m) ? m : 0,
                page,
                bbox,
                keepFigures: keep,
                addFigures: add.map((f) => ({ page: f.page, bbox: f.bbox })),
            });
            if (!res.ok) toast.error(res.error);
            else {
                setSaved(true);
                setAdd([]);
                router.refresh();
            }
        });

    return (
        <article
            id={`q-${q.number}`}
            className={cn("scroll-mt-24 rounded-xl border bg-card p-4 shadow-card sm:p-5", q.depth > 0 && "sm:ml-6", q.depth > 1 && "sm:ml-12")}
        >
            <header className="mb-3 flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-extrabold">{q.number}</h3>
                {q.edited && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold">Edited</span>}
                {q.issues.map((i) => (
                    <span key={i} className="rounded-full bg-mastery-developing-pale px-2.5 py-0.5 text-xs font-bold text-mastery-developing-text">
                        {i}
                    </span>
                ))}
            </header>
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                    <RegionImage src={pageSrc(page)} bbox={bbox} alt={`Question ${q.number} on page ${page}`} className="border" />
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor={`p-${q.id}`}>Page</Label>
                            <Input id={`p-${q.id}`} type="number" min={1} max={pageCount} value={page} onChange={(e) => setPage(Math.min(pageCount, Math.max(1, Number(e.target.value) || 1)))} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`t-${q.id}`}>Top %</Label>
                            <Input id={`t-${q.id}`} type="number" step={0.5} min={0} max={100} value={pct(top)} onChange={(e) => setTop(Math.min(1, Math.max(0, Number(e.target.value) / 100)))} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`b-${q.id}`}>Bottom %</Label>
                            <Input id={`b-${q.id}`} type="number" step={0.5} min={0} max={100} value={pct(bottom)} onChange={(e) => setBottom(Math.min(1, Math.max(0, Number(e.target.value) / 100)))} />
                        </div>
                    </div>
                    {(q.figures.length > 0 || add.length > 0) && (
                        <ul className="grid grid-cols-2 gap-2" aria-label="Figures">
                            {q.figures.map((f, i) => (
                                <li key={`f${i}`} className={cn("rounded-md border p-1", !keep.includes(i) && "opacity-40")}>
                                    {/* eslint-disable-next-line @next/next/no-img-element -- private figure crop */}
                                    <img src={`/api/papers/figures/${q.id}/${i}`} alt={`Figure ${i + 1} of ${q.number}`} className="w-full rounded" />
                                    <Button
                                        type="button"
                                        size="xs"
                                        variant="ghost"
                                        className="mt-1 w-full"
                                        onClick={() => setKeep(keep.includes(i) ? keep.filter((k) => k !== i) : [...keep, i])}
                                    >
                                        <Trash2 aria-hidden />
                                        {keep.includes(i) ? "Remove" : "Keep"}
                                    </Button>
                                </li>
                            ))}
                            {add.map((f, i) => (
                                <li key={`a${i}`} className="rounded-md border border-dashed p-1">
                                    <RegionImage src={pageSrc(f.page)} bbox={f.bbox} alt="New figure" />
                                    <p className="mt-1 text-center text-xs text-muted-foreground">New, cropped when you save</p>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Button type="button" size="sm" variant="ghost" onClick={() => setAdd([...add, { page, bbox }])} disabled={add.length >= 4}>
                        <ImagePlus aria-hidden />
                        Use this crop as a figure
                    </Button>
                </div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor={`s-${q.id}`}>Text (Markdown, $LaTeX$, \ce{"{}"} for chemistry)</Label>
                        <Textarea id={`s-${q.id}`} rows={6} value={stem} onChange={(e) => setStem(e.target.value)} className="font-mono text-sm" />
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-lg bg-muted p-3 text-[0.9375rem]">{stem === q.stem ? preview : <p className="text-sm text-muted-foreground">Save to preview the formatted text.</p>}</div>
                    <div className="flex items-end gap-3">
                        <div className="w-28 space-y-1">
                            <Label htmlFor={`m-${q.id}`}>Marks</Label>
                            <Input id={`m-${q.id}`} type="number" min={0} max={100} value={marks} onChange={(e) => setMarks(e.target.value)} />
                        </div>
                        <Button type="button" variant="outline" onClick={save} disabled={pending}>
                            {pending ? <Loader2 className="animate-spin" aria-hidden /> : saved ? <Check aria-hidden /> : null}
                            Save {q.number}
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}
