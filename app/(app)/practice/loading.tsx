import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading practice session">
            <div className="mb-6 space-y-2.5 sm:mb-8">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-8 w-72 max-w-full" />
            </div>
            <div className="grid items-start gap-6 min-[960px]:grid-cols-[minmax(0,1fr)_380px] min-[960px]:gap-8">
                <div className="grid gap-6 rounded-xl border bg-card p-5 shadow-card sm:p-8">
                    <div className="grid gap-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                    <div className="grid gap-3">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-4/5" />
                    </div>
                    <div className="grid gap-3">
                        {Array.from({ length: 4 }, (_, i) => (
                            <Skeleton key={i} className="h-[60px] w-full rounded-lg" />
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 border-t pt-5">
                        <Skeleton className="h-11 w-24 rounded-full" />
                        <Skeleton className="h-11 w-36 rounded-full" />
                    </div>
                </div>
                <div className="grid gap-3 rounded-xl bg-muted p-5 sm:p-6">
                    <Skeleton className="h-5 w-32 bg-card" />
                    <Skeleton className="h-[68px] w-full rounded-lg bg-card" />
                </div>
            </div>
        </div>
    );
}
