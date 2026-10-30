"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleX, FileJson, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { previewImport, runImport, type ImportPreviewRow } from "@/app/(app)/admin/actions";

const MAX_FILE_BYTES = 2_000_000;

export function ImportForm() {
    const [text, setText] = useState("");
    const [rows, setRows] = useState<ImportPreviewRow[] | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);
    const [publish, setPublish] = useState(false);
    const [result, setResult] = useState<{ created: number; updated: number; skipped: number } | null>(null);
    const [validating, startValidate] = useTransition();
    const [importing, startImport] = useTransition();
    const fileRef = useRef<HTMLInputElement>(null);

    const valid = rows?.filter((r) => r.ok).length ?? 0;
    const invalid = (rows?.length ?? 0) - valid;

    const reset = (next: string) => {
        setText(next);
        setRows(null);
        setParseError(null);
        setResult(null);
    };

    const validate = (source = text) =>
        startValidate(async () => {
            const res = await previewImport(source);
            if (!res.ok) {
                setRows(null);
                setParseError(res.error);
                return;
            }
            setParseError(null);
            setRows(res.rows);
        });

    const doImport = () =>
        startImport(async () => {
            const res = await runImport(text, publish);
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
            setResult(res);
            setRows(null);
            toast.success(
                `Imported ${res.created + res.updated} question${res.created + res.updated === 1 ? "" : "s"}`,
            );
        });

    const onFile = async (file: File | undefined) => {
        if (!file) return;
        if (file.size > MAX_FILE_BYTES) {
            toast.error("File is larger than 2 MB — split it into smaller batches");
            return;
        }
        const content = await file.text();
        reset(content);
        validate(content);
    };

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <Label htmlFor="import-json" className="text-sm font-semibold">
                        Questions JSON
                    </Label>
                    <div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="application/json,.json"
                            className="sr-only"
                            id="import-file"
                            onChange={(e) => {
                                void onFile(e.target.files?.[0]);
                                e.target.value = "";
                            }}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                            <Upload /> Upload .json
                        </Button>
                    </div>
                </div>
                <Textarea
                    id="import-json"
                    value={text}
                    onChange={(e) => reset(e.target.value)}
                    rows={14}
                    placeholder='[{ "unitCode": "WPH11", "topicSlug": "motion", "type": "SHORT", ... }]'
                    className="max-h-[32rem] min-h-72 font-mono text-xs"
                    spellCheck={false}
                    aria-invalid={Boolean(parseError)}
                    aria-describedby={parseError ? "import-error" : undefined}
                />
                {parseError && (
                    <p id="import-error" className="mt-2 flex items-start gap-2 text-sm text-destructive" role="alert">
                        <CircleX className="mt-0.5 size-4 shrink-0" /> {parseError}
                    </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button type="button" onClick={() => validate()} disabled={!text.trim() || validating}>
                        {validating ? <Loader2 className="animate-spin" /> : <FileJson />} Validate
                    </Button>
                    {rows && (
                        <span className="text-sm text-muted-foreground" aria-live="polite">
                            {valid} valid · {invalid} with errors
                        </span>
                    )}
                </div>
            </div>

            {result && (
                <div
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-success/40 bg-success/5 p-4 text-sm"
                    role="status"
                >
                    <CheckCircle2 className="size-5 text-success" />
                    <span>
                        Created {result.created}, updated {result.updated}
                        {result.skipped ? `, skipped ${result.skipped} invalid` : ""}.
                    </span>
                    <Button asChild size="sm" variant="outline" className="ml-auto">
                        <Link href={`/admin/questions${publish ? "" : "?status=DRAFT"}`}>Review questions</Link>
                    </Button>
                </div>
            )}

            {rows && (
                <div className="rounded-xl border bg-card">
                    <div className="flex flex-wrap items-center gap-3 border-b p-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="import-publish"
                                checked={publish}
                                onCheckedChange={(c) => setPublish(c === true)}
                            />
                            <Label htmlFor="import-publish" className="font-normal">
                                Publish immediately (otherwise new rows are drafts)
                            </Label>
                        </div>
                        <Button type="button" className="ml-auto" onClick={doImport} disabled={!valid || importing}>
                            {importing && <Loader2 className="animate-spin" />}
                            Import {valid} valid row{valid === 1 ? "" : "s"}
                        </Button>
                    </div>
                    <p className="px-3 pt-2 text-xs text-muted-foreground">
                        Rows matching an existing seedKey are updated; their status only changes if publishing.
                    </p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>Result</TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead className="hidden md:table-cell">Topic</TableHead>
                                <TableHead className="text-right">Marks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((r) =>
                                r.ok ? (
                                    <TableRow key={r.index}>
                                        <TableCell className="align-top text-muted-foreground tabular-nums">
                                            {r.index + 1}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    r.action === "update"
                                                        ? "border-primary/40 text-primary"
                                                        : "border-success/40 text-success"
                                                }
                                            >
                                                {r.action === "update" ? "Update" : "New"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md align-top whitespace-normal">
                                            <div className="line-clamp-2">{r.stem}</div>
                                            <div className="mt-0.5 text-xs text-muted-foreground">
                                                {r.type}
                                                {r.seedKey && <span className="ml-2 font-mono">{r.seedKey}</span>}
                                            </div>
                                            {r.warnings.map((w) => (
                                                <div
                                                    key={w}
                                                    className="mt-1 flex items-start gap-1 text-xs text-warning"
                                                >
                                                    <AlertTriangle className="mt-0.5 size-3 shrink-0" /> {w}
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell className="hidden align-top md:table-cell">
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {r.unitCode}
                                            </span>{" "}
                                            {r.topicName}
                                        </TableCell>
                                        <TableCell className="text-right align-top tabular-nums">{r.marks}</TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow key={r.index} className="bg-destructive/5">
                                        <TableCell className="align-top text-muted-foreground tabular-nums">
                                            {r.index + 1}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Badge variant="outline" className="border-destructive/40 text-destructive">
                                                Error
                                            </Badge>
                                        </TableCell>
                                        <TableCell colSpan={3} className="align-top whitespace-normal">
                                            {r.label && (
                                                <div className="mb-1 truncate font-mono text-xs">{r.label}</div>
                                            )}
                                            <ul className="space-y-0.5 text-xs text-destructive">
                                                {r.errors.map((e) => (
                                                    <li key={e}>{e}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                    </TableRow>
                                ),
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
