"use client";

import { useState } from "react";
import { Check } from "lucide-react";
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
        <div className="flex flex-col gap-7">
            <fieldset>
                <legend className="mb-3 font-display text-base font-extrabold">Subjects</legend>
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
                                    "inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-4.5 font-display text-[0.975rem] font-extrabold transition-[background-color,box-shadow,color] duration-200 ease-out-soft outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                    on
                                        ? "bg-selected pl-3.5 text-selected-foreground shadow-[inset_0_0_0_2px_var(--progress)]"
                                        : "bg-card text-foreground shadow-[inset_0_0_0_1.5px_var(--border-strong)] hover:bg-accent",
                                )}
                            >
                                {on && <Check className="size-4" strokeWidth={3} aria-hidden />}
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
                            <legend className="mb-3 flex w-full items-baseline justify-between gap-2">
                                <span className="font-display text-base font-extrabold">{s.name} units</span>
                                <span
                                    className={cn(
                                        "text-sm font-semibold",
                                        count > 0 ? "text-selected-foreground" : "text-muted-foreground",
                                    )}
                                >
                                    <span className="num">{count}</span> selected
                                </span>
                            </legend>
                            {s.units.length === 0 ? (
                                <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                                    No units yet — coming soon.
                                </p>
                            ) : (
                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    {s.units.map((u) => {
                                        const checked = selected.has(u.id);
                                        const inputId = `unit-${u.id}`;
                                        return (
                                            <label
                                                key={u.id}
                                                htmlFor={inputId}
                                                className={cn(
                                                    "flex min-h-[60px] cursor-pointer items-start gap-3 rounded-lg px-4 py-3.5 transition-[background-color,box-shadow] duration-200 ease-out-soft has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                                                    checked
                                                        ? "bg-selected shadow-[inset_0_0_0_2px_var(--progress)]"
                                                        : "bg-card shadow-[inset_0_0_0_1.5px_var(--border)] hover:shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
                                                )}
                                            >
                                                <Checkbox
                                                    id={inputId}
                                                    checked={checked}
                                                    onCheckedChange={(v) => toggleUnit(u.id, v === true)}
                                                    className="mt-0.5 focus-visible:outline-none"
                                                />
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span
                                                            className={cn(
                                                                "rounded-[10px] px-2 py-0.5 font-display text-sm font-extrabold transition-colors duration-200",
                                                                checked
                                                                    ? "bg-progress text-background"
                                                                    : "bg-selected text-selected-foreground",
                                                            )}
                                                        >
                                                            {u.code}
                                                        </span>
                                                        {u.topicCount === 0 && (
                                                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                                                                Coming soon
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="mt-1.5 block leading-snug font-semibold">
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
