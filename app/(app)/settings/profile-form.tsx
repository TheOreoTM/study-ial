"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function ProfileForm({ name: initialName, email }: { name: string; email: string }) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const trimmed = name.trim();

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (trimmed.length < 1 || trimmed.length > 60) {
            setError("Your name should be between 1 and 60 characters.");
            return;
        }
        startTransition(async () => {
            const { error } = await authClient.updateUser({ name: trimmed });
            if (error) {
                setError(error.message ?? "Couldn't update your name.");
                return;
            }
            toast.success("Name updated");
            router.refresh();
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled readOnly />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">Display name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    autoComplete="name"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "name-error" : undefined}
                />
                {error && (
                    <p id="name-error" className="text-sm text-destructive">
                        {error}
                    </p>
                )}
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={pending || trimmed === initialName}>
                    {pending && <Loader2 className="animate-spin" aria-hidden />}
                    Save name
                </Button>
            </div>
        </form>
    );
}
