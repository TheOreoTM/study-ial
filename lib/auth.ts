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

    return dbUser;
}
