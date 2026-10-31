import "server-only";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { db } from "@/lib/db";

export const aiEnabled = Boolean(process.env.OPENROUTER_API_KEY);

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY ?? "" });

/** Cheap, fast model for high-volume work (marking, plan notes, tutor). */
export const fastModelId = () => process.env.AI_MODEL_FAST || "google/gemini-2.5-flash";
export const fastModel = () => openrouter.chat(fastModelId());
/** Stronger model for harder reasoning. */
export const smartModel = () => openrouter.chat(process.env.AI_MODEL_SMART || "google/gemini-2.5-pro");

export type AiFeature = "marking" | "plan" | "tutor";

const DEFAULT_LIMITS: Record<AiFeature, number> = { marking: 40, plan: 5, tutor: 20 };

export function dailyLimit(feature: AiFeature) {
    const raw = process.env[`AI_DAILY_LIMIT_${feature.toUpperCase()}`];
    const n = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_LIMITS[feature];
}

export class AiQuotaError extends Error {
    constructor(public feature: AiFeature) {
        super(`Daily AI limit reached for ${feature}. It resets at midnight UTC.`);
    }
}

const today = () => new Date().toISOString().slice(0, 10);

/** Atomically reserves one unit of AI quota, throwing AiQuotaError if the cap is hit. */
export async function consumeAiQuota(userId: string, feature: AiFeature) {
    const limit = dailyLimit(feature);
    const day = today();
    const usage = await db.aiUsage.upsert({
        where: { userId_day_feature: { userId, day, feature } },
        create: { userId, day, feature, count: 1 },
        update: { count: { increment: 1 } },
    });
    if (usage.count > limit) {
        await db.aiUsage.update({
            where: { userId_day_feature: { userId, day, feature } },
            data: { count: { decrement: 1 } },
        });
        throw new AiQuotaError(feature);
    }
}

export async function remainingAiQuota(userId: string, feature: AiFeature) {
    const usage = await db.aiUsage.findUnique({
        where: { userId_day_feature: { userId, day: today(), feature } },
    });
    return Math.max(0, dailyLimit(feature) - (usage?.count ?? 0));
}

/** Gives back a unit of quota when the model call failed, so students aren't charged for our errors. */
export async function refundAiQuota(userId: string, feature: AiFeature) {
    await db.aiUsage
        .updateMany({ where: { userId, day: today(), feature, count: { gt: 0 } }, data: { count: { decrement: 1 } } })
        .catch(() => {});
}
