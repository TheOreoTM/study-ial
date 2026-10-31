"use client";

import { useState, useTransition } from "react";
import { CheckCheck, EyeOff, Loader2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    deleteSharedFlashcard,
    setFlashcardStatus,
    setTopicFlashcardStatus,
} from "@/app/(app)/admin/flashcards/actions";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Topic-level publish (orange) and unpublish-all (outline) buttons. */
export function TopicStatusButtons({
    topicId,
    drafts,
    published,
}: {
    topicId: string;
    drafts: number;
    published: number;
}) {
    const [pending, startTransition] = useTransition();
    const run = (status: "DRAFT" | "PUBLISHED") =>
        startTransition(async () => {
            const res = await setTopicFlashcardStatus({ topicId, status });
            if (!res.ok) toast.error(res.error);
            else
                toast.success(
                    `${status === "PUBLISHED" ? "Published" : "Unpublished"} ${res.count} card${res.count === 1 ? "" : "s"}.`,
                );
        });
    return (
        <>
            {published > 0 && (
                <Button variant="outline" disabled={pending} onClick={() => run("DRAFT")}>
                    <EyeOff />
                    Unpublish all
                </Button>
            )}
            {drafts > 0 && (
                <Button disabled={pending} onClick={() => run("PUBLISHED")}>
                    {pending ? <Loader2 className="animate-spin" /> : <CheckCheck />}
                    Publish {drafts} draft{drafts === 1 ? "" : "s"}
                </Button>
            )}
        </>
    );
}

export function FlashcardAdminRow({ id, status }: { id: string; status: "DRAFT" | "PUBLISHED" }) {
    const [pending, startTransition] = useTransition();
    const [confirming, setConfirming] = useState(false);
    const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string) =>
        startTransition(async () => {
            const res = await fn();
            if (res.ok) toast.success(success);
            else toast.error(res.error);
        });
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="-mt-1.5 -mr-2"
                        aria-label="Card options"
                        disabled={pending}
                    >
                        {pending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {status === "DRAFT" ? (
                        <DropdownMenuItem
                            onSelect={() =>
                                run(() => setFlashcardStatus({ ids: [id], status: "PUBLISHED" }), "Published.")
                            }
                        >
                            <Send />
                            Publish
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onSelect={() =>
                                run(() => setFlashcardStatus({ ids: [id], status: "DRAFT" }), "Moved to drafts.")
                            }
                        >
                            <EyeOff />
                            Unpublish
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem variant="destructive" onSelect={() => setConfirming(true)}>
                        <Trash2 />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this card?</DialogTitle>
                        <DialogDescription>
                            Students lose its review history, and re-running the seed won&apos;t bring it back. To hide
                            it for now, unpublish it instead.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirming(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={pending}
                            onClick={() => {
                                setConfirming(false);
                                run(() => deleteSharedFlashcard({ id }), "Deleted.");
                            }}
                        >
                            Delete card
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
