"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                } catch {
                    toast.error("Couldn't copy — select the text and copy manually");
                }
            }}
        >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : label}
        </Button>
    );
}
