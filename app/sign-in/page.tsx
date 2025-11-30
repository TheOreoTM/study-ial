"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const signIn = async () => {
        await authClient.signIn.email(
            {
                email,
                password,
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                },
            }
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-4 w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Sign In</h1>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <button
                    onClick={signIn}
                    className="bg-black dark:bg-white text-white dark:text-black p-2 rounded font-medium hover:opacity-90 transition-opacity"
                >
                    Sign In
                </button>
                <div className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
