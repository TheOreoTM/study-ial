import { Suspense } from "react";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { getStudyPlanItem } from "@/lib/actions/studyPlans";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PomodoroTimerWrapper } from "@/components/pomodoro-timer-wrapper";

interface FocusPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FocusPage({ searchParams }: FocusPageProps) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        redirect("/handler/sign-in");
    }

    const params = await searchParams;
    const taskId = typeof params.taskId === "string" ? params.taskId : undefined;
    const planId = typeof params.planId === "string" ? params.planId : undefined;

    let task = null;

    if (taskId) {
        task = await getStudyPlanItem(taskId);

        // Security check: Ensure task belongs to the user
        if (!task || task.userId !== userId) {
            // If task doesn't exist or doesn't belong to user, redirect to standalone focus mode (remove params)
            redirect("/pomodoro");
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Minimal Header */}
            <header className="p-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={taskId && planId ? `/study-plans/${planId}/tasks/${taskId}` : "/study-plans/me"}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {taskId ? "Back to Task" : "Exit Focus Mode"}
                    </Link>
                </Button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-8 text-center">
                    {task ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                Current Task
                            </h2>
                            <h1 className="text-3xl md:text-4xl font-bold capitalize tracking-tight">
                                {task.taskType.replace(/_/g, " ")}
                            </h1>
                            {task.metadata && (task.metadata as any).description && (
                                <p className="text-muted-foreground max-w-md mx-auto line-clamp-2">
                                    {(task.metadata as any).description}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Zen Mode</h1>
                            <p className="text-muted-foreground">Focus on your work, distraction-free.</p>
                        </div>
                    )}

                    <div className="animate-in fade-in zoom-in duration-700 delay-150">
                        <PomodoroTimerWrapper taskId={taskId} initialStatus={task?.status} />
                    </div>
                </div>
            </main>
        </div>
    );
}
