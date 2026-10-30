import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="mx-auto max-w-3xl space-y-6" aria-busy="true" aria-label="Loading practice session">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="space-y-4 rounded-xl border p-6">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-9 w-32" />
            </div>
        </div>
    );
}
