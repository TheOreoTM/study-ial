import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { getSubjects } from "@/lib/queries/curriculum";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toIsoDate } from "@/components/units/exam-sessions";
import { toPickerSubjects } from "@/components/units/types";
import { UnitsEditor } from "@/components/units/units-editor";
import { updateMyUnits } from "./actions";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { DeleteAccount } from "./delete-account";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
    const user = await requireUser();
    const [subjects, myUnits, credential] = await Promise.all([
        getSubjects(),
        db.userUnit.findMany({ where: { userId: user.id }, select: { unitId: true, examDate: true } }),
        db.account.findFirst({ where: { userId: user.id, providerId: "credential" }, select: { id: true } }),
    ]);
    const pickerSubjects = toPickerSubjects(subjects);
    const order = pickerSubjects.flatMap((s) => s.units.map((u) => u.id));
    const initial = myUnits
        .map((u) => ({ unitId: u.unitId, examDate: toIsoDate(u.examDate) }))
        .sort((a, b) => order.indexOf(a.unitId) - order.indexOf(b.unitId));
    const hasPassword = Boolean(credential);

    return (
        <div className="mx-auto max-w-3xl">
            <PageHeader title="Settings" description="Your profile, units and account." />
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>How you appear across Study-IAL.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm name={user.name} email={user.email} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>My units</CardTitle>
                        <CardDescription>
                            The units you&apos;re studying and when you&apos;re sitting them. Your dashboard and study
                            plans use these.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UnitsEditor
                            subjects={pickerSubjects}
                            initial={initial}
                            today={new Date().toISOString()}
                            action={updateMyUnits}
                        />
                    </CardContent>
                </Card>

                {hasPassword && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Other devices will be signed out when you change it.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordForm />
                        </CardContent>
                    </Card>
                )}

                <Card className="border-destructive/40">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger zone</CardTitle>
                        <CardDescription>
                            Permanently delete your account, practice history, study plans and focus sessions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DeleteAccount requirePassword={hasPassword} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
