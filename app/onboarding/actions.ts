"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertUser } from "@/lib/session";
import { saveUserUnits } from "@/components/units/save-units";

/** Saves the chosen units + exam dates, marks the user onboarded and sends them to the dashboard. */
export async function completeOnboarding(input: unknown) {
    const user = await assertUser();
    const res = await saveUserUnits(user.id, input, { markOnboarded: true });
    if (!res.ok) return res;
    revalidatePath("/", "layout");
    redirect("/dashboard");
}
