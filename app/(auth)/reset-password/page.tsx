import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = { title: "Set a new password" };

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string; error?: string }>;
}) {
    const { token, error } = await searchParams;
    const valid = !error && Boolean(token);
    return (
        <AuthCard
            title="Set a new password"
            description={valid ? "At least 8 characters." : undefined}
        >
            <ResetPasswordForm token={error ? null : (token ?? null)} />
        </AuthCard>
    );
}
