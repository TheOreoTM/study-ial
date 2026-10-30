"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "./auth-card";
import { signIn } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/safe-redirect";

export function SignInForm({ next }: { next: string }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setPending(true);
        setError(null);
        const { error } = await signIn.email({
            email: String(form.get("email")),
            password: String(form.get("password")),
        });
        if (error) {
            setError(
                error.status === 403
                    ? "Please verify your email first — check your inbox for the link."
                    : (error.message ?? "Couldn't sign you in."),
            );
            setPending(false);
            return;
        }
        router.push(safeRedirect(next));
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-5">
            {error && <FormError>{error}</FormError>}
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={error ? true : undefined}
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="-my-1 inline-flex min-h-6 items-center rounded-sm text-sm font-semibold text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors duration-150 hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                        Forgot password?
                    </Link>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-invalid={error ? true : undefined}
                />
            </div>
            <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
                {pending && <Loader2 className="animate-spin" aria-hidden />}
                Sign in
            </Button>
        </form>
    );
}
