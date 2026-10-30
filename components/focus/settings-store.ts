"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS, sanitizeSettings, type TimerSettings } from "./timer";

// Timer preferences persisted per browser in localStorage (all access wrapped: storage can be unavailable).

const KEY = "study-ial:focus-settings";
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: TimerSettings = DEFAULT_SETTINGS;

function read(): TimerSettings {
    let raw: string | null;
    try {
        raw = window.localStorage.getItem(KEY);
    } catch {
        return cached; // storage unavailable: keep in-memory settings
    }
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        try {
            cached = raw ? sanitizeSettings(JSON.parse(raw)) : DEFAULT_SETTINGS;
        } catch {
            cached = DEFAULT_SETTINGS;
        }
    }
    return cached;
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", onStorage);
    };
}

export function saveTimerSettings(next: TimerSettings) {
    const clean = sanitizeSettings(next);
    try {
        window.localStorage.setItem(KEY, JSON.stringify(clean));
    } catch {
        // Storage blocked: keep the settings for this page view only.
        cached = clean;
    }
    listeners.forEach((l) => l());
}

export function useTimerSettings(): TimerSettings {
    return useSyncExternalStore(subscribe, read, () => DEFAULT_SETTINGS);
}
