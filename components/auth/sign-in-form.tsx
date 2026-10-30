"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
        <form onSubmit={onSubmit} className="grid gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                        Forgot password?
                    </Link>
                </div>
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                Sign in
            </Button>
        </form>
    );
}
