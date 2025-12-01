"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    Clock,
    MoreHorizontal,
    Pencil,
    Trash2,
    BookOpen,
    CheckCircle2,
    Circle,
    ArrowLeft,
    Target,
    Lock,
    Globe,
    TrendingUp,
    X,
    ArrowUpDown,
    SkipForward,
    ChevronsUpDown,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import {
    updateStudyPlan,
    deleteStudyPlan,
    toggleStudyPlanPrivacy,
    updateStudyPlanItemStatus,
    updateStudyPlanItemsStatus,
    deleteStudyPlanItem,
} from "@/lib/actions/studyPlans";
import type { StudyPlan, StudyPlanItem } from "@/lib/generated/prisma/client";
import { StudyPlanTaskItem } from "@/components/study-plan-task-item";
import { RenameStudyPlanDialog } from "@/components/rename-study-plan-dialog";
import { cn } from "@/lib/utils";

interface StudyPlanViewProps {
    plan: StudyPlan & { items: StudyPlanItem[] };
    initialStats: {
        totalTasks: number;
        completedTasks: number;
        completionPercentage: number;
        totalMinutes: number;
        completedMinutes: number;
    };
    isReadOnly?: boolean;
}

function formatDate(date: Date | string | null | undefined) {
    if (!date) return "-";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function groupItemsByDay(items: StudyPlanItem[]) {
    const groups: Record<string, StudyPlanItem[]> = {};
    for (const item of items) {
        const d = item.dueDate instanceof Date ? item.dueDate : new Date(item.dueDate);
        const key = d.toISOString().split("T")[0];
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    }
    return groups;
}

type SortOption = "date" | "status" | "type";

export function StudyPlanView({ plan, initialStats, isReadOnly = false }: StudyPlanViewProps) {
    const router = useRouter();
    const [items, setItems] = useState<StudyPlanItem[]>(
        isReadOnly
            ? (plan.items || []).map((item) => ({ ...item, status: "PENDING" as StudyPlanItem["status"] }))
            : plan.items || []
    );
    const [planName, setPlanName] = useState(plan.name);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublic, setIsPublic] = useState(plan.isPublic || false);
    const [isTogglingPrivacy, setIsTogglingPrivacy] = useState(false);

    // Bulk Actions & Sorting State
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [sortOption, setSortOption] = useState<SortOption>("date");

    const settings: any = plan.settings || {};

    // Derived stats from local state
    const stats = useMemo(() => {
        const total = items.length;
        const completed = items.filter((i) => i.status === "DONE").length;
        const inProgress = items.filter((i) => i.status === "IN_PROGRESS").length;
        const pending = items.filter((i) => i.status === "PENDING").length;
        const skipped = items.filter((i) => i.status === "SKIPPED").length;
        const completionPercentage = total > 0 ? (completed / total) * 100 : 0;

        return {
            total,
            completed,
            inProgress,
            pending,
            skipped,
            completionPercentage,
        };
    }, [items]);

    const sortedItems = useMemo(() => {
        const sorted = [...items];
        switch (sortOption) {
            case "date":
                sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                break;
            case "status":
                const statusOrder = { IN_PROGRESS: 0, PENDING: 1, DONE: 2, SKIPPED: 3 };
                sorted.sort(
                    (a, b) =>
                        (statusOrder[a.status as keyof typeof statusOrder] || 0) -
                        (statusOrder[b.status as keyof typeof statusOrder] || 0)
                );
                break;
            case "type":
                sorted.sort((a, b) => a.taskType.localeCompare(b.taskType));
                break;
        }
        return sorted;
    }, [items, sortOption]);

    const grouped = useMemo(() => groupItemsByDay(sortedItems), [sortedItems]);
    const dateKeys = Object.keys(grouped);

    if (sortOption === "date") {
        dateKeys.sort();
    }

    const start = plan.startDate as any;
    const end = plan.endDate as any;

    async function handleStatusChange(itemId: string, newStatus: "PENDING" | "IN_PROGRESS" | "DONE" | "SKIPPED") {
        // Optimistic update
        setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)));

        try {
            await updateStudyPlanItemStatus(itemId, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    }

    async function handleRename(newName: string) {
        try {
            await updateStudyPlan(plan.id, { name: newName });
            setPlanName(newName);
            toast.success("Plan renamed", {
                description: "Study plan name has been updated successfully.",
            });
        } catch (error) {
            toast.error("Error", {
                description: "Failed to rename study plan.",
            });
            throw error; // Re-throw so the dialog knows it failed
        }
    }

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await deleteStudyPlan(plan.id);
            toast.success("Plan deleted", {
                description: "Study plan has been deleted successfully.",
            });
            router.push("/study-plans/me");
        } catch (error) {
            toast.error("Error", {
                description: "Failed to delete study plan.",
            });
            setIsDeleting(false);
        }
    }

    async function handlePrivacyToggle(checked: boolean) {
        setIsTogglingPrivacy(true);
        // Optimistic update
        setIsPublic(checked);

        try {
            await toggleStudyPlanPrivacy(plan.id, checked);
            toast.success(checked ? "Plan is now Public" : "Plan is now Private", {
                description: checked
                    ? "Your study plan is visible in the marketplace."
                    : "Your study plan is only visible to you.",
            });
        } catch (error) {
            // Revert on failure
            setIsPublic(!checked);
            toast.error("Error", {
                description: "Failed to update privacy settings.",
            });
        } finally {
            setIsTogglingPrivacy(false);
        }
    }

    // Bulk Selection Handlers
    function handleSelect(itemId: string, selected: boolean) {
        const newSelected = new Set(selectedItems);
        if (selected) {
            newSelected.add(itemId);
        } else {
            newSelected.delete(itemId);
        }
        setSelectedItems(newSelected);
    }

    function handleSelectAll() {
        if (selectedItems.size === items.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(items.map((i) => i.id)));
        }
    }

    async function handleBulkStatusChange(status: "PENDING" | "IN_PROGRESS" | "DONE" | "SKIPPED") {
        const itemIds = Array.from(selectedItems);

        // Optimistic update
        setItems((prevItems) => prevItems.map((item) => (selectedItems.has(item.id) ? { ...item, status } : item)));
        setSelectedItems(new Set());

        try {
            await updateStudyPlanItemsStatus(itemIds, status);
            toast.success("Tasks updated");
        } catch (error) {
            console.error("Failed to bulk update status", error);
            toast.error("Failed to update tasks");
        }
    }

    async function handleBulkDelete() {
        const itemIds = Array.from(selectedItems);

        // Optimistic update
        setItems((prevItems) => prevItems.filter((item) => !selectedItems.has(item.id)));
        setSelectedItems(new Set());

        try {
            await Promise.all(itemIds.map((id) => deleteStudyPlanItem(id)));
            toast.success("Tasks deleted");
        } catch (error) {
            console.error("Failed to bulk delete items", error);
            toast.error("Failed to delete tasks");
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
                            <Link href="/study-plans/me">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            {plan.generatedByModel && (
                                <div>
                                    <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                                        AI Generated
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{planName}</h1>

                                <div className="flex items-center gap-3 shrink-0">
                                    {!isReadOnly && (
                                        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border border-border">
                                            <Switch
                                                id="privacy-mode"
                                                checked={isPublic}
                                                onCheckedChange={handlePrivacyToggle}
                                                disabled={isTogglingPrivacy || isReadOnly}
                                            />
                                            <Label
                                                htmlFor="privacy-mode"
                                                className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                            >
                                                {isPublic ? (
                                                    <>
                                                        <Globe className="w-4 h-4 text-primary" />
                                                        <span className="hidden sm:inline">Public</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                                        <span className="hidden sm:inline">Private</span>
                                                    </>
                                                )}
                                            </Label>
                                        </div>
                                    )}

                                    {!isReadOnly && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Rename Plan
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
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional info below */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {format(new Date(start), "MMM d")} - {format(new Date(end), "MMM d, yyyy")}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{String(plan.totalTargetHours)}h total</span>
                            </div>
                            {settings.goal && (
                                <div className="flex items-center gap-1.5">
                                    <Target className="w-4 h-4" />
                                    <span className="capitalize">{settings.goal.replace(/_/g, " ")}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="text-primary">{stats.completionPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={stats.completionPercentage} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Total Tasks",
                            value: stats.total,
                            icon: BookOpen,
                            color: "text-blue-500",
                            bg: "bg-blue-500/10",
                        },
                        {
                            label: "Completed",
                            value: stats.completed,
                            icon: CheckCircle2,
                            color: "text-emerald-500",
                            bg: "bg-emerald-500/10",
                        },
                        {
                            label: "In Progress",
                            value: stats.inProgress,
                            icon: Clock,
                            color: "text-amber-500",
                            bg: "bg-amber-500/10",
                        },
                        {
                            label: "Remaining",
                            value: stats.pending + stats.skipped,
                            icon: TrendingUp,
                            color: "text-purple-500",
                            bg: "bg-purple-500/10",
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Schedule */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Your Schedule</h2>
                            <div className="flex items-center gap-2">
                                {!isReadOnly && (
                                    <>
                                        <Checkbox
                                            checked={selectedItems.size === items.length && items.length > 0}
                                            onCheckedChange={handleSelectAll}
                                            id="select-all"
                                        />
                                        <Label
                                            htmlFor="select-all"
                                            className="text-sm text-muted-foreground cursor-pointer"
                                        >
                                            Select All
                                        </Label>
                                    </>
                                )}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <ArrowUpDown className="h-4 w-4" />
                                    Sort by: <span className="capitalize">{sortOption}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Sort Tasks</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortOption("date")}>Date</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("status")}>Status</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("type")}>Type</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {dateKeys.length === 0 ? (
                        <div className="text-center py-12 bg-card/50 rounded-3xl border border-dashed border-border">
                            <p className="text-muted-foreground">This plan has no tasks yet.</p>
                        </div>
                    ) : (
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:left-[8.75rem] md:before:ml-0 md:before:right-auto before:h-full before:w-0.5 before:bg-border">
                            {dateKeys.map((dateKey) => {
                                const dateObj = new Date(dateKey);
                                const dayItems = grouped[dateKey];
                                const today = new Date().toISOString().split("T")[0];
                                const isToday = dateKey === today;
                                const isPast = dateKey < today;

                                return (
                                    <div key={dateKey} className="relative flex items-start md:gap-6 group">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 ml-5 -translate-x-1/2 md:left-[8.75rem] md:ml-0 md:-translate-x-1/2 mt-1.5 h-3 w-3 rounded-full border border-border bg-background ring-4 ring-background" />

                                        {/* Date Column (Desktop) */}
                                        <div className="hidden md:flex flex-col items-end w-32 shrink-0 pt-1">
                                            <span
                                                className={cn(
                                                    "text-sm font-bold",
                                                    isToday ? "text-primary" : "text-foreground",
                                                    isPast ? "text-muted-foreground/60" : ""
                                                )}
                                            >
                                                {dateObj.toLocaleDateString(undefined, { weekday: "long" })}
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-xs text-muted-foreground",
                                                    isPast ? "text-muted-foreground/60" : ""
                                                )}
                                            >
                                                {dateObj.toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pl-10 md:pl-0">
                                            {/* Date Header (Mobile) */}
                                            <div className="md:hidden mb-3 flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "text-sm font-bold",
                                                        isToday ? "text-primary" : "text-foreground",
                                                        isPast ? "text-muted-foreground" : ""
                                                    )}
                                                >
                                                    {formatDate(dateObj)}
                                                </span>
                                                {isToday && (
                                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                        Today
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                {dayItems.map((item) => (
                                                    <StudyPlanTaskItem
                                                        key={item.id}
                                                        item={item}
                                                        onStatusChange={
                                                            isReadOnly ? async () => {} : handleStatusChange
                                                        }
                                                        isSelected={selectedItems.has(item.id)}
                                                        onSelect={handleSelect}
                                                        selectionMode={selectedItems.size > 0}
                                                        planId={plan.id}
                                                        isReadOnly={isReadOnly}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            {/* Floating Action Bar */}
            <AnimatePresence>
                {selectedItems.size > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50"
                    >
                        <div className="bg-secondary-foreground border text-foreground rounded-full shadow-lg p-2 pl-6 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="font-medium whitespace-nowrap">{selectedItems.size} selected</span>
                                <div className="h-4 w-px bg-background/20" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                    onClick={() => setSelectedItems(new Set())}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear
                                </Button>
                            </div>

                            <div className="flex items-center gap-1">
                                {/* Desktop View */}
                                <div className="hidden md:flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                        onClick={() => handleBulkStatusChange("DONE")}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Done
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                        onClick={() => handleBulkStatusChange("IN_PROGRESS")}
                                    >
                                        <Clock className="h-4 w-4 mr-1" />
                                        In Progress
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                        onClick={() => handleBulkStatusChange("PENDING")}
                                    >
                                        <Circle className="h-4 w-4 mr-1" />
                                        Pending
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                        onClick={() => handleBulkStatusChange("SKIPPED")}
                                    >
                                        <SkipForward className="h-4 w-4 mr-1" />
                                        Skip
                                    </Button>
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                            >
                                                <ChevronsUpDown className="h-4 w-4 mr-1" />
                                                Status
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleBulkStatusChange("DONE")}>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Done
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleBulkStatusChange("IN_PROGRESS")}>
                                                <Clock className="h-4 w-4 mr-2" />
                                                In Progress
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleBulkStatusChange("PENDING")}>
                                                <Circle className="h-4 w-4 mr-2" />
                                                Pending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleBulkStatusChange("SKIPPED")}>
                                                <SkipForward className="h-4 w-4 mr-2" />
                                                Skip
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="h-4 w-px bg-background/20 mx-1" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8"
                                    onClick={handleBulkDelete}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rename Dialog */}
            <RenameStudyPlanDialog
                open={isRenameOpen}
                onOpenChange={setIsRenameOpen}
                currentName={planName}
                onRename={handleRename}
            />

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Study Plan</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this study plan? This action cannot be undone.
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
        </div>
    );
}
