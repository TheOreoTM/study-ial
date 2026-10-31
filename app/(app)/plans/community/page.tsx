import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { formatMinutes } from "@/components/plans/task-meta";
import { UnitChip } from "@/components/plans/unit-chip";
import { Button } from "@/components/ui/button";
import { listCommunityPlans } from "@/lib/queries/community-plans";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Community plans", robots: { index: false } };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CommunityPlansPage({ searchParams }: { searchParams: SearchParams }) {
    const user = await requireUser();
    const all = (await searchParams).show === "all";
    const plans = await listCommunityPlans(user.id, { all });

    return (
        <>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
                <Link href="/plans">
                    <ArrowLeft />
                    Study plans
                </Link>
            </Button>
            <PageHeader
                title="Community plans"
                description="See how other students pace their revision. Using a plan copies its rhythm; the topics are still ordered by your own marks."
            />

            <nav aria-label="Filter" className="mb-6 flex gap-1">
                {[
                    { href: "/plans/community", label: "For my units", current: !all },
                    { href: "/plans/community?show=all", label: "All plans", current: all },
                ].map((f) => (
                    <Link
                        key={f.href}
                        href={f.href}
                        aria-current={f.current ? "page" : undefined}
                        className={cn(
                            "flex min-h-11 items-center rounded-full px-4 font-display font-bold transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            f.current
                                ? "bg-selected text-selected-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                    >
                        {f.label}
                    </Link>
                ))}
            </nav>

            {plans.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title={all ? "No shared plans yet" : "No shared plans for your units yet"}
                    description="Share one of your plans from its menu and it'll show up here for other students."
                    action={
                        all ? undefined : (
                            <Button asChild variant="outline">
                                <Link href="/plans/community?show=all">See all plans</Link>
                            </Button>
                        )
                    }
                />
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {plans.map((p) => (
                        <li key={p.id}>
                            <Link
                                href={`/plans/community/${p.id}`}
                                className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-card transition-[border-color,box-shadow] duration-200 ease-out-soft hover:border-border-strong hover:shadow-raised focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                                <span className="flex flex-wrap gap-1.5">
                                    {p.unitCodes.map((c) => (
                                        <UnitChip key={c} code={c} size="sm" />
                                    ))}
                                </span>
                                <span className="mt-3 font-display text-lg leading-tight font-extrabold">
                                    {p.title}
                                </span>
                                <span className="mt-1 text-sm text-muted-foreground">
                                    {formatMinutes(p.minutesPerDay)} a day · {p.studyDays.length} day
                                    {p.studyDays.length === 1 ? "" : "s"} a week · {p.weeks} week
                                    {p.weeks === 1 ? "" : "s"}
                                </span>
                                <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-[0.8125rem] font-semibold text-muted-foreground">
                                    <span>{p.taskCount} sessions</span>
                                    <span>
                                        {p.mine
                                            ? "Your plan"
                                            : p.uses > 0
                                              ? `Used by ${p.uses} student${p.uses === 1 ? "" : "s"}`
                                              : "New"}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
