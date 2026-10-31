import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/session";

export default async function NotFound() {
    // Signed-out visitors would bounce from /dashboard to sign-in, so send them home instead.
    const user = await getUser();
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
            <Logo className="mb-6" />
            <main className="w-full max-w-[480px] rounded-xl border bg-card px-6 py-9 text-center shadow-card sm:px-10">
                <p className="num text-[4.5rem] leading-none text-muted-foreground" aria-hidden>
                    404
                </p>
                <h1 className="mt-4 text-[1.625rem] leading-[1.15] sm:text-[1.75rem]">
                    This page isn&apos;t on the syllabus.
                </h1>
                <p className="mt-2 text-muted-foreground">The link may be old, or the page may have moved.</p>
                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                    <Button asChild>
                        {user ? <Link href="/dashboard">Go to today</Link> : <Link href="/">Go to the homepage</Link>}
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/subjects">Browse subjects</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
