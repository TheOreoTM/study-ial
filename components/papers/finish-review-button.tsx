"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { finishReview } from "@/app/(app)/papers/actions";

export function FinishReviewButton({ paperId, sittingId }: { paperId: string; sittingId: string }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <Button
            disabled={pending}
            onClick={() =>
                start(async () => {
                    const res = await finishReview({ paperId });
                    if (!res.ok) toast.error(res.error);
                    else {
                        toast.success("Questions saved");
                        router.push(`/papers/${sittingId}`);
                    }
                })
            }
        >
            Looks right
        </Button>
    );
}
