import { Logo } from "@/components/logo";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <header className="border-b bg-card">
                <div className="mx-auto flex h-16 w-full max-w-3xl items-center px-4 sm:px-6">
                    <Logo href="/onboarding" />
                </div>
            </header>
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-0 sm:px-6 sm:pt-12 sm:pb-16">{children}</main>
        </div>
    );
}
