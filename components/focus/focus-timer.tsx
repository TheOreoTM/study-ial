"use client";

import { useEffect, useEffectEvent, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, Pause, Play, RotateCcw, SkipForward, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { playChime, unlockAudio } from "./chime";
import { useTimerSettings } from "./settings-store";
import { TimerSettingsDialog } from "./timer-settings-dialog";
import {
    advance,
    DEFAULT_SETTINGS,
    durationFor,
    elapsed,
    formatClock,
    initialState,
    MIN_LOG_MINUTES,
    minutesToLog,
    MODE_LABEL,
    pause,
    remaining,
    reset,
    spokenRemaining,
    start,
    type FocusMode,
    type TimerState,
} from "./timer";
import type { FocusActionResult, FocusTask, FocusTopic, FocusTopicGroup, LogFocusInput } from "./types";

const NO_TOPIC = "none";
const MODES: FocusMode[] = ["focus", "short", "long"];

export function FocusTimer({
    task,
    initialTopic,
    topicGroups,
    logSession,
    markTaskDone,
}: {
    task: FocusTask | null;
    initialTopic: FocusTopic | null;
    topicGroups: FocusTopicGroup[];
    logSession: (input: LogFocusInput) => Promise<FocusActionResult>;
    markTaskDone: (taskId: string) => Promise<FocusActionResult>;
}) {
    const settings = useTimerSettings();
    const [stored, setTimer] = useState<TimerState>(() => initialState(DEFAULT_SETTINGS));
    const [now, setNow] = useState(0);
    const [topicId, setTopicId] = useState<string | null>(task?.topic?.id ?? initialTopic?.id ?? null);
    const [taskDone, setTaskDone] = useState(task?.done ?? false);
    const [offerTaskDone, setOfferTaskDone] = useState(false);
    const [status, setStatus] = useState("");
    const [markingDone, startMarking] = useTransition();
    const completedFor = useRef<number | null>(null);

    // An untouched period always reflects the current settings (they load from localStorage after hydration).
    const timer: TimerState =
        stored.startedAt === null && stored.endsAt === null
            ? { ...stored, durationMs: durationFor(stored.mode, settings), remainingMs: durationFor(stored.mode, settings) }
            : stored;
    const running = timer.endsAt !== null;
    const rem = remaining(timer, now);
    const clock = formatClock(rem);
    const progress = timer.durationMs > 0 ? 1 - rem / timer.durationMs : 0;
    const focusedMs = timer.mode === "focus" ? elapsed(timer, now) : 0;
    const canEndEarly = timer.mode === "focus" && timer.startedAt !== null && minutesToLog(focusedMs) >= MIN_LOG_MINUTES;
    const isBreak = timer.mode !== "focus";

    const allTopics = topicGroups.flatMap((g) => g.topics);
    const linkedTopic: FocusTopic | null =
        task?.topic ?? allTopics.find((t) => t.id === topicId) ?? (initialTopic?.id === topicId ? initialTopic : null);

    async function log(minutes: number, startedAt: number) {
        const res = await logSession({
            minutes,
            startedAt: new Date(startedAt).toISOString(),
            taskId: task?.id ?? null,
            topicId: task ? (task.topic?.id ?? null) : topicId,
        });
        if (res.ok) toast.success(`Logged ${minutes} minutes of focus`);
        else toast.error(`Couldn't log this session: ${res.error}`);
    }

    function notify(title: string, body: string) {
        if (!settings.notify || typeof Notification === "undefined" || Notification.permission !== "granted") return;
        try {
            new Notification(title, { body, icon: "/icon.png", tag: "study-ial-focus" });
        } catch {
            // Some mobile browsers only allow notifications from a service worker.
        }
    }

    function finishPeriod(n: number, { early }: { early: boolean }) {
        const finished = timer;
        const next = advance(finished, settings, { countFocus: true, now: n });
        if (finished.mode === "focus" && finished.startedAt !== null) {
            const minutes = early ? minutesToLog(elapsed(finished, n)) : minutesToLog(finished.durationMs);
            if (minutes >= 1) void log(minutes, finished.startedAt);
            if (task && !taskDone) setOfferTaskDone(true);
        }
        if (!early) {
            if (settings.sound) playChime();
            const title = finished.mode === "focus" ? "Focus complete" : "Break's over";
            const body =
                finished.mode === "focus" ? `Nice work. Time for a ${MODE_LABEL[next.mode].toLowerCase()}.` : "Ready to focus?";
            notify(title, body);
        }
        setStatus(
            `${MODE_LABEL[finished.mode]} ${early ? "ended" : "complete"}. ${MODE_LABEL[next.mode]} ${next.endsAt ? "started" : "is ready"}.`,
        );
        setNow(n);
        setTimer(next);
    }

    const tick = useEffectEvent(() => {
        const n = Date.now();
        setNow(n);
        if (timer.endsAt !== null && n >= timer.endsAt && completedFor.current !== timer.endsAt) {
            completedFor.current = timer.endsAt;
            finishPeriod(n, { early: false });
        }
    });

    // Re-derive from the clock a few times a second; also fire exactly at the end and when the tab is shown again.
    useEffect(() => {
        if (timer.endsAt === null) return;
        const interval = window.setInterval(tick, 250);
        const timeout = window.setTimeout(tick, Math.max(0, timer.endsAt - Date.now()) + 20);
        const onVisible = () => tick();
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            window.clearInterval(interval);
            window.clearTimeout(timeout);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [timer.endsAt]);

    // Remaining time in the tab title while running.
    const baseTitle = useRef<string | null>(null);
    const ourTitle = useRef<string | null>(null);
    useEffect(() => {
        if (baseTitle.current === null) baseTitle.current = document.title;
        if (running) {
            ourTitle.current = `${clock} · ${MODE_LABEL[timer.mode]}`;
            document.title = ourTitle.current;
        } else if (ourTitle.current !== null && document.title === ourTitle.current) {
            document.title = baseTitle.current;
            ourTitle.current = null;
        }
    }, [running, clock, timer.mode]);
    useEffect(
        () => () => {
            if (ourTitle.current !== null && document.title === ourTitle.current && baseTitle.current)
                document.title = baseTitle.current;
        },
        [],
    );

    function toggle() {
        const n = Date.now();
        if (running) {
            setTimer(pause(timer, n));
            setStatus("Paused.");
            return;
        }
        unlockAudio();
        if (settings.notify && typeof Notification !== "undefined" && Notification.permission === "default") {
            void Notification.requestPermission().catch(() => undefined);
        }
        setNow(n);
        setTimer(start(timer, n));
        setStatus(`${MODE_LABEL[timer.mode]} started. ${spokenRemaining(timer.remainingMs)}.`);
    }

    function onReset() {
        setTimer(reset(timer));
        setStatus("Timer reset.");
    }

    function onSkip() {
        const n = Date.now();
        const next = advance(timer, settings, { countFocus: false, now: n });
        setNow(n);
        setTimer(next);
        setStatus(`Skipped. ${MODE_LABEL[next.mode]} ${next.endsAt ? "started" : "is ready"}.`);
    }

    function switchMode(mode: FocusMode) {
        if (running || mode === timer.mode) return;
        setTimer(initialState(settings, mode, timer.completedFocus));
    }

    function onMarkDone() {
        if (!task) return;
        startMarking(async () => {
            const res = await markTaskDone(task.id);
            if (res.ok) {
                setTaskDone(true);
                setOfferTaskDone(false);
                toast.success("Task marked done");
            } else toast.error(res.error);
        });
    }

    const cyclePos = timer.completedFocus % settings.longEvery;
    const dotsFilled = timer.mode === "long" && cyclePos === 0 && timer.completedFocus > 0 ? settings.longEvery : cyclePos;
    const R = 46;
    const C = 2 * Math.PI * R;

    return (
        <div className="flex flex-col gap-6">
            <Card className="gap-0 py-0">
                <CardContent className="flex flex-col items-center gap-6 px-4 py-6 sm:px-8 sm:py-8">
                    <div className="flex w-full items-center justify-between gap-2">
                        <div role="group" aria-label="Timer mode" className="flex rounded-lg bg-muted p-1 text-sm">
                            {MODES.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    aria-pressed={timer.mode === m}
                                    disabled={running && timer.mode !== m}
                                    onClick={() => switchMode(m)}
                                    className={cn(
                                        "rounded-md px-2.5 py-1.5 font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 sm:px-3",
                                        timer.mode === m
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {m === "focus" ? "Focus" : m === "short" ? "Short" : "Long"}
                                    <span className="sr-only sm:not-sr-only">{m === "focus" ? "" : " break"}</span>
                                </button>
                            ))}
                        </div>
                        <TimerSettingsDialog settings={settings} />
                    </div>

                    <div
                        className={cn(
                            "relative grid aspect-square w-full max-w-[18rem] place-items-center",
                            isBreak ? "text-success" : "text-primary",
                        )}
                    >
                        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
                            <circle cx="50" cy="50" r={R} fill="none" strokeWidth="2.5" className="stroke-muted" />
                            <circle
                                cx="50"
                                cy="50"
                                r={R}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={C}
                                strokeDashoffset={C * (1 - Math.min(1, Math.max(0, progress)))}
                                className="transition-[stroke-dashoffset] duration-300 ease-linear"
                            />
                        </svg>
                        <div className="relative flex flex-col items-center gap-1 text-center">
                            <span className="text-sm font-medium text-muted-foreground">{MODE_LABEL[timer.mode]}</span>
                            <span
                                role="timer"
                                aria-label={`${MODE_LABEL[timer.mode]}: ${spokenRemaining(rem)}`}
                                className="text-6xl font-semibold tracking-tight text-foreground tabular-nums sm:text-7xl"
                            >
                                {clock}
                            </span>
                            <span className="h-5 text-sm text-muted-foreground">
                                {running ? "" : timer.startedAt !== null ? "Paused" : ""}
                            </span>
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-1.5"
                        role="img"
                        aria-label={`${dotsFilled} of ${settings.longEvery} focus sessions before a long break`}
                    >
                        {Array.from({ length: settings.longEvery }, (_, i) => (
                            <span
                                key={i}
                                className={cn("size-2 rounded-full", i < dotsFilled ? "bg-primary" : "bg-muted")}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <Button
                            variant="outline"
                            size="icon-lg"
                            className="rounded-full"
                            onClick={onReset}
                            disabled={timer.startedAt === null}
                            aria-label="Reset timer"
                        >
                            <RotateCcw aria-hidden />
                        </Button>
                        <Button
                            size="lg"
                            className="h-14 min-w-36 rounded-full text-base"
                            onClick={toggle}
                            aria-label={running ? "Pause timer" : timer.startedAt !== null ? "Resume timer" : "Start timer"}
                        >
                            {running ? <Pause aria-hidden /> : <Play aria-hidden />}
                            {running ? "Pause" : timer.startedAt !== null ? "Resume" : "Start"}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-lg"
                            className="rounded-full"
                            onClick={onSkip}
                            aria-label={`Skip to ${MODE_LABEL[advance(timer, settings, { countFocus: false, now: 0 }).mode].toLowerCase()}`}
                        >
                            <SkipForward aria-hidden />
                        </Button>
                    </div>

                    <div className="flex min-h-9 items-center justify-center">
                        {canEndEarly ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => finishPeriod(Date.now(), { early: true })}
                                className="text-muted-foreground"
                            >
                                <Square aria-hidden /> End &amp; log {minutesToLog(focusedMs)} min
                            </Button>
                        ) : timer.mode === "focus" ? (
                            <p className="text-center text-xs text-muted-foreground">
                                Sessions are logged when the timer finishes (or ended after {MIN_LOG_MINUTES}+ minutes).
                            </p>
                        ) : null}
                    </div>

                    <p className="sr-only" aria-live="polite" aria-atomic="true">
                        {running ? spokenRemaining(rem) : ""}
                    </p>
                    <p className="sr-only" role="status">
                        {status}
                    </p>
                </CardContent>
            </Card>

            <Card className="gap-4 py-5">
                <CardContent className="flex flex-col gap-3 px-5">
                    <h2 className="text-sm font-medium">Working on</h2>
                    {task ? (
                        <div className="flex flex-col gap-3">
                            <div className="rounded-lg border bg-muted/30 p-3">
                                <p className={cn("font-medium", taskDone && "text-muted-foreground line-through")}>
                                    {task.title}
                                </p>
                                {task.topic && (
                                    <p className="mt-0.5 text-sm text-muted-foreground">
                                        <span className="font-mono text-xs">{task.topic.unitCode}</span> ·{" "}
                                        {task.topic.code} {task.topic.name}
                                    </p>
                                )}
                            </div>
                            {taskDone ? (
                                <p className="flex items-center gap-1.5 text-sm text-success">
                                    <CheckCircle2 className="size-4" aria-hidden /> Task done
                                </p>
                            ) : (
                                <div
                                    className={cn(
                                        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                                        offerTaskDone && "rounded-lg bg-primary/5 p-3",
                                    )}
                                >
                                    {offerTaskDone && <p className="text-sm">Nice work — finished this task?</p>}
                                    <Button
                                        variant={offerTaskDone ? "default" : "outline"}
                                        size="sm"
                                        onClick={onMarkDone}
                                        disabled={markingDone}
                                    >
                                        <CheckCircle2 aria-hidden /> Mark task done
                                    </Button>
                                </div>
                            )}
                            <Link href="/focus" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                                Unlink task
                            </Link>
                        </div>
                    ) : topicGroups.length > 0 || initialTopic ? (
                        <div className="grid gap-2">
                            <Label htmlFor="focus-topic" className="font-normal text-muted-foreground">
                                Topic (optional)
                            </Label>
                            <Select value={topicId ?? NO_TOPIC} onValueChange={(v) => setTopicId(v === NO_TOPIC ? null : v)}>
                                <SelectTrigger id="focus-topic" className="w-full">
                                    <SelectValue placeholder="No topic" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="max-h-72">
                                    <SelectItem value={NO_TOPIC}>No particular topic</SelectItem>
                                    {initialTopic && !allTopics.some((t) => t.id === initialTopic.id) && (
                                        <SelectItem value={initialTopic.id}>
                                            {initialTopic.unitCode} · {initialTopic.code} {initialTopic.name}
                                        </SelectItem>
                                    )}
                                    {topicGroups.map((g) => (
                                        <SelectGroup key={g.unitCode}>
                                            <SelectLabel>
                                                {g.unitCode} · {g.unitName}
                                            </SelectLabel>
                                            {g.topics.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.code} {t.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                            {linkedTopic && (
                                <p className="text-xs text-muted-foreground">
                                    Time you log will count toward {linkedTopic.code} {linkedTopic.name}.
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Add units in <Link href="/settings" className="underline underline-offset-4">Settings</Link>{" "}
                            to link focus time to a topic.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
