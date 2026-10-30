"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong.</h1>
            <p className="max-w-md text-muted-foreground">
                That&apos;s on us, not you. Try again — if it keeps happening, refresh the page.
            </p>
            {error.digest && <p className="font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>}
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}
