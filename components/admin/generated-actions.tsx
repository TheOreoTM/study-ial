"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteQuestion, setQuestionStatus } from "@/app/(app)/admin/actions";

export function GeneratedActions({ id, flagged }: { id: string; flagged: boolean }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <div className="flex flex-wrap gap-2">
            <Button
                size="sm"
                variant={flagged ? "outline" : "default"}
                disabled={pending}
                onClick={() =>
                    start(async () => {
                        if (flagged && !confirm("This draft was flagged. Publish it anyway?")) return;
                        const res = await setQuestionStatus({ ids: [id], status: "PUBLISHED" });
                        if (!res.ok) toast.error(res.error);
                        else router.refresh();
                    })
                }
            >
                Publish
            </Button>
            <Button asChild size="sm" variant="outline">
                <Link href={`/admin/questions/${id}`}>Edit</Link>
            </Button>
            <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() =>
                    start(async () => {
                        if (!confirm("Delete this draft?")) return;
                        const res = await deleteQuestion(id);
                        if (!res.ok) toast.error(res.error);
                        else router.refresh();
                    })
                }
            >
                Delete
            </Button>
        </div>
    );
}
