
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900",
        outline: "border border-gray-200 bg-transparent hover:bg-gray-100 data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-500",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof toggleVariants> {
  pressed?: boolean;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ 
    className, 
    children, 
    pressed, 
    variant, 
    size, 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        data-state={pressed ? "on" : "off"}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
