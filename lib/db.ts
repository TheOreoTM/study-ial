import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
    // Cap concurrent connections per instance: serverless instances should stay small, and the local
    // Prisma dev server rejects bursts of parallel connections. Extra queries queue instead.
    const max = Number.parseInt(process.env.DATABASE_POOL_MAX ?? "", 10) || 5;
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max });
    return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
