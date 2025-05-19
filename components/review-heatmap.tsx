"use client"

import type { ReviewLog } from "@/lib/types"
import { addDays, format, startOfWeek, subMonths } from "date-fns"

interface ReviewHeatmapProps {
  logs: ReviewLog[]
}

export function ReviewHeatmap({ logs }: ReviewHeatmapProps) {
  // Get dates for the last 3 months
  const today = new Date()
  const startDate = startOfWeek(subMonths(today, 3))

  // Create a map of dates to review counts
  const reviewsByDate = new Map<string, number>()

  logs.forEach((log) => {
    const date = log.date.split("T")[0]
    reviewsByDate.set(date, (reviewsByDate.get(date) || 0) + 1)
  })

  // Generate calendar grid
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  // Generate days for 3 months (approximately 13 weeks)
  for (let i = 0; i < 91; i++) {
    const date = addDays(startDate, i)

    if (date > today) {
      break
    }

    if (date.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }

    currentWeek.push(date)

    if (i === 90 || date.getTime() === today.getTime()) {
      weeks.push(currentWeek)
    }
  }

  // Get color intensity based on review count
  const getColorIntensity = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count < 3) return "bg-emerald-200 dark:bg-emerald-900"
    if (count < 6) return "bg-emerald-300 dark:bg-emerald-800"
    if (count < 10) return "bg-emerald-400 dark:bg-emerald-700"
    return "bg-emerald-500 dark:bg-emerald-600"
  }

  // Get weekday labels
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="flex mb-1">
          <div className="w-8"></div>
          {weeks.map((_, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex-1 text-center text-xs text-muted-foreground">
              {weekIndex % 2 === 0 && format(weeks[weekIndex][0], "MMM")}
            </div>
          ))}
        </div>

        <div className="flex">
          <div className="w-8 flex flex-col justify-around">
            {weekdays.map((day, i) => (
              <div key={day} className="h-6 text-xs text-muted-foreground">
                {i % 2 === 0 ? day : ""}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-flow-col gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={`col-${weekIndex}`} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const date = week[dayIndex]
                  if (!date) return <div key={`empty-${dayIndex}`} className="h-6 w-6"></div>

                  const dateStr = format(date, "yyyy-MM-dd")
                  const count = reviewsByDate.get(dateStr) || 0

                  return (
                    <div
                      key={dateStr}
                      className={`h-6 w-6 rounded-sm ${getColorIntensity(count)}`}
                      title={`${format(date, "MMM d, yyyy")}: ${count} reviews`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="h-4 w-4 rounded-sm bg-muted"></div>
            <div className="h-4 w-4 rounded-sm bg-emerald-200 dark:bg-emerald-900"></div>
            <div className="h-4 w-4 rounded-sm bg-emerald-300 dark:bg-emerald-800"></div>
            <div className="h-4 w-4 rounded-sm bg-emerald-400 dark:bg-emerald-700"></div>
            <div className="h-4 w-4 rounded-sm bg-emerald-500 dark:bg-emerald-600"></div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
