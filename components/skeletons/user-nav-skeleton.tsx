import { Skeleton } from "@/components/ui/skeleton";

export function UserNavSkeleton() {
    return (
        <div className="flex flex-row items-center space-x-2 border py-1 pr-4 pl-1 rounded-sm border-primary/5">
            <Skeleton className="h-9 w-27 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
    );
}

export function UserNavSkeletonMobile() {
    return (
        <div className="flex gap-2 items-center">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    );
}
