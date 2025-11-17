/**
 * Database seed script
 * Run with: npx ts-node lib/db/seed.ts
 */

import { dbClient } from "./client";
import { subjects, units, topics } from "./schema";

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

    const insertedSubjects = await dbClient
      .insert(subjects)
      .values(subjectData)
      .onConflictDoNothing()
      .returning();

    console.log(`✅ Inserted ${insertedSubjects.length} subjects`);

    // Get subjects for unit/topic creation
    const allSubjects = await dbClient.select().from(subjects);

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
        const [unit] = await dbClient
          .insert(units)
          .values({
            ...unitData,
            subjectId: chemSubject.id,
          })
          .onConflictDoNothing()
          .returning();

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

          await dbClient
            .insert(topics)
            .values(topicsData)
            .onConflictDoNothing();
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
        const [unit] = await dbClient
          .insert(units)
          .values({
            ...unitData,
            subjectId: bioSubject.id,
          })
          .onConflictDoNothing()
          .returning();

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

          await dbClient
            .insert(topics)
            .values(topicsData)
            .onConflictDoNothing();
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
        const [unit] = await dbClient
          .insert(units)
          .values({
            ...unitData,
            subjectId: physSubject.id,
          })
          .onConflictDoNothing()
          .returning();

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

          await dbClient
            .insert(topics)
            .values(topicsData)
            .onConflictDoNothing();
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
        const [unit] = await dbClient
          .insert(units)
          .values({
            ...unitData,
            subjectId: mathSubject.id,
          })
          .onConflictDoNothing()
          .returning();

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

          await dbClient
            .insert(topics)
            .values(topicsData)
            .onConflictDoNothing();
        }
      }

      console.log("✅ Mathematics units and topics seeded");
    }

    console.log("✨ Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed().then(() => process.exit(0));
