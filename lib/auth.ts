import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const auth = betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        // Verification is only enforced once real email delivery is configured.
        requireEmailVerification: Boolean(process.env.RESEND_API_KEY),
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your Study-IAL password",
                text: `Hi ${user.name},\n\nReset your password here: ${url}\n\nIf you didn't ask for this, ignore this email.`,
            });
        },
    },
    emailVerification: {
        sendOnSignUp: Boolean(process.env.RESEND_API_KEY),
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Verify your Study-IAL email",
                text: `Hi ${user.name},\n\nConfirm your email to start studying: ${url}`,
            });
        },
    },
    socialProviders: googleEnabled
        ? {
              google: {
                  clientId: process.env.GOOGLE_CLIENT_ID!,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
              },
          }
        : undefined,
    user: {
        additionalFields: {
            role: { type: "string", input: false, defaultValue: "STUDENT" },
            onboardedAt: { type: "date", input: false, required: false },
        },
        deleteUser: { enabled: true },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => ({
                    data: { ...user, role: adminEmails.includes(user.email.toLowerCase()) ? "ADMIN" : "STUDENT" },
                }),
            },
        },
    },
    plugins: [nextCookies()],
});

export const authConfig = { googleEnabled };
