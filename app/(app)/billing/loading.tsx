import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="mx-auto max-w-3xl" aria-busy="true" aria-label="Loading your plan">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="mt-3 h-5 w-full max-w-xl" />
            <Skeleton className="mt-8 h-44 rounded-xl" />
            <Skeleton className="mt-6 h-56 rounded-xl" />
            <Skeleton className="mt-6 h-32 rounded-xl" />
        </div>
    );
}
