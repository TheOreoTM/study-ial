"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Progress as ProgressPrimitive } from "radix-ui"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-track",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full bg-progress transition-transform duration-500 ease-out-soft"
        // Any progress at all stays visible (a 1% plan still shows a sliver).
        style={{ transform: `translateX(-${100 - (value ? Math.max(value, 3) : 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
