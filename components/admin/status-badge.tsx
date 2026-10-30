import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: "DRAFT" | "PUBLISHED"; className?: string }) {
    return status === "PUBLISHED" ? (
        <Badge variant="outline" className={cn("border-success/40 bg-success/10 text-success", className)}>
            Published
        </Badge>
    ) : (
        <Badge variant="outline" className={cn("border-warning/40 bg-warning/10 text-warning", className)}>
            Draft
        </Badge>
    );
}
