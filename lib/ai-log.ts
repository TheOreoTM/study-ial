// Token and cost logging for every model call (admin spend view). Only counts are stored: never prompts, answers or
// anything that identifies a student beyond their id.
import { db } from "@/lib/db";

/** USD per million tokens [input, output]. Unknown models use the fallback; override with AI_PRICE_DEFAULT="in,out". */
const PRICES: Record<string, [number, number]> = {
    "google/gemini-2.5-flash": [0.3, 2.5],
    "google/gemini-2.5-pro": [1.25, 10],
    "z-ai/glm-5.3-flash": [0.1, 0.4],
};

export function priceFor(model: string): [number, number] {
    if (PRICES[model]) return PRICES[model];
    const env = process.env.AI_PRICE_DEFAULT?.split(",").map(Number);
    return env && env.length === 2 && env.every(Number.isFinite) ? [env[0], env[1]] : [1, 4];
}

/** Estimated cost in micro-dollars. */
export function estimateCostMicros(model: string, inputTokens: number, outputTokens: number) {
    const [i, o] = priceFor(model);
    return Math.round(inputTokens * i + outputTokens * o);
}

type Usage = { inputTokens?: number | undefined; outputTokens?: number | undefined } | undefined;

export async function logAiCall(entry: { userId: string | null; feature: string; model: string; usage: Usage; ok: boolean }) {
    const inputTokens = entry.usage?.inputTokens ?? 0;
    const outputTokens = entry.usage?.outputTokens ?? 0;
    await db.aiCallLog
        .create({
            data: {
                userId: entry.userId,
                feature: entry.feature,
                model: entry.model,
                inputTokens,
                outputTokens,
                costMicros: estimateCostMicros(entry.model, inputTokens, outputTokens),
                ok: entry.ok,
            },
        })
        .catch((err) => console.error("ai-log: couldn't record call", err));
}
