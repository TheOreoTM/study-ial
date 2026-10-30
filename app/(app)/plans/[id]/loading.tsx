import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8" aria-busy="true" aria-label="Loading plan">
            <Skeleton className="h-8 w-28" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-64 max-w-full" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>
            <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                {Array.from({ length: 4 }, (_, i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
            </div>
        </div>
    );
}
