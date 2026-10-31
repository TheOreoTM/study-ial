import "dotenv/config";
import { hashPassword } from "better-auth/crypto";
import { db } from "../lib/db";
import { flashcards, questions, subjects } from "./seed-data";

async function seedCurriculum() {
    for (const [si, s] of subjects.entries()) {
        const subject = await db.subject.upsert({
            where: { slug: s.slug },
            create: { slug: s.slug, code: s.code, name: s.name, description: s.description, color: s.color, isLocal: s.isLocal ?? false, order: si },
            update: { code: s.code, name: s.name, description: s.description, color: s.color, isLocal: s.isLocal ?? false, order: si },
        });
        for (const [ui, u] of s.units.entries()) {
            const unit = await db.unit.upsert({
                where: { code: u.code },
                create: { code: u.code, number: u.number, name: u.name, description: u.description, order: ui, subjectId: subject.id },
                update: { number: u.number, name: u.name, description: u.description, order: ui, subjectId: subject.id },
            });
            for (const [ti, t] of u.topics.entries()) {
                const data = { code: t.code, name: t.name, summary: t.summary, specPoints: t.specPoints ?? [], order: ti };
                await db.topic.upsert({
                    where: { unitId_slug: { unitId: unit.id, slug: t.slug } },
                    create: { ...data, slug: t.slug, unitId: unit.id },
                    update: data,
                });
            }
        }
    }
    console.log(`✓ ${subjects.length} subjects`);
}

// Seeded draft content belongs to the admins once it's in the DB: the seed creates it but never overwrites it, so
// their edits (published or not) survive re-seeding. `SEED_REFRESH_DRAFTS=1 pnpm db:seed` deliberately rewrites
// seeded content that is still a draft, e.g. after fixing a mistake in prisma/seed-data.
const refreshDrafts = process.env.SEED_REFRESH_DRAFTS === "1";

async function tombstones() {
    const rows = await db.seedTombstone.findMany({ select: { seedKey: true } });
    return new Set(rows.map((r) => r.seedKey));
}

async function seedQuestions() {
    const topics = await db.topic.findMany({ select: { id: true, slug: true, unitId: true, unit: { select: { code: true } } } });
    const topicKey = new Map(topics.map((t) => [`${t.unit.code}/${t.slug}`, t]));
    const deleted = await tombstones();
    let created = 0;
    let kept = 0;

    for (const q of questions) {
        const topic = topicKey.get(`${q.unitCode}/${q.topicSlug}`);
        if (!topic) throw new Error(`Question ${q.seedKey}: unknown topic ${q.unitCode}/${q.topicSlug}`);
        if (q.type === "MCQ" && (q.options?.filter((o) => o.isCorrect).length ?? 0) !== 1)
            throw new Error(`Question ${q.seedKey}: MCQ needs exactly one correct option`);
        if (deleted.has(q.seedKey)) continue;

        const data = {
            unitId: topic.unitId,
            topicId: topic.id,
            type: q.type,
            difficulty: q.difficulty,
            marks: q.marks,
            stem: q.stem,
            markScheme: q.markScheme,
            explanation: q.explanation,
            source: "ORIGINAL" as const,
        };
        const options = q.type === "MCQ" ? (q.options ?? []) : [];
        const existing = await db.question.findUnique({ where: { seedKey: q.seedKey }, select: { id: true, status: true } });

        if ((q.status ?? "PUBLISHED") === "DRAFT") {
            if (existing && !(refreshDrafts && existing.status === "DRAFT")) {
                kept++;
                continue;
            }
            if (!existing) created++;
        }

        await db.$transaction(async (tx) => {
            // New rows take the seed's status; existing rows keep whatever an admin set (Physics is never re-published).
            const saved = existing
                ? await tx.question.update({ where: { id: existing.id }, data })
                : await tx.question.create({ data: { ...data, status: q.status ?? "PUBLISHED", seedKey: q.seedKey } });
            await tx.questionOption.deleteMany({
                where: { questionId: saved.id, label: { notIn: options.map((o) => o.label) } },
            });
            for (const o of options) {
                await tx.questionOption.upsert({
                    where: { questionId_label: { questionId: saved.id, label: o.label } },
                    create: { questionId: saved.id, ...o },
                    update: { text: o.text, isCorrect: o.isCorrect },
                });
            }
        });
    }
    console.log(`✓ ${questions.length} questions (${created} new drafts, ${kept} drafts already in the DB left as they are)`);
}

/** Shared flashcards are content like questions: created as DRAFT for an admin to publish, then never overwritten. */
async function seedFlashcards() {
    const topics = await db.topic.findMany({ select: { id: true, slug: true, unit: { select: { code: true } } } });
    const topicKey = new Map(topics.map((t) => [`${t.unit.code}/${t.slug}`, t.id]));
    const deleted = await tombstones();
    let created = 0;
    for (const c of flashcards) {
        const topicId = topicKey.get(`${c.unitCode}/${c.topicSlug}`);
        if (!topicId) throw new Error(`Flashcard ${c.seedKey}: unknown topic ${c.unitCode}/${c.topicSlug}`);
        if (deleted.has(c.seedKey)) continue;
        const existing = await db.flashcard.findUnique({ where: { seedKey: c.seedKey }, select: { id: true, status: true } });
        const data = { topicId, front: c.front, back: c.back };
        if (!existing) {
            await db.flashcard.create({ data: { ...data, seedKey: c.seedKey, status: "DRAFT" } });
            created++;
        } else if (refreshDrafts && existing.status === "DRAFT") {
            await db.flashcard.update({ where: { id: existing.id }, data });
        }
    }
    console.log(`✓ ${flashcards.length} flashcards (${created} new drafts)`);
}

/** A ready-to-use local account. Never runs in production. */
async function seedDemoUser() {
    if (process.env.NODE_ENV === "production") return;
    const email = "demo@study-ial.test";
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return;

    const physicsUnits = await db.unit.findMany({ where: { subject: { slug: "physics" } }, orderBy: { order: "asc" } });
    const examDate = new Date(Date.UTC(new Date().getUTCFullYear() + 1, 0, 15));
    await db.user.create({
        data: {
            id: "demo-user",
            name: "Demo Student",
            email,
            emailVerified: true,
            role: "ADMIN",
            onboardedAt: new Date(),
            accounts: {
                create: { id: "demo-account", accountId: "demo-user", providerId: "credential", password: await hashPassword("demo-password") },
            },
            units: { create: physicsUnits.slice(0, 2).map((u) => ({ unitId: u.id, examDate })) },
        },
    });
    console.log(`✓ demo user ${email} / demo-password`);
}

async function main() {
    await seedCurriculum();
    await seedQuestions();
    await seedFlashcards();
    await seedDemoUser();
}

main()
    .then(() => db.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
