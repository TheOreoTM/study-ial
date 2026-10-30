"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function DeleteAccount({ requirePassword }: { requirePassword: boolean }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const canDelete = confirm.trim().toLowerCase() === "delete" && (!requirePassword || password.length > 0);

    function onOpenChange(next: boolean) {
        if (pending) return;
        setOpen(next);
        if (!next) {
            setConfirm("");
            setPassword("");
            setError(null);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!canDelete) return;
        setError(null);
        startTransition(async () => {
            const { error } = await authClient.deleteUser(requirePassword ? { password } : {});
            if (error) {
                setError(
                    error.code === "INVALID_PASSWORD"
                        ? "That password is incorrect."
                        : error.code === "SESSION_EXPIRED"
                          ? "For your security, sign out and sign back in, then try again."
                          : (error.message ?? "Couldn't delete your account."),
                );
                return;
            }
            router.push("/");
            router.refresh();
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">This can&apos;t be undone.</p>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2 aria-hidden /> Delete account
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Delete your account?</DialogTitle>
                        <DialogDescription>
                            All your practice attempts, mastery, study plans and focus sessions will be permanently
                            deleted.
                        </DialogDescription>
                    </DialogHeader>
                    {requirePassword && (
                        <div className="grid gap-2">
                            <Label htmlFor="delete-password">Your password</Label>
                            <Input
                                id="delete-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="delete-confirm">
                            Type <span className="font-mono font-semibold">delete</span> to confirm
                        </Label>
                        <Input
                            id="delete-confirm"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            autoComplete="off"
                            autoCapitalize="none"
                            spellCheck={false}
                        />
                    </div>
                    {error && (
                        <p role="alert" className="text-sm text-destructive">
                            {error}
                        </p>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={pending}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={!canDelete || pending}>
                            {pending && <Loader2 className="animate-spin" aria-hidden />}
                            Delete forever
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
