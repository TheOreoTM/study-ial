import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react";
import { getStudyPlanItem } from "@/lib/actions/studyPlans";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskStatusActions } from "@/components/task-status-actions";

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string; taskId: string }> }) {
    const { taskId, id } = await params;
    const task = await getStudyPlanItem(taskId);

    if (!task) {
        notFound();
    }

    const metadata: any = task.metadata || {};
    const description: string | undefined = metadata.description;

    return (
        <div className="container max-w-3xl py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/study-plans/${id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold capitalize">{task.taskType.replace(/_/g, " ")}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Due{" "}
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <TaskStatusActions itemId={task.id} currentStatus={task.status} />
            </div>

            {/* Main Content */}
            <div className="grid gap-6">
                {/* Description */}
                <div className="p-6 rounded-2xl border bg-card space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Description
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {description || "No description provided for this task."}
                        </p>
                    </div>
                </div>

                {/* Topics */}
                {task.topics && task.topics.length > 0 && (
                    <div className="p-6 rounded-2xl border bg-card space-y-4">
                        <h2 className="text-lg font-semibold">Topics Covered</h2>
                        <div className="flex flex-wrap gap-2">
                            {task.topics.map((topic: any) => (
                                <Badge key={topic.id} variant="secondary" className="px-3 py-1 text-sm">
                                    {topic.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Task Stats */}
                {(task.targetQuestionsCount || task.targetMinutes) && (
                    <div className="grid grid-cols-2 gap-4">
                        {task.targetQuestionsCount && (
                            <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Target Questions</p>
                                    <p className="text-xl font-bold">{task.targetQuestionsCount}</p>
                                </div>
                            </div>
                        )}
                        {task.targetMinutes && (
                            <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Target Time</p>
                                    <p className="text-xl font-bold">{task.targetMinutes} min</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
