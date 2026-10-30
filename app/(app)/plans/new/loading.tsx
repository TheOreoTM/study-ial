import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="mx-auto max-w-3xl space-y-6" aria-busy="true" aria-label="Loading">
            <Skeleton className="h-8 w-28" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-full max-w-lg" />
            </div>
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
        </div>
    );
}
