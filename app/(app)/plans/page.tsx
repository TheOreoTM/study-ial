import type { Metadata } from "next";
import Link from "next/link";
import { Archive, ArrowRight, CalendarCheck, CalendarDays, Plus, Users } from "lucide-react";
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
                actions={
                    <>
                        <Button asChild variant="outline">
                            <Link href="/plans/community">
                                <Users />
                                Community plans
                            </Link>
                        </Button>
                        {plans.length > 0 && newButton}
                    </>
                }
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
                    <section aria-labelledby="active-plans" className="space-y-4">
                        <h2 id="active-plans" className="text-xl">
                            Active
                        </h2>
                        {active.length === 0 ? (
                            <p className="rounded-xl bg-muted p-6 text-center text-muted-foreground">
                                No active plans. Create one, or unarchive an old plan.
                            </p>
                        ) : (
                            <ul className="grid gap-4 md:grid-cols-2">
                                {active.map((p) => (
                                    <PlanCard key={p.id} plan={p} />
                                ))}
                            </ul>
                        )}
                    </section>
                    {archived.length > 0 && (
                        <section aria-labelledby="archived-plans" className="space-y-4">
                            <h2 id="archived-plans" className="text-xl">
                                Archived
                            </h2>
                            <ul className="grid gap-4 md:grid-cols-2">
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
    const soon = plan.daysLeft <= 21 && plan.daysLeft >= 0;
    return (
        <li>
            <Link
                href={`/plans/${plan.id}`}
                className={cn(
                    "group flex h-full flex-col gap-5 rounded-xl border p-5 outline-none transition-[border-color,box-shadow] duration-200 ease-out-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-6",
                    archived ? "border-transparent bg-muted" : "bg-card shadow-card hover:border-border-strong",
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-xl leading-tight">{plan.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Exam {formatDate(plan.examDate)}</p>
                    </div>
                    <span
                        className={cn(
                            "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-bold",
                            archived ? "bg-card text-muted-foreground" : "bg-muted",
                            !archived && (soon ? "text-warning" : "text-foreground"),
                        )}
                    >
                        {archived ? (
                            <Archive className="size-3.5" aria-hidden />
                        ) : (
                            <CalendarDays className="size-3.5" aria-hidden />
                        )}
                        {archived ? "Archived" : daysLeftLabel(plan.daysLeft)}
                    </span>
                </div>
                <div className="mt-auto">
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                            {plan.doneTasks} of {plan.totalTasks - plan.skippedTasks} sessions done
                        </span>
                        <span className="num text-xl leading-none">{plan.percentDone}%</span>
                    </div>
                    <Progress value={plan.percentDone} className="h-2" aria-label={`${plan.title} progress`} />
                    {!archived && (
                        <p className="mt-4 flex items-center justify-between gap-3 border-t pt-4 text-sm font-semibold">
                            <span className={plan.todayTasks > 0 ? undefined : "text-muted-foreground"}>
                                {plan.todayTasks > 0
                                    ? `Today: ${plan.todayTasks} ${plan.todayTasks === 1 ? "session" : "sessions"} · ${formatMinutes(plan.todayMinutes)}`
                                    : "Nothing scheduled today"}
                            </span>
                            <ArrowRight
                                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </p>
                    )}
                </div>
            </Link>
        </li>
    );
}
