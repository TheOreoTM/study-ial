import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getStudyPlanWithItems, getStudyPlanStatistics } from "@/lib/actions/studyPlans";
import { StudyPlanView } from "@/components/study-plan-view";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const plan = await getStudyPlanWithItems(id);

    return {
        title: plan ? (plan as any).name : "Study Plan",
        description: "View your personalized study plan details and progress.",
    };
}

export default async function StudyPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
        notFound();
    }

    const plan = await getStudyPlanWithItems(id);
    if (!plan || (plan as any).userId !== userId) {
        notFound();
    }

    const stats = await getStudyPlanStatistics(id);

    return <StudyPlanView plan={plan as any} initialStats={stats} />;
}
