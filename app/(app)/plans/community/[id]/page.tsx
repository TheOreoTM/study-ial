import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { AdminUnshareButton, ShareToggle, UsePlanButton } from "@/components/plans/community-actions";
import { formatMinutes } from "@/components/plans/task-meta";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { TASK_TYPES, TASK_TYPE_LABEL } from "@/lib/community-plans";
import { getCommunityPlan } from "@/lib/queries/community-plans";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Community plan", robots: { index: false } };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = { params: Promise<{ id: string }> };

export default async function CommunityPlanPage({ params }: Props) {
    const { id } = await params;
    const user = await requireUser();
    const plan = await getCommunityPlan(user.id, id);
    if (!plan) notFound();
    const { template } = plan;
    const days = [1, 2, 3, 4, 5, 6, 0].filter((d) => plan.studyDays.includes(d)).map((d) => DAY_NAMES[d]);
    const missing = plan.units.filter((u) => !u.studied).map((u) => u.code);
    const maxWeek = Math.max(1, ...template.outline.map((w) => w.minutes));

    return (
        <>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
                <Link href="/plans/community">
                    <ArrowLeft />
                    Community plans
                </Link>
            </Button>
            <PageHeader
                title={plan.title}
                description={
                    <>
                        {formatMinutes(plan.minutesPerDay)} a day on {days.join(", ")}, over {template.weeks} week
                        {template.weeks === 1 ? "" : "s"}.
                        <span className="mt-3 flex flex-wrap gap-1.5">
                            {plan.units.map((u) => (
                                <UnitChip key={u.id} code={u.code} size="sm" />
                            ))}
                        </span>
                    </>
                }
                actions={
                    plan.mine ? (
                        <ShareToggle planId={plan.id} title={plan.title} shared={plan.isPublic} />
                    ) : (
                        <>
                            {user.role === "ADMIN" && plan.isPublic && <AdminUnshareButton planId={plan.id} />}
                            <UsePlanButton planId={plan.id} missingUnits={missing} />
                        </>
                    )
                }
            />

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <section aria-labelledby="outline" className="min-w-0 rounded-xl border bg-card p-5 shadow-card sm:p-6">
                    <h2 id="outline" className="text-lg">
                        Week by week
                    </h2>
                    <p className="mt-1 mb-4 text-sm text-muted-foreground">
                        The mix of sessions each week. When you use the plan, the topics come from your own weakest
                        ones.
                    </p>
                    <ol className="divide-y">
                        {template.outline.map((w) => (
                            <li
                                key={w.week}
                                className="grid gap-1.5 py-3 first:pt-0 last:pb-0 sm:grid-cols-[5rem_1fr_5.5rem] sm:items-center sm:gap-4"
                            >
                                <span className="font-bold">Week {w.week}</span>
                                <span className="min-w-0">
                                    <span className="block h-2 overflow-hidden rounded-full bg-track" aria-hidden>
                                        <span
                                            className="block h-full rounded-full bg-progress"
                                            style={{ width: `${(w.minutes / maxWeek) * 100}%` }}
                                        />
                                    </span>
                                    <span className="mt-1.5 block text-[0.8125rem] text-muted-foreground">
                                        {TASK_TYPES.filter((t) => w.counts[t] > 0)
                                            .map((t) => `${w.counts[t]} ${TASK_TYPE_LABEL[t].toLowerCase()}`)
                                            .join(" · ") || (w.week === template.weeks ? "Exam week" : "Rest week")}
                                        {w.units.length > 0 && ` · ${w.units.join(", ")}`}
                                    </span>
                                </span>
                                <span className="num text-sm text-muted-foreground sm:text-right">
                                    {formatMinutes(w.minutes)}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>

                <aside className="space-y-4 lg:sticky lg:top-24">
                    <section aria-labelledby="mix" className="rounded-xl bg-muted p-5">
                        <h2 id="mix" className="mb-3 text-lg">
                            Session mix
                        </h2>
                        <dl className="space-y-1 rounded-lg bg-card px-4 py-3">
                            {TASK_TYPES.map((t) => (
                                <div key={t} className="flex items-baseline justify-between gap-2 py-0.5">
                                    <dt className="text-muted-foreground">{TASK_TYPE_LABEL[t]}</dt>
                                    <dd className="num">{template.mix[t]}</dd>
                                </div>
                            ))}
                            <div className="mt-1 flex items-baseline justify-between gap-2 border-t pt-2">
                                <dt className="font-bold">Total</dt>
                                <dd className="num text-lg leading-none">{template.taskCount}</dd>
                            </div>
                        </dl>
                        <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                            {plan.uses > 0
                                ? `Used by ${plan.uses} student${plan.uses === 1 ? "" : "s"}.`
                                : "Nobody has used this plan yet."}
                        </p>
                    </section>
                    <section aria-labelledby="how" className="rounded-xl bg-muted p-5">
                        <h2 id="how" className="mb-2 text-lg">
                            How using it works
                        </h2>
                        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                            <li>You get the same daily time, study days and units.</li>
                            <li>
                                Your exam dates are used when you&apos;ve set them; otherwise the plan keeps its length
                                from today.
                            </li>
                            <li>Topics are scheduled weakest first, from your own marks.</li>
                        </ul>
                    </section>
                </aside>
            </div>
        </>
    );
}
