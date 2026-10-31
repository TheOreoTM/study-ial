"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { dismissMilestones } from "@/app/(app)/progress/actions";
import { Button } from "@/components/ui/button";
import type { MilestoneKey } from "@/lib/milestones";
import { milestoneIcon } from "./icons";

/**
 * A quiet line on the dashboard for a newly earned milestone, always pointing at the next useful thing to revise.
 * No modal, no confetti: one tonal row the student can dismiss.
 */
export function MilestoneNotice({
    milestone,
    more,
    next,
}: {
    milestone: { key: MilestoneKey; title: string; detail: string | null; earnedAt: string };
    more: number;
    next: { name: string; href: string } | null;
}) {
    const [pending, startTransition] = useTransition();
    const Icon = milestoneIcon[milestone.key];
    return (
        <section
            aria-label="New milestone"
            className="mb-8 flex items-start gap-3 rounded-xl bg-muted p-4 sm:items-center sm:gap-4 sm:px-5"
        >
            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-selected text-selected-foreground">
                <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
                <p className="leading-snug">
                    <span className="font-bold">Milestone: {milestone.title}</span>
                    {milestone.detail && <span className="text-muted-foreground"> · {milestone.detail}</span>}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    {next ? (
                        <>
                            Next up:{" "}
                            <Link
                                href={next.href}
                                className="font-bold text-foreground underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                            >
                                {next.name}
                            </Link>
                            .
                        </>
                    ) : (
                        "Nice work."
                    )}
                    {more > 0 && (
                        <>
                            {" "}
                            <Link
                                href="/progress#milestones"
                                className="underline decoration-border-strong decoration-2 underline-offset-4 hover:decoration-current"
                            >
                                +{more} more
                            </Link>
                        </>
                    )}
                </p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="-mt-1 -mr-2 shrink-0 sm:mt-0"
                aria-label="Dismiss milestone"
                disabled={pending}
                onClick={() =>
                    startTransition(async () => {
                        const res = await dismissMilestones({ upTo: milestone.earnedAt });
                        if (!res.ok) toast.error(res.error);
                    })
                }
            >
                {pending ? <Loader2 className="animate-spin" /> : <X />}
            </Button>
        </section>
    );
}
