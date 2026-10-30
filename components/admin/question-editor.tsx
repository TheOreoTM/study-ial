"use client";

import { useDeferredValue, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CircleX, ExternalLink, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { deleteQuestion, draftMarkScheme, saveQuestion } from "@/app/(app)/admin/actions";
import {
    blankOptions,
    checkQuestion,
    OPTION_LABELS,
    questionInputSchema,
    TYPE_LABELS,
    type OptionInput,
    type QuestionTypeValue,
} from "@/app/(app)/admin/validation";
import type { CurriculumTree } from "@/app/(app)/admin/queries";
import { cn } from "@/lib/utils";

export type EditorValues = {
    topicId: string;
    type: QuestionTypeValue;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    marks: string;
    status: "DRAFT" | "PUBLISHED";
    source: "ORIGINAL" | "PAST_PAPER";
    sourceRef: string;
    stem: string;
    markScheme: string;
    explanation: string;
    options: OptionInput[];
};

function findLocation(tree: CurriculumTree, topicId: string) {
    for (const s of tree) for (const u of s.units) if (u.topics.some((t) => t.id === topicId)) return { s, u };
    return null;
}

export function QuestionEditor({
    tree,
    initial,
    questionId,
    aiEnabled,
    meta,
}: {
    tree: CurriculumTree;
    initial: EditorValues;
    questionId?: string;
    aiEnabled: boolean;
    meta?: { seedKey: string | null; attempts: number; updatedAt: string; publicHref: string | null };
}) {
    const router = useRouter();
    const [v, setV] = useState<EditorValues>(initial);
    const [attempted, setAttempted] = useState(false);
    const [saving, startSave] = useTransition();
    const [deleting, startDelete] = useTransition();
    const [drafting, startDraft] = useTransition();
    const [proposal, setProposal] = useState<{ markScheme: string; notes: string | null } | null>(null);

    const set = <K extends keyof EditorValues>(key: K, value: EditorValues[K]) =>
        setV((prev) => ({ ...prev, [key]: value }));

    // Placement cascade: subject → unit → topic, seeded from the initial topic.
    const [subjectId, setSubjectId] = useState(() => findLocation(tree, initial.topicId)?.s.id ?? "");
    const [unitId, setUnitId] = useState(() => findLocation(tree, initial.topicId)?.u.id ?? "");
    const subject = tree.find((s) => s.id === subjectId);
    const unit = subject?.units.find((u) => u.id === unitId);

    const isMcq = v.type === "MCQ";
    const payload = {
        id: questionId,
        topicId: v.topicId,
        type: v.type,
        difficulty: v.difficulty,
        marks: v.marks.trim() === "" ? Number.NaN : Number(v.marks),
        status: v.status,
        source: v.source,
        sourceRef: v.sourceRef,
        stem: v.stem,
        markScheme: v.markScheme,
        explanation: v.explanation,
        options: isMcq ? v.options : [],
    };
    const parsed = questionInputSchema.safeParse(payload);
    const errors = parsed.success
        ? []
        : parsed.error.issues.map((i) => (i.path.length ? `${String(i.path[0])}: ${i.message}` : i.message));
    const warnings = parsed.success ? checkQuestion(parsed.data).warnings : [];

    const save = (then?: "new") => {
        setAttempted(true);
        if (!parsed.success) {
            toast.error("Fix the highlighted problems before saving");
            return;
        }
        startSave(async () => {
            const res = await saveQuestion(payload);
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success(questionId ? "Question saved" : "Question created", {
                description: res.warnings.length ? `${res.warnings.length} warning(s) — see below` : undefined,
            });
            if (then === "new") router.push(`/admin/questions/new?topic=${v.topicId}&type=${v.type}&n=${Date.now()}`);
            else if (!questionId) router.push(`/admin/questions/${res.id}`);
        });
    };

    const remove = () =>
        startDelete(async () => {
            if (!questionId) return;
            const res = await deleteQuestion(questionId);
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            toast.success("Question deleted");
            router.push("/admin/questions");
        });

    const draft = () =>
        startDraft(async () => {
            if (v.type === "MCQ") return;
            const res = await draftMarkScheme({
                stem: v.stem,
                marks: Number(v.marks),
                type: v.type,
                topicId: v.topicId || undefined,
            });
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            setProposal({ markScheme: res.markScheme, notes: res.notes });
        });

    const setOption = (i: number, patch: Partial<OptionInput>) =>
        set(
            "options",
            v.options.map((o, j) => (j === i ? { ...o, ...patch } : o)),
        );
    const correctLabel = v.options.find((o) => o.isCorrect)?.label ?? "";

    return (
        <form
            className="flex flex-col gap-6 pb-4"
            onSubmit={(e) => {
                e.preventDefault();
                save();
            }}
            onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                    e.preventDefault();
                    save();
                }
            }}
        >
            {meta && (
                <div className="-mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    <StatusBadge status={initial.status} />
                    {meta.seedKey && (
                        <span>
                            seedKey{" "}
                            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                                {meta.seedKey}
                            </code>
                        </span>
                    )}
                    <span>
                        {meta.attempts} attempt{meta.attempts === 1 ? "" : "s"}
                    </span>
                    <span>Updated {meta.updatedAt}</span>
                    {meta.publicHref && initial.status === "PUBLISHED" && (
                        <Link
                            href={meta.publicHref}
                            className="inline-flex min-h-6 items-center gap-1 font-semibold text-selected-foreground underline-offset-2 hover:underline"
                        >
                            View topic <ExternalLink className="size-3" />
                        </Link>
                    )}
                </div>
            )}

            <Section title="Placement">
                <div className="grid gap-3 sm:grid-cols-3">
                    <Field id="q-subject" label="Subject">
                        <Select
                            value={subjectId}
                            onValueChange={(id) => {
                                setSubjectId(id);
                                setUnitId("");
                                set("topicId", "");
                            }}
                        >
                            <SelectTrigger id="q-subject" className="w-full">
                                <SelectValue placeholder="Choose subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {tree.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id="q-unit" label="Unit">
                        <Select
                            value={unitId}
                            disabled={!subject}
                            onValueChange={(id) => {
                                setUnitId(id);
                                set("topicId", "");
                            }}
                        >
                            <SelectTrigger id="q-unit" className="w-full">
                                <SelectValue placeholder={subject ? "Choose unit" : "Choose a subject first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {subject?.units.map((u) => (
                                    <SelectItem key={u.id} value={u.id}>
                                        {u.code} · {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id="q-topic" label="Topic" invalid={attempted && !v.topicId}>
                        <Select value={v.topicId} disabled={!unit} onValueChange={(id) => set("topicId", id)}>
                            <SelectTrigger id="q-topic" className="w-full" aria-invalid={attempted && !v.topicId}>
                                <SelectValue placeholder={unit ? "Choose topic" : "Choose a unit first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {unit?.topics.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.code} {t.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </Section>

            <Section title="Details">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Field id="q-type" label="Type">
                        <Select
                            value={v.type}
                            onValueChange={(t) => {
                                const type = t as QuestionTypeValue;
                                setV((prev) => ({
                                    ...prev,
                                    type,
                                    marks: type === "MCQ" && prev.marks === "" ? "1" : prev.marks,
                                    options:
                                        type === "MCQ" && prev.options.length === 0 ? blankOptions() : prev.options,
                                }));
                            }}
                        >
                            <SelectTrigger id="q-type" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id="q-difficulty" label="Difficulty">
                        <Select
                            value={v.difficulty}
                            onValueChange={(d) => set("difficulty", d as EditorValues["difficulty"])}
                        >
                            <SelectTrigger id="q-difficulty" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EASY">Easy</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HARD">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id="q-marks" label="Marks">
                        <Input
                            id="q-marks"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={30}
                            value={v.marks}
                            onChange={(e) => set("marks", e.target.value)}
                        />
                    </Field>
                    <Field id="q-status" label="Status">
                        <Select value={v.status} onValueChange={(s) => set("status", s as EditorValues["status"])}>
                            <SelectTrigger id="q-status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="PUBLISHED">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id="q-source" label="Source">
                        <Select value={v.source} onValueChange={(s) => set("source", s as EditorValues["source"])}>
                            <SelectTrigger id="q-source" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ORIGINAL">Original</SelectItem>
                                <SelectItem value="PAST_PAPER">Past paper</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field
                        id="q-source-ref"
                        label="Source reference"
                        className="col-span-2 sm:col-span-3"
                        hint='e.g. "WPH11 Jan 2024 Q12" or a link to the official paper'
                    >
                        <Input
                            id="q-source-ref"
                            value={v.sourceRef}
                            onChange={(e) => set("sourceRef", e.target.value)}
                            placeholder={v.source === "PAST_PAPER" ? "WPH11 Jan 2024 Q12" : "Optional"}
                        />
                    </Field>
                </div>
            </Section>

            <MarkdownField
                id="q-stem"
                label="Question stem"
                value={v.stem}
                onChange={(s) => set("stem", s)}
                rows={8}
                placeholder={
                    "e.g. A car accelerates uniformly from rest to $20\\,\\text{m s}^{-1}$ in 8.0 s.\n\nCalculate the distance travelled."
                }
                previewExtra={
                    isMcq && v.options.some((o) => o.text.trim()) ? (
                        <ol className="mt-3 space-y-1.5">
                            {v.options.map((o) => (
                                <li key={o.label} className="flex items-baseline gap-2">
                                    <span
                                        className={cn(
                                            "w-5 shrink-0 font-display font-extrabold",
                                            o.isCorrect ? "text-success" : "text-muted-foreground",
                                        )}
                                    >
                                        {o.label}
                                    </span>
                                    <Markdown className="min-w-0 flex-1 [&_p]:my-0">{o.text || "—"}</Markdown>
                                </li>
                            ))}
                        </ol>
                    ) : null
                }
            />

            {isMcq && (
                <Section
                    title="Options"
                    description="Pick the single correct answer. Markdown and $LaTeX$ work in option text."
                >
                    <RadioGroup
                        value={correctLabel}
                        onValueChange={(label) =>
                            set(
                                "options",
                                v.options.map((o) => ({ ...o, isCorrect: o.label === label })),
                            )
                        }
                        aria-label="Correct option"
                        className="gap-2"
                    >
                        {v.options.map((o, i) => (
                            <div key={o.label} className="flex items-center gap-2">
                                <RadioGroupItem
                                    value={o.label}
                                    id={`q-correct-${o.label}`}
                                    aria-label={`${o.label} is correct`}
                                />
                                <Label
                                    htmlFor={`q-opt-${o.label}`}
                                    className="w-5 justify-center font-display font-extrabold"
                                >
                                    {o.label}
                                </Label>
                                <Input
                                    id={`q-opt-${o.label}`}
                                    value={o.text}
                                    onChange={(e) => setOption(i, { text: e.target.value })}
                                    aria-invalid={attempted && !o.text.trim()}
                                    className={cn(o.isCorrect && "border-success/60")}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Remove option ${o.label}`}
                                    disabled={v.options.length <= 2}
                                    onClick={() =>
                                        set(
                                            "options",
                                            v.options
                                                .filter((_, j) => j !== i)
                                                .map((opt, j) => ({ ...opt, label: OPTION_LABELS[j] })),
                                        )
                                    }
                                >
                                    <X />
                                </Button>
                            </div>
                        ))}
                    </RadioGroup>
                    {v.options.length < 5 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() =>
                                set("options", [
                                    ...v.options,
                                    { label: OPTION_LABELS[v.options.length], text: "", isCorrect: false },
                                ])
                            }
                        >
                            <Plus /> Add option
                        </Button>
                    )}
                </Section>
            )}

            <MarkdownField
                id="q-mark-scheme"
                label="Mark scheme"
                description={
                    isMcq
                        ? "Optional for MCQ — leave blank to use the correct letter."
                        : `One marking point per line, each ending in "(1)". This question needs ${v.marks || "?"}.`
                }
                value={v.markScheme}
                onChange={(s) => set("markScheme", s)}
                rows={7}
                placeholder={"e.g.\n- use of $s = \\tfrac{1}{2}(u + v)t$ (1)\n- $s = 80\\,\\text{m}$ (1)"}
                action={
                    aiEnabled && !isMcq ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={draft}
                            disabled={drafting || !v.stem.trim() || !(Number(v.marks) >= 1)}
                        >
                            {drafting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            Draft with AI
                        </Button>
                    ) : null
                }
            >
                {proposal && (
                    <div className="mt-4 rounded-lg bg-selected/60 p-4" role="region" aria-label="AI proposal">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-selected-foreground">
                            <Sparkles className="size-4" /> AI-drafted mark scheme — review before using
                        </div>
                        <Markdown>{proposal.markScheme}</Markdown>
                        {proposal.notes && (
                            <p className="mt-2 text-xs text-muted-foreground">Notes: {proposal.notes}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                    set("markScheme", proposal.markScheme);
                                    setProposal(null);
                                }}
                            >
                                Replace mark scheme
                            </Button>
                            {v.markScheme.trim() && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        set("markScheme", `${v.markScheme.trimEnd()}\n${proposal.markScheme}`);
                                        setProposal(null);
                                    }}
                                >
                                    Append
                                </Button>
                            )}
                            <Button type="button" size="sm" variant="ghost" onClick={() => setProposal(null)}>
                                Discard
                            </Button>
                        </div>
                    </div>
                )}
            </MarkdownField>

            <MarkdownField
                id="q-explanation"
                label="Explanation"
                description="Optional worked solution shown after answering."
                value={v.explanation}
                onChange={(s) => set("explanation", s)}
                rows={6}
            />

            <div className="sticky bottom-3 z-10 rounded-xl border bg-card/95 px-4 py-3 shadow-card backdrop-blur sm:px-5">
                {(attempted && errors.length > 0) || warnings.length > 0 ? (
                    <ul className="mb-3 max-h-32 space-y-1 overflow-y-auto text-sm" aria-live="polite">
                        {attempted &&
                            errors.map((e) => (
                                <li key={e} className="flex items-start gap-2 text-destructive">
                                    <CircleX className="mt-0.5 size-4 shrink-0" /> {e}
                                </li>
                            ))}
                        {warnings.map((w) => (
                            <li key={w} className="flex items-start gap-2 text-warning">
                                <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {w}
                            </li>
                        ))}
                    </ul>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">
                    {questionId && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 /> Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete this question?</DialogTitle>
                                    <DialogDescription>
                                        This can&apos;t be undone.
                                        {meta && meta.attempts > 0
                                            ? ` ${meta.attempts} student attempt${meta.attempts === 1 ? "" : "s"} will be deleted too, which changes mastery scores. Consider unpublishing instead.`
                                            : ""}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="button" variant="destructive" onClick={remove} disabled={deleting}>
                                        {deleting && <Loader2 className="animate-spin" />} Delete question
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">Ctrl/⌘ + S to save</span>
                    <Button type="button" variant="outline" onClick={() => save("new")} disabled={saving}>
                        Save &amp; add another
                    </Button>
                    <Button type="submit" disabled={saving} className="max-sm:ml-auto">
                        {saving && <Loader2 className="animate-spin" />}
                        {questionId ? "Save changes" : "Create question"}
                    </Button>
                </div>
            </div>
        </form>
    );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <fieldset className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
            {/* float makes the legend sit inside the card instead of notching its border */}
            <legend className="float-left mb-4 w-full font-display text-lg leading-tight font-extrabold">
                {title}
                {description && (
                    <span className="mt-1 block font-sans text-sm font-medium text-muted-foreground">
                        {description}
                    </span>
                )}
            </legend>
            <div className="clear-both" />
            {children}
        </fieldset>
    );
}

function Field({
    id,
    label,
    hint,
    invalid,
    className,
    children,
}: {
    id: string;
    label: string;
    hint?: string;
    invalid?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
            <Label htmlFor={id} className={cn(invalid && "text-destructive")}>
                {label}
            </Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

function MarkdownField({
    id,
    label,
    description,
    value,
    onChange,
    rows,
    placeholder,
    action,
    previewExtra,
    children,
}: {
    id: string;
    label: string;
    description?: string;
    value: string;
    onChange: (value: string) => void;
    rows: number;
    placeholder?: string;
    action?: React.ReactNode;
    previewExtra?: React.ReactNode;
    children?: React.ReactNode;
}) {
    const deferred = useDeferredValue(value);
    return (
        <div className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                    <Label htmlFor={id} className="font-display text-lg leading-tight font-extrabold">
                        {label}
                    </Label>
                    {description && (
                        <p id={`${id}-desc`} className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <Textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    placeholder={placeholder}
                    aria-describedby={description ? `${id}-desc` : undefined}
                    className="min-h-32 font-mono text-[13px] leading-relaxed"
                    spellCheck
                />
                <div
                    className="min-h-32 min-w-0 overflow-x-auto rounded-lg bg-muted px-4 py-3"
                    aria-label={`${label} preview`}
                    role="region"
                >
                    <p aria-hidden className="mb-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                        Preview
                    </p>
                    {deferred.trim() ? (
                        <Markdown>{deferred}</Markdown>
                    ) : (
                        <p className="text-sm text-muted-foreground">Preview appears here.</p>
                    )}
                    {previewExtra}
                </div>
            </div>
            {children}
        </div>
    );
}
