// Pomodoro timer maths. Pure and timestamp-based: the remaining time is always derived from `Date.now()`
// against an absolute end time, so throttled background tabs never drift.

export type FocusMode = "focus" | "short" | "long";

export type TimerSettings = {
    focus: number; // minutes
    short: number;
    long: number;
    /** A long break replaces the short one after every N focus periods */
    longEvery: number;
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
    sound: boolean;
    notify: boolean;
};

export const DEFAULT_SETTINGS: TimerSettings = {
    focus: 25,
    short: 5,
    long: 15,
    longEvery: 4,
    autoStartBreaks: true,
    autoStartFocus: false,
    sound: true,
    notify: false,
};

export const MODE_LABEL: Record<FocusMode, string> = { focus: "Focus", short: "Short break", long: "Long break" };

/** Focus sessions shorter than this aren't logged when ended early. */
export const MIN_LOG_MINUTES = 5;

export type TimerState = {
    mode: FocusMode;
    /** Total length of the current period, ms */
    durationMs: number;
    /** Set while running: absolute time the period ends */
    endsAt: number | null;
    /** Remaining time while paused/idle, ms */
    remainingMs: number;
    /** When the current period was first started (null until started) */
    startedAt: number | null;
    /** Focus periods completed this sitting (drives the long-break cycle) */
    completedFocus: number;
};

export function durationFor(mode: FocusMode, s: TimerSettings) {
    return Math.round(s[mode] * 60_000);
}

export function initialState(s: TimerSettings, mode: FocusMode = "focus", completedFocus = 0): TimerState {
    const durationMs = durationFor(mode, s);
    return { mode, durationMs, endsAt: null, remainingMs: durationMs, startedAt: null, completedFocus };
}

export function isRunning(t: TimerState) {
    return t.endsAt !== null;
}

export function remaining(t: TimerState, now: number) {
    return t.endsAt === null ? t.remainingMs : Math.max(0, t.endsAt - now);
}

export function elapsed(t: TimerState, now: number) {
    return t.durationMs - remaining(t, now);
}

export function start(t: TimerState, now: number): TimerState {
    if (t.endsAt !== null) return t;
    return { ...t, endsAt: now + t.remainingMs, startedAt: t.startedAt ?? now };
}

export function pause(t: TimerState, now: number): TimerState {
    if (t.endsAt === null) return t;
    return { ...t, endsAt: null, remainingMs: remaining(t, now) };
}

export function reset(t: TimerState): TimerState {
    return { ...t, endsAt: null, remainingMs: t.durationMs, startedAt: null };
}

/** Which mode follows `mode`, given how many focus periods are done *including* the one just finished. */
export function nextMode(mode: FocusMode, completedFocus: number, longEvery: number): FocusMode {
    if (mode !== "focus") return "focus";
    return completedFocus > 0 && completedFocus % longEvery === 0 ? "long" : "short";
}

/**
 * Move to the next period. `countFocus` says whether the period being left counts as a completed focus period
 * (true when it ran out or was ended early and logged; false when skipped).
 */
export function advance(t: TimerState, s: TimerSettings, { countFocus, now }: { countFocus: boolean; now: number }) {
    const completedFocus = t.mode === "focus" && countFocus ? t.completedFocus + 1 : t.completedFocus;
    const mode = nextMode(t.mode, completedFocus, s.longEvery);
    const next = initialState(s, mode, completedFocus);
    const autoStart = mode === "focus" ? s.autoStartFocus : s.autoStartBreaks;
    return autoStart ? start(next, now) : next;
}

/** "MM:SS" (or "H:MM:SS"), rounding up so the display reads 25:00 at the start and 0:01 in the last second. */
export function formatClock(ms: number) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    const mm = String(m).padStart(2, "0");
    return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

/**
 * Screen-reader announcement for the remaining time, bucketed so a polite live region only speaks at sensible
 * intervals: every 5 minutes, then every minute in the last 5, then at 30 and 10 seconds.
 */
export function spokenRemaining(ms: number) {
    const sec = Math.max(0, Math.ceil(ms / 1000));
    if (sec > 5 * 60) return `${Math.ceil(sec / 300) * 5} minutes left`;
    if (sec > 60) return `${Math.ceil(sec / 60)} minutes left`;
    if (sec > 30) return "1 minute left";
    if (sec > 10) return "30 seconds left";
    return "10 seconds left";
}

/** Whole minutes to log for a focus period (rounded to nearest; 0 when under a minute). */
export function minutesToLog(ms: number) {
    return Math.round(ms / 60_000);
}

/** Clamp/validate user-entered settings. */
export function sanitizeSettings(raw: unknown): TimerSettings {
    const s = { ...DEFAULT_SETTINGS };
    if (!raw || typeof raw !== "object") return s;
    const r = raw as Record<string, unknown>;
    const num = (v: unknown, min: number, max: number, fallback: number) =>
        typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
    s.focus = num(r.focus, 1, 120, s.focus);
    s.short = num(r.short, 1, 60, s.short);
    s.long = num(r.long, 1, 60, s.long);
    s.longEvery = num(r.longEvery, 2, 8, s.longEvery);
    for (const k of ["autoStartBreaks", "autoStartFocus", "sound", "notify"] as const) {
        if (typeof r[k] === "boolean") s[k] = r[k];
    }
    return s;
}
