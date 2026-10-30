"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link2Off, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthNotice, FormError } from "./auth-card";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPending(true);
        // Always show the same confirmation so this can't be used to probe which emails exist.
        await authClient.requestPasswordReset({
            email: String(new FormData(e.currentTarget).get("email")),
            redirectTo: "/reset-password",
        });
        setSent(true);
    }

    if (sent) {
        return (
            <AuthNotice icon={MailCheck} title="Check your inbox">
                If an account exists for that email, a reset link is on its way.
            </AuthNotice>
        );
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
                {pending && <Loader2 className="animate-spin" aria-hidden />}
                Send reset link
            </Button>
        </form>
    );
}

export function ResetPasswordForm({ token }: { token: string | null }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!token) {
        return (
            <div className="flex flex-col gap-5">
                <AuthNotice icon={Link2Off} title="This link no longer works">
                    This reset link is invalid or has expired. Request a new one and we&apos;ll email it to you.
                </AuthNotice>
                <Button asChild size="lg" className="w-full">
                    <Link href="/forgot-password">Request a new link</Link>
                </Button>
            </div>
        );
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const password = String(form.get("password"));
        if (password !== String(form.get("confirm"))) {
            setError("Passwords don't match.");
            return;
        }
        setPending(true);
        setError(null);
        const { error } = await authClient.resetPassword({ newPassword: password, token: token! });
        if (error) {
            setError(error.message ?? "Couldn't reset your password.");
            setPending(false);
            return;
        }
        toast.success("Password updated — sign in with your new password.");
        router.push("/sign-in");
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-5">
            {error && <FormError>{error}</FormError>}
            <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    aria-invalid={error === "Passwords don't match." ? true : undefined}
                />
            </div>
            <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
                {pending && <Loader2 className="animate-spin" aria-hidden />}
                Set new password
            </Button>
        </form>
    );
}
