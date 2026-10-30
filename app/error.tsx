"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
            <Logo className="mb-6" />
            <main className="w-full max-w-[480px] rounded-xl border bg-card px-6 py-9 text-center shadow-card sm:px-10">
                <h1 className="text-[1.625rem] leading-[1.15] sm:text-[1.75rem]">Something went wrong.</h1>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                    That&apos;s on us, not you. Try again — if it keeps happening, refresh the page.
                </p>
                <Button onClick={reset} className="mt-7">
                    <RotateCw aria-hidden /> Try again
                </Button>
                {error.digest && (
                    <p className="mt-6 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        Ref: <span className="ml-1 font-mono">{error.digest}</span>
                    </p>
                )}
            </main>
        </div>
    );
}
