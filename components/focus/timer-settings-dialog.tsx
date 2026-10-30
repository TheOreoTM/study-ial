"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveTimerSettings } from "./settings-store";
import { DEFAULT_SETTINGS, sanitizeSettings, type TimerSettings } from "./timer";

export function TimerSettingsDialog({ settings }: { settings: TimerSettings }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Timer settings">
                    <Settings2 aria-hidden />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] overflow-y-auto">
                {/* Mounted only while open, so the draft starts from the current settings each time */}
                <SettingsForm settings={settings} onDone={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

const LENGTHS = [
    { key: "focus", label: "Focus", max: 120 },
    { key: "short", label: "Short break", max: 60 },
    { key: "long", label: "Long break", max: 60 },
] as const;

const TOGGLES = [
    { key: "autoStartBreaks", label: "Start breaks automatically" },
    { key: "autoStartFocus", label: "Start focus automatically after a break" },
    { key: "sound", label: "Play a chime when time's up" },
    { key: "notify", label: "Show a browser notification", hint: "We'll ask for permission when you next press Start." },
] as const;

function SettingsForm({ settings, onDone }: { settings: TimerSettings; onDone: () => void }) {
    const [draft, setDraft] = useState<Record<string, string | boolean>>(() => ({
        ...settings,
        focus: String(settings.focus),
        short: String(settings.short),
        long: String(settings.long),
        longEvery: String(settings.longEvery),
    }));

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const toNum = (v: string | boolean) => (typeof v === "string" && v.trim() ? Number(v) : NaN);
        saveTimerSettings(
            sanitizeSettings({
                ...draft,
                focus: toNum(draft.focus),
                short: toNum(draft.short),
                long: toNum(draft.long),
                longEvery: toNum(draft.longEvery),
            }),
        );
        onDone();
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            <DialogHeader>
                <DialogTitle>Timer settings</DialogTitle>
                <DialogDescription>Saved in this browser. Changes apply to the next timer you start.</DialogDescription>
            </DialogHeader>

            <fieldset className="grid grid-cols-3 gap-3">
                <legend className="mb-2 text-sm font-medium">Lengths (minutes)</legend>
                {LENGTHS.map(({ key, label, max }) => (
                    <div key={key} className="grid gap-1.5">
                        <Label htmlFor={`len-${key}`} className="text-xs text-muted-foreground">
                            {label}
                        </Label>
                        <Input
                            id={`len-${key}`}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={max}
                            value={String(draft[key])}
                            onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                            required
                        />
                    </div>
                ))}
            </fieldset>

            <div className="flex items-center justify-between gap-4">
                <Label htmlFor="len-longEvery">Long break after every</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="len-longEvery"
                        type="number"
                        inputMode="numeric"
                        min={2}
                        max={8}
                        className="w-16"
                        value={String(draft.longEvery)}
                        onChange={(e) => setDraft({ ...draft, longEvery: e.target.value })}
                        required
                    />
                    <span className="text-sm text-muted-foreground">sessions</span>
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t pt-4">
                {TOGGLES.map((t) => (
                    <div key={t.key} className="flex items-start justify-between gap-4">
                        <Label htmlFor={`opt-${t.key}`} className="flex-col items-start gap-1 font-normal">
                            {t.label}
                            {"hint" in t && <span className="text-xs text-muted-foreground">{t.hint}</span>}
                        </Label>
                        <Switch
                            id={`opt-${t.key}`}
                            checked={draft[t.key] === true}
                            onCheckedChange={(v) => setDraft({ ...draft, [t.key]: v })}
                        />
                    </div>
                ))}
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                        setDraft({
                            ...DEFAULT_SETTINGS,
                            focus: String(DEFAULT_SETTINGS.focus),
                            short: String(DEFAULT_SETTINGS.short),
                            long: String(DEFAULT_SETTINGS.long),
                            longEvery: String(DEFAULT_SETTINGS.longEvery),
                        })
                    }
                >
                    Restore defaults
                </Button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit">Save</Button>
                </div>
            </DialogFooter>
        </form>
    );
}
