import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { daysLeftLabel, formatDate, formatMinutes } from "@/components/plans/task-meta";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPlans, type PlanListItem } from "@/lib/queries/plans";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Study plans", robots: { index: false } };

export default async function PlansPage() {
    const user = await requireUser();
    const plans = await getPlans(user.id);
    const active = plans.filter((p) => p.status === "ACTIVE");
    const archived = plans.filter((p) => p.status === "ARCHIVED");

    const newButton = (
        <Button asChild>
            <Link href="/plans/new">
                <Plus />
                New plan
            </Link>
        </Button>
    );

    return (
        <>
            <PageHeader
                title="Study plans"
                description="A day-by-day schedule built around your exam dates, weakest topics first."
                actions={plans.length > 0 ? newButton : undefined}
            />
            {plans.length === 0 ? (
                <EmptyState
                    icon={CalendarCheck}
                    title="No study plans yet"
                    description="Tell us your exam dates and how much time you have — we'll plan every session, from learning new topics to timed past papers."
                    action={newButton}
                />
            ) : (
                <div className="space-y-10">
                    <section aria-labelledby="active-plans" className="space-y-3">
                        <h2 id="active-plans" className="text-sm font-medium text-muted-foreground">
                            Active
                        </h2>
                        {active.length === 0 ? (
                            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No active plans. Create one, or unarchive an old plan.
                            </p>
                        ) : (
                            <ul className="grid gap-3 md:grid-cols-2">
                                {active.map((p) => (
                                    <PlanCard key={p.id} plan={p} />
                                ))}
                            </ul>
                        )}
                    </section>
                    {archived.length > 0 && (
                        <section aria-labelledby="archived-plans" className="space-y-3">
                            <h2 id="archived-plans" className="text-sm font-medium text-muted-foreground">
                                Archived
                            </h2>
                            <ul className="grid gap-3 md:grid-cols-2">
                                {archived.map((p) => (
                                    <PlanCard key={p.id} plan={p} />
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </>
    );
}

function PlanCard({ plan }: { plan: PlanListItem }) {
    const archived = plan.status === "ARCHIVED";
    return (
        <li>
            <Link
                href={`/plans/${plan.id}`}
                className={cn(
                    "group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors outline-none hover:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    archived && "bg-muted/30 shadow-none",
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate font-semibold group-hover:text-primary">{plan.title}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">Exam {formatDate(plan.examDate)}</p>
                    </div>
                    <span
                        className={cn(
                            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            archived
                                ? "bg-muted text-muted-foreground"
                                : plan.daysLeft <= 21 && plan.daysLeft >= 0
                                  ? "bg-warning/15 text-amber-700 dark:text-warning"
                                  : "bg-accent text-accent-foreground",
                        )}
                    >
                        {archived ? "Archived" : daysLeftLabel(plan.daysLeft)}
                    </span>
                </div>
                <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                        <span>
                            {plan.doneTasks} of {plan.totalTasks - plan.skippedTasks} sessions done
                        </span>
                        <span>{plan.percentDone}%</span>
                    </div>
                    <Progress value={plan.percentDone} className="h-1.5" aria-label={`${plan.title} progress`} />
                    {!archived && (
                        <p className="text-xs text-muted-foreground">
                            {plan.todayTasks > 0
                                ? `Today: ${plan.todayTasks} ${plan.todayTasks === 1 ? "session" : "sessions"} · ${formatMinutes(plan.todayMinutes)}`
                                : "Nothing scheduled today"}
                        </p>
                    )}
                </div>
            </Link>
        </li>
    );
}
