"use client";

import { useState } from "react";
import { CopyButton } from "@/components/admin/copy-button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UnitRef = {
    code: string;
    name: string;
    subject: string;
    topics: { slug: string; code: string; name: string }[];
};

export const EXAMPLE_JSON = JSON.stringify(
    [
        {
            seedKey: "phy-u1-motion-101",
            unitCode: "WPH11",
            topicSlug: "motion",
            type: "CALCULATION",
            difficulty: "MEDIUM",
            marks: 3,
            stem: "A car accelerates uniformly from rest to $20\\,\\text{m s}^{-1}$ in $8.0\\,\\text{s}$.\n\nCalculate the distance travelled.",
            markScheme:
                "- use of $s = \\tfrac{1}{2}(u + v)t$ or $v^2 = u^2 + 2as$ (1)\n- correct substitution (1)\n- $s = 80\\,\\text{m}$ (1)",
            explanation: "Average velocity is $10\\,\\text{m s}^{-1}$ for $8.0\\,\\text{s}$.",
            source: "ORIGINAL",
        },
        {
            seedKey: "phy-u1-motion-102",
            unitCode: "WPH11",
            topicSlug: "motion",
            type: "MCQ",
            difficulty: "EASY",
            marks: 1,
            stem: "Which of the following is a vector quantity?",
            markScheme: "**C** (1)",
            options: [
                { label: "A", text: "speed", isCorrect: false },
                { label: "B", text: "distance", isCorrect: false },
                { label: "C", text: "displacement", isCorrect: true },
                { label: "D", text: "time", isCorrect: false },
            ],
            source: "PAST_PAPER",
            sourceRef: "WPH11 Jan 2024 Q1",
        },
    ],
    null,
    2,
);

function buildPrompt(unit: UnitRef | undefined) {
    const topics = unit
        ? unit.topics.map((t) => `  - ${t.slug} — ${t.code} ${t.name}`).join("\n")
        : "  - (pick a unit above to list its topic slugs)";
    return `You are converting exam questions into JSON for a question bank.

Unit: ${unit ? `${unit.code} — ${unit.name} (${unit.subject})` : "<UNIT CODE>"}
Allowed topicSlug values for this unit:
${topics}

Output ONLY a JSON array (no prose, no code fences). Each element must have:
- "seedKey": a stable unique id, lowercase kebab-case, e.g. "${(unit?.code ?? "wph11").toLowerCase()}-jan24-q12a"
- "unitCode": "${unit?.code ?? "<UNIT CODE>"}"
- "topicSlug": one of the slugs above (choose the best match for the question's content)
- "type": "MCQ" | "SHORT" | "CALCULATION" | "LONG"  (LONG = 6-mark style extended response)
- "difficulty": "EASY" | "MEDIUM" | "HARD"
- "marks": integer
- "stem": the question in Markdown; use $...$ / $$...$$ LaTeX for maths and units (e.g. $9.81\\,\\text{m s}^{-2}$). Include any data the question gives. Split multi-part questions (a), (b)… into separate elements, repeating needed context in each stem.
- "markScheme": Markdown list, ONE marking point per line, each line ending with "(1)". The number of lines should equal "marks" (extra lines for accepted alternatives are OK; say "max N").
- "explanation": optional short worked solution
- "options": MCQ only — [{"label":"A","text":"...","isCorrect":false}, ...] with exactly one isCorrect true
- "source": "PAST_PAPER" for official papers, otherwise "ORIGINAL"
- "sourceRef": e.g. "${unit?.code ?? "WPH11"} Jan 2024 Q12" (or a link to the official paper on the Pearson website)

Skip any question that depends on a diagram or graph you cannot reproduce in text/Markdown tables.

Here are the questions and mark scheme:
<PASTE QUESTIONS AND MARK SCHEME HERE>`;
}

export function ImportHelp({ units }: { units: UnitRef[] }) {
    const [code, setCode] = useState(units[0]?.code ?? "");
    const unit = units.find((u) => u.code === code);
    const prompt = buildPrompt(unit);

    return (
        <aside className="flex min-w-0 flex-col gap-4">
            <section className="rounded-xl bg-muted p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="text-lg">LLM conversion prompt</h2>
                    <CopyButton text={prompt} label="Copy prompt" />
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                    Paste into any LLM along with a paper&apos;s questions and mark scheme, then paste its output on the
                    left. Always review the result — LLMs misread diagrams and mark allocations.
                </p>
                <Label htmlFor="prompt-unit" className="mb-1.5">
                    Unit
                </Label>
                <Select value={code} onValueChange={setCode}>
                    <SelectTrigger id="prompt-unit" size="sm" className="mb-3 w-full">
                        <SelectValue placeholder="Choose unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {units.map((u) => (
                            <SelectItem key={u.code} value={u.code}>
                                {u.code} · {u.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <pre className="max-h-64 overflow-auto rounded-lg border bg-card p-3 text-xs leading-relaxed whitespace-pre-wrap">
                    {prompt}
                </pre>
            </section>

            <section className="rounded-xl bg-warning/10 p-5 text-sm">
                <h2 className="mb-1 text-lg text-warning">Copyright</h2>
                <p>
                    Pearson past papers and mark schemes are copyrighted. Don&apos;t upload or re-host the PDFs — set{" "}
                    <code>source: &quot;PAST_PAPER&quot;</code> and put a reference or a link to the official paper in{" "}
                    <code>sourceRef</code>. Prefer writing original questions in the same style.
                </p>
            </section>

            <section className="rounded-xl bg-muted p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="text-lg">Example JSON</h2>
                    <CopyButton text={EXAMPLE_JSON} label="Copy" />
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                    Same shape as the seed data (<code>SeedQuestion</code>). <code>seedKey</code>,{" "}
                    <code>explanation</code>, <code>source</code>, <code>sourceRef</code> are optional;{" "}
                    <code>markScheme</code> is optional for MCQ.
                </p>
                <pre className="max-h-72 overflow-auto rounded-lg border bg-card p-3 text-xs leading-relaxed">
                    {EXAMPLE_JSON}
                </pre>
            </section>

            {unit && (
                <details className="rounded-xl bg-muted p-5 text-xs">
                    <summary className="flex min-h-6 cursor-pointer items-center font-display text-base font-extrabold">
                        Topic slugs for {unit.code}
                    </summary>
                    <ul className="mt-2 space-y-0.5">
                        {unit.topics.map((t) => (
                            <li key={t.slug} className="flex gap-2">
                                <code className="shrink-0">{t.slug}</code>
                                <span className="truncate text-muted-foreground">
                                    {t.code} {t.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </aside>
    );
}
