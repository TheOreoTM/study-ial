import type { Metadata } from "next";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { SignInForm } from "@/components/auth/sign-in-form";
import { authConfig } from "@/lib/auth";
import { safeRedirect } from "@/lib/safe-redirect";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const next = safeRedirect((await searchParams).next);
    return (
        <AuthCard
            title="Welcome back"
            description="Sign in to pick up where you left off."
            footer={
                <>
                    New here? <AuthLink href="/sign-up">Create a free account</AuthLink>
                </>
            }
        >
            {authConfig.googleEnabled && (
                <>
                    <GoogleButton callbackURL={next} />
                    <OrDivider />
                </>
            )}
            <SignInForm next={next} />
        </AuthCard>
    );
}
