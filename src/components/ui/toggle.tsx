
import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ 
    className, 
    children, 
    pressed, 
    variant = 'default', 
    size = 'default', 
    ...props 
  }, ref) => {
    const variantClasses = {
      default: "bg-transparent data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900",
      outline: "border border-gray-200 bg-transparent hover:bg-gray-100 data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-500",
    }

    const sizeClasses = {
      default: "h-10 px-3",
      sm: "h-9 px-2.5",
      lg: "h-11 px-5",
    }

    return (
      <button
        ref={ref}
        data-state={pressed ? "on" : "off"}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Toggle.displayName = "Toggle"

export { Toggle }
