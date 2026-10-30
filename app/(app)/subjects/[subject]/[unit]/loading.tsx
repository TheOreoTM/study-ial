import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <Skeleton className="mb-4 h-5 w-56" />
            <div className="mb-8 space-y-3">
                <Skeleton className="h-9 w-80 max-w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-7 w-20 rounded-[12px]" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-40 rounded-full" />
                </div>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="space-y-1.5 rounded-xl border bg-card p-2 sm:p-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="flex items-center gap-3.5 px-3 py-3 sm:px-4">
                            <Skeleton className="size-11 rounded-[12px]" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-2 w-full" />
                            </div>
                            <Skeleton className="h-6 w-14" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-44 w-full rounded-xl" />
            </div>
        </div>
    );
}
