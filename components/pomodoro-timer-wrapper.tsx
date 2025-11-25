"use client";

import { PomodoroTimer } from "@/components/pomodoro-timer";
import { updateStudyPlanItemStatus } from "@/lib/actions/studyPlans";
import { toast } from "sonner";

interface PomodoroTimerWrapperProps {
    taskId?: string;
    initialStatus?: string;
}

export function PomodoroTimerWrapper({ taskId, initialStatus }: PomodoroTimerWrapperProps) {
    const handleTimerStart = async () => {
        if (taskId && initialStatus === "pending") {
            try {
                await updateStudyPlanItemStatus(taskId, "in_progress");
                toast.success("Task marked as In Progress");
            } catch (error) {
                console.error("Failed to update task status:", error);
                toast.error("Failed to update task status");
            }
        }
    };

    const handleTimerComplete = async () => {
        // Optional: Could prompt to mark as done, or just play sound (handled by Timer component)
        toast.success("Focus session complete! Take a break.");
    };

    return <PomodoroTimer taskId={taskId} onTimerStart={handleTimerStart} onTimerComplete={handleTimerComplete} />;
}
