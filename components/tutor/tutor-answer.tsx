import { Markdown } from "@/components/markdown";
import type { TutorResult } from "@/app/(app)/tutor/actions";

type Done = Extract<TutorResult, { ok: true }>;

const notes: Record<"off" | "quota" | "error", string> = {
    off: "AI explanations aren't switched on, so here's what the question bank says.",
    quota: "You've used today's AI explanations, so here's what the question bank says.",
    error: "The AI tutor couldn't answer just now. Here's what the question bank says.",
};

/** An explanation from the tutor (or the bank fallback), with an honest note about where it came from. */
export function TutorAnswer({ result }: { result: Done }) {
    return (
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
}
