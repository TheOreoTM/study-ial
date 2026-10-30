import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading progress">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            <Skeleton className="mb-3 h-6 w-32" />
            <Skeleton className="mb-8 h-56 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
        </div>
    );
}
