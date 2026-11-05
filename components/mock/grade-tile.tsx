import { cn } from "@/lib/utils";

/** Ink tile holding an indicative grade letter. Neutral on purpose: grades are not mastery levels. */
export function GradeTile({ grade, size = "md" }: { grade: string; size?: "md" | "lg" }) {
    return (
        <span
            className={cn(
                "num grid shrink-0 place-items-center rounded-[12px] bg-foreground leading-none text-background",
                size === "lg" ? "size-20 rounded-[20px] text-[2.75rem]" : "size-11 text-xl",
            )}
        >
            <span aria-hidden>{grade}</span>
            <span className="sr-only">Indicative grade {grade}</span>
        </span>
    );
}
