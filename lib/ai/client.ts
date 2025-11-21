import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Models
export const flashLiteModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite-preview-02-05", // Using the preview version as per research
});

export const flashThinkingModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite-preview-02-05", // Using the preview version as per research
});

export const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
});

export async function generateEmbedding(text: string) {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}
