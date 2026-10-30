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
    const footer = user ? (
        <UserMenu name={user.name} email={user.email} image={user.image} />
    ) : (
        <div className="flex flex-col gap-2">
            <Button asChild>
                <Link href="/sign-up">Create free account</Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/sign-in">Sign in</Link>
            </Button>
        </div>
    );

    return (
        <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
            <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r bg-card/50 p-4 lg:flex">
                <Logo href={user ? "/dashboard" : "/"} className="px-2 pt-1" />
                <div className="flex-1">{user ? <NavLinks isAdmin={isAdmin} /> : null}</div>
                {footer}
            </aside>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
                {user && <MobileNav isAdmin={isAdmin} footer={footer} />}
                <Logo href={user ? "/dashboard" : "/"} />
                {!user && (
                    <Button asChild size="sm" className="ml-auto">
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                )}
            </header>
            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        </div>
    );
}
