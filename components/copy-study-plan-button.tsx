"use client";

import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { copyStudyPlan } from "@/lib/actions/studyPlans";
import { toast } from "sonner";

interface CopyStudyPlanButtonProps {
    planId: string;
    userId: string;
}

export function CopyStudyPlanButton({ planId, userId }: CopyStudyPlanButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleCopy(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            await copyStudyPlan(planId, userId);
            toast.success("Study Plan Copied", {
                description: "The study plan has been added to your personal collection.",
            });
            router.push("/study-plans/me");
        } catch (error) {
            console.error("Failed to copy plan", error);
            toast.error("Error", {
                description: "Failed to copy study plan. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button variant="secondary" size="sm" className="gap-2" onClick={handleCopy} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            Copy to My Plans
        </Button>
    );
}
