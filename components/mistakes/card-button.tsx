"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cardFromMistake } from "@/app/(app)/mistakes/actions";
import { Button } from "@/components/ui/button";

/** "Make a flashcard" for one mistake; becomes a link to the deck once the card exists. */
export function CardFromMistakeButton({ questionId }: { questionId: string }) {
    const [pending, startTransition] = useTransition();
    const [topicId, setTopicId] = useState<string | null>(null);

    if (topicId) {
        return (
            <Button asChild variant="ghost" size="sm">
                <Link href={`/flashcards/${topicId}`}>
                    <Check />
                    Added to your deck
                </Link>
            </Button>
        );
    }
    return (
        <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
                startTransition(async () => {
                    const res = await cardFromMistake({ questionId }).catch(() => null);
                    if (!res || !res.ok) return void toast.error(res?.error ?? "Couldn't make the card. Try again.");
                    setTopicId(res.topicId);
                })
            }
        >
            {pending ? <Loader2 className="animate-spin" /> : <Layers />}
            Make a flashcard
        </Button>
    );
}
