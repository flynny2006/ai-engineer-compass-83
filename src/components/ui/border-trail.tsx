
import { VariantProps, cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const borderTrailVariants = cva("relative overflow-hidden", {
  variants: {
    variant: {
      default: "[--border-trail-color:theme(colors.blue.500)]",
      primary: "[--border-trail-color:theme(colors.primary)]",
      destructive: "[--border-trail-color:theme(colors.destructive)]",
    },
    duration: {
      slow: "[--animation-duration:4s]",
      default: "[--animation-duration:2s]",
      fast: "[--animation-duration:1s]",
    },
    borderWidth: {
      default: "[--border-width:2px]",
      sm: "[--border-width:1px]",
      lg: "[--border-width:3px]",
    },
    spacing: {
      default: "[--spacing:0px]",
      sm: "[--spacing:0.5px]",
      lg: "[--spacing:1px]",
    },
  },
  defaultVariants: {
    variant: "default",
    duration: "default",
    borderWidth: "default",
    spacing: "default",
  },
})

export interface BorderTrailProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof borderTrailVariants> {}

const BorderTrail = React.forwardRef<HTMLDivElement, BorderTrailProps>(
  (
    {
      className,
      variant,
      duration,
      borderWidth,
      spacing,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          borderTrailVariants({ variant, duration, borderWidth, spacing }),
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 [mask:linear-gradient(white,white)]">
          <div
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, rgba(0, 0, 0, 0) 0deg, rgba(0, 0, 0, 0) 25%, var(--border-trail-color) 270deg, rgba(0, 0, 0, 0) 295deg, rgba(0, 0, 0, 0) 360deg)",
            }}
            className="absolute inset-[--spacing] animate-[border-trail_var(--animation-duration)_linear_infinite]"
          />
        </div>

        <div className="relative z-10 h-full w-full rounded-[inherit] bg-background">{props.children}</div>
      </div>
    )
  }
)

BorderTrail.displayName = "BorderTrail"

export { BorderTrail }
