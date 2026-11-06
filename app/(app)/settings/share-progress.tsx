"use client";

import { useState, useTransition } from "react";
import { Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/admin/copy-button";
import { Button } from "@/components/ui/button";
import { APP_TIME_ZONE } from "@/lib/time";
import { createProgressShare, deleteProgressShare } from "./actions";

/** Create, replace or turn off the read-only progress link. The full link is only shown right after creating it. */
export function ShareProgress({ active }: { active: { since: string; lastViewed: string | null } | null }) {
    const [url, setUrl] = useState<string | null>(null);
    const [on, setOn] = useState(!!active);
    const [pending, startTransition] = useTransition();

    function create() {
        startTransition(async () => {
            const res = await createProgressShare();
            if (!res.ok) return void toast.error(res.error);
            setUrl(`${window.location.origin}${res.path}`);
            setOn(true);
        });
    }

    function remove() {
        startTransition(async () => {
            const res = await deleteProgressShare();
            if (!res.ok) return void toast.error(res.error);
            setUrl(null);
            setOn(false);
            toast("Sharing is off. The old link no longer works.");
        });
    }

    return (
        <div className="grid gap-4">
            <p className="text-[0.9375rem] text-muted-foreground">
                Give a parent or teacher a link to a read-only summary: your first name, your units and exam dates,
                mastery by topic, mock grades and your study calendar. They never see your email, your answers or
                your notes, and they can&apos;t change anything.
            </p>

            {url ? (
                <div className="grid gap-2 rounded-lg bg-muted p-4">
                    <label htmlFor="share-url" className="text-sm font-bold">
                        Your link. Copy it now: for your privacy we don&apos;t keep a copy, so we can&apos;t show it
                        again.
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            id="share-url"
                            readOnly
                            value={url}
                            onFocus={(e) => e.currentTarget.select()}
                            className="h-11 min-w-0 flex-1 rounded-md border-[1.5px] border-border-strong bg-card px-3 font-mono text-sm"
                        />
                        <CopyButton text={url} label="Copy link" />
                    </div>
                </div>
            ) : on ? (
                <p className="rounded-lg bg-muted px-4 py-3 text-[0.9375rem]">
                    A link is active
                    {active?.since && ` since ${formatDay(active.since)}`}
                    {active?.lastViewed ? `, last opened ${formatDay(active.lastViewed)}` : ", not opened yet"}.
                    Lost it? Make a new one; the old link stops working.
                </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={create} disabled={pending}>
                    {pending ? <Loader2 className="animate-spin" /> : <Link2 />}
                    {on ? "Make a new link" : "Create a link"}
                </Button>
                {on && (
                    <Button variant="ghost" onClick={remove} disabled={pending}>
                        Turn off sharing
                    </Button>
                )}
            </div>
        </div>
    );
}

function formatDay(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: APP_TIME_ZONE });
}
