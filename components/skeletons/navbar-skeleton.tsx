import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
    return (
        <header>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo Skeleton */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>

                {/* Nav Links Skeleton (Hidden on mobile to match Navbar) */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </nav>

                {/* Right Side Skeleton */}
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-9 w-9 rounded-md" /> {/* Mode Toggle */}
                    <Skeleton className="h-9 w-20 rounded-md" /> {/* Auth Button */}
                    <Skeleton className="h-9 w-24 rounded-md" /> {/* Auth Button */}
                </div>
            </div>
        </header>
    );
}
