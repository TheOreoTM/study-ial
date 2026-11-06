"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startExam } from "@/app/(app)/papers/exam-actions";

export function StartExamButton({ sittingId, label = "Start the clock" }: { sittingId: string; label?: string }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <Button
            disabled={pending}
            onClick={() =>
                start(async () => {
                    const res = await startExam({ sittingId });
                    if (!res.ok) toast.error(res.error);
                    else router.refresh();
                })
            }
        >
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Timer aria-hidden />}
            {label}
        </Button>
    );
}
