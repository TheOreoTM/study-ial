import type { PracticeQuestion } from "@/app/(app)/practice/types";
import { cn } from "@/lib/utils";
import type { QuestionOutcome } from "./question-view";

type SegmentState = "correct" | "partial" | "wrong" | "skipped" | "current" | "todo";

const segmentClass: Record<SegmentState, string> = {
    correct: "bg-mastery-strong",
    partial: "bg-mastery-developing",
    wrong: "bg-mastery-weak",
    skipped: "bg-border-strong",
    current: "bg-progress",
    todo: "bg-track",
};

const segmentLabel: Record<SegmentState, string> = {
    correct: "full marks",
    partial: "some marks",
    wrong: "no marks",
    skipped: "skipped",
    current: "on screen",
    todo: "not started",
};

export function segmentState(o: QuestionOutcome | undefined, isCurrent: boolean): SegmentState {
    if (!o) return isCurrent ? "current" : "todo";
    if (o.skipped) return "skipped";
    if (o.maxMarks > 0 && o.marksAwarded >= o.maxMarks) return "correct";
    return o.marksAwarded > 0 ? "partial" : "wrong";
}

/**
 * One segment per question: teal = full marks, sun = part marks, bubblegum = none, outline grey = skipped,
 * purple = the question on screen, track = not reached yet.
 */
export function SessionProgress({
    questions,
    outcomes,
    current,
    className,
}: {
    questions: PracticeQuestion[];
    outcomes: Record<string, QuestionOutcome>;
    /** Index of the question on screen; -1 when the session is over. */
    current: number;
    className?: string;
}) {
    return (
        <ol className={cn("flex gap-1.5", className)} aria-label="This session">
            {questions.map((q, i) => {
                const state = segmentState(outcomes[q.id], i === current);
                return (
                    <li
                        key={q.id}
                        className={cn(
                            "h-2 min-w-0 flex-1 rounded-full transition-colors duration-200 ease-out-soft",
                            segmentClass[state],
                        )}
                    >
                        <span className="sr-only">
                            Question {i + 1}: {segmentLabel[state]}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
