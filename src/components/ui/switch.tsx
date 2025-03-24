
import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <label className="inline-flex h-6 w-11 items-center rounded-full bg-gray-200 p-1 transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:bg-gray-300">
      <input
        type="checkbox"
        className="sr-only"
        ref={ref}
        {...props}
      />
      <span
        className={cn(
          "block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
          props.checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </label>
  )
)
Switch.displayName = "Switch"

export { Switch }
