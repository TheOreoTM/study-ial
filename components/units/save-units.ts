import "server-only";
import { db } from "@/lib/db";
import { unitSelectionSchema } from "./schema";

export type SaveUnitsResult = { ok: true } | { ok: false; error: string };

/**
 * Replace a user's units with `input` (validated here): removes units no longer chosen, upserts the rest
 * (keeping `addedAt` for units they already had). Optionally marks the user as onboarded in the same transaction.
 */
export async function saveUserUnits(
    userId: string,
    input: unknown,
    { markOnboarded = false }: { markOnboarded?: boolean } = {},
): Promise<SaveUnitsResult> {
    const parsed = unitSelectionSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid selection." };
    const { units } = parsed.data;

    const ids = units.map((u) => u.unitId);
    const found = await db.unit.count({ where: { id: { in: ids } } });
    if (found !== ids.length) return { ok: false, error: "Some of those units no longer exist. Refresh and try again." };

    await db.$transaction([
        db.userUnit.deleteMany({ where: { userId, unitId: { notIn: ids } } }),
        ...units.map((u) => {
            const examDate = u.examDate ? new Date(`${u.examDate}T00:00:00Z`) : null;
            return db.userUnit.upsert({
                where: { userId_unitId: { userId, unitId: u.unitId } },
                create: { userId, unitId: u.unitId, examDate },
                update: { examDate },
            });
        }),
        ...(markOnboarded ? [db.user.update({ where: { id: userId }, data: { onboardedAt: new Date() } })] : []),
    ]);
    return { ok: true };
}
