import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading progress">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-44" />
                <Skeleton className="h-5 w-full max-w-md" />
            </div>
            <Skeleton className="mb-10 h-36 rounded-xl" />
            <Skeleton className="mb-3 h-6 w-32" />
            <Skeleton className="mb-10 h-80 rounded-xl" />
            <Skeleton className="mb-3 h-6 w-24" />
            <div className="grid gap-5 lg:grid-cols-2">
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
            </div>
        </div>
    );
}
