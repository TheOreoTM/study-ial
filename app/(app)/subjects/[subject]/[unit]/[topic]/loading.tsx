import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading">
            <Skeleton className="mb-4 h-5 w-64" />
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                    <Skeleton className="h-9 w-72 max-w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-7 w-20 rounded-[12px]" />
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-28 rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-12 w-44 rounded-full" />
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="space-y-4 rounded-xl border bg-card p-5 sm:p-8">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-36 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
