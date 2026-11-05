import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div aria-busy="true" aria-label="Loading checklist">
            <Skeleton className="mb-3 h-5 w-64" />
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
            </div>
            <div className="grid gap-6">
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
            </div>
        </div>
    );
}
