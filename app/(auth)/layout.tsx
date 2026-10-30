import { redirect } from "next/navigation";
import { Logo, LogoMark } from "@/components/logo";
import { getUser } from "@/lib/session";
import { cn } from "@/lib/utils";

/** A rising-bars skyline on the tangerine panel (deeper orange, the last bar ink). No mastery colours: decoration. */
const BARS = [28, 40, 34, 52, 46, 64, 58, 78, 72, 92];

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    if (await getUser()) redirect("/dashboard");
    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8 sm:py-12 lg:px-8">
            <div className="grid w-full max-w-[1040px] items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
                <aside
                    aria-hidden
                    className="relative hidden min-h-[540px] flex-col overflow-hidden rounded-xl bg-primary p-10 text-primary-foreground lg:flex dark:bg-primary-soft dark:text-foreground"
                >
                    <div className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight">
                        <LogoMark />
                        <span>Study-IAL</span>
                    </div>
                    <p className="mt-auto max-w-[17ch] font-display text-[2.5rem] leading-[1.02] font-extrabold tracking-[-0.02em]">
                        Practise a topic. Watch your bar rise.
                    </p>
                    <p className="mt-4 max-w-[36ch] text-[1.0625rem] leading-relaxed font-semibold">
                        Edexcel IAL questions, topic by topic, with a mastery score that tells you what to revise next.
                    </p>
                    <div className="mt-10 -mb-10 flex h-28 items-end gap-2.5">
                        {BARS.map((h, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "flex-1 rounded-t-[10px]",
                                    i === BARS.length - 1
                                        ? "bg-primary-foreground dark:bg-primary"
                                        : "bg-primary-press dark:bg-primary/30",
                                )}
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </aside>

                <div className="flex w-full flex-col items-center justify-center lg:items-stretch">
                    <Logo className="mb-6 lg:hidden" />
                    <div className="w-full max-w-[440px]">{children}</div>
                </div>
            </div>
        </main>
    );
}
