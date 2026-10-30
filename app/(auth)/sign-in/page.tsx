import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { SignInForm } from "@/components/auth/sign-in-form";
import { authConfig } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

/** Only allow same-site relative redirects. */
function safeNext(next: string | string[] | undefined) {
    return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const next = safeNext((await searchParams).next);
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>Sign in to pick up where you left off.</CardDescription>
            </CardHeader>
            <CardContent>
                {authConfig.googleEnabled && (
                    <>
                        <GoogleButton callbackURL={next} />
                        <OrDivider />
                    </>
                )}
                <SignInForm next={next} />
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    New here?{" "}
                    <Link href="/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
                        Create a free account
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
