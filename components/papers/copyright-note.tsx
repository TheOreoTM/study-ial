import Link from "next/link";
import { cn } from "@/lib/utils";

/** Shown wherever Pearson materials (or their metadata) appear. */
export function PaperCopyrightNote({ className }: { className?: string }) {
    return (
        <p className={cn("text-sm text-muted-foreground", className)}>
            Past papers, mark schemes and examiner reports are © Pearson Education Ltd and are provided here unmodified
            for personal study only. Study-IAL is not affiliated with Pearson.{" "}
            <Link href="/takedown" className="font-semibold underline decoration-border-strong underline-offset-4 hover:text-foreground">
                Takedown requests
            </Link>
            .
        </p>
    );
}
