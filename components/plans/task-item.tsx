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
import { UnitChip } from "./unit-chip";
import { unitCodeFromTitle } from "./unit-code";
import { focusHref, formatMinutes, taskHref, taskTypeMeta, type TaskLike } from "./task-meta";

export function TaskItem({
    task,
    onStatus,
    context,
    compact = false,
    next = false,
    className,
}: {
    task: TaskLike;
    /** Smaller row without the action buttons (they move into the menu; the title links instead). */
    compact?: boolean;
    /** The single "do this next" task in the view: tangerine-pale ground and a primary action button. */
    next?: boolean;
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
    const isNext = next && !done && !skipped && !compact;
    const unitCode = task.topic?.unit.code ?? unitCodeFromTitle(task.title);

    return (
        <li
            className={cn(
                "flex gap-3 rounded-lg border transition-[background-color,box-shadow] duration-200 ease-out-soft",
                compact ? "px-3 py-2.5 sm:px-4" : "p-4 sm:p-5",
                isNext ? "border-transparent bg-primary-soft shadow-raised" : "bg-card",
                (done || skipped) && "bg-transparent",
                className,
            )}
        >
            <Checkbox
                className={cn("size-6 rounded-[8px]", compact ? "mt-0" : "mt-0.5")}
                checked={done}
                onCheckedChange={(c) => onStatus(c === true ? "DONE" : "PENDING")}
                aria-label={done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
            />
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.8125rem] font-semibold text-muted-foreground">
                    {isNext && (
                        <span className="font-display text-[0.8125rem] font-extrabold tracking-[0.05em] text-foreground uppercase">
                            Up next
                        </span>
                    )}
                    <span
                        className={cn(
                            "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-bold",
                            isNext
                                ? "bg-card text-foreground"
                                : done || skipped
                                  ? "text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                                  : meta.tone,
                        )}
                    >
                        <Icon className="size-3.5" aria-hidden />
                        {meta.label}
                    </span>
                    {unitCode && <UnitChip code={unitCode} size="sm" />}
                    <span className="tabular-nums">{formatMinutes(task.minutes)}</span>
                    {skipped && (
                        <span className="inline-flex h-6 items-center rounded-full bg-track px-2.5 text-xs font-bold text-foreground">
                            Skipped
                        </span>
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
                        "leading-snug font-bold break-words",
                        compact ? "mt-1.5 text-[0.9375rem]" : "mt-2 text-[1.0625rem]",
                        (done || skipped) && "font-semibold text-muted-foreground",
                        done && "line-through decoration-muted-foreground/50",
                    )}
                >
                    {compact && link && !done && !skipped ? (
                        <Link
                            href={link.href}
                            className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-border-strong"
                        >
                            {task.title}
                        </Link>
                    ) : (
                        task.title
                    )}
                </p>
                {task.notes && !done && !compact && <p className="mt-1 text-sm text-muted-foreground">{task.notes}</p>}
                {!done && !skipped && !compact && (
                    <div className="mt-3.5 flex flex-wrap gap-2">
                        {link && (
                            <Button asChild size={isNext ? "default" : "sm"} variant={isNext ? "default" : "outline"}>
                                <Link href={link.href}>
                                    {link.label}
                                    <ArrowRight />
                                </Link>
                            </Button>
                        )}
                        <Button
                            asChild
                            size={isNext ? "default" : "sm"}
                            variant={isNext && !link ? "default" : "ghost"}
                        >
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
                    <Button variant="ghost" size="icon-sm" className={cn("-mr-1", compact ? "-my-1" : "-mt-1")} aria-label={`More actions for "${task.title}"`}>
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
