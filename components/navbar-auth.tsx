"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@daveyplate/better-auth-ui";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { UserNavSkeleton, UserNavSkeletonMobile } from "./skeletons/user-nav-skeleton";

export function NavbarAuthDesktop() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    if (isPending) {
        return <UserNavSkeleton />;
    }

    if (!user) {
        return (
            <>
                <Link href="/auth/sign-in">
                    <Button variant="outline" className="hover:bg-background cursor-pointer">
                        Sign In
                    </Button>
                </Link>
                <Link href="/auth/sign-up">
                    <Button className="btn-glow cursor-pointer">Get Started</Button>
                </Link>
            </>
        );
    }

    return (
        <div className="flex flex-row items-center space-x-2 border py-1 pr-4 pl-1 rounded-sm bg-linear-to-br border-primary/5 transition-all">
            <Button variant="ghost" size="default" asChild>
                <Link href="/study-hub">Study Hub</Link>
            </Button>
            <UserDropdown user={user} />
        </div>
    );
}

export function NavbarAuthMobile() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    if (isPending) {
        return <UserNavSkeletonMobile />;
    }

    if (!user) {
        return (
            <div className="grid gap-2">
                <Link href="/auth/sign-in" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                        Sign In
                    </Button>
                </Link>
                <Link href="/auth/sign-up" className="w-full">
                    <Button size="sm" className="w-full btn-glow">
                        Get Started
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex gap-2 items-center">
            <Link href="/study-hub" className="flex-1">
                <Button size="sm" className="w-full btn-glow">
                    Go to Study Hub
                </Button>
            </Link>
            <div className="flex items-center">
                <UserButton size="icon" align="center" />
            </div>
        </div>
    );
}
