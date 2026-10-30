import { BookOpen, FileText, PencilLine, RotateCcw, type LucideIcon } from "lucide-react";
import type { TaskStatus, TaskType } from "@/lib/generated/prisma/enums";

/** The task shape the plan UI needs (matches `PlanTaskView` from lib/queries/plans.ts). */
export type TaskLike = {
    id: string;
    date: Date;
    type: TaskType;
    title: string;
    notes: string | null;
    minutes: number;
    status: TaskStatus;
    topic: {
        id: string;
        name: string;
        slug: string;
        unit: { code: string; name: string; subject: { slug: string; name: string } };
    } | null;
};

export const taskTypeMeta: Record<TaskType, { label: string; icon: LucideIcon; tone: string }> = {
    LEARN: { label: "Learn", icon: BookOpen, tone: "bg-primary/10 text-primary" },
    PRACTICE: { label: "Practice", icon: PencilLine, tone: "bg-accent text-accent-foreground" },
    REVIEW: { label: "Review", icon: RotateCcw, tone: "bg-warning/15 text-amber-700 dark:text-warning" },
    PAST_PAPER: { label: "Past paper", icon: FileText, tone: "bg-success/15 text-success" },
};

/** Where a task's main action goes: the topic page for LEARN, a practice session for PRACTICE/REVIEW. */
export function taskHref(task: Pick<TaskLike, "type" | "topic">): { href: string; label: string } | null {
    const t = task.topic;
    if (!t) return null;
    if (task.type === "LEARN")
        return {
            href: `/subjects/${t.unit.subject.slug}/${t.unit.code.toLowerCase()}/${t.slug}`,
            label: "Open topic",
        };
    if (task.type === "PRACTICE" || task.type === "REVIEW")
        return { href: `/practice?topic=${encodeURIComponent(t.id)}`, label: "Practise" };
    return null;
}

export const focusHref = (taskId: string) => `/focus?task=${encodeURIComponent(taskId)}`;

export function formatMinutes(min: number) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h} h ${m} min` : `${h} h`;
}

const UTC_DATE = { timeZone: "UTC" } as const;
export const formatDay = (d: Date, opts: Intl.DateTimeFormatOptions = {}) =>
    d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", ...UTC_DATE, ...opts });
export const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", ...UTC_DATE });

export function daysLeftLabel(daysLeft: number) {
    if (daysLeft < 0) return "Exam passed";
    if (daysLeft === 0) return "Exam today";
    if (daysLeft === 1) return "1 day to go";
    return `${daysLeft} days to go`;
}
