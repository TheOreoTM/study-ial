import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <Skeleton className="mb-4 h-5 w-40" />
            <div className="mb-8 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-4 w-full max-w-lg" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="space-y-4 rounded-xl border bg-card p-5 sm:p-6">
                        <div className="flex gap-4">
                            <Skeleton className="size-12 rounded-[12px]" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 w-20 rounded-[9px]" />
                                <Skeleton className="h-5 w-56 max-w-full" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                        </div>
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-9 w-32 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
