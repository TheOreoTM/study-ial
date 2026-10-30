import Link from "next/link";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/shell/nav-links";
import { MobileNav } from "@/components/shell/mobile-nav";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/session";

// Pages in this group decide for themselves whether sign-in is required
// (e.g. /subjects is public), so the shell adapts to a missing user.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN";
    const home = user ? "/dashboard" : "/";

    return (
        <div className="min-h-dvh">
            <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
                <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center gap-2 px-4 sm:px-6 lg:gap-6">
                    {user && (
                        <div className="lg:hidden">
                            <MobileNav
                                isAdmin={isAdmin}
                                footer={<UserMenu name={user.name} email={user.email} image={user.image} />}
                            />
                        </div>
                    )}
                    <Logo href={home} />
                    {user && (
                        <div className="hidden min-w-0 flex-1 lg:block">
                            {/* Settings lives in the account menu on desktop, keeping the bar to the core loop. */}
                            <NavLinks isAdmin={isAdmin} orientation="horizontal" exclude={["/settings"]} />
                        </div>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                        {user ? (
                            <UserMenu name={user.name} email={user.email} image={user.image} compact />
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/sign-in">Sign in</Link>
                                </Button>
                                {/* Outline: the page itself owns the one orange action. */}
                                <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                                    <Link href="/sign-up">Create free account</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:py-10">{children}</main>
        </div>
    );
}
