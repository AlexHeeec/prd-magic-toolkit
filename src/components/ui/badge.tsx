
import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ 
  className, 
  variant = 'default', 
  ...props 
}: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600 border-transparent",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border-transparent",
    destructive: "bg-red-500 text-white hover:bg-red-600 border-transparent",
    outline: "bg-transparent text-gray-900 border-gray-200",
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { Badge }
