import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { getSubjects } from "@/lib/queries/curriculum";
import { toIsoDate } from "@/components/units/exam-sessions";
import { toPickerSubjects } from "@/components/units/types";
import { OnboardingFlow } from "./onboarding-flow";

export const metadata: Metadata = { title: "Get started" };

export default async function OnboardingPage() {
    const user = await requireUser({ allowUnonboarded: true });
    if (user.onboardedAt) redirect("/dashboard");

    const [subjects, existing] = await Promise.all([
        getSubjects(),
        db.userUnit.findMany({ where: { userId: user.id }, select: { unitId: true, examDate: true } }),
    ]);
    const pickerSubjects = toPickerSubjects(subjects);
    const order = pickerSubjects.flatMap((s) => s.units.map((u) => u.id));
    const initial = existing
        .map((u) => ({ unitId: u.unitId, examDate: toIsoDate(u.examDate) }))
        .sort((a, b) => order.indexOf(a.unitId) - order.indexOf(b.unitId));

    return (
        <OnboardingFlow
            firstName={user.name.split(/\s+/)[0] || "there"}
            subjects={pickerSubjects}
            initial={initial}
            today={new Date().toISOString()}
        />
    );
}
