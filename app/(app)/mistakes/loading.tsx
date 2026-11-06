import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading mistakes">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-5 w-full max-w-md" />
                </div>
                <Skeleton className="h-11 w-52 rounded-full" />
            </div>
            <div className="mb-6 flex gap-2">
                <Skeleton className="h-11 w-20 rounded-full" />
                <Skeleton className="h-11 w-24 rounded-full" />
                <Skeleton className="h-11 w-24 rounded-full" />
            </div>
            {[0, 1].map((i) => (
                <div key={i} className="mb-8">
                    <Skeleton className="mb-3 h-7 w-72" />
                    <div className="grid gap-2.5">
                        <Skeleton className="h-24 rounded-lg" />
                        <Skeleton className="h-24 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}
