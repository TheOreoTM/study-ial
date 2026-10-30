"use server";

import { revalidatePath } from "next/cache";
import { assertUser } from "@/lib/session";
import { saveUserUnits, type SaveUnitsResult } from "@/components/units/save-units";

export async function updateMyUnits(input: unknown): Promise<SaveUnitsResult> {
    const user = await assertUser();
    const res = await saveUserUnits(user.id, input);
    if (res.ok) revalidatePath("/", "layout");
    return res;
}
