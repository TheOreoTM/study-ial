import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const user = session?.user;
    const userId = user?.id;

    if (!userId) {
        notFound();
    }

    const plan = await getStudyPlanWithItems(id);

    if (!plan) {
        notFound();
    }

    const isOwner = (plan as any).userId === userId;
    const isPublic = (plan as any).isPublic;

    if (!isOwner && !isPublic) {
        notFound();
    }

    const isReadOnly = !isOwner;

    const stats = await getStudyPlanStatistics(id);

    return <StudyPlanView plan={plan as any} initialStats={stats} isReadOnly={isReadOnly} />;
}
