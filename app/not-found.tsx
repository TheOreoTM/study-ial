import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
            <Logo />
            <div>
                <p className="font-mono text-sm text-muted-foreground">404</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">This page isn&apos;t on the syllabus.</h1>
                <p className="mt-2 text-muted-foreground">The link may be old, or the page may have moved.</p>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href="/dashboard">Go to today</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/subjects">Browse subjects</Link>
                </Button>
            </div>
        </div>
    );
}
