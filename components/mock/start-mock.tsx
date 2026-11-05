"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Timer } from "lucide-react";
import { toast } from "sonner";
import { startMock } from "@/app/(app)/mock/actions";
import { Button } from "@/components/ui/button";
import {
    durationFor,
    formatDuration,
    lengthAvailable,
    MOCK_LENGTH_LABEL,
    MOCK_TARGET,
    type MockLength,
} from "@/lib/mock-exam";
import { cn } from "@/lib/utils";

const LENGTHS: MockLength[] = ["short", "half", "full"];

/** The three paper lengths for one unit; lengths the bank can't fill are shown disabled. */
export function StartMock({
    unitId,
    subjectSlug,
    availableMarks,
    primary = false,
}: {
    unitId: string;
    subjectSlug: string;
    availableMarks: number;
    /** The page's one orange action goes on the first unit's half paper. */
    primary?: boolean;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [which, setWhich] = useState<MockLength | null>(null);

    function start(length: MockLength) {
        setWhich(length);
        startTransition(async () => {
            const res = await startMock({ unitId, length });
            if (!res.ok) {
                toast.error(res.error);
                setWhich(null);
                return;
            }
            if (res.resumed) toast("You already have a paper running for this unit, so we've opened it.");
            router.push(`/mock/${res.id}`);
        });
    }

    return (
        <div className="grid gap-2 sm:grid-cols-3">
            {LENGTHS.map((length) => {
                const marks = Math.min(MOCK_TARGET[length], availableMarks);
                const ok = lengthAvailable(length, availableMarks);
                return (
                    <Button
                        key={length}
                        variant={primary && length === "half" && ok ? "default" : "outline"}
                        disabled={!ok || pending}
                        onClick={() => start(length)}
                        className={cn("h-auto min-h-14 flex-col gap-0.5 py-2 whitespace-normal")}
                        aria-label={`${MOCK_LENGTH_LABEL[length]}: ${marks} marks, ${formatDuration(durationFor(marks, subjectSlug))}`}
                    >
                        <span className="flex items-center gap-1.5">
                            {pending && which === length ? <Loader2 className="animate-spin" /> : <Timer />}
                            {MOCK_LENGTH_LABEL[length]}
                        </span>
                        <span className="text-xs font-bold opacity-80">
                            {ok ? `${marks} marks · ${formatDuration(durationFor(marks, subjectSlug))}` : "Not enough questions yet"}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
}
