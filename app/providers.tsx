"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter();

    return (
        <AuthUIProvider
            social={{
                providers: ["google"],
            }}
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            avatar={{
                upload: async (file) => {
                    const formData = new FormData();
                    formData.append("avatar", file);

                    const res = await fetch("/api/uploadAvatar", { method: "POST", body: formData });
                    const { data } = await res.json();

                    return data.url;
                },
                delete: async (url) => {
                    await fetch("/api/deleteAvatar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url }),
                    });
                },
            }}
            account={{
                fields: ["image", "name"],
            }}
            onSessionChange={() => {
                // Clear router cache (protected routes)
                router.refresh();
            }}
            Link={Link}
        >
            {children}
        </AuthUIProvider>
    );
}
