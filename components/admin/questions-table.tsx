"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { setQuestionStatus } from "@/app/(app)/admin/actions";
import { TYPE_LABELS, type QuestionTypeValue } from "@/app/(app)/admin/validation";
import { cn } from "@/lib/utils";

export type QuestionRow = {
    id: string;
    type: QuestionTypeValue;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    marks: number;
    stem: string;
    status: "DRAFT" | "PUBLISHED";
    source: "ORIGINAL" | "PAST_PAPER";
    seedKey: string | null;
    updatedAt: string;
    unitCode: string;
    topic: string;
    attempts: number;
};

const difficultyClass = { EASY: "text-success", MEDIUM: "text-muted-foreground", HARD: "text-destructive" };

export function QuestionsTable({ questions }: { questions: QuestionRow[] }) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [pending, startTransition] = useTransition();
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    // Drop selections that are no longer on the page (e.g. after filtering).
    const visible = new Set(questions.map((q) => q.id));
    const ids = [...selected].filter((id) => visible.has(id));
    const allSelected = questions.length > 0 && ids.length === questions.length;

    const toggle = (id: string, on: boolean) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (on) next.add(id);
            else next.delete(id);
            return next;
        });

    const bulk = (status: "DRAFT" | "PUBLISHED") => {
        setPendingStatus(status);
        startTransition(async () => {
            const res = await setQuestionStatus({ ids, status });
            setPendingStatus(null);
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(
                `${res.count} question${res.count === 1 ? "" : "s"} ${status === "PUBLISHED" ? "published" : "moved to draft"}`,
            );
            setSelected(new Set());
        });
    };

    return (
        <div className="rounded-xl border bg-card">
            <div className="flex min-h-12 flex-wrap items-center gap-2 border-b px-3 py-2 text-sm">
                <span className="text-muted-foreground" aria-live="polite">
                    {ids.length ? `${ids.length} selected` : "Select questions for bulk actions"}
                </span>
                <div className="ml-auto flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!ids.length || pending}
                        onClick={() => bulk("PUBLISHED")}
                    >
                        {pendingStatus === "PUBLISHED" ? <Loader2 className="animate-spin" /> : <Eye />} Publish
                    </Button>
                    <Button size="sm" variant="outline" disabled={!ids.length || pending} onClick={() => bulk("DRAFT")}>
                        {pendingStatus === "DRAFT" ? <Loader2 className="animate-spin" /> : <EyeOff />} Unpublish
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10 pl-3">
                            <Checkbox
                                aria-label="Select all on this page"
                                checked={allSelected ? true : ids.length ? "indeterminate" : false}
                                onCheckedChange={(v) => setSelected(v === true ? new Set(visible) : new Set())}
                            />
                        </TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="hidden md:table-cell">Topic</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-right">Marks</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden text-right lg:table-cell">Attempts</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questions.map((q) => {
                        const checked = selected.has(q.id);
                        return (
                            <TableRow key={q.id} data-state={checked ? "selected" : undefined}>
                                <TableCell className="pl-3">
                                    <Checkbox
                                        aria-label="Select question"
                                        checked={checked}
                                        onCheckedChange={(v) => toggle(q.id, v === true)}
                                    />
                                </TableCell>
                                <TableCell className="max-w-[16rem] sm:max-w-md">
                                    <Link
                                        href={`/admin/questions/${q.id}`}
                                        className="block truncate font-medium hover:underline"
                                        title={q.stem}
                                    >
                                        {q.stem.replace(/\s+/g, " ")}
                                    </Link>
                                    <div className="mt-0.5 flex gap-2 text-xs text-muted-foreground">
                                        <span className={difficultyClass[q.difficulty]}>
                                            {q.difficulty.toLowerCase()}
                                        </span>
                                        {q.source === "PAST_PAPER" && <span>past paper</span>}
                                        {q.seedKey && <span className="truncate font-mono">{q.seedKey}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden max-w-56 truncate md:table-cell" title={q.topic}>
                                    <span className="font-mono text-xs text-muted-foreground">{q.unitCode}</span>{" "}
                                    {q.topic}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant="secondary" className={cn("font-normal")}>
                                        {TYPE_LABELS[q.type]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">{q.marks}</TableCell>
                                <TableCell>
                                    <StatusBadge status={q.status} />
                                </TableCell>
                                <TableCell className="hidden text-right text-muted-foreground tabular-nums lg:table-cell">
                                    {q.attempts}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
