import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    text?: string;
    className?: string;
}

export function LoadingSpinner({ text = "Loading...", className }: LoadingSpinnerProps) {
    return (
        <div
            className={cn("min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm", className)}
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
                </div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">{text}</p>
            </div>
        </div>
    );
}
