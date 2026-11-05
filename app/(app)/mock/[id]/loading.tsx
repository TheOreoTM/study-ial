import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading paper">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-80 max-w-full" />
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
                <div className="grid gap-5">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                </div>
                <Skeleton className="hidden h-72 rounded-xl lg:block" />
            </div>
        </div>
    );
}
