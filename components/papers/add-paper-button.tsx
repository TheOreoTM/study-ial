"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToMyPapers, removeFromMyPapers } from "@/app/(app)/papers/actions";

export function AddPaperButton({
    sittingId,
    saved: initiallySaved,
    signedIn,
    next,
    size = "sm",
    showOpen = true,
}: {
    sittingId: string;
    saved: boolean;
    signedIn: boolean;
    /** Where sign-in should bring the visitor back to */
    next: string;
    size?: "sm" | "default";
    /** Hide the "Open" link when already on the paper's page */
    showOpen?: boolean;
}) {
    const [saved, setSaved] = useState(initiallySaved);
    const [pending, start] = useTransition();

    if (!signedIn) {
        return (
            <Button asChild size={size} variant="outline">
                <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>Sign in to add</Link>
            </Button>
        );
    }

    if (saved) {
        return (
            <div className="flex items-center gap-1.5">
                {showOpen && (
                    <Button asChild size={size} variant="outline">
                        <Link href={`/papers/${sittingId}`}>Open</Link>
                    </Button>
                )}
                <Button
                    size={size}
                    variant="ghost"
                    disabled={pending}
                    aria-label="Remove from my papers"
                    title="Remove from my papers"
                    onClick={() =>
                        start(async () => {
                            const res = await removeFromMyPapers({ sittingId });
                            if (res.ok) setSaved(false);
                            else toast.error(res.error);
                        })
                    }
                >
                    <Check className="text-success" aria-hidden />
                    Added
                </Button>
            </div>
        );
    }

    return (
        <Button
            size={size}
            variant="outline"
            disabled={pending}
            onClick={() =>
                start(async () => {
                    const res = await addToMyPapers({ sittingId });
                    if (res.ok) {
                        setSaved(true);
                        toast.success("Added to your papers");
                    } else toast.error(res.error);
                })
            }
        >
            <Plus aria-hidden />
            Add to my papers
        </Button>
    );
}
