import { Markdown } from "@/components/markdown";
import type { KeyEquationGroup } from "@/lib/key-equations";

/** A unit's key equations, grouped by topic. `topics` maps topic codes to names for the group headings. */
export function KeyEquations({
    groups,
    topics,
    id = "key-equations",
}: {
    groups: KeyEquationGroup[];
    topics: Map<string, string>;
    id?: string;
}) {
    return (
        <section
            aria-labelledby={id}
            className="rounded-xl border bg-card p-5 shadow-card sm:p-7 print:break-before-page print:shadow-none"
        >
            <h2 id={id} className="text-lg">
                Key equations
            </h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
                The relationships this unit leans on most. Check your data and formulae booklet for which ones the exam
                gives you.
            </p>
            <div className="grid gap-6 md:grid-cols-2 print:grid-cols-2 print:gap-4">
                {groups.map((g) => (
                    <div key={g.topic} className="min-w-0 break-inside-avoid">
                        <h3 className="mb-2 text-base">
                            <span className="num mr-2 text-muted-foreground">{g.topic}</span>
                            {topics.get(g.topic) ?? ""}
                        </h3>
                        <dl className="grid gap-2">
                            {g.equations.map((e) => (
                                <div key={e.tex} className="rounded-lg bg-muted px-3.5 py-2.5">
                                    <dt className="overflow-x-auto overflow-y-hidden">
                                        <Markdown className="text-[1.0625rem] [&_p]:my-0">{`$${e.tex}$`}</Markdown>
                                    </dt>
                                    <dd className="mt-1">
                                        <Markdown className="text-[0.8125rem] text-muted-foreground [&_p]:my-0">
                                            {e.meaning}
                                        </Markdown>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                ))}
            </div>
        </section>
    );
}
