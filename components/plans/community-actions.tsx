"use client";

import { useState, useTransition } from "react";
import { Copy, EyeOff, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { adminUnsharePlan, clonePlan, setPlanShared } from "@/app/(app)/plans/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

/** "Use this plan": builds a fresh plan from the template and the student's own marks, then opens it. */
export function UsePlanButton({ planId, missingUnits }: { planId: string; missingUnits: string[] }) {
    const [pending, startTransition] = useTransition();
    return (
        <div className="grid gap-2 sm:justify-items-end">
            <Button
                size="lg"
                disabled={pending}
                onClick={() =>
                    startTransition(async () => {
                        // Redirects to the new plan on success.
                        const res = await clonePlan(planId);
                        if (res && !res.ok) toast.error(res.error);
                    })
                }
            >
                {pending ? <Loader2 className="animate-spin" /> : <Copy />}
                Use this plan
            </Button>
            {missingUnits.length > 0 && (
                <p className="max-w-xs text-[0.8125rem] text-muted-foreground sm:text-right">
                    Adds {missingUnits.join(", ")} to your units, with an estimated exam date you can change in
                    Settings.
                </p>
            )}
        </div>
    );
}

/** Owner's share/unshare control, with a warning that the title becomes public. */
export function ShareToggle({ planId, title, shared }: { planId: string; title: string; shared: boolean }) {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const run = (next: boolean) =>
        startTransition(async () => {
            const res = await setPlanShared(planId, next);
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(next ? "Shared to community plans." : "No longer shared.");
            setOpen(false);
        });

    if (shared) {
        return (
            <Button variant="outline" disabled={pending} onClick={() => run(false)}>
                {pending ? <Loader2 className="animate-spin" /> : <EyeOff />}
                Stop sharing
            </Button>
        );
    }
    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                <Share2 />
                Share
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share this plan?</DialogTitle>
                        <DialogDescription>
                            Other students will see its title (&ldquo;{title}&rdquo;), units, daily time, study days and
                            the week-by-week mix of tasks. They won&apos;t see your name, your progress or your notes.
                            Rename it first if the title says anything personal.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={pending} onClick={() => run(true)}>
                            {pending && <Loader2 className="animate-spin" />}
                            Share plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function AdminUnshareButton({ planId }: { planId: string }) {
    const [pending, startTransition] = useTransition();
    return (
        <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() =>
                startTransition(async () => {
                    const res = await adminUnsharePlan(planId);
                    if (res.ok) toast.success("Removed from community plans.");
                    else toast.error(res.error);
                })
            }
        >
            {pending ? <Loader2 className="animate-spin" /> : <EyeOff />}
            Unshare (admin)
        </Button>
    );
}
