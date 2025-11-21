import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.warn("Missing OPENROUTER_API_KEY environment variable");
}

export const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey || "",
});

// Model IDs on OpenRouter
export const MODELS = {
    flashLite: "google/gemini-2.0-flash-lite-001",
    flashThinking: "google/gemini-2.0-flash-001",
    embedding: "openai/text-embedding-3-small",
};

export async function generateEmbedding(text: string) {
    try {
        const response = await openai.embeddings.create({
            model: MODELS.embedding,
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Embedding error:", error);
        return [];
    }
}
