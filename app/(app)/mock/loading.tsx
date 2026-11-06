import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading mock papers">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
            </div>
            <Skeleton className="mt-10 mb-3 h-7 w-36" />
            <div className="grid gap-2">
                <Skeleton className="h-[72px] rounded-lg" />
                <Skeleton className="h-[72px] rounded-lg" />
            </div>
        </div>
    );
}
