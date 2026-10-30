import { z } from "zod";

export const unitSelectionSchema = z.object({
    units: z
        .array(
            z.object({
                unitId: z.string().min(1).max(64),
                examDate: z
                    .string()
                    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
                    .refine((s) => !Number.isNaN(new Date(`${s}T00:00:00Z`).getTime()), "Invalid date")
                    .nullable(),
            }),
        )
        .min(1, "Pick at least one unit.")
        .max(60)
        .refine((units) => new Set(units.map((u) => u.unitId)).size === units.length, "Duplicate units."),
});

export type UnitSelection = z.infer<typeof unitSelectionSchema>;
export type UnitSelectionEntry = UnitSelection["units"][number];
