import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authConfig } from "@/lib/auth";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Create your account</CardTitle>
                <CardDescription>Free. Takes about a minute.</CardDescription>
            </CardHeader>
            <CardContent>
                {authConfig.googleEnabled && (
                    <>
                        <GoogleButton callbackURL="/onboarding" />
                        <OrDivider />
                    </>
                )}
                <SignUpForm requiresVerification={Boolean(process.env.RESEND_API_KEY)} />
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
