"use client";

import { useTransition } from "react";
import { CheckCheck, EyeOff, Loader2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    deleteSharedFlashcard,
    publishTopicFlashcards,
    setFlashcardStatus,
} from "@/app/(app)/admin/flashcards/actions";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PublishTopicButton({ topicId, drafts }: { topicId: string; drafts: number }) {
    const [pending, startTransition] = useTransition();
    return (
        <Button
            disabled={pending}
            onClick={() =>
                startTransition(async () => {
                    const res = await publishTopicFlashcards({ topicId });
                    if (res.ok) toast.success(`Published ${res.count} card${res.count === 1 ? "" : "s"}.`);
                    else toast.error(res.error);
                })
            }
        >
            {pending ? <Loader2 className="animate-spin" /> : <CheckCheck />}
            Publish {drafts} draft{drafts === 1 ? "" : "s"}
        </Button>
    );
}

export function FlashcardAdminRow({ id, status }: { id: string; status: "DRAFT" | "PUBLISHED" }) {
    const [pending, startTransition] = useTransition();
    const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string) =>
        startTransition(async () => {
            const res = await fn();
            if (res.ok) toast.success(success);
            else toast.error(res.error);
        });
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mt-1.5 -mr-2" aria-label="Card options" disabled={pending}>
                    {pending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {status === "DRAFT" ? (
                    <DropdownMenuItem
                        onSelect={() => run(() => setFlashcardStatus({ ids: [id], status: "PUBLISHED" }), "Published.")}
                    >
                        <Send />
                        Publish
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onSelect={() => run(() => setFlashcardStatus({ ids: [id], status: "DRAFT" }), "Moved to drafts.")}
                    >
                        <EyeOff />
                        Unpublish
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem variant="destructive" onSelect={() => run(() => deleteSharedFlashcard({ id }), "Deleted.")}>
                    <Trash2 />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
