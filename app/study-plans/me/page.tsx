import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Target, ArrowRight, Sparkles } from "lucide-react";

import { getStudyPlanStatistics, getUserStudyPlans } from "@/lib/actions/studyPlans";
import type { StudyPlan } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { CreateStudyPlanModal } from "@/components/create-study-plan-modal";
import { MyStudyPlanFilters } from "@/components/my-study-plan-filters";
import { StudyPlanCard } from "@/components/study-plan-card";
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

export default async function MyStudyPlansPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const user = await stackServerApp.getUser();
    const userId = user?.id;

    if (!userId) {
        redirect("/handler/sign-in?redirect_url=/study-plans/me");
    }

    const params = await searchParams;

    const search = typeof params.search === "string" ? params.search : undefined;
    const status = typeof params.status === "string" ? params.status : "active";
    const sort = typeof params.sort === "string" ? (params.sort as any) : "createdAt";
    const order = typeof params.order === "string" ? (params.order as any) : "desc";

    const plans = await getUserStudyPlans(userId, {
        search,
        filterStatus: status as any,
        sortBy: sort,
        sortOrder: order,
    });

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
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

                <MyStudyPlanFilters />

                {plans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card border border-dashed border-border rounded-3xl space-y-6">
                        <div className="p-4 bg-primary/5 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h2 className="text-2xl font-semibold">No study plans found</h2>
                            <p className="text-muted-foreground">
                                {search || status !== "active"
                                    ? "Try adjusting your filters or search terms."
                                    : "Create your first AI-generated study plan to get a structured schedule tailored to your needs."}
                            </p>
                        </div>
                        {!search && status === "active" && <CreateStudyPlanModal />}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {plans.map(async (plan) => {
                            const stats = await getStudyPlanStatistics(plan.id);
                            return <StudyPlanCard key={plan.id} plan={plan} stats={stats} />;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
