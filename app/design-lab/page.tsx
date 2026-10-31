import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { logoOptions } from "./logos";

export const metadata: Metadata = { title: "Design lab: logos", robots: { index: false } };

const faviconSizes = [
    { px: 16, size: "size-4" },
    { px: 24, size: "size-6" },
    { px: 32, size: "size-8" },
    { px: 48, size: "size-12" },
];

export default function DesignLabPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <h1 className="text-[1.75rem] leading-[1.1] tracking-[-0.01em] sm:text-[2.125rem]">Logo options</h1>
            <p className="mt-2 max-w-2xl text-[1.0625rem] text-muted-foreground">
                Five marks in the Playful Pop palette. Each is shown large, in the app bar, at favicon sizes, and on
                the cream, plum and tangerine fields it has to live on.
            </p>

            <ol className="mt-10 grid gap-6 lg:grid-cols-2">
                {logoOptions.map(({ id, name, Mark, note, tileOnDark }, i) => (
                    <li key={id} id={id} className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
                        <div className="flex items-baseline gap-3">
                            <span className="num text-lg text-muted-foreground">{i + 1}</span>
                            <h2 className="text-xl">{name}</h2>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{note}</p>

                        <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-5">
                            <Mark className={cn("size-28 sm:size-32", tileOnDark && "dark:rounded-[36%] dark:ring-1 dark:ring-border")} />
                            <div className="flex flex-col gap-4">
                                <div className="flex min-h-11 items-center gap-2.5 rounded-lg border bg-background px-3 py-2">
                                    <Mark className={cn("size-9", tileOnDark && "dark:rounded-[13px] dark:ring-1 dark:ring-border")} />
                                    <span className="font-display text-xl font-extrabold tracking-tight">Study-IAL</span>
                                </div>
                                <div className="flex items-end gap-4">
                                    {faviconSizes.map(({ px, size }) => (
                                        <div key={px} className="flex flex-col items-center gap-1">
                                            <Mark className={size} />
                                            <span className="num text-xs text-muted-foreground">{px}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                            {[
                                { label: "Cream", field: "bg-cream text-ink" },
                                { label: "Plum", field: "bg-ink text-cream" },
                                { label: "Tangerine", field: "bg-tangerine text-ink" },
                            ].map(({ label, field }) => (
                                <div
                                    key={label}
                                    className={cn("flex flex-col items-center gap-2 rounded-lg px-2 py-4", field)}
                                >
                                    <Mark
                                        className={cn(
                                            "size-12",
                                            label === "Plum" && tileOnDark && "rounded-[13px] ring-1 ring-ink-soft",
                                        )}
                                    />
                                    <span className="text-xs font-bold">{label}</span>
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>
        </main>
    );
}
