"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { assertUser } from "@/lib/session";
import { hashShareToken, newShareToken, sharePath } from "@/lib/share";
import { saveUserUnits, type SaveUnitsResult } from "@/components/units/save-units";

export async function updateMyUnits(input: unknown): Promise<SaveUnitsResult> {
    const user = await assertUser();
    const res = await saveUserUnits(user.id, input);
    if (res.ok) revalidatePath("/", "layout");
    return res;
}

/**
 * Creates (or replaces) the student's read-only progress link. The token is returned once and never stored, only
 * its hash, so this is the only time the full link is available.
 */
export async function createProgressShare(): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
    const user = await assertUser();
    const token = newShareToken();
    await db.progressShare.upsert({
        where: { userId: user.id },
        create: { userId: user.id, tokenHash: hashShareToken(token) },
        update: { tokenHash: hashShareToken(token), createdAt: new Date(), lastViewed: null },
    });
    revalidatePath("/settings");
    return { ok: true, path: sharePath(token) };
}

/** Turns sharing off: the current link stops working straight away. */
export async function deleteProgressShare(): Promise<{ ok: true } | { ok: false; error: string }> {
    const user = await assertUser();
    await db.progressShare.deleteMany({ where: { userId: user.id } });
    revalidatePath("/settings");
    return { ok: true };
}
