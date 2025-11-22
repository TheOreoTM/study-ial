import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen, Globe, Search } from "lucide-react";

import { getPublicStudyPlans } from "@/lib/actions/studyPlans";
import { Button } from "@/components/ui/button";
import { CreateStudyPlanModal } from "@/components/create-study-plan-modal";
import { CopyStudyPlanButton } from "@/components/copy-study-plan-button";
import { Metadata } from "next";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
    title: "Study Plan Marketplace",
    description: "Discover and copy community-created study plans.",
};

function formatHours(hours: string | number | null) {
    if (hours == null) return "-";
    const num = typeof hours === "string" ? parseFloat(hours) : hours;
    if (Number.isNaN(num)) return "-";
    return `${num.toFixed(1)}h`;
}

export default async function MarketplacePage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/auth/sign-in?redirect_url=/study-plans");
    }

    const plans = await getPublicStudyPlans();

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium ring-1 ring-inset ring-primary/20">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Community Plans</span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Study Plan Marketplace</h1>
                            <p className="text-muted-foreground mt-2 max-w-xl text-lg">
                                Discover expert-curated and community-shared study plans to accelerate your learning.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/study-plans/me" className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                My Plans
                            </Link>
                        </Button>
                        <CreateStudyPlanModal />
                    </div>
                </header>

                {/* Search (Visual only for now) */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search for study plans..." className="pl-9 bg-card" />
                </div>

                {plans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card border border-dashed border-border rounded-3xl space-y-6">
                        <div className="p-4 bg-primary/5 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h2 className="text-2xl font-semibold">No public plans yet</h2>
                            <p className="text-muted-foreground">
                                Be the first to share a study plan with the community! Create a plan and make it public
                                in the settings.
                            </p>
                        </div>
                        <CreateStudyPlanModal />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => {
                            const settings: any = plan.settings || {};

                            return (
                                <div
                                    key={plan.id}
                                    className="group relative flex flex-col bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="space-y-1.5">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                {plan.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {settings.goal
                                                    ? `Goal: ${String(settings.goal).replace(/_/g, " ")}`
                                                    : "Custom Study Plan"}
                                            </p>
                                        </div>
                                        <div className="shrink-0 p-2 bg-primary/10 rounded-xl text-primary">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatHours(plan.totalTargetHours)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {Math.ceil(
                                                        (new Date(plan.endDate).getTime() -
                                                            new Date(plan.startDate).getTime()) /
                                                            (1000 * 60 * 60 * 24)
                                                    )}{" "}
                                                    days
                                                </span>
                                            </div>
                                        </div>

                                        {plan.generatedByModel && (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                <span>AI Generated</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Link href={`/study-plans/${plan.id}`} className="flex items-center gap-2">
                                                Preview <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <CopyStudyPlanButton planId={plan.id} userId={userId} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
