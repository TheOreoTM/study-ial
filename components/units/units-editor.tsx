"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamSessionPicker } from "./exam-session-picker";
import { UnitPicker } from "./unit-picker";
import type { PickerSubject, PickerUnit, UnitChoice } from "./types";

export type SaveUnitsAction = (input: { units: UnitChoice[] }) => Promise<{ ok: true } | { ok: false; error: string }>;

/** Selection state shared by onboarding and settings: unit ids in curriculum order + their exam dates. */
export function useUnitChoices(subjects: PickerSubject[], initial: UnitChoice[]) {
    const [choices, setChoices] = useState<UnitChoice[]>(initial);
    const allUnits = useMemo(() => subjects.flatMap((s) => s.units), [subjects]);

    const selectedIds = choices.map((c) => c.unitId);
    const selectedUnits: PickerUnit[] = allUnits.filter((u) => selectedIds.includes(u.id));

    function setSelectedIds(ids: string[]) {
        const prev = new Map(choices.map((c) => [c.unitId, c.examDate]));
        const order = new Map(allUnits.map((u, i) => [u.id, i]));
        const sorted = [...new Set(ids)].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
        setChoices(sorted.map((unitId) => ({ unitId, examDate: prev.get(unitId) ?? null })));
    }

    return { choices, setChoices, selectedIds, selectedUnits, setSelectedIds };
}

/** Settings variant: unit picker and exam sessions on one form with a save button. */
export function UnitsEditor({
    subjects,
    initial,
    today,
    action,
}: {
    subjects: PickerSubject[];
    initial: UnitChoice[];
    today: string;
    action: SaveUnitsAction;
}) {
    const { choices, setChoices, selectedIds, selectedUnits, setSelectedIds } = useUnitChoices(subjects, initial);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const dirty = JSON.stringify(choices) !== JSON.stringify(initial);

    function save() {
        setError(null);
        if (choices.length === 0) {
            setError("Keep at least one unit.");
            return;
        }
        startTransition(async () => {
            const res = await action({ units: choices });
            if (res.ok) toast.success("Units saved");
            else setError(res.error);
        });
    }

    return (
        <div className="flex flex-col gap-8">
            <UnitPicker subjects={subjects} selectedIds={selectedIds} onChange={setSelectedIds} />
            {selectedUnits.length > 0 && (
                <section aria-labelledby="exam-sessions-heading">
                    <h3 id="exam-sessions-heading" className="mb-3 text-sm font-medium">
                        Exam sessions
                    </h3>
                    <ExamSessionPicker units={selectedUnits} choices={choices} onChange={setChoices} today={today} />
                </section>
            )}
            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                {error && (
                    <p role="alert" className="text-sm text-destructive sm:mr-auto">
                        {error}
                    </p>
                )}
                <Button onClick={save} disabled={pending || !dirty}>
                    {pending && <Loader2 className="animate-spin" aria-hidden />}
                    Save units
                </Button>
            </div>
        </div>
    );
}
