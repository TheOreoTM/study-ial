"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthNotice, FormError } from "./auth-card";
import { signUp } from "@/lib/auth-client";

export function SignUpForm({ requiresVerification }: { requiresVerification: boolean }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [sentTo, setSentTo] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email"));
        setPending(true);
        setError(null);
        const { error } = await signUp.email({
            name: String(form.get("name")).trim(),
            email,
            password: String(form.get("password")),
            callbackURL: "/onboarding",
        });
        if (error) {
            setError(error.message ?? "Couldn't create your account.");
            setPending(false);
            return;
        }
        if (requiresVerification) {
            setSentTo(email);
            return;
        }
        router.push("/onboarding");
        router.refresh();
    }

    if (sentTo) {
        return (
            <AuthNotice icon={MailCheck} title="Check your inbox">
                We sent a verification link to <span className="font-bold break-all text-foreground">{sentTo}</span>.
            </AuthNotice>
        );
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-5">
            {error && <FormError>{error}</FormError>}
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" autoComplete="name" required maxLength={60} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    aria-describedby="password-hint"
                />
                <p id="password-hint" className="text-sm text-muted-foreground">
                    At least 8 characters.
                </p>
            </div>
            <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
                {pending && <Loader2 className="animate-spin" aria-hidden />}
                Create account
            </Button>
        </form>
    );
}
