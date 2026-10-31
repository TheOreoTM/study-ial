"use client";

import { useState, useTransition } from "react";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCard, deleteCard, updateCard } from "@/app/(app)/flashcards/actions";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Card = { id: string; front: string; back: string };

function CardFields({
    front,
    back,
    setFront,
    setBack,
    idPrefix,
}: {
    front: string;
    back: string;
    setFront: (v: string) => void;
    setBack: (v: string) => void;
    idPrefix: string;
}) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor={`${idPrefix}-front`}>Front</Label>
                <Textarea
                    id={`${idPrefix}-front`}
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    maxLength={300}
                    rows={2}
                    placeholder="e.g. Define specific heat capacity"
                    className="bg-card"
                />
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor={`${idPrefix}-back`}>Back</Label>
                <Textarea
                    id={`${idPrefix}-back`}
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    maxLength={600}
                    rows={3}
                    placeholder="The answer. LaTeX works too, e.g. $v = f\lambda$"
                    className="bg-card"
                />
            </div>
        </div>
    );
}

/** Adds one of the student's own cards to a topic's deck. */
export function CardEditor({ topicId }: { topicId: string }) {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [pending, startTransition] = useTransition();

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                startTransition(async () => {
                    const res = await createCard({ topicId, front, back });
                    if (!res.ok) {
                        toast.error(res.error);
                        return;
                    }
                    toast.success("Card added. It'll show up in your next review.");
                    setFront("");
                    setBack("");
                });
            }}
        >
            <CardFields front={front} back={back} setFront={setFront} setBack={setBack} idPrefix="new-card" />
            <Button type="submit" variant="outline" className="mt-4 w-full" disabled={pending}>
                {pending && <Loader2 className="animate-spin" />}
                Add card
            </Button>
        </form>
    );
}

export function OwnCardActions({ card }: { card: Card }) {
    const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);
    const [front, setFront] = useState(card.front);
    const [back, setBack] = useState(card.back);
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mt-1.5 -mr-2 shrink-0" aria-label="Card options">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onSelect={() => {
                            setFront(card.front);
                            setBack(card.back);
                            setDialog("edit");
                        }}
                    >
                        <Pencil />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setDialog("delete")}>
                        <Trash2 />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={dialog === "edit"} onOpenChange={(o) => !o && setDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit card</DialogTitle>
                        <DialogDescription>Your review schedule for this card stays the same.</DialogDescription>
                    </DialogHeader>
                    <CardFields
                        front={front}
                        back={back}
                        setFront={setFront}
                        setBack={setBack}
                        idPrefix={`edit-${card.id}`}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={pending}
                            onClick={() => run(() => updateCard({ cardId: card.id, front, back }), "Card saved.")}
                        >
                            {pending && <Loader2 className="animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={dialog === "delete"} onOpenChange={(o) => !o && setDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this card?</DialogTitle>
                        <DialogDescription>Its review history goes too. This can&apos;t be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={pending}
                            onClick={() => run(() => deleteCard({ cardId: card.id }), "Card deleted.")}
                        >
                            {pending && <Loader2 className="animate-spin" />}
                            Delete card
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
