import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Forgot your password?</CardTitle>
                <CardDescription>We&apos;ll email you a link to set a new one.</CardDescription>
            </CardHeader>
            <CardContent>
                <ForgotPasswordForm />
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    <Link href="/sign-in" className="underline-offset-4 hover:underline">
                        Back to sign in
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
