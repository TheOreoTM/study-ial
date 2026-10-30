import { Resend } from "resend";

type Email = { to: string; subject: string; text: string };

/** Sends via Resend when configured, otherwise logs to the server console (dev). */
export async function sendEmail({ to, subject, text }: Email) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
        console.info(`\n[email] to=${to}\n[email] subject=${subject}\n${text}\n`);
        return;
    }
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Study-IAL <onboarding@resend.dev>",
        to,
        subject,
        text,
    });
    if (error) throw new Error(`Failed to send email: ${error.message}`);
}
