import type { Metadata } from "next";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authConfig } from "@/lib/auth";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
    return (
        <AuthCard
            title="Create your account"
            description="Free. Takes about a minute."
            footer={
                <>
                    Already have an account? <AuthLink href="/sign-in">Sign in</AuthLink>
                </>
            }
        >
            {authConfig.googleEnabled && (
                <>
                    <GoogleButton callbackURL="/onboarding" />
                    <OrDivider />
                </>
            )}
            <SignUpForm requiresVerification={Boolean(process.env.RESEND_API_KEY)} />
        </AuthCard>
    );
}
