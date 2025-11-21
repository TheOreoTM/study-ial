import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// For server-side operations
let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
    if (!db) {
        if (!connectionString) {
            throw new Error("DATABASE_URL environment variable is not set");
        }
        const client = postgres(connectionString);
        db = drizzle(client, { schema });
    }
    return db as ReturnType<typeof drizzle<typeof schema>>;
}

// For use in server components and API routes
export const dbClient = getDb();

export type Database = typeof dbClient;
