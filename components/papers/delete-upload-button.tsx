"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteUpload } from "@/app/(app)/papers/actions";

export function DeleteUploadButton({ sittingId }: { sittingId: string }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (
        <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => {
                if (!confirm("Delete this upload and your attempts on it? This can't be undone.")) return;
                start(async () => {
                    const res = await deleteUpload({ sittingId });
                    if (!res.ok) toast.error(res.error);
                    else router.push("/papers");
                });
            }}
        >
            <Trash2 aria-hidden />
            Delete
        </Button>
    );
}
