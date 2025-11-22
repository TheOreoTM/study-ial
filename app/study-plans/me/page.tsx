import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Target,
    ArrowRight,
    Sparkles,
    BookOpen,
    MoreHorizontal,
    CheckCircle2,
    PlayCircle,
} from "lucide-react";

import { getStudyPlanStatistics, getUserStudyPlans } from "@/lib/actions/studyPlans";
import type { StudyPlan } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { CreateStudyPlanModal } from "@/components/create-study-plan-modal";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Study Plans",
    description: "Manage your personalized learning paths.",
};

function parseDate(value: string | Date | null | undefined) {
    if (!value) return null;
    return value instanceof Date ? value : new Date(value);
}

function getPlanStatus(plan: StudyPlan) {
    const now = new Date();
    const start = parseDate(plan.startDate);
    const end = parseDate(plan.endDate);

    if (!start || !end) return "unknown" as const;
    if (now < start) return "upcoming" as const;
    if (now > end) return "completed" as const;
    return "active" as const;
}

function getTimeProgress(plan: StudyPlan) {
    const start = parseDate(plan.startDate);
    const end = parseDate(plan.endDate);
    if (!start || !end) return 0;

    const total = end.getTime() - start.getTime();
    if (total <= 0) return 0;

    const now = Date.now();
    const elapsed = Math.min(Math.max(now - start.getTime(), 0), total);
    return Math.round((elapsed / total) * 100);
}

function formatDate(date: Date | null) {
    if (!date) return "-";
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatHours(hours: string | number | null) {
    if (hours == null) return "-";
    const num = typeof hours === "string" ? parseFloat(hours) : hours;
    if (Number.isNaN(num)) return "-";
    return `${num.toFixed(1)}h`;
}

function splitPlans(plans: StudyPlan[]) {
    return plans.reduce(
        (acc, plan) => {
            const status = getPlanStatus(plan);
            if (status === "active") acc.activePlans.push(plan);
            else if (status === "upcoming") acc.upcomingPlans.push(plan);
            else if (status === "completed") acc.completedPlans.push(plan);
            return acc;
        },
        { activePlans: [] as StudyPlan[], upcomingPlans: [] as StudyPlan[], completedPlans: [] as StudyPlan[] }
    );
}

export default async function MyStudyPlansPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/auth/sign-in?redirect_url=/study-plans/me");
    }

    const plans = await getUserStudyPlans(userId);
    const { activePlans, upcomingPlans, completedPlans } = splitPlans(plans);

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium ring-1 ring-inset ring-primary/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Personalized Learning</span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Study Plans</h1>
                            <p className="text-muted-foreground mt-2 max-w-xl text-lg">
                                Manage your active, upcoming, and completed study plans.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                            <Link href="/study-plans" className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Marketplace
                            </Link>
                        </Button>
                        <CreateStudyPlanModal />
                    </div>
                </header>

                {plans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card border border-dashed border-border rounded-3xl space-y-6">
                        <div className="p-4 bg-primary/5 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h2 className="text-2xl font-semibold">No study plans yet</h2>
                            <p className="text-muted-foreground">
                                Create your first AI-generated study plan to get a structured schedule tailored to your
                                needs.
                            </p>
                        </div>
                        <CreateStudyPlanModal />
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Active Plans */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <PlayCircle className="w-6 h-6 text-primary" />
                                    Active Plans
                                </h2>
                                <span className="text-lg text-accent-foreground font-medium bg-accent px-2.5 py-0.5 rounded-full">
                                    {activePlans.length}
                                </span>
                            </div>

                            {activePlans.length === 0 ? (
                                <div className="bg-muted/30 rounded-2xl p-8 text-center border border-dashed border-border">
                                    <p className="text-muted-foreground">
                                        No active plans. Check your upcoming plans or create a new one!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                                    {activePlans.map(async (plan) => {
                                        const start = parseDate(plan.startDate);
                                        const end = parseDate(plan.endDate);
                                        const settings: any = plan.settings || {};
                                        const stats = await getStudyPlanStatistics(plan.id);
                                        const progress = stats.completionPercentage.toFixed(0);

                                        return (
                                            <Link
                                                key={plan.id}
                                                href={`/study-plans/${plan.id}`}
                                                className="group block h-full"
                                            >
                                                <div className="relative h-full bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col">
                                                    <div className="flex items-start justify-between gap-4 mb-6">
                                                        <div className="space-y-1.5">
                                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                                {plan.name}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {settings.goal
                                                                    ? `Goal: ${String(settings.goal).replace(
                                                                          /_/g,
                                                                          " "
                                                                      )}`
                                                                    : "Custom Plan"}
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 p-2 bg-primary/10 rounded-xl text-primary">
                                                            <BookOpen className="w-5 h-5" />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 space-y-6">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                                                    Timeline
                                                                </p>
                                                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                    <span>
                                                                        {start && end
                                                                            ? `${formatDate(start)} – ${formatDate(
                                                                                  end
                                                                              )}`
                                                                            : "TBD"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                                                    Commitment
                                                                </p>
                                                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                                    <span>
                                                                        {formatHours(plan.totalTargetHours)} total
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2.5">
                                                            <div className="flex justify-between text-xs font-semibold tracking-wide">
                                                                <span className="text-muted-foreground">PROGRESS</span>
                                                                <span className="text-primary text-lg">
                                                                    {progress}%
                                                                </span>
                                                            </div>
                                                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-medium text-primary">
                                                        <span>Continue Learning</span>
                                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Upcoming Plans */}
                        {upcomingPlans.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2 text-muted-foreground">
                                        <Target className="w-5 h-5" />
                                        Upcoming
                                    </h2>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {upcomingPlans.map((plan) => {
                                        const start = parseDate(plan.startDate);
                                        return (
                                            <Link
                                                key={plan.id}
                                                href={`/study-plans/${plan.id}`}
                                                className="group block"
                                            >
                                                <div className="bg-card/50 p-5 rounded-2xl border border-border hover:bg-card hover:border-blue-500/30 transition-all">
                                                    <div className="flex items-center justify-between gap-3 mb-3">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                                            Starts {start ? formatDate(start) : "Soon"}
                                                        </span>
                                                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                                        {plan.name}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {plan.totalTargetHours
                                                            ? `${formatHours(plan.totalTargetHours)} planned`
                                                            : "Draft plan"}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Completed Plans */}
                        {completedPlans.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2 text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Completed
                                    </h2>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {completedPlans.map((plan) => {
                                        const end = parseDate(plan.endDate);
                                        return (
                                            <Link
                                                key={plan.id}
                                                href={`/study-plans/${plan.id}`}
                                                className="group block"
                                            >
                                                <div className="bg-muted/20 p-4 rounded-2xl border border-border hover:bg-card hover:border-emerald-500/30 transition-all">
                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                        <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-600 dark:text-emerald-400">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground font-medium">
                                                            {end ? formatDate(end) : "Done"}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                                                        {plan.name}
                                                    </h3>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
