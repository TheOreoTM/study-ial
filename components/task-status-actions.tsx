"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, PauseCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStudyPlanItemStatus } from "@/lib/actions/studyPlans";
import { cn } from "@/lib/utils";

interface TaskStatusActionsProps {
    itemId: string;
    currentStatus: string;
}

export function TaskStatusActions({ itemId, currentStatus }: TaskStatusActionsProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const statusConfig = {
        done: {
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            label: "Completed",
        },
        in_progress: {
            icon: PauseCircle,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            label: "In Progress",
        },
        skipped: {
            icon: XCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            label: "Skipped",
        },
        pending: {
            icon: Circle,
            color: "text-neutral-400",
            bg: "bg-neutral-100 dark:bg-neutral-800",
            border: "border-neutral-200 dark:border-neutral-800",
            label: "Pending",
        },
    };

    async function handleStatusChange(newStatus: string) {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await updateStudyPlanItemStatus(itemId, newStatus as any);
            setStatus(newStatus);
            router.refresh();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsLoading(false);
        }
    }

    const currentConfig = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = currentConfig.icon;

    return (
        <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
            <SelectTrigger
                className={cn(
                    "w-auto gap-2 rounded-full px-4 py-2 font-medium border transition-all",
                    currentConfig.bg,
                    currentConfig.border,
                    currentConfig.color
                )}
            >
                <div className="flex items-center gap-2">
                    {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                        <StatusIcon className="h-4 w-4" />
                    )}
                    <span>{currentConfig.label}</span>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-neutral-400" />
                        <span>Pending</span>
                    </div>
                </SelectItem>
                <SelectItem value="in_progress">
                    <div className="flex items-center gap-2">
                        <PauseCircle className="h-4 w-4 text-blue-500" />
                        <span>In Progress</span>
                    </div>
                </SelectItem>
                <SelectItem value="done">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>Completed</span>
                    </div>
                </SelectItem>
                <SelectItem value="skipped">
                    <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-amber-500" />
                        <span>Skipped</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
