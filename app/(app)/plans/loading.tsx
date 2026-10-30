import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8" aria-busy="true" aria-label="Loading study plans">
            <div className="flex items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-44" />
                    <Skeleton className="h-4 w-72 max-w-full" />
                </div>
                <Skeleton className="hidden h-9 w-28 sm:block" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 2 }, (_, i) => (
                    <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
