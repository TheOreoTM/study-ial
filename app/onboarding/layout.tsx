import { Logo } from "@/components/logo";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col">
            <header className="flex h-16 items-center justify-center border-b px-4">
                <Logo href="/onboarding" />
            </header>
            <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">{children}</main>
        </div>
    );
}
