import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <Skeleton className="mb-4 h-4 w-64" />
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-72" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-56 w-full rounded-xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-36 w-full rounded-xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
