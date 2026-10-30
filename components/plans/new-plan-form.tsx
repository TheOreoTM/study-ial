"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { createPlan } from "@/app/(app)/plans/actions";
import { formatMinutes } from "./task-meta";

export type FormUnit = {
    unitId: string;
    code: string;
    name: string;
    subjectName: string;
    topicCount: number;
    /** YYYY-MM-DD or "" */
    examDate: string;
};

const DAYS = [
    { value: 0, short: "Sun", long: "Sunday" },
    { value: 1, short: "Mon", long: "Monday" },
    { value: 2, short: "Tue", long: "Tuesday" },
    { value: 3, short: "Wed", long: "Wednesday" },
    { value: 4, short: "Thu", long: "Thursday" },
    { value: 5, short: "Fri", long: "Friday" },
    { value: 6, short: "Sat", long: "Saturday" },
];
// Friday off by default (the Maldivian weekend starts Friday).
const DEFAULT_DAYS = [0, 1, 2, 3, 4, 6];

const dayNum = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

export function NewPlanForm({ units, today, aiAvailable }: { units: FormUnit[]; today: string; aiAvailable: boolean }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [selected, setSelected] = useState<Set<string>>(
        () => new Set(units.filter((u) => u.examDate && u.examDate > today).map((u) => u.unitId)),
    );
    const [examDates, setExamDates] = useState<Record<string, string>>(() =>
        Object.fromEntries(units.map((u) => [u.unitId, u.examDate])),
    );
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(today);
    const [minutes, setMinutes] = useState(90);
    const [studyDays, setStudyDays] = useState<number[]>(DEFAULT_DAYS);

    const chosen = units.filter((u) => selected.has(u.unitId));
    const defaultTitle = chosen.length ? `${chosen.map((u) => u.code).join(" + ")} revision` : "My study plan";

    const preview = useMemo(() => {
        const dates = chosen.map((u) => examDates[u.unitId]).filter(Boolean);
        if (!dates.length || dates.length !== chosen.length || !startDate) return null;
        const start = Math.max(dayNum(startDate), dayNum(today));
        const last = Math.max(...dates.map(dayNum));
        let days = 0;
        for (let d = start; d < last; d++) if (studyDays.includes(new Date(d * 86_400_000).getUTCDay())) days++;
        return { days, weeks: Math.max(0, Math.round((last - start) / 7)) };
    }, [chosen, examDates, startDate, studyDays, today]);

    const toggleUnit = (id: string, on: boolean) =>
        setSelected((s) => {
            const next = new Set(s);
            if (on) next.add(id);
            else next.delete(id);
            return next;
        });
    const toggleDay = (d: number) =>
        setStudyDays((days) => (days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort()));

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (chosen.length === 0) return setError("Choose at least one unit.");
        const missing = chosen.find((u) => !examDates[u.unitId]);
        if (missing) return setError(`Add an exam date for ${missing.code}.`);
        if (studyDays.length === 0) return setError("Pick at least one study day.");

        startTransition(async () => {
            const res = await createPlan({
                title: title.trim() || defaultTitle,
                units: chosen.map((u) => ({ unitId: u.unitId, examDate: examDates[u.unitId] })),
                startDate,
                minutesPerDay: minutes,
                studyDays,
            });
            if (!res.ok) {
                setError(res.error);
                return;
            }
            toast.success("Your plan is ready.");
            router.push(`/plans/${res.planId}`);
        });
    }

    return (
        <form onSubmit={submit} className="space-y-6" noValidate>
            <Card>
                <CardHeader>
                    <CardTitle>Units and exam dates</CardTitle>
                    <CardDescription>
                        Pick the units this plan covers. Changing a date here also updates it in your settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="divide-y rounded-lg border">
                        {units.map((u) => {
                            const on = selected.has(u.unitId);
                            const id = `unit-${u.unitId}`;
                            return (
                                <li key={u.unitId} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                        <Checkbox
                                            id={id}
                                            className="mt-0.5"
                                            checked={on}
                                            onCheckedChange={(c) => toggleUnit(u.unitId, c === true)}
                                        />
                                        <Label htmlFor={id} className="block min-w-0 cursor-pointer font-normal">
                                            <span className="font-medium">{u.code}</span>{" "}
                                            <span className="text-muted-foreground">· {u.subjectName}</span>
                                            <span className="block text-sm text-muted-foreground">
                                                {u.name} · {u.topicCount} topics
                                            </span>
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2 pl-7 sm:pl-0">
                                        <Label htmlFor={`${id}-exam`} className="text-xs whitespace-nowrap text-muted-foreground">
                                            Exam date
                                        </Label>
                                        <Input
                                            id={`${id}-exam`}
                                            type="date"
                                            className="w-40"
                                            disabled={!on}
                                            min={today}
                                            value={examDates[u.unitId] ?? ""}
                                            onChange={(e) => setExamDates((d) => ({ ...d, [u.unitId]: e.target.value }))}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your schedule</CardTitle>
                    <CardDescription>We&apos;ll fill each study day up to your daily time, weakest topics first.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="plan-title">Plan name</Label>
                            <Input
                                id="plan-title"
                                placeholder={defaultTitle}
                                value={title}
                                maxLength={80}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plan-start">Start date</Label>
                            <Input
                                id="plan-start"
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value || today)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-baseline justify-between gap-2">
                            <Label id="minutes-label">Time per study day</Label>
                            <span className="text-sm font-medium tabular-nums">{formatMinutes(minutes)}</span>
                        </div>
                        <Slider
                            aria-labelledby="minutes-label"
                            min={30}
                            max={240}
                            step={15}
                            value={[minutes]}
                            onValueChange={([v]) => setMinutes(v)}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>30 min</span>
                            <span>4 h</span>
                        </div>
                    </div>

                    <fieldset className="space-y-3">
                        <legend className="text-sm leading-none font-medium">Study days</legend>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map((d) => {
                                const on = studyDays.includes(d.value);
                                return (
                                    <button
                                        key={d.value}
                                        type="button"
                                        aria-pressed={on}
                                        aria-label={d.long}
                                        onClick={() => toggleDay(d.value)}
                                        className={cn(
                                            "h-9 min-w-12 rounded-full border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                            on
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "bg-background text-muted-foreground hover:bg-muted",
                                        )}
                                    >
                                        {d.short}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>

                    {preview && (
                        <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
                            {preview.days > 0 ? (
                                <>
                                    About <span className="font-medium text-foreground">{preview.days} study days</span> over{" "}
                                    {preview.weeks} {preview.weeks === 1 ? "week" : "weeks"} — roughly{" "}
                                    {formatMinutes(Math.round((preview.days * minutes) / 60) * 60)} of revision.
                                </>
                            ) : (
                                "None of your study days fall before the exam yet."
                            )}
                        </p>
                    )}
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive" role="alert">
                    <AlertCircle />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {aiAvailable && <Sparkles className="size-3.5" aria-hidden />}
                    {aiAvailable
                        ? "We'll also write a short personalised summary for your plan."
                        : "Built from your mastery scores — you can reschedule any time."}
                </p>
                <Button type="submit" size="lg" disabled={pending}>
                    {pending && <Loader2 className="animate-spin" />}
                    {pending ? "Building your plan…" : "Create plan"}
                </Button>
            </div>
        </form>
    );
}
