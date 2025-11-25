"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MoreHorizontal, BookOpen, ArrowRight, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { StudyPlan } from "@/lib/db/schema";
import { deleteStudyPlan, toggleStudyPlanArchive, getStudyPlanStatistics } from "@/lib/actions/studyPlans";

interface StudyPlanCardProps {
    plan: StudyPlan;
    stats?: {
        completionPercentage: number;
    };
}

export function StudyPlanCard({ plan, stats: initialStats }: StudyPlanCardProps) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);

    // We can fetch stats here if not provided, but for list view passing them is better.
    // For now, we'll assume stats are passed or we show a simplified view.
    const progress = initialStats?.completionPercentage?.toFixed(0) || "0";

    const settings: any = plan.settings || {};
    const isArchived = settings.isArchived === true;

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await deleteStudyPlan(plan.id);
            toast.success("Plan deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete plan");
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    }

    async function handleToggleArchive() {
        setIsArchiving(true);
        try {
            await toggleStudyPlanArchive(plan.id, !isArchived);
            toast.success(isArchived ? "Plan restored" : "Plan archived");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update plan");
        } finally {
            setIsArchiving(false);
        }
    }

    const start = plan.startDate ? new Date(plan.startDate) : null;
    const end = plan.endDate ? new Date(plan.endDate) : null;

    return (
        <>
            <div className="group relative h-full bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <Link href={`/study-plans/${plan.id}`} className="block">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1 truncate">
                                {plan.name}
                            </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground truncate">
                            {settings.goal ? `Goal: ${String(settings.goal).replace(/_/g, " ")}` : "Custom Plan"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 -mr-2">
                                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleToggleArchive} disabled={isArchiving}>
                                    {isArchived ? (
                                        <>
                                            <ArchiveRestore className="w-4 h-4 mr-2" />
                                            Restore Plan
                                        </>
                                    ) : (
                                        <>
                                            <Archive className="w-4 h-4 mr-2" />
                                            Archive Plan
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setIsDeleteOpen(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Plan
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <Link href={`/study-plans/${plan.id}`} className="flex-1 space-y-6 block">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                Timeline
                            </p>
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="truncate">
                                    {start && end ? `${format(start, "MMM d")} – ${format(end, "MMM d")}` : "TBD"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                Commitment
                            </p>
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>
                                    {plan.totalTargetHours ? `${Number(plan.totalTargetHours).toFixed(1)}h` : "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex justify-between text-xs font-semibold tracking-wide">
                            <span className="text-muted-foreground">PROGRESS</span>
                            <span className="text-primary text-lg">{progress}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </Link>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-medium text-primary">
                    <Link href={`/study-plans/${plan.id}`} className="flex items-center gap-2 hover:underline">
                        <span>Continue Learning</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Study Plan</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Plan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
