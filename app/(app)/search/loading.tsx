import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Searching">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-36" />
                <Skeleton className="h-5 w-full max-w-lg" />
            </div>
            <Skeleton className="mb-8 h-12 max-w-2xl rounded-md" />
            <div className="grid gap-2">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
            </div>
        </div>
    );
}
