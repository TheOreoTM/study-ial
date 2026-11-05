import { Eye } from "lucide-react";
import { Logo } from "@/components/logo";

/** Shell for read-only shared pages: the brand and a "Read-only" badge, never the viewer's own app navigation. */
export default function ShareLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh">
            <header className="border-b bg-card print:hidden">
                <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center gap-3 px-4 sm:px-6">
                    <Logo />
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
                        <Eye className="size-3.5" aria-hidden /> Read-only
                    </span>
                </div>
            </header>
            <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:py-10">{children}</main>
        </div>
    );
}
