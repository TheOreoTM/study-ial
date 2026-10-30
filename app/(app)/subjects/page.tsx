import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { getSubjects } from "@/lib/queries/curriculum";
import { getUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { UnitChip } from "./_components/chips";

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
                            <h2 id="local-subjects" className="text-xl">
                                Local subjects
                            </h2>
                            <p className="mt-1 mb-4 text-muted-foreground">
                                Maldivian national subjects taken alongside the IAL.
                            </p>
                            <SubjectGrid subjects={local} myUnits={myUnits} local />
                        </section>
                    )}
                </div>
            )}
        </>
    );
}

function SubjectGrid({
    subjects,
    myUnits,
    local = false,
}: {
    subjects: Subjects;
    myUnits: Set<string>;
    local?: boolean;
}) {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((s) => {
                const topicCount = s.units.reduce((n, u) => n + u._count.topics, 0);
                const studying = s.units.some((u) => myUnits.has(u.id));
                return (
                    <li key={s.id} className="flex">
                        <article className="group relative flex w-full flex-col rounded-xl border bg-card p-5 shadow-card transition-[box-shadow,border-color,translate] duration-200 ease-out-soft has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring hover:-translate-y-px hover:border-border-strong/50 hover:shadow-raised sm:p-6">
                            <div className="flex items-start gap-3.5">
                                <div
                                    className={cn(
                                        "grid size-12 shrink-0 place-items-center rounded-[14px] pt-0.5 font-display text-xl leading-none font-extrabold",
                                        local ? "bg-muted text-foreground" : "bg-foreground text-background",
                                    )}
                                    aria-hidden
                                >
                                    {s.name.slice(0, 2)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-xl leading-tight">
                                        <Link
                                            href={`/subjects/${s.slug}`}
                                            className="outline-none after:absolute after:inset-0 after:rounded-xl"
                                        >
                                            {s.name}
                                        </Link>
                                    </h2>
                                    <p className="mt-0.5 text-sm text-muted-foreground">
                                        <span className="num text-foreground">{s.units.length}</span> unit
                                        {s.units.length === 1 ? "" : "s"} ·{" "}
                                        <span className="num text-foreground">{topicCount}</span> topic
                                        {topicCount === 1 ? "" : "s"}
                                    </p>
                                </div>
                                {studying && (
                                    <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-selected px-3 text-[0.8125rem] font-bold text-selected-foreground">
                                        Studying
                                    </span>
                                )}
                            </div>
                            {s.description && (
                                <p className="mt-3 text-[0.9375rem] text-muted-foreground">{s.description}</p>
                            )}
                            {s.units.length > 0 && (
                                <ul className="mt-4 space-y-2 border-t pt-4 text-[0.9375rem]">
                                    {s.units.map((u) => (
                                        <li key={u.id} className="flex items-center gap-2.5">
                                            <UnitChip
                                                size="sm"
                                                muted={u._count.topics === 0}
                                                className="w-[4.25rem] justify-center"
                                            >
                                                {u.code}
                                            </UnitChip>
                                            <span
                                                className={cn(
                                                    "min-w-0 flex-1 truncate font-semibold",
                                                    u._count.topics === 0 && "font-medium text-muted-foreground",
                                                )}
                                            >
                                                {u.name}
                                            </span>
                                            {u._count.topics === 0 && (
                                                <span className="shrink-0 text-[0.8125rem] text-muted-foreground">
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
