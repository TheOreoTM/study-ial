import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
    ArrowLeft,
    Calendar,
    Clock,
    FileText,
    ChevronRight,
    BookOpen,
    Link as LinkIcon,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { getStudyPlanItem } from "@/lib/actions/studyPlans";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskStatusActions } from "@/components/task-status-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string; taskId: string }> }) {
    const { taskId, id } = await params;
    const task = await getStudyPlanItem(taskId);

    if (!task) {
        notFound();
    }

    const { userId } = await auth();
    const isOwner = (task as any).userId === userId;
    const isPublic = (task as any).isPublic;

    if (!isOwner && !isPublic) {
        notFound();
    }

    const isReadOnly = !isOwner;

    const metadata: any = task.metadata || {};
    const description: string | undefined = metadata.description;
    const resources: any[] = metadata.resources || [];
    const notes: string | undefined = metadata.notes;

    const isOverdue = task.status === "pending" && new Date(task.dueDate) < new Date();
    const isDone = task.status === "done";

    // In readonly mode, force status to pending for display if requested,
    // but for task details it might be better to show actual status or pending?
    // User said "all the tasks should be set to pending" for the preview.
    // Let's force display status to pending if readonly to match the preview.
    const displayStatus = isReadOnly ? "pending" : task.status;
    const isDisplayDone = displayStatus === "done";

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Breadcrumb Header */}
            <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto max-w-5xl py-3 px-4 md:px-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link
                            href={isReadOnly ? "/study-plans" : "/study-plans/me"}
                            className="hover:text-foreground transition-colors"
                        >
                            {isReadOnly ? "Marketplace" : "Study Plans"}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href={`/study-plans/${id}`} className="hover:text-foreground transition-colors">
                            {(task as any).planName || "Plan"}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium capitalize">
                            {task.taskType.replace(/_/g, " ")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl py-8 px-4 md:px-6 space-y-8">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge
                                variant={isDisplayDone ? "default" : "outline"}
                                className={cn(
                                    "px-3 py-1 text-sm capitalize",
                                    isDisplayDone && "bg-emerald-500 hover:bg-emerald-600",
                                    displayStatus === "in_progress" && "border-blue-500 text-blue-500",
                                    displayStatus === "skipped" && "border-amber-500 text-amber-500"
                                )}
                            >
                                {displayStatus.replace(/_/g, " ")}
                            </Badge>
                            {isOverdue && (
                                <Badge variant="destructive" className="px-3 py-1 text-sm">
                                    Overdue
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold capitalize tracking-tight">
                            {task.taskType.replace(/_/g, " ")}
                        </h1>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
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
                            {task.completedAt && (
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Completed on {new Date(task.completedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isReadOnly && <TaskStatusActions itemId={task.id} currentStatus={task.status} />}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-base">
                                        {description || "No description provided for this task."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resources */}
                        {resources.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        Resources
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3">
                                        {resources.map((resource: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded bg-background border flex items-center justify-center">
                                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {resource.title || "Resource"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {resource.type || "Link"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {resource.url && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a
                                                            href={resource.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Open
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notes (Placeholder for future) */}
                        {notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Task Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {task.targetMinutes && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-sm">Target Time</span>
                                        </div>
                                        <span className="font-medium">{task.targetMinutes} min</span>
                                    </div>
                                )}
                                {task.targetQuestionsCount && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="text-sm">Questions</span>
                                        </div>
                                        <span className="font-medium">{task.targetQuestionsCount}</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-muted-foreground mb-3">Topics Covered</p>
                                    <div className="flex flex-wrap gap-2">
                                        {task.topics && task.topics.length > 0 ? (
                                            task.topics.map((topic: any) => (
                                                <Badge
                                                    key={topic.id}
                                                    variant="secondary"
                                                    className="px-2.5 py-0.5 text-xs font-normal"
                                                >
                                                    {topic.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">
                                                No specific topics
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
