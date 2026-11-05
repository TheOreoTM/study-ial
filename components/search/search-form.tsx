import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** A plain GET form, so search works before (and without) JavaScript. */
export function SearchForm({
    defaultValue = "",
    autoFocus = false,
    className,
}: {
    defaultValue?: string;
    autoFocus?: boolean;
    className?: string;
}) {
    return (
        <form action="/search" method="get" role="search" className={cn("flex gap-2", className)}>
            <label htmlFor="search-q" className="sr-only">
                Search topics and specification points
            </label>
            <div className="relative min-w-0 flex-1">
                <Search
                    className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
                <input
                    id="search-q"
                    name="q"
                    type="search"
                    defaultValue={defaultValue}
                    autoFocus={autoFocus}
                    maxLength={100}
                    placeholder="Projectiles, WPH11, enthalpy…"
                    autoComplete="off"
                    enterKeyHint="search"
                    className="h-12 w-full rounded-md border-[1.5px] border-border-strong bg-card pr-3.5 pl-11 text-base outline-none transition-[border-color,box-shadow] duration-200 ease-out-soft placeholder:text-muted-foreground hover:border-foreground/60 focus-visible:border-progress focus-visible:ring-3 focus-visible:ring-progress/25"
                />
            </div>
            <Button type="submit" variant="outline" className="h-12">
                Search
            </Button>
        </form>
    );
}
