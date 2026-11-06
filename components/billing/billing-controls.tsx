"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cancelAction, resumeAction, startTrialAction, subscribeAction } from "@/app/(app)/billing/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Result = { ok: true } | { ok: false; error: string };

/** Runs a billing action; refreshes the page on success, toasts the error otherwise. */
function useBillingAction() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const run = (fn: () => Promise<Result>, done?: string) =>
        startTransition(async () => {
            const res = await fn().catch(() => null);
            // A successful subscribe redirects to the payment page and never returns here.
            if (!res) return void toast.error("Something went wrong. Check your connection and try again.");
            if (!res.ok) return void toast.error(res.error);
            if (done) toast.success(done);
            router.refresh();
        });
    return { pending, run };
}

export function StartTrialButton() {
    const { pending, run } = useBillingAction();
    return (
        <Button onClick={() => run(startTrialAction, "Your free week of Pro has started.")} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Start your free week
        </Button>
    );
}

export function SubscribeButton({ label, variant = "default" }: { label: string; variant?: "default" | "outline" }) {
    const { pending, run } = useBillingAction();
    return (
        <Button variant={variant} onClick={() => run(subscribeAction)} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <CreditCard />}
            {label}
        </Button>
    );
}

export function ResumeButton() {
    const { pending, run } = useBillingAction();
    return (
        <Button onClick={() => run(resumeAction, "Pro will renew as usual.")} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            Keep renewing
        </Button>
    );
}

export function CancelButton({ until }: { until: string }) {
    const [open, setOpen] = useState(false);
    const { pending, run } = useBillingAction();
    return (
        <Dialog open={open} onOpenChange={(o) => !pending && setOpen(o)}>
            <DialogTrigger asChild>
                <Button variant="outline">Cancel renewal</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stop renewing Pro?</DialogTitle>
                    <DialogDescription>
                        You keep Pro until {until}, then AI marking and the AI tutor switch off. Nothing else changes,
                        and you can switch renewal back on until then.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={pending}>
                            Keep Pro
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        disabled={pending}
                        onClick={() => {
                            run(cancelAction, `Pro won't renew. It runs until ${until}.`);
                            setOpen(false);
                        }}
                    >
                        {pending && <Loader2 className="animate-spin" />}
                        Cancel renewal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
