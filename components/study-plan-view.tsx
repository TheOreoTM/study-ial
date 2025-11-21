"use client";

import { useState, useMemo } from "react";
import {
    Calendar,
    Clock,
    ArrowLeft,
    CheckCircle2,
    TrendingUp,
    BookOpen,
    Pencil,
    Trash2,
    AlertTriangle,
    CheckSquare,
    X,
    ArrowUpDown,
    Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudyPlanTaskItem } from "@/components/study-plan-task-item";
import {
    updateStudyPlanItemStatus,
    updateStudyPlan,
    deleteStudyPlan,
    deleteStudyPlanItem,
} from "@/lib/actions/studyPlans";
import type { StudyPlan, StudyPlanItem } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface StudyPlanViewProps {
    plan: StudyPlan & { items: (StudyPlanItem & { topics?: any[] })[] };
    initialStats: {
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
        skipped: number;
        completionPercentage: number;
    };
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

function groupItemsByDay(items: (StudyPlanItem & { topics?: any[] })[]) {
    const groups: Record<string, typeof items> = {};
    for (const item of items) {
        const d = item.dueDate instanceof Date ? item.dueDate : new Date(item.dueDate);
        const key = d.toISOString().split("T")[0];
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    }
    return groups;
}

type SortOption = "date" | "status" | "type";

export function StudyPlanView({ plan, initialStats }: StudyPlanViewProps) {
    const router = useRouter();
    const [items, setItems] = useState(plan.items || []);
    const [planName, setPlanName] = useState(plan.name);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [newName, setNewName] = useState(plan.name);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);

    // Bulk Actions & Sorting State
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [sortOption, setSortOption] = useState<SortOption>("date");

    // Derived stats from local state
    const stats = useMemo(() => {
        const total = items.length;
        const completed = items.filter((i) => i.status === "done").length;
        const inProgress = items.filter((i) => i.status === "in_progress").length;
        const pending = items.filter((i) => i.status === "pending").length;
        const skipped = items.filter((i) => i.status === "skipped").length;
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
                const statusOrder = { in_progress: 0, pending: 1, done: 2, skipped: 3 };
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
    const dateKeys = Object.keys(grouped); // Already sorted if sortOption is 'date', otherwise just grouped keys

    // If sorting by date, ensure keys are sorted chronologically
    if (sortOption === "date") {
        dateKeys.sort();
    }

    const start = plan.startDate as any;
    const end = plan.endDate as any;

    async function handleStatusChange(itemId: string, newStatus: "pending" | "in_progress" | "done" | "skipped") {
        // Optimistic update
        setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)));

        try {
            await updateStudyPlanItemStatus(itemId, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    }

    async function handleRename() {
        if (!newName.trim() || newName === planName) {
            setIsRenameOpen(false);
            return;
        }

        setIsRenaming(true);
        try {
            await updateStudyPlan(plan.id, { name: newName });
            setPlanName(newName);
            setIsRenameOpen(false);
        } catch (error) {
            console.error("Failed to rename plan", error);
        } finally {
            setIsRenaming(false);
        }
    }

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await deleteStudyPlan(plan.id);
            router.push("/study-hub");
        } catch (error) {
            console.error("Failed to delete plan", error);
            setIsDeleting(false);
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

    async function handleBulkStatusChange(status: "pending" | "in_progress" | "done" | "skipped") {
        const itemIds = Array.from(selectedItems);

        // Optimistic update
        setItems((prevItems) => prevItems.map((item) => (selectedItems.has(item.id) ? { ...item, status } : item)));
        setSelectedItems(new Set());

        try {
            await Promise.all(itemIds.map((id) => updateStudyPlanItemStatus(id, status)));
        } catch (error) {
            console.error("Failed to bulk update status", error);
        }
    }

    async function handleBulkDelete() {
        const itemIds = Array.from(selectedItems);

        // Optimistic update
        setItems((prevItems) => prevItems.filter((item) => !selectedItems.has(item.id)));
        setSelectedItems(new Set());

        try {
            await Promise.all(itemIds.map((id) => deleteStudyPlanItem(id)));
        } catch (error) {
            console.error("Failed to bulk delete items", error);
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans pb-32">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Navigation & Header */}
                <header className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/study-hub"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Study Hub
                        </Link>

                        <div className="flex items-center gap-2">
                            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Rename Plan</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Rename Study Plan</DialogTitle>
                                        <DialogDescription>Enter a new name for your study plan.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                placeholder="My Study Plan"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleRename} disabled={isRenaming}>
                                            {isRenaming ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete Plan</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-destructive">
                                            <AlertTriangle className="h-5 w-5" />
                                            Delete Study Plan
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete <strong>{planName}</strong>? This action
                                            cannot be undone and will remove all associated tasks and progress.
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
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                    Study Plan
                                </span>
                                {plan.generatedByModel && (
                                    <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                                        AI Generated
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{planName}</h1>
                            <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground pt-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(start).toLocaleDateString()} – {new Date(end).toLocaleDateString()}
                                    </span>
                                </div>
                                {plan.totalTargetHours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{String(plan.totalTargetHours)} hours target</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="w-full md:w-64 bg-card border border-border rounded-2xl p-4 shadow-sm">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                                <span className="text-2xl font-bold text-primary">
                                    {stats.completionPercentage.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${stats.completionPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

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
                                <Checkbox
                                    checked={selectedItems.size === items.length && items.length > 0}
                                    onCheckedChange={handleSelectAll}
                                    id="select-all"
                                />
                                <Label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                                    Select All
                                </Label>
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
                                const dayItems = grouped[dateKey];
                                const dateObj = new Date(dateKey);
                                const isToday = new Date().toISOString().split("T")[0] === dateKey;

                                return (
                                    <div key={dateKey} className="relative flex items-start md:gap-6 group">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 ml-5 -translate-x-1/2 md:left-[8.75rem] md:ml-0 md:-translate-x-1/2 mt-1.5 h-3 w-3 rounded-full border border-border bg-background ring-4 ring-background" />

                                        {/* Date Column (Desktop) */}
                                        <div className="hidden md:flex flex-col items-end w-32 shrink-0 pt-1">
                                            <span
                                                className={`text-sm font-bold ${
                                                    isToday ? "text-primary" : "text-foreground"
                                                }`}
                                            >
                                                {dateObj.toLocaleDateString(undefined, { weekday: "long" })}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
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
                                                    className={`text-sm font-bold ${
                                                        isToday ? "text-primary" : "text-foreground"
                                                    }`}
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
                                                        onStatusChange={handleStatusChange}
                                                        isSelected={selectedItems.has(item.id)}
                                                        onSelect={handleSelect}
                                                        selectionMode={selectedItems.size > 0}
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
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
                    >
                        <div className="bg-background text-foreground rounded-full shadow-lg p-2 pl-6 flex items-center justify-between gap-4">
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
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                    onClick={() => handleBulkStatusChange("done")}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Done
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                    onClick={() => handleBulkStatusChange("in_progress")}
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    In Progress
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-foreground hover:text-primary/80 hover:bg-primary/10 h-8 px-2"
                                    onClick={() => handleBulkStatusChange("skipped")}
                                >
                                    <ArrowUpDown className="h-4 w-4 mr-1" />
                                    Skip
                                </Button>
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
        </div>
    );
}
