"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateForTopic } from "@/app/(app)/admin/generate/actions";

type Unit = { code: string; name: string; subject: string; topics: { id: string; code: string; name: string }[] };

const select =
    "h-11 w-full rounded-md border-[1.5px] border-border-strong bg-card px-3 text-base hover:border-foreground/60 focus-visible:border-ring focus-visible:outline-3 focus-visible:outline-ring/25";

export function GenerateForm({ units, enabled }: { units: Unit[]; enabled: boolean }) {
    const router = useRouter();
    const [unit, setUnit] = useState(units[0]?.code ?? "");
    const topics = units.find((u) => u.code === unit)?.topics ?? [];
    const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
    const [count, setCount] = useState(3);
    const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "MIXED">("MIXED");
    const [types, setTypes] = useState<("MCQ" | "SHORT" | "CALCULATION" | "LONG")[]>(["SHORT", "CALCULATION"]);
    const [pending, start] = useTransition();

    return (
        <form
            className="grid gap-4 rounded-xl border bg-card p-5 shadow-card sm:grid-cols-2"
            onSubmit={(e) => {
                e.preventDefault();
                start(async () => {
                    const res = await generateForTopic({ topicId, count, difficulty, types });
                    if (!res.ok) toast.error(res.error);
                    else {
                        toast.success(`${res.created} drafts written${res.flagged ? `, ${res.flagged} flagged for a closer look` : ""}`);
                        router.refresh();
                    }
                });
            }}
        >
            <div className="space-y-1.5">
                <Label htmlFor="g-unit">Unit</Label>
                <select
                    id="g-unit"
                    className={select}
                    value={unit}
                    onChange={(e) => {
                        setUnit(e.target.value);
                        setTopicId(units.find((u) => u.code === e.target.value)?.topics[0]?.id ?? "");
                    }}
                >
                    {units.map((u) => (
                        <option key={u.code} value={u.code}>
                            {u.code} · {u.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="g-topic">Topic</Label>
                <select id="g-topic" className={select} value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                    {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.code} {t.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="g-count">How many</Label>
                <select id="g-count" className={select} value={count} onChange={(e) => setCount(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n}>{n}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="g-diff">Difficulty</Label>
                <select id="g-diff" className={select} value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}>
                    <option value="MIXED">Mixed</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
            </div>
            <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-bold">Types</legend>
                <div className="flex flex-wrap gap-2">
                    {(["MCQ", "SHORT", "CALCULATION", "LONG"] as const).map((t) => (
                        <label key={t} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-muted px-4 font-bold">
                            <input
                                type="checkbox"
                                checked={types.includes(t)}
                                onChange={() => setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t])}
                                className="size-4 accent-[var(--progress)]"
                            />
                            {t === "MCQ" ? "Multiple choice" : t.charAt(0) + t.slice(1).toLowerCase()}
                        </label>
                    ))}
                </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                <Button type="submit" disabled={!enabled || pending || !topicId || types.length === 0}>
                    {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />}
                    {pending ? "Writing and checking…" : "Generate drafts"}
                </Button>
                <p className="text-sm text-muted-foreground">
                    {enabled ? "Each question is solved again by a second model and compared with past papers." : "Needs OPENROUTER_API_KEY."}
                </p>
            </div>
        </form>
    );
}
