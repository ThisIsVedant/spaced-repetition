"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max, className, showLabel = false }: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

  return (
    <div className={cn("w-full space-y-1", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-300">
        <div className="h-full progress-bar-animated gradient-primary" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{value} reviewed</span>
          <span>{max} total</span>
        </div>
      )}
    </div>
  )
}
