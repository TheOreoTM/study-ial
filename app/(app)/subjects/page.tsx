import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getSubjects } from "@/lib/queries/curriculum";
import { getUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { subjectAccent } from "./_components/accent";

export const metadata: Metadata = {
    title: "IAL subjects",
    description:
        "Browse Pearson Edexcel International A Level subjects unit by unit and topic by topic, with practice questions and mark schemes for every topic.",
    alternates: { canonical: "/subjects" },
};

type Subjects = Awaited<ReturnType<typeof getSubjects>>;

export default async function SubjectsPage() {
    const [subjects, user] = await Promise.all([getSubjects(), getUser()]);
    const myUnits = user
        ? new Set(
              (await db.userUnit.findMany({ where: { userId: user.id }, select: { unitId: true } })).map(
                  (u) => u.unitId,
              ),
          )
        : new Set<string>();

    const pearson = subjects.filter((s) => !s.isLocal);
    const local = subjects.filter((s) => s.isLocal);

    return (
        <>
            <PageHeader
                title="Subjects"
                description="Pick a subject, then a unit, then a topic. Every topic has practice questions marked against an exam-style mark scheme."
            />
            {subjects.length === 0 ? (
                <EmptyState icon={BookOpen} title="No subjects yet" description="The curriculum is on its way." />
            ) : (
                <div className="space-y-10">
                    <SubjectGrid subjects={pearson} myUnits={myUnits} />
                    {local.length > 0 && (
                        <section aria-labelledby="local-subjects">
                            <h2 id="local-subjects" className="text-lg font-semibold tracking-tight">
                                Local subjects
                            </h2>
                            <p className="mt-1 mb-4 text-sm text-muted-foreground">
                                Maldivian national subjects taken alongside the IAL.
                            </p>
                            <SubjectGrid subjects={local} myUnits={myUnits} />
                        </section>
                    )}
                </div>
            )}
        </>
    );
}

function SubjectGrid({ subjects, myUnits }: { subjects: Subjects; myUnits: Set<string> }) {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((s) => {
                const topicCount = s.units.reduce((n, u) => n + u._count.topics, 0);
                const studying = s.units.some((u) => myUnits.has(u.id));
                return (
                    <li key={s.id} className="flex">
                        <article className="group relative flex w-full flex-col rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-foreground/20">
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        "grid size-10 shrink-0 place-items-center rounded-lg text-sm font-semibold",
                                        subjectAccent(s.color),
                                    )}
                                    aria-hidden
                                >
                                    {s.name.slice(0, 2)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-semibold leading-tight">
                                        <Link href={`/subjects/${s.slug}`} className="after:absolute after:inset-0">
                                            {s.name}
                                        </Link>
                                    </h2>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {s.units.length} unit{s.units.length === 1 ? "" : "s"} · {topicCount} topic
                                        {topicCount === 1 ? "" : "s"}
                                    </p>
                                </div>
                                {studying && <Badge variant="secondary">Studying</Badge>}
                            </div>
                            {s.description && <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>}
                            {s.units.length > 0 && (
                                <ul className="mt-4 space-y-1.5 border-t pt-3 text-sm">
                                    {s.units.map((u) => (
                                        <li key={u.id} className="flex items-baseline gap-2">
                                            <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">
                                                {u.code}
                                            </span>
                                            <span
                                                className={cn(
                                                    "min-w-0 flex-1 truncate",
                                                    u._count.topics === 0 && "text-muted-foreground",
                                                )}
                                            >
                                                {u.name}
                                            </span>
                                            {u._count.topics === 0 && (
                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    Coming soon
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </article>
                    </li>
                );
            })}
        </ul>
    );
}
