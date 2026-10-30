"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sessionOptions, upcomingExamSessions } from "./exam-sessions";
import type { PickerUnit, UnitChoice } from "./types";

const NOT_SURE = "none";

/** Per-unit exam session selects ("Not sure yet" → null), with a shortcut to set every unit at once. */
export function ExamSessionPicker({
    units,
    choices,
    onChange,
    today,
}: {
    /** The chosen units, in display order */
    units: PickerUnit[];
    choices: UnitChoice[];
    onChange: (choices: UnitChoice[]) => void;
    /** ISO date for "today" — passed from the server so SSR and the client agree */
    today: string;
}) {
    const todayDate = new Date(today);
    const dateFor = new Map(choices.map((c) => [c.unitId, c.examDate]));

    function set(unitId: string, value: string) {
        const examDate = value === NOT_SURE ? null : value;
        onChange(choices.map((c) => (c.unitId === unitId ? { ...c, examDate } : c)));
    }

    return (
        <div className="flex flex-col gap-4">
            {units.length > 1 && (
                <div className="flex flex-col gap-3 rounded-lg bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
                    <Label htmlFor="exam-all" className="leading-snug">
                        Sitting everything in the same session?
                    </Label>
                    <Select
                        value=""
                        onValueChange={(v) =>
                            onChange(choices.map((c) => ({ ...c, examDate: v === NOT_SURE ? null : v })))
                        }
                    >
                        <SelectTrigger id="exam-all" className="w-full sm:w-60">
                            <SelectValue placeholder="Set all units…" />
                        </SelectTrigger>
                        <SelectContent>
                            {upcomingExamSessions(todayDate).map((s) => (
                                <SelectItem key={s.id} value={s.date}>
                                    {s.label}
                                </SelectItem>
                            ))}
                            <SelectItem value={NOT_SURE}>Not sure yet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <ul className="flex flex-col gap-2.5">
                {units.map((u) => {
                    const current = dateFor.get(u.id) ?? null;
                    const id = `exam-${u.id}`;
                    return (
                        <li
                            key={u.id}
                            className="flex flex-col gap-3 rounded-lg bg-card px-4 py-3.5 shadow-[inset_0_0_0_1.5px_var(--border)] sm:flex-row sm:items-center sm:gap-4"
                        >
                            <Label htmlFor={id} className="min-w-0 flex-1 items-center gap-3 leading-snug">
                                <span className="shrink-0 rounded-[10px] bg-selected px-2 py-0.5 font-display text-sm font-extrabold text-selected-foreground">
                                    {u.code}
                                </span>
                                <span className="min-w-0 font-semibold">{u.name}</span>
                            </Label>
                            <Select value={current ?? NOT_SURE} onValueChange={(v) => set(u.id, v)}>
                                <SelectTrigger id={id} className="w-full sm:w-60">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessionOptions(todayDate, current).map((s) => (
                                        <SelectItem key={s.id} value={s.date}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value={NOT_SURE}>Not sure yet</SelectItem>
                                </SelectContent>
                            </Select>
                        </li>
                    );
                })}
            </ul>
            <p className="text-sm text-muted-foreground">
                We use approximate dates (mid-January, early June, late October) to pace your study plan. You can change
                these any time in Settings.
            </p>
        </div>
    );
}
