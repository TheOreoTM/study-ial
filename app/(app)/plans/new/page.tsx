import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { NewPlanForm } from "@/components/plans/new-plan-form";
import { Button } from "@/components/ui/button";
import { aiEnabled } from "@/lib/ai";
import { dayKey } from "@/lib/planner";
import { localDayKey } from "@/lib/time";
import { upcomingExamSessions } from "@/components/units/exam-sessions";
import { getPlannableUnits } from "@/lib/queries/plans";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "New study plan", robots: { index: false } };

export default async function NewPlanPage() {
    const user = await requireUser();
    const units = await getPlannableUnits(user.id);

    return (
        <div className="mx-auto max-w-3xl">
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                <Link href="/plans">
                    <ArrowLeft />
                    Study plans
                </Link>
            </Button>
            <PageHeader
                title="New study plan"
                description="We'll schedule every topic weakest-first, add spaced reviews, and finish with timed past papers in the last three weeks."
            />
            {units.length === 0 ? (
                <EmptyState
                    icon={Layers}
                    title="Add your units first"
                    description="A plan is built from the units you're studying and their exam dates."
                    action={
                        <Button asChild>
                            <Link href="/settings">Choose units</Link>
                        </Button>
                    }
                />
            ) : (
                <NewPlanForm
                    today={localDayKey()}
                    aiAvailable={aiEnabled}
                    suggestedExamDate={upcomingExamSessions()[0]?.date}
                    units={units.map((u) => ({
                        unitId: u.unitId,
                        code: u.code,
                        name: u.name,
                        subjectName: u.subjectName,
                        topicCount: u.topicCount,
                        examDate: u.examDate ? dayKey(u.examDate) : "",
                    }))}
                />
            )}
        </div>
    );
}
