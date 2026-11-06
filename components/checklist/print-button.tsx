"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens the browser's print dialog (which also saves as PDF). */
export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
    return (
        <Button variant="outline" onClick={() => window.print()} className="print:hidden">
            <Printer />
            {label}
        </Button>
    );
}
