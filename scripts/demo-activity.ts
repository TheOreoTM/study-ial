// Gives the seeded demo user a few weeks of realistic history (practice attempts and focus sessions), so the
// dashboard, progress, analytics and mistake pages can be checked with data on them. Local development only.
//
//   pnpm demo:activity            # adds history if the demo user has none yet
//   pnpm demo:activity --reset    # deletes the demo user's attempts and focus sessions first
//
// Deterministic (seeded random), so two runs from a reset give the same picture.
import "dotenv/config";
import { db } from "../lib/db";

const DEMO_EMAIL = "demo@study-ial.test";
const DAYS = 24;
const DAY = 86_400_000;

function rng(seed: number) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 2 ** 32;
    };
}

async function main() {
    if (process.env.NODE_ENV === "production") throw new Error("demo-activity never runs in production.");
    const url = process.env.DATABASE_URL ?? "";
    if (!/@(localhost|127\.0\.0\.1)[:/]/.test(url)) throw new Error("demo-activity only runs against a local database.");

    const user = await db.user.findUnique({ where: { email: DEMO_EMAIL }, include: { units: true } });
    if (!user) throw new Error("Run `pnpm db:seed` first: there is no demo user.");

    if (process.argv.includes("--reset")) {
        await db.attempt.deleteMany({ where: { userId: user.id } });
        await db.focusSession.deleteMany({ where: { userId: user.id } });
        await db.userMilestone.deleteMany({ where: { userId: user.id } });
        console.log("✓ cleared the demo user's attempts, focus sessions and milestones");
    } else if (await db.attempt.count({ where: { userId: user.id } })) {
        console.log("The demo user already has attempts. Pass --reset to start over.");
        return;
    }

    const unitIds = user.units.map((u) => u.unitId);
    const questions = await db.question.findMany({
        where: { unitId: { in: unitIds }, status: "PUBLISHED" },
        include: { options: true, topic: { select: { id: true, order: true } } },
        orderBy: [{ topic: { order: "asc" } }, { id: "asc" }],
    });
    if (questions.length === 0) throw new Error("No published questions in the demo user's units.");

    // Each topic gets a "skill" so mastery spreads across weak, developing and strong.
    const rand = rng(42);
    const skill = new Map<string, number>();
    for (const q of questions) if (!skill.has(q.topicId)) skill.set(q.topicId, 0.25 + rand() * 0.7);

    const now = Date.now();
    let attempts = 0;
    let sessions = 0;
    for (let d = DAYS; d >= 0; d--) {
        // Study on most days, never on every one.
        if (d > 0 && rand() < 0.3) continue;
        const dayStart = now - d * DAY;
        // An evening session in Maldives time (UTC+5): 19:00–21:00 local is 14:00–16:00Z.
        const start = new Date(Math.min(now - 60_000, Math.floor(dayStart / DAY) * DAY + (14 + rand() * 2) * 3_600_000));
        const sessionQs = [...questions].sort(() => rand() - 0.5).slice(0, 4 + Math.floor(rand() * 6));
        let t = start.getTime();
        for (const q of sessionQs) {
            // Students improve a little over the weeks.
            const p = Math.min(0.95, skill.get(q.topicId)! + (DAYS - d) * 0.006);
            t += (1 + rand() * 3) * 60_000;
            const createdAt = new Date(Math.min(t, now - 1000));
            if (q.type === "MCQ") {
                const correct = rand() < p;
                const option = q.options.find((o) => o.isCorrect === correct) ?? q.options[0];
                await db.attempt.create({
                    data: {
                        userId: user.id,
                        questionId: q.id,
                        selectedOptionId: option.id,
                        marksAwarded: correct ? q.marks : 0,
                        maxMarks: q.marks,
                        method: "AUTO",
                        createdAt,
                    },
                });
            } else {
                const marks = Math.max(0, Math.min(q.marks, Math.round(q.marks * (p + (rand() - 0.5) * 0.4))));
                await db.attempt.create({
                    data: {
                        userId: user.id,
                        questionId: q.id,
                        answer: "(demo answer)",
                        marksAwarded: marks,
                        maxMarks: q.marks,
                        method: "SELF",
                        createdAt,
                    },
                });
            }
            attempts++;
        }
        if (rand() < 0.7) {
            const minutes = [25, 25, 50, 15][Math.floor(rand() * 4)];
            await db.focusSession.create({
                data: {
                    userId: user.id,
                    topicId: sessionQs[0].topicId,
                    minutes,
                    startedAt: start,
                    endedAt: new Date(Math.min(start.getTime() + minutes * 60_000, now - 1000)),
                },
            });
            sessions++;
        }
    }
    console.log(`✓ ${attempts} attempts and ${sessions} focus sessions over the last ${DAYS} days`);
}

main()
    .catch((e) => {
        console.error(e instanceof Error ? e.message : e);
        process.exitCode = 1;
    })
    .finally(() => db.$disconnect());
