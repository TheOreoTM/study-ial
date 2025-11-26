const pdf = require("pdf-parse");
import { generateEmbedding } from "./client";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client/client";

export async function ingestPdf(fileBuffer: Buffer, fileName: string, userId: string) {
    // 1. Extract Text
    const data = await pdf(fileBuffer);
    const text = data.text;
    const pageCount = data.numpages;

    // 2. Create Resource Record
    const resource = await prisma.resource.create({
        data: {
            userId,
            fileName,
            fileSize: fileBuffer.length,
            pageCount,
        },
    });

    // 3. Chunk Text
    const chunks = chunkText(text, 1000, 200);

    // 4. Embed & Store Chunks
    // We process in batches to avoid hitting API rate limits
    const BATCH_SIZE = 10;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);

        await Promise.all(
            batch.map(async (chunk) => {
                const embedding = await generateEmbedding(chunk);
                if (embedding.length > 0) {
                    // Use executeRaw to insert vector data
                    const chunkIndex = i + batch.indexOf(chunk);
                    const metadata = { chunkIndex };

                    await prisma.$executeRaw`
                        INSERT INTO "resource_chunks" ("resource_id", "content", "embedding", "metadata")
                        VALUES (${resource.id}, ${chunk}, ${JSON.stringify(embedding)}::vector, ${JSON.stringify(
                        metadata
                    )}::jsonb)
                    `;
                }
            })
        );
    }

    return resource;
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        let chunk = text.slice(start, end);

        // Try to break at a sentence or paragraph if possible (simple heuristic)
        // If we are not at the end, look for the last period or newline in the last 100 chars
        if (end < text.length) {
            const lastPeriod = chunk.lastIndexOf(".", end);
            const lastNewline = chunk.lastIndexOf("\n", end);
            const breakPoint = Math.max(lastPeriod, lastNewline);

            if (breakPoint > chunkSize * 0.8) {
                // Only if it's near the end
                chunk = text.slice(start, start + breakPoint + 1);
                start += breakPoint + 1 - overlap; // Move start back by overlap
            } else {
                start += chunkSize - overlap;
            }
        } else {
            start += chunkSize; // End of text
        }

        // Clean up whitespace
        chunk = chunk.replace(/\s+/g, " ").trim();

        if (chunk.length > 50) {
            // Ignore very small chunks
            chunks.push(chunk);
        }
    }

    return chunks;
}
