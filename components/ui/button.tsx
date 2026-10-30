import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-display text-[0.975rem] leading-none font-extrabold whitespace-nowrap transition-[transform,background-color,box-shadow,color] duration-200 ease-out-soft outline-none active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:bg-track disabled:text-muted-foreground disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-action hover:-translate-y-px hover:bg-primary-hover active:translate-y-0 active:bg-primary-press",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-destructive",
        outline:
          "bg-card text-foreground shadow-[inset_0_0_0_2px_var(--border-strong)] hover:bg-accent hover:shadow-[inset_0_0_0_2px_var(--foreground)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-track",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "font-sans font-bold text-selected-foreground underline decoration-2 underline-offset-4 hover:decoration-current active:scale-100",
      },
      size: {
        default: "h-11 px-5 has-[>svg]:px-4",
        xs: "h-8 gap-1 px-3 text-xs has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-4 text-sm has-[>svg]:px-3",
        lg: "h-12 px-7 text-[1.0625rem] has-[>svg]:px-6 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
