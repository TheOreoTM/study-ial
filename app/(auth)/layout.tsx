import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getUser } from "@/lib/session";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    if (await getUser()) redirect("/dashboard");
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-10">
            <Logo className="mb-8 text-lg" />
            <div className="w-full max-w-sm">{children}</div>
        </div>
    );
}
