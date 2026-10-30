import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "tsx prisma/seed.ts",
    },
    datasource: {
        // Optional so `prisma generate` (postinstall) works without a database configured.
        url: process.env.DATABASE_URL ?? "",
        shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL || undefined,
    },
});
