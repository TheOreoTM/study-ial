"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import type { TaskStatus } from "@/lib/generated/prisma/enums";
import { setTaskStatus } from "@/app/(app)/plans/actions";

/** Optimistic task statuses: the UI flips immediately, the server action confirms (and revalidates the page). */
export function useTaskStatuses<T extends { id: string; status: TaskStatus }>(tasks: T[]) {
    const [optimistic, apply] = useOptimistic(tasks, (state, u: { id: string; status: TaskStatus }) =>
        state.map((t) => (t.id === u.id ? { ...t, status: u.status } : t)),
    );
    const [, startTransition] = useTransition();

    const setStatus = (id: string, status: TaskStatus) =>
        startTransition(async () => {
            apply({ id, status });
            const res = await setTaskStatus(id, status);
            if (!res.ok) toast.error(res.error);
        });

    return [optimistic, setStatus] as const;
}
