/**
 * Database seed script
 * Run with: npx ts-node lib/db/seed.ts
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "@/generated/prisma/client/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
    try {
        console.log("🌱 Starting database seed...");

        // Seed subjects
        console.log("📚 Seeding subjects...");
        const subjectData = [
            {
                code: "chem",
                name: "Chemistry",
                description: "Organic, Inorganic, and Physical Chemistry (Units 1-6)",
            },
            {
                code: "bio",
                name: "Biology",
                description: "Molecular Biology, Genetics, and Ecology (Units 1-6)",
            },
            {
                code: "phys",
                name: "Physics",
                description: "Mechanics, Waves, Electricity, and more (Units 1-6)",
            },
            {
                code: "math",
                name: "Mathematics",
                description: "Pure Math, Statistics, and Mechanics (P1-P4, S1, M1)",
            },
        ];

        for (const s of subjectData) {
            await prisma.subject.upsert({
                where: { code: s.code },
                update: {},
                create: s,
            });
        }

        const allSubjects = await prisma.subject.findMany();
        console.log(`✅ Inserted/Verified ${allSubjects.length} subjects`);

        if (allSubjects.length === 0) {
            console.error("❌ No subjects found after insertion");
            return;
        }

        // Seed Chemistry units and topics
        const chemSubject = allSubjects.find((s) => s.code === "chem");
        if (chemSubject) {
            console.log("📖 Seeding Chemistry units and topics...");

            const chemUnits = [
                { code: "Unit 1", name: "Atomic Structure and Bonding" },
                { code: "Unit 2", name: "States of Matter" },
                { code: "Unit 3", name: "Inorganic Chemistry" },
                { code: "Unit 4", name: "Organic Chemistry" },
                { code: "Unit 5", name: "Energetics and Equilibrium" },
                { code: "Unit 6", name: "Reaction Kinetics" },
            ];

            for (const unitData of chemUnits) {
                // Upsert unit based on code and subjectId (assuming unique constraint or logic)
                // Since there isn't a unique constraint on (subjectId, code) in the schema explicitly shown in previous turns (or maybe there is),
                // we'll use findFirst to check existence or just create if not exists.
                // Better to rely on a unique identifier if possible.
                // Let's assume we want to avoid duplicates.

                let unit = await prisma.unit.findFirst({
                    where: {
                        subjectId: chemSubject.id,
                        code: unitData.code,
                    },
                });

                if (!unit) {
                    unit = await prisma.unit.create({
                        data: {
                            ...unitData,
                            subjectId: chemSubject.id,
                        },
                    });
                }

                if (unit) {
                    // Add topics for each unit
                    const topicsData = [
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-1`,
                            name: "Topic 1",
                            subjectId: chemSubject.id,
                            unitId: unit.id,
                        },
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-2`,
                            name: "Topic 2",
                            subjectId: chemSubject.id,
                            unitId: unit.id,
                        },
                    ];

                    for (const topic of topicsData) {
                        await prisma.topic.upsert({
                            where: { slug: topic.slug },
                            update: {},
                            create: topic,
                        });
                    }
                }
            }

            console.log("✅ Chemistry units and topics seeded");
        }

        // Seed Biology units and topics
        const bioSubject = allSubjects.find((s) => s.code === "bio");
        if (bioSubject) {
            console.log("📖 Seeding Biology units and topics...");

            const bioUnits = [
                { code: "Unit 1", name: "Cell Biology" },
                { code: "Unit 2", name: "Organism Level Systems" },
                { code: "Unit 3", name: "Genetics and Evolution" },
                { code: "Unit 4", name: "Ecology" },
                { code: "Unit 5", name: "Plant Science" },
                { code: "Unit 6", name: "Human Health" },
            ];

            for (const unitData of bioUnits) {
                let unit = await prisma.unit.findFirst({
                    where: {
                        subjectId: bioSubject.id,
                        code: unitData.code,
                    },
                });

                if (!unit) {
                    unit = await prisma.unit.create({
                        data: {
                            ...unitData,
                            subjectId: bioSubject.id,
                        },
                    });
                }

                if (unit) {
                    const topicsData = [
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-1`,
                            name: "Topic 1",
                            subjectId: bioSubject.id,
                            unitId: unit.id,
                        },
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-2`,
                            name: "Topic 2",
                            subjectId: bioSubject.id,
                            unitId: unit.id,
                        },
                    ];

                    for (const topic of topicsData) {
                        await prisma.topic.upsert({
                            where: { slug: topic.slug },
                            update: {},
                            create: topic,
                        });
                    }
                }
            }

            console.log("✅ Biology units and topics seeded");
        }

        // Seed Physics units and topics
        const physSubject = allSubjects.find((s) => s.code === "phys");
        if (physSubject) {
            console.log("📖 Seeding Physics units and topics...");

            const physUnits = [
                { code: "Unit 1", name: "Mechanics" },
                { code: "Unit 2", name: "Waves" },
                { code: "Unit 3", name: "Electricity and Magnetism" },
                { code: "Unit 4", name: "Thermodynamics" },
                { code: "Unit 5", name: "Modern Physics" },
                { code: "Unit 6", name: "Astrophysics" },
            ];

            for (const unitData of physUnits) {
                let unit = await prisma.unit.findFirst({
                    where: {
                        subjectId: physSubject.id,
                        code: unitData.code,
                    },
                });

                if (!unit) {
                    unit = await prisma.unit.create({
                        data: {
                            ...unitData,
                            subjectId: physSubject.id,
                        },
                    });
                }

                if (unit) {
                    const topicsData = [
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-1`,
                            name: "Topic 1",
                            subjectId: physSubject.id,
                            unitId: unit.id,
                        },
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-2`,
                            name: "Topic 2",
                            subjectId: physSubject.id,
                            unitId: unit.id,
                        },
                    ];

                    for (const topic of topicsData) {
                        await prisma.topic.upsert({
                            where: { slug: topic.slug },
                            update: {},
                            create: topic,
                        });
                    }
                }
            }

            console.log("✅ Physics units and topics seeded");
        }

        // Seed Mathematics units and topics
        const mathSubject = allSubjects.find((s) => s.code === "math");
        if (mathSubject) {
            console.log("📖 Seeding Mathematics units and topics...");

            const mathUnits = [
                { code: "P1", name: "Pure Mathematics 1" },
                { code: "P2", name: "Pure Mathematics 2" },
                { code: "P3", name: "Pure Mathematics 3" },
                { code: "P4", name: "Pure Mathematics 4" },
                { code: "S1", name: "Statistics 1" },
                { code: "M1", name: "Mechanics 1" },
            ];

            for (const unitData of mathUnits) {
                let unit = await prisma.unit.findFirst({
                    where: {
                        subjectId: mathSubject.id,
                        code: unitData.code,
                    },
                });

                if (!unit) {
                    unit = await prisma.unit.create({
                        data: {
                            ...unitData,
                            subjectId: mathSubject.id,
                        },
                    });
                }

                if (unit) {
                    const topicsData = [
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-1`,
                            name: "Topic 1",
                            subjectId: mathSubject.id,
                            unitId: unit.id,
                        },
                        {
                            slug: `${unitData.code.toLowerCase()}-topic-2`,
                            name: "Topic 2",
                            subjectId: mathSubject.id,
                            unitId: unit.id,
                        },
                    ];

                    for (const topic of topicsData) {
                        await prisma.topic.upsert({
                            where: { slug: topic.slug },
                            update: {},
                            create: topic,
                        });
                    }
                }
            }

            console.log("✅ Mathematics units and topics seeded");
        }

        console.log("✨ Database seed completed successfully!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed().then(() => process.exit(0));
