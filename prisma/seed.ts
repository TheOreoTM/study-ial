import "dotenv/config";
import { hashPassword } from "better-auth/crypto";
import { db } from "../lib/db";
import { questions, subjects } from "./seed-data";

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

async function seedQuestions() {
    const topics = await db.topic.findMany({ select: { id: true, slug: true, unitId: true, unit: { select: { code: true } } } });
    const topicKey = new Map(topics.map((t) => [`${t.unit.code}/${t.slug}`, t]));

    for (const q of questions) {
        const topic = topicKey.get(`${q.unitCode}/${q.topicSlug}`);
        if (!topic) throw new Error(`Question ${q.seedKey}: unknown topic ${q.unitCode}/${q.topicSlug}`);
        if (q.type === "MCQ" && (q.options?.filter((o) => o.isCorrect).length ?? 0) !== 1)
            throw new Error(`Question ${q.seedKey}: MCQ needs exactly one correct option`);

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
            status: "PUBLISHED" as const,
        };
        const saved = await db.question.upsert({ where: { seedKey: q.seedKey }, create: { ...data, seedKey: q.seedKey }, update: data });

        if (q.options) {
            for (const o of q.options) {
                await db.questionOption.upsert({
                    where: { questionId_label: { questionId: saved.id, label: o.label } },
                    create: { questionId: saved.id, ...o },
                    update: { text: o.text, isCorrect: o.isCorrect },
                });
            }
        }
    }
    console.log(`✓ ${questions.length} questions`);
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
    await seedDemoUser();
}

main()
    .then(() => db.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
