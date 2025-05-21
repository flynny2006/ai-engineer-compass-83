
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        circle: "bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full p-0 h-10 w-10 shadow-md",
        modern: "bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5",
        glow: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-[0_0_15px_rgba(149,128,255,0.5)] hover:shadow-[0_0_25px_rgba(149,128,255,0.7)] transition-all duration-300",
        // New button variants that match enhanced design principles
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 shadow-sm hover:shadow-md transition-all duration-200",
        neon: "relative bg-black text-white border-2 border-[#0ff] shadow-[0_0_10px_#0ff,inset_0_0_10px_#0ff] hover:shadow-[0_0_20px_#0ff,inset_0_0_20px_#0ff] transition-all duration-300",
        material: "bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:shadow-md",
        minimal: "border-none bg-transparent text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
        pill: "rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200",
        "3d": "bg-blue-500 text-white border-b-4 border-blue-700 hover:bg-blue-400 active:border-b-0 active:border-t-4 active:border-t-transparent transition-all duration-100 transform active:translate-y-1",
        retro: "bg-yellow-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2",
        skeuomorphic: "bg-gradient-to-b from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800 text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] active:shadow-[inset_0_1px_8px_rgba(0,0,0,0.4)] transition-all duration-150",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 text-base rounded-md px-10",
        icon: "h-10 w-10",
        // New size variants
        "2xl": "h-14 text-lg rounded-md px-12",
        compact: "h-8 px-3 py-1 text-xs",
        wide: "h-10 px-8 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
