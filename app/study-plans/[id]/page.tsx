import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getStudyPlanWithItems, getStudyPlanStatistics } from "@/lib/actions/studyPlans";
import { StudyPlanView } from "@/components/study-plan-view";

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
