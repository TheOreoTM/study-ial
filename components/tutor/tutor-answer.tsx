import type { TutorResult } from "@/app/(app)/tutor/actions";
import { ProPrompt } from "@/components/billing/pro-prompt";
import { Markdown } from "@/components/markdown";

type Done = Extract<TutorResult, { ok: true }>;

const notes: Record<"off" | "quota" | "error" | "pro", string> = {
    pro: "Meanwhile, here's what the question bank says.",
    off: "AI explanations aren't switched on, so here's what the question bank says.",
    quota: "You've used today's AI explanations, so here's what the question bank says.",
    error: "The AI tutor couldn't answer just now. Here's what the question bank says.",
};

/**
 * An explanation from the tutor (or the bank fallback), with an honest note about where it came from. Without Pro it
 * leads with the free-week prompt; `onUnlocked` asks again once the trial has started.
 */
export function TutorAnswer({ result, onUnlocked }: { result: Done; onUnlocked?: () => void }) {
    const answer = (
        <div className="rounded-lg bg-muted px-4 py-4 sm:px-5" aria-live="polite">
            {result.source === "fallback" && (
                <p className="mb-3 text-sm font-semibold text-muted-foreground">{notes[result.reason]}</p>
            )}
            <Markdown className="max-w-[62ch] [&_h3]:mt-4 [&_h3]:text-base [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {result.content}
            </Markdown>
            {result.source !== "fallback" && (
                <p className="mt-4 border-t border-border-strong/25 pt-3 text-[0.8125rem] text-muted-foreground">
                    AI explanation, grounded in the specification. Check it against your notes and the mark scheme.
                    {result.remaining !== null && ` ${result.remaining} left today.`}
                </p>
            )}
        </div>
    );
    if (result.source !== "fallback" || result.reason !== "pro") return answer;
    return (
        <div className="grid gap-3">
            <ProPrompt access={result.access} feature="The AI tutor" onUnlocked={onUnlocked} />
            {answer}
        </div>
    );
}
