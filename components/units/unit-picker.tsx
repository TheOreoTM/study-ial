"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { PickerSubject } from "./types";

/**
 * Two-level multi-select: toggle the subjects you take, then tick the units within them.
 * Units without topics yet are still selectable but marked "coming soon".
 */
export function UnitPicker({
    subjects,
    selectedIds,
    onChange,
}: {
    subjects: PickerSubject[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const selected = new Set(selectedIds);
    const [openSubjects, setOpenSubjects] = useState<Set<string>>(
        () =>
            new Set(
                subjects
                    .filter((s) => subjects.length === 1 || s.units.some((u) => selected.has(u.id)))
                    .map((s) => s.id),
            ),
    );

    function toggleSubject(subject: PickerSubject) {
        const next = new Set(openSubjects);
        if (next.has(subject.id)) {
            next.delete(subject.id);
            const unitIds = new Set(subject.units.map((u) => u.id));
            onChange(selectedIds.filter((id) => !unitIds.has(id)));
        } else {
            next.add(subject.id);
        }
        setOpenSubjects(next);
    }

    function toggleUnit(id: string, checked: boolean) {
        onChange(checked ? [...selectedIds, id] : selectedIds.filter((x) => x !== id));
    }

    return (
        <div className="flex flex-col gap-6">
            <fieldset>
                <legend className="mb-3 text-sm font-medium">Subjects</legend>
                <div className="flex flex-wrap gap-2">
                    {subjects.map((s) => {
                        const on = openSubjects.has(s.id);
                        return (
                            <button
                                key={s.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => toggleSubject(s)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                    on
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                {on && <Check className="size-3.5" aria-hidden />}
                                {s.name}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {subjects
                .filter((s) => openSubjects.has(s.id))
                .map((s) => {
                    const count = s.units.filter((u) => selected.has(u.id)).length;
                    return (
                        <fieldset key={s.id} className="min-w-0">
                            <legend className="mb-3 flex w-full items-baseline justify-between gap-2 text-sm font-medium">
                                <span>{s.name} units</span>
                                <span className="text-xs font-normal text-muted-foreground">
                                    {count} selected
                                </span>
                            </legend>
                            {s.units.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No units yet — coming soon.</p>
                            ) : (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {s.units.map((u) => {
                                        const checked = selected.has(u.id);
                                        const inputId = `unit-${u.id}`;
                                        return (
                                            <label
                                                key={u.id}
                                                htmlFor={inputId}
                                                className={cn(
                                                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                                                    checked ? "border-primary bg-primary/5" : "hover:bg-muted/60",
                                                )}
                                            >
                                                <Checkbox
                                                    id={inputId}
                                                    checked={checked}
                                                    onCheckedChange={(v) => toggleUnit(u.id, v === true)}
                                                    className="mt-0.5"
                                                />
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            {u.code}
                                                        </span>
                                                        {u.topicCount === 0 && (
                                                            <Badge variant="secondary" className="text-[0.7rem]">
                                                                Coming soon
                                                            </Badge>
                                                        )}
                                                    </span>
                                                    <span className="mt-0.5 block text-sm leading-snug font-medium">
                                                        {u.name}
                                                    </span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </fieldset>
                    );
                })}
        </div>
    );
}
