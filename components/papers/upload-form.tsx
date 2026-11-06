"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Unit = { code: string; name: string; subject: string };

const MAX_EDGE = 2000;

/** Phone photos are 3–6 MB; shrink them in the browser so a whole paper fits in one upload. */
async function shrinkImage(file: File): Promise<Blob> {
    if (!file.type.startsWith("image/") || file.type === "image/heic") return file;
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) return file;
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob ?? file;
}

export function UploadForm({
    units,
    maxMb,
    sittingId,
    defaultType = "QP",
}: {
    units: Unit[];
    maxMb: number;
    /** Adding a mark scheme to an existing upload */
    sittingId?: string;
    defaultType?: "QP" | "MS";
}) {
    const router = useRouter();
    const input = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [title, setTitle] = useState("");
    const [unitCode, setUnitCode] = useState("");
    const [type, setType] = useState<"QP" | "MS">(defaultType);
    const [busy, setBusy] = useState(false);
    const isPdf = files.length === 1 && files[0].type === "application/pdf";

    const add = (list: FileList | null) => {
        if (!list) return;
        const next = [...files, ...Array.from(list)];
        const pdfs = next.filter((f) => f.type === "application/pdf");
        if (pdfs.length && next.length > 1) {
            toast.error("Upload one PDF on its own, or photos without a PDF.");
            return;
        }
        setFiles(next);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.length) return;
        setBusy(true);
        try {
            const form = new FormData();
            form.set("title", title);
            form.set("unitCode", unitCode);
            form.set("type", type);
            if (sittingId) form.set("sittingId", sittingId);
            let size = 0;
            for (const f of files) {
                const blob = await shrinkImage(f);
                size += blob.size;
                form.append("files", blob, f.name.replace(/\.(heic|png|webp)$/i, ".jpg"));
            }
            if (size > maxMb * 1024 * 1024) {
                toast.error(`That's ${(size / 1024 / 1024).toFixed(1)} MB; the limit is ${maxMb} MB. Try fewer photos.`);
                return;
            }
            const res = await fetch("/api/papers/uploads", { method: "POST", body: form });
            const json = (await res.json().catch(() => ({}))) as { error?: string; sittingId?: string; deduped?: string | null };
            if (!res.ok || !json.sittingId) {
                toast.error(json.error ?? "The upload didn't work. Try again.");
                return;
            }
            if (json.deduped === "index") toast.success("That's a past paper we already have: added it to your papers.");
            else if (json.deduped === "own") toast.success("You've uploaded this one before.");
            else toast.success("Uploaded. Reading the questions now…");
            router.push(`/papers/${json.sittingId}`);
        } finally {
            setBusy(false);
        }
    };

    const subjects = [...new Set(units.map((u) => u.subject))];
    return (
        <form onSubmit={submit} className="space-y-6">
            <div
                className={cn(
                    "flex flex-col items-center rounded-xl border-2 border-dashed border-border-strong/60 bg-muted px-6 py-10 text-center",
                    files.length && "py-6",
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    add(e.dataTransfer.files);
                }}
            >
                <div className="mb-3 grid size-14 place-items-center rounded-lg bg-card shadow-card">
                    <FileUp className="size-6 text-selected-foreground" aria-hidden />
                </div>
                <p className="font-display text-lg font-extrabold">A PDF, or photos of the pages</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Several photos make one paper, in the order you add them. Up to {maxMb} MB per upload.
                </p>
                <input
                    ref={input}
                    type="file"
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    id="paper-files"
                    onChange={(e) => {
                        add(e.target.files);
                        e.target.value = "";
                    }}
                />
                <Button type="button" variant="outline" className="mt-4" onClick={() => input.current?.click()}>
                    <ImagePlus aria-hidden />
                    {files.length ? "Add more" : "Choose files"}
                </Button>
            </div>

            {files.length > 0 && (
                <ol className="space-y-2" aria-label="Files to upload">
                    {files.map((f, i) => (
                        <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5">
                            <span className="num w-6 text-muted-foreground">{i + 1}</span>
                            <span className="min-w-0 flex-1 truncate font-semibold">{f.name}</span>
                            <span className="text-sm text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                            <Button
                                type="button"
                                size="icon-sm"
                                variant="ghost"
                                aria-label={`Remove ${f.name}`}
                                onClick={() => setFiles(files.filter((_, j) => j !== i))}
                            >
                                <X aria-hidden />
                            </Button>
                        </li>
                    ))}
                </ol>
            )}

            {!sittingId && (
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="paper-title">Name</Label>
                        <Input
                            id="paper-title"
                            value={title}
                            maxLength={120}
                            placeholder="e.g. Mock exam, March"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paper-unit">Unit</Label>
                        <select
                            id="paper-unit"
                            value={unitCode}
                            onChange={(e) => setUnitCode(e.target.value)}
                            className="h-11 w-full rounded-md border-[1.5px] border-border-strong bg-card px-3 text-base hover:border-foreground/60 focus-visible:border-ring focus-visible:outline-3 focus-visible:outline-ring/25"
                        >
                            <option value="">Not sure / other</option>
                            {subjects.map((s) => (
                                <optgroup key={s} label={s}>
                                    {units
                                        .filter((u) => u.subject === s)
                                        .map((u) => (
                                            <option key={u.code} value={u.code}>
                                                {u.code} · {u.name}
                                            </option>
                                        ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <fieldset className="space-y-2">
                <legend className="text-sm font-bold">This is a</legend>
                <div className="flex flex-wrap gap-2">
                    {(["QP", "MS"] as const).map((t) => (
                        <label
                            key={t}
                            className={cn(
                                "inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 font-display font-bold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                                type === t ? "bg-selected text-selected-foreground" : "bg-muted",
                            )}
                        >
                            <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
                            {t === "QP" ? "Question paper" : "Mark scheme"}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={!files.length || busy}>
                    {busy && <Loader2 className="animate-spin" aria-hidden />}
                    {busy ? "Uploading…" : isPdf ? "Upload PDF" : files.length > 1 ? `Upload ${files.length} photos` : "Upload"}
                </Button>
                <p className="text-sm text-muted-foreground">Only you can see your uploads.</p>
            </div>
        </form>
    );
}
