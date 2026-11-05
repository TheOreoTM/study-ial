import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading progress">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="mt-3 h-5 w-full max-w-xl" />
            <div className="mt-8 grid grid-cols-3 gap-3">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
            </div>
            <Skeleton className="mt-8 h-80 rounded-xl" />
        </div>
    );
}
