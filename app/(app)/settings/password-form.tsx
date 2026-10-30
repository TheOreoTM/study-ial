"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function PasswordForm() {
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const currentPassword = String(data.get("currentPassword") ?? "");
        const newPassword = String(data.get("newPassword") ?? "");
        const confirm = String(data.get("confirmPassword") ?? "");
        setError(null);
        if (newPassword.length < 8) return setError("Your new password needs at least 8 characters.");
        if (newPassword !== confirm) return setError("The new passwords don't match.");
        if (newPassword === currentPassword) return setError("Choose a password different from your current one.");

        startTransition(async () => {
            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });
            if (error) {
                setError(
                    error.code === "INVALID_PASSWORD"
                        ? "Your current password is incorrect."
                        : (error.message ?? "Couldn't change your password."),
                );
                return;
            }
            form.reset();
            toast.success("Password changed");
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                </div>
            </div>
            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}
            <div className="flex justify-end">
                <Button type="submit" disabled={pending}>
                    {pending && <Loader2 className="animate-spin" aria-hidden />}
                    Change password
                </Button>
            </div>
        </form>
    );
}
