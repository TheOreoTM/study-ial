"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ScanText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getParseStatus, requestParse } from "@/app/(app)/papers/actions";

export function RequestParseButton({ paperId, vision = false, label, variant = "outline" }: { paperId: string; vision?: boolean; label?: string; variant?: "outline" | "default" | "ghost" }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <Button
            variant={variant}
            disabled={pending}
            onClick={() =>
                start(async () => {
                    const res = await requestParse({ paperId, vision });
                    if (!res.ok) toast.error(res.error);
                    router.refresh();
                })
            }
        >
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : vision ? <Sparkles aria-hidden /> : <ScanText aria-hidden />}
            {label ?? (vision ? "Re-read with AI" : "Read the questions")}
        </Button>
    );
}

/** Polls while a parse is queued or running, then refreshes the page. */
export function ParsePoller({ paperId, status }: { paperId: string; status: string }) {
    const router = useRouter();
    const [current, setCurrent] = useState(status);
    useEffect(() => {
        if (current !== "QUEUED" && current !== "PARSING") return;
        const t = setInterval(async () => {
            const res = await getParseStatus({ paperId });
            if (res.ok && res.status !== current) {
                setCurrent(res.status);
                router.refresh();
            }
        }, 4000);
        return () => clearInterval(t);
    }, [current, paperId, router]);
    return (
        <p className="flex items-center gap-2 font-semibold" role="status">
            <Loader2 className="size-4 animate-spin text-selected-foreground" aria-hidden />
            {current === "QUEUED" ? "Waiting to read the questions…" : "Reading the questions…"}
        </p>
    );
}
