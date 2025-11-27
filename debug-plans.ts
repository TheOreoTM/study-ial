import "dotenv/config";
import { prisma } from "./lib/prisma";

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
            console.log(`  Settings: ${JSON.stringify(plan.settings)}`);

            const isActive = plan.startDate <= now && plan.endDate >= now;
            console.log(`  Is Active? ${isActive}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        // Don't disconnect the shared instance, just exit
        process.exit(0);
    }
}

main();
