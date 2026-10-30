import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <Skeleton className="mb-4 h-4 w-56" />
            <div className="mb-8 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="divide-y rounded-xl border">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4">
                        <Skeleton className="h-4 w-8" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
