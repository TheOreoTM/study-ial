import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const user = await stackServerApp.getUser();

    if (!user) {
        return null;
    }

    const dbUser = await prisma.user.upsert({
        where: {
            userId: user.id,
        },
        update: {
            email: user.primaryEmail,
        },
        create: {
            userId: user.id,
            email: user.primaryEmail,
        },
        include: {
            apiKeys: true,
        },
    });

    if (dbUser.apiKeys.length === 0) {
        const newKey = `sk_student_${crypto.randomUUID().replace(/-/g, "")}`;
        await prisma.apiKey.create({
            data: {
                key: newKey,
                userId: dbUser.id,
            },
        });

        // Return the user with the new key (simulated push since we just created it)
        // Or re-fetch. Re-fetching is safer.
        return await prisma.user.findUnique({
            where: { id: dbUser.id },
            include: { apiKeys: true },
        });
    }

    return dbUser;
}
