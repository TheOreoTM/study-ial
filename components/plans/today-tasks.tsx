"use client";

import Link from "next/link";
import { CalendarCheck, PartyPopper } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { TaskStatus } from "@/lib/generated/prisma/enums";
import { TaskItem } from "./task-item";
import { formatMinutes, type TaskLike } from "./task-meta";
import { useTaskStatuses } from "./use-task-status";

/** Shape returned by `getTodayTasks` (lib/queries/plans.ts). */
export type TodayTaskItem = TaskLike & { planId: string; planTitle: string; status: TaskStatus };

/** Today's plan tasks with inline done/skip. Pass the result of `getTodayTasks(userId)`. */
export function TodayTasks({ tasks }: { tasks: TodayTaskItem[] }) {
    const [items, setStatus] = useTaskStatuses(tasks);

    if (items.length === 0) {
        return (
            <EmptyState
                icon={CalendarCheck}
                title="Nothing planned for today"
                description="Build a study plan around your exam dates and your daily sessions will show up here."
                action={
                    <Button asChild size="sm" variant="outline">
                        <Link href="/plans">Study plans</Link>
                    </Button>
                }
            />
        );
    }

    const done = items.filter((t) => t.status === "DONE");
    const open = items.filter((t) => t.status !== "SKIPPED");
    const totalMinutes = open.reduce((s, t) => s + t.minutes, 0);
    const doneMinutes = done.reduce((s, t) => s + t.minutes, 0);
    const allDone = open.length > 0 && done.length === open.length;
    const multiplePlans = new Set(items.map((t) => t.planId)).size > 1;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <Progress
                    value={totalMinutes ? (doneMinutes / totalMinutes) * 100 : 0}
                    className="h-1.5 flex-1"
                    aria-label="Today's progress"
                />
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {done.length}/{open.length} done · {formatMinutes(totalMinutes)}
                </span>
            </div>
            {allDone && (
                <p className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success" role="status">
                    <PartyPopper className="size-4" aria-hidden />
                    All done for today. Nice work.
                </p>
            )}
            <ul className="space-y-2">
                {items.map((t) => (
                    <TaskItem
                        key={t.id}
                        task={t}
                        onStatus={(s) => setStatus(t.id, s)}
                        context={
                            multiplePlans ? (
                                <Link href={`/plans/${t.planId}`} className="hover:underline">
                                    {t.planTitle}
                                </Link>
                            ) : undefined
                        }
                    />
                ))}
            </ul>
        </div>
    );
}
