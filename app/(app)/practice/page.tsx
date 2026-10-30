import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PracticeSession } from "@/components/practice/practice-session";
import { Button } from "@/components/ui/button";
import { aiEnabled, remainingAiQuota } from "@/lib/ai";
import { requireUser } from "@/lib/session";
import { parseCount } from "./select";
import { buildSession, parseMode } from "./session";

export const metadata: Metadata = { title: "Practice", robots: { index: false } };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PracticePage({ searchParams }: { searchParams: SearchParams }) {
    const user = await requireUser();
    const sp = await searchParams;
    const mode = parseMode(sp);

    if (!mode) {
        return (
            <EmptyState
                icon={BookOpen}
                title="Pick something to practise"
                description="Choose a topic or unit from your subjects, or let us pick your weakest topics."
                action={
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button asChild>
                            <Link href="/practice?mode=weak">Practise weak topics</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/subjects">Browse subjects</Link>
                        </Button>
                    </div>
                }
            />
        );
    }

    const count = parseCount(sp.count);
    const [session, remaining] = await Promise.all([
        buildSession(user.id, mode, count),
        aiEnabled ? remainingAiQuota(user.id, "marking") : Promise.resolve(0),
    ]);

    if (!session) {
        return (
            <EmptyState
                icon={SearchX}
                title="We couldn't find that topic"
                description="It may have been moved or removed."
                action={
                    <Button asChild variant="outline">
                        <Link href="/subjects">Browse subjects</Link>
                    </Button>
                }
            />
        );
    }

    if (session.questions.length === 0) {
        const weakWithoutUnits = mode.kind === "weak" && !mode.unitId;
        return (
            <EmptyState
                icon={BookOpen}
                title={weakWithoutUnits ? "No questions for your units yet" : "No questions here yet"}
                description={
                    weakWithoutUnits
                        ? "Add the units you're studying in Settings, or browse subjects to practise any topic."
                        : "We're still writing questions for this part of the course. Try another topic in the meantime."
                }
                action={
                    <Button asChild variant="outline">
                        <Link href={session.back.href}>{session.back.label}</Link>
                    </Button>
                }
            />
        );
    }

    // `s` is a nonce set by "Practise again" so a fresh session remounts the client state;
    // re-renders of this page for any other reason keep the in-progress session.
    const nonce = typeof sp.s === "string" ? sp.s : "";
    const again = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (k !== "s" && typeof v === "string") again.set(k, v);

    return (
        <PracticeSession
            key={nonce}
            title={session.title}
            description={session.description}
            questions={session.questions}
            topics={session.topics}
            back={session.back}
            againQuery={again.toString()}
            ai={{ enabled: aiEnabled, remaining }}
        />
    );
}
