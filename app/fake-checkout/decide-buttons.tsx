"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FakeOutcome } from "@/lib/payments/fake";
import { decideFake } from "./actions";

const CHOICES: { outcome: FakeOutcome; label: string; variant: "default" | "outline" }[] = [
    { outcome: "approve", label: "Approve payment", variant: "default" },
    { outcome: "approve-renewals-fail", label: "Approve, but decline later renewals", variant: "outline" },
    { outcome: "decline", label: "Decline", variant: "outline" },
];

export function DecideButtons({ checkoutRef }: { checkoutRef: string }) {
    const [pending, startTransition] = useTransition();
    return (
        <div className="grid gap-2">
            {CHOICES.map((c) => (
                <Button
                    key={c.outcome}
                    variant={c.variant}
                    disabled={pending}
                    onClick={() =>
                        startTransition(async () => {
                            const back = await decideFake({ ref: checkoutRef, outcome: c.outcome });
                            window.location.assign(back);
                        })
                    }
                >
                    {pending && c.outcome === "approve" && <Loader2 className="animate-spin" />}
                    {c.label}
                </Button>
            ))}
        </div>
    );
}
