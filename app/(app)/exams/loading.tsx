import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading exams">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-36" />
                <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <div className="grid gap-5">
                <Skeleton className="h-80 rounded-xl md:h-64" />
                <Skeleton className="h-80 rounded-xl md:h-64" />
            </div>
        </div>
    );
}
