import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-md border-[1.5px] border-input bg-card px-3.5 py-2.5 text-base transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground hover:border-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-[0.95rem]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
