"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Clock, FileText, PauseCircle, SkipForward } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { StudyPlanItem } from "@/lib/actions/studyPlans";

interface StudyPlanTaskItemProps {
    item: StudyPlanItem & { topics?: any[] };
    onStatusChange?: (itemId: string, newStatus: "pending" | "in_progress" | "done" | "skipped") => Promise<void>;
    isSelected?: boolean;
    onSelect?: (itemId: string, selected: boolean) => void;
    selectionMode?: boolean;
    planId: string;
    isReadOnly?: boolean;
}

export function StudyPlanTaskItem({
    item,
    onStatusChange,
    isSelected = false,
    onSelect,
    selectionMode = false,
    planId,
    isReadOnly = false,
}: StudyPlanTaskItemProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleStatusChange(newStatus: "pending" | "in_progress" | "done" | "skipped") {
        if (isLoading || !onStatusChange) return;
        setIsLoading(true);
        try {
            await onStatusChange(item.id, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleItemClick = () => {
        if (!selectionMode) {
            router.push(`/study-plans/${planId}/tasks/${item.id}`);
        }
    };

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
            icon: SkipForward,
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

    const currentConfig = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = currentConfig.icon;

    const metadata: any = item.metadata || {};
    const topicNames: string[] = item.topics?.map((t) => t.name) || metadata.topics || [];
    const description: string | undefined = metadata.description;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleItemClick}
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md cursor-pointer",
                item.status === "done" ? "opacity-75 hover:opacity-100" : "",
                currentConfig.border,
                isSelected && "ring-2 ring-primary ring-offset-2"
            )}
        >
            <div className="flex items-start gap-4 p-4">
                <div className="flex flex-col items-center gap-2 mt-1">
                    {/* Status Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering row click if any
                            let nextStatus: "pending" | "done" = "done";
                            if (item.status === "done" || item.status === "skipped") {
                                nextStatus = "pending";
                            }
                            handleStatusChange(nextStatus);
                        }}
                        disabled={isLoading || isReadOnly}
                        className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            item.status === "pending" &&
                                "border-2 border-neutral-300 hover:border-primary dark:border-neutral-600",
                            item.status !== "pending" && currentConfig.color,
                            isReadOnly && "cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <StatusIcon className="h-6 w-6" />
                        )}
                    </button>

                    {/* Selection Checkbox */}
                    {!isReadOnly && (
                        <div
                            className={cn(
                                "flex items-center justify-center transition-all duration-200 overflow-hidden",
                                selectionMode || isSelected
                                    ? "h-6 opacity-100"
                                    : "h-0 opacity-0 group-hover:h-6 group-hover:opacity-100"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => onSelect?.(item.id, checked as boolean)}
                                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3
                            className={cn(
                                "font-medium leading-none transition-all",
                                item.status === "done" ? "text-muted-foreground line-through" : "text-foreground"
                            )}
                        >
                            <span className="capitalize">{item.taskType.replace(/_/g, " ")}</span>
                        </h3>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {/* Status Badge with Select */}
                            <Select
                                value={item.status}
                                onValueChange={(val) => handleStatusChange(val as any)}
                                disabled={isLoading || isReadOnly}
                            >
                                <SelectTrigger
                                    className={cn(
                                        "h-auto w-auto gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border-0 ring-0 focus:ring-0 focus:ring-offset-0",
                                        currentConfig.bg,
                                        currentConfig.color
                                    )}
                                >
                                    <StatusIcon className="h-3 w-3" />
                                    <span className="mr-1">{currentConfig.label}</span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="done">Completed</SelectItem>
                                    <SelectItem value="skipped">Skipped</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {(item.targetQuestionsCount || item.targetMinutes) && (
                            <div className="flex items-center gap-3 border-r border-border pr-3">
                                {item.targetQuestionsCount && (
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {item.targetQuestionsCount} Qs
                                    </span>
                                )}
                                {item.targetMinutes && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {item.targetMinutes}m
                                    </span>
                                )}
                            </div>
                        )}

                        {topicNames.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {topicNames.slice(0, 3).map((t) => (
                                    <span
                                        key={t}
                                        className="rounded-md bg-secondary px-1.5 py-0.5 text-secondary-foreground"
                                    >
                                        {t}
                                    </span>
                                ))}
                                {topicNames.length > 3 && (
                                    <span className="px-1.5 py-0.5">+{topicNames.length - 3} more</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar for "In Progress" items */}
            {item.status === "in_progress" && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-500/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: "50%" }} className="h-full bg-blue-500" />
                </div>
            )}
        </motion.div>
    );
}
