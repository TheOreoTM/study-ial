import type { MilestoneView } from "@/lib/queries/milestones";
import { APP_TIME_ZONE } from "@/lib/time";
import { cn } from "@/lib/utils";
import { milestoneIcon } from "./icons";

/** All milestones: earned ones with their date, the rest with honest progress. Neutral, with purple for earned. */
export function MilestoneGrid({ milestones }: { milestones: MilestoneView[] }) {
    const earned = milestones.filter((m) => m.earnedAt).length;
    return (
        <section aria-labelledby="milestones-heading" id="milestones" className="scroll-mt-24">
            <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 id="milestones-heading" className="text-lg">
                    Milestones
                </h2>
                <p className="text-sm text-muted-foreground">
                    <span className="num text-foreground">{earned}</span> of {milestones.length} earned
                </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {milestones.map((m) => {
                    const Icon = milestoneIcon[m.key];
                    const done = !!m.earnedAt;
                    return (
                        <li
                            key={m.key}
                            className={cn("flex gap-3 rounded-lg border p-4", done ? "bg-card" : "bg-transparent")}
                        >
                            <span
                                className={cn(
                                    "grid size-10 shrink-0 place-items-center rounded-[12px]",
                                    done ? "bg-selected text-selected-foreground" : "bg-muted text-muted-foreground",
                                )}
                            >
                                <Icon className="size-5" aria-hidden />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="leading-snug font-bold">
                                    {m.title}
                                    {!done && <span className="sr-only"> (not earned yet)</span>}
                                </p>
                                <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{m.description}</p>
                                {done ? (
                                    <p className="mt-2 text-[0.8125rem] font-semibold">
                                        {m.detail && <>{m.detail} · </>}
                                        <time dateTime={m.earnedAt!.toISOString()}>
                                            {m.earnedAt!.toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                timeZone: APP_TIME_ZONE,
                                            })}
                                        </time>
                                    </p>
                                ) : (
                                    m.progress && (
                                        <div className="mt-2.5">
                                            <div
                                                className="h-1.5 overflow-hidden rounded-full bg-track"
                                                role="progressbar"
                                                aria-valuemin={0}
                                                aria-valuemax={m.progress.target}
                                                aria-valuenow={m.progress.value}
                                                aria-label={m.title}
                                                aria-valuetext={`${m.progress.value} of ${m.progress.target} ${m.progress.label}`}
                                            >
                                                <div
                                                    className="h-full rounded-full bg-progress"
                                                    style={{
                                                        width: `${Math.max(3, (m.progress.value / m.progress.target) * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="mt-1.5 text-[0.8125rem] text-muted-foreground tabular-nums">
                                                {m.progress.value} of {m.progress.target} {m.progress.label}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
