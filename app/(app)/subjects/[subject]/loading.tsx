import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <Skeleton className="mb-4 h-4 w-40" />
            <div className="mb-8 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-full max-w-lg" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="space-y-3 rounded-xl border p-5">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-5 w-56" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-1.5 w-full" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                ))}
            </div>
        </div>
    );
}
