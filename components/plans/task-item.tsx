"use client";

import Link from "next/link";
import { ArrowRight, Check, MoreHorizontal, SkipForward, Timer, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskStatus } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { unitCodeFromTitle } from "./unit-code";
import { focusHref, formatMinutes, taskHref, taskTypeMeta, type TaskLike } from "./task-meta";

export function TaskItem({
    task,
    onStatus,
    context,
    compact = false,
    className,
}: {
    task: TaskLike;
    /** Smaller row without the action buttons (they move into the menu; the title links instead). */
    compact?: boolean;
    onStatus: (status: TaskStatus) => void;
    /** Extra muted text shown in the meta line, e.g. the plan name or a date. */
    context?: React.ReactNode;
    className?: string;
}) {
    const meta = taskTypeMeta[task.type];
    const Icon = meta.icon;
    const link = taskHref(task);
    const done = task.status === "DONE";
    const skipped = task.status === "SKIPPED";
    const unitCode = task.topic?.unit.code ?? unitCodeFromTitle(task.title);

    return (
        <li
            className={cn(
                "flex gap-3 rounded-lg border bg-card transition-colors",
                compact ? "px-3 py-2.5" : "p-3 sm:p-4",
                (done || skipped) && "bg-muted/40",
                className,
            )}
        >
            <Checkbox
                className="mt-0.5 size-5"
                checked={done}
                onCheckedChange={(c) => onStatus(c === true ? "DONE" : "PENDING")}
                aria-label={done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
            />
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium", meta.tone)}>
                        <Icon className="size-3" aria-hidden />
                        {meta.label}
                    </span>
                    {unitCode && <span>{unitCode}</span>}
                    <span aria-hidden>·</span>
                    <span>{formatMinutes(task.minutes)}</span>
                    {skipped && (
                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">Skipped</span>
                    )}
                    {context && (
                        <>
                            <span aria-hidden>·</span>
                            <span className="truncate">{context}</span>
                        </>
                    )}
                </div>
                <p
                    className={cn(
                        "leading-snug font-medium break-words",
                        compact ? "mt-1 text-sm" : "mt-1.5",
                        (done || skipped) && "text-muted-foreground",
                        done && "line-through decoration-muted-foreground/50",
                    )}
                >
                    {compact && link && !done && !skipped ? (
                        <Link href={link.href} className="hover:text-primary hover:underline">
                            {task.title}
                        </Link>
                    ) : (
                        task.title
                    )}
                </p>
                {task.notes && !done && !compact && <p className="mt-1 text-sm text-muted-foreground">{task.notes}</p>}
                {!done && !skipped && !compact && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                        {link && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={link.href}>
                                    {link.label}
                                    <ArrowRight />
                                </Link>
                            </Button>
                        )}
                        <Button asChild size="sm" variant="ghost">
                            <Link href={focusHref(task.id)}>
                                <Timer />
                                Start focus
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="-mt-1 -mr-1" aria-label={`More actions for "${task.title}"`}>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {!done && (
                        <DropdownMenuItem onSelect={() => onStatus("DONE")}>
                            <Check />
                            Mark done
                        </DropdownMenuItem>
                    )}
                    {!skipped && (
                        <DropdownMenuItem onSelect={() => onStatus("SKIPPED")}>
                            <SkipForward />
                            Skip
                        </DropdownMenuItem>
                    )}
                    {(done || skipped) && (
                        <DropdownMenuItem onSelect={() => onStatus("PENDING")}>
                            <Undo2 />
                            Undo
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {link && (
                        <DropdownMenuItem asChild>
                            <Link href={link.href}>
                                <ArrowRight />
                                {link.label}
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href={focusHref(task.id)}>
                            <Timer />
                            Start focus
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    );
}
