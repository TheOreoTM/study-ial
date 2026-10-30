"use client";

import { useState, useTransition } from "react";
import { Archive, ArchiveRestore, CalendarSync, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deletePlan, renamePlan, rescheduleMissed, setPlanArchived } from "@/app/(app)/plans/actions";

export function RescheduleButton({ planId, variant = "outline" }: { planId: string; variant?: "outline" | "default" }) {
    const [pending, startTransition] = useTransition();
    return (
        <Button
            variant={variant}
            disabled={pending}
            onClick={() =>
                startTransition(async () => {
                    const res = await rescheduleMissed(planId);
                    if (res.ok) toast.success(`Rescheduled from today: ${res.created} sessions planned.`);
                    else toast.error(res.error);
                })
            }
        >
            {pending ? <Loader2 className="animate-spin" /> : <CalendarSync />}
            Reschedule missed
        </Button>
    );
}

export function PlanActions({ planId, title, archived }: { planId: string; title: string; archived: boolean }) {
    const [dialog, setDialog] = useState<"rename" | "delete" | null>(null);
    const [name, setName] = useState(title);
    const [pending, startTransition] = useTransition();

    const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string) =>
        startTransition(async () => {
            const res = await fn();
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(success);
            setDialog(null);
        });

    return (
        <>
            {!archived && <RescheduleButton planId={planId} />}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Plan options">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onSelect={() => {
                            setName(title);
                            setDialog("rename");
                        }}
                    >
                        <Pencil />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() =>
                            run(() => setPlanArchived(planId, !archived), archived ? "Plan restored." : "Plan archived.")
                        }
                    >
                        {archived ? <ArchiveRestore /> : <Archive />}
                        {archived ? "Unarchive" : "Archive"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => setDialog("delete")}>
                        <Trash2 />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={dialog === "rename"} onOpenChange={(o) => !o && setDialog(null)}>
                <DialogContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            run(() => renamePlan(planId, name), "Plan renamed.");
                        }}
                        className="space-y-4"
                    >
                        <DialogHeader>
                            <DialogTitle>Rename plan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="plan-name">Name</Label>
                            <Input id="plan-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoFocus />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialog(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={pending || !name.trim()}>
                                {pending && <Loader2 className="animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={dialog === "delete"} onOpenChange={(o) => !o && setDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this plan?</DialogTitle>
                        <DialogDescription>
                            &ldquo;{title}&rdquo; and all its sessions will be removed. Your practice history and mastery are
                            not affected. This can&apos;t be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={pending}
                            onClick={() => run(() => deletePlan(planId), "Plan deleted.")}
                        >
                            {pending && <Loader2 className="animate-spin" />}
                            Delete plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
