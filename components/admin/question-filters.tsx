"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TYPE_LABELS } from "@/app/(app)/admin/validation";
import type { CurriculumTree } from "@/app/(app)/admin/queries";

type Values = {
    subject?: string;
    unit?: string;
    topic?: string;
    type?: string;
    difficulty?: string;
    status?: string;
    q?: string;
};

const ALL = "__all";

export function QuestionFilters({ tree, values }: { tree: CurriculumTree; values: Values }) {
    const router = useRouter();
    const pathname = usePathname();
    const [q, setQ] = useState(values.q ?? "");

    const go = (next: Values) => {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
        const s = params.toString();
        router.push(s ? `${pathname}?${s}` : pathname);
    };
    const set = (patch: Values) => go({ ...values, q, ...patch });

    // Cascade: subject narrows units, unit narrows topics.
    const unitSubject = values.unit ? tree.find((s) => s.units.some((u) => u.code === values.unit)) : undefined;
    const subjectSlug = values.subject ?? unitSubject?.slug;
    const units = tree.filter((s) => !subjectSlug || s.slug === subjectSlug).flatMap((s) => s.units);
    const unit = units.find((u) => u.code === values.unit);

    return (
        <form
            role="search"
            className="mb-5 grid grid-cols-2 gap-x-2.5 gap-y-3 rounded-xl bg-muted p-4 sm:grid-cols-4 lg:grid-cols-8"
            onSubmit={(e) => {
                e.preventDefault();
                set({ q });
            }}
        >
            <div className="col-span-2 flex flex-col gap-1 sm:col-span-4 lg:col-span-2">
                <Label htmlFor="filter-q" className="text-xs text-muted-foreground">
                    Search stem
                </Label>
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="filter-q"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Text, seedKey or source…"
                        className="h-9 pl-8"
                    />
                </div>
            </div>
            <FilterSelect
                id="filter-subject"
                label="Subject"
                value={subjectSlug}
                onChange={(v) => set({ subject: v, unit: undefined, topic: undefined })}
                options={tree.map((s) => ({ value: s.slug, label: s.name }))}
            />
            <FilterSelect
                id="filter-unit"
                label="Unit"
                value={values.unit}
                onChange={(v) => set({ unit: v, topic: undefined })}
                options={units.map((u) => ({ value: u.code, label: `${u.code} · ${u.name}` }))}
            />
            <FilterSelect
                id="filter-topic"
                label="Topic"
                value={values.topic}
                disabled={!unit}
                placeholder={unit ? "All" : "Pick a unit"}
                onChange={(v) => set({ topic: v })}
                options={(unit?.topics ?? []).map((t) => ({ value: t.id, label: `${t.code} ${t.name}` }))}
            />
            <FilterSelect
                id="filter-type"
                label="Type"
                value={values.type}
                onChange={(v) => set({ type: v })}
                options={Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <FilterSelect
                id="filter-difficulty"
                label="Difficulty"
                value={values.difficulty}
                onChange={(v) => set({ difficulty: v })}
                options={[
                    { value: "EASY", label: "Easy" },
                    { value: "MEDIUM", label: "Medium" },
                    { value: "HARD", label: "Hard" },
                ]}
            />
            <div className="flex items-end gap-1">
                <FilterSelect
                    id="filter-status"
                    label="Status"
                    value={values.status}
                    onChange={(v) => set({ status: v })}
                    options={[
                        { value: "PUBLISHED", label: "Published" },
                        { value: "DRAFT", label: "Draft" },
                    ]}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Clear filters"
                    title="Clear filters"
                    onClick={() => {
                        setQ("");
                        go({});
                    }}
                >
                    <X />
                </Button>
            </div>
        </form>
    );
}

function FilterSelect({
    id,
    label,
    value,
    onChange,
    options,
    disabled,
    placeholder = "All",
}: {
    id: string;
    label: string;
    value?: string;
    onChange: (value: string | undefined) => void;
    options: { value: string; label: string }[];
    disabled?: boolean;
    placeholder?: string;
}) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Label htmlFor={id} className="text-xs text-muted-foreground">
                {label}
            </Label>
            <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)} disabled={disabled}>
                <SelectTrigger id={id} size="sm" className="w-full min-w-0">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-80">
                    <SelectItem value={ALL}>{placeholder === "Pick a unit" ? "All" : placeholder}</SelectItem>
                    {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
