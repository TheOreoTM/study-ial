import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
    try {
        const plans = await prisma.studyPlan.findMany();
        console.log(`Found ${plans.length} study plans.`);

        const now = new Date();
        console.log(`Current server time: ${now.toISOString()}`);

        plans.forEach((plan) => {
            console.log(`Plan ID: ${plan.id}`);
            console.log(`  User ID: ${plan.userId}`);
            console.log(`  Name: ${plan.name}`);
            console.log(`  Start Date: ${plan.startDate.toISOString()}`);
            console.log(`  End Date: ${plan.endDate.toISOString()}`);

            const isActive = plan.startDate <= now && plan.endDate >= now;
            console.log(`  Is Active? ${isActive}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
