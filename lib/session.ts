import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/** The signed-in user (fresh from the DB), or null. Cached per request. */
export const getUser = cache(async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    return db.user.findUnique({ where: { id: session.user.id } });
});

/** For pages: redirects to sign-in when signed out, and to onboarding until it's done. */
export async function requireUser({ allowUnonboarded = false } = {}) {
    const user = await getUser();
    if (!user) redirect("/sign-in");
    if (!allowUnonboarded && !user.onboardedAt) redirect("/onboarding");
    return user;
}

export async function requireAdmin() {
    const user = await requireUser();
    if (user.role !== "ADMIN") redirect("/dashboard");
    return user;
}

/** For server actions / route handlers: throws instead of redirecting. */
export async function assertUser() {
    const user = await getUser();
    if (!user) throw new Error("Not signed in");
    return user;
}

export async function assertAdmin() {
    const user = await assertUser();
    if (user.role !== "ADMIN") throw new Error("Admins only");
    return user;
}
