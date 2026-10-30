import type { Metadata } from "next";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
    return (
        <AuthCard
            title="Forgot your password?"
            description="We'll email you a link to set a new one."
            footer={<AuthLink href="/sign-in">Back to sign in</AuthLink>}
        >
            <ForgotPasswordForm />
        </AuthCard>
    );
}
