import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = { title: "Set a new password" };

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string; error?: string }>;
}) {
    const { token, error } = await searchParams;
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Set a new password</CardTitle>
            </CardHeader>
            <CardContent>
                <ResetPasswordForm token={error ? null : (token ?? null)} />
            </CardContent>
        </Card>
    );
}
