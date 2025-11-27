"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const currentPath = usePathname();
    const isAuthPath = currentPath.startsWith("/handler");

    if (isAuthPath) {
        return null;
    }

    return (
        <header>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Logo />
                <nav className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/subjects"
                        className={
                            currentPath.startsWith("/subjects")
                                ? "text-primary font-medium transition-colors"
                                : "text-muted-foreground hover:text-primary font-medium transition-colors"
                        }
                    >
                        Subjects
                    </Link>
                    <Link
                        href="/study-plans"
                        className={
                            currentPath === "/study-plans"
                                ? "text-primary font-medium transition-colors"
                                : "text-muted-foreground hover:text-primary font-medium transition-colors"
                        }
                    >
                        Marketplace
                    </Link>
                    <Link
                        href="/study-plans/me"
                        className={
                            currentPath.startsWith("/study-plans/me")
                                ? "text-primary font-medium transition-colors"
                                : "text-muted-foreground hover:text-primary font-medium transition-colors"
                        }
                    >
                        My Plans
                    </Link>
                    <Link
                        href="/search"
                        className={
                            currentPath.startsWith("/search")
                                ? "text-primary font-medium transition-colors"
                                : "text-muted-foreground hover:text-primary font-medium transition-colors"
                        }
                    >
                        Search
                    </Link>
                </nav>
                <div className="flex items-center space-x-3">
                    <ModeToggle />
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="outline" className="hover:bg-background cursor-pointer">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button className="btn-glow cursor-pointer">Get Started</Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex space-x-2 border py-1 pr-4 pl-1 rounded-sm bg-linear-to-br border-primary/5 transition-all">
                            <Button variant="ghost" size="default" asChild>
                                <Link href="/study-hub">Study Hub</Link>
                            </Button>
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
