"use client"

import { useSpacedRep } from "@/components/spaced-rep-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart } from "@/components/ui/chart"
import { AlertCircle, BarChart3, PieChartIcon, Calendar, SaveAll } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatDistanceToNow } from "date-fns"
import { ReviewHeatmap } from "@/components/review-heatmap"
import { ImportExportDialog } from "@/components/import-export-dialog"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export function StatsDashboard() {
  const { cards, reviewLogs, resetProgress, dailyStats } = useSpacedRep()
  const [showImportExport, setShowImportExport] = useState(false)

  const totalReviews = reviewLogs.length
  const knownCount = reviewLogs.filter((log) => log.known).length
  const successRate = totalReviews > 0 ? Math.round((knownCount / totalReviews) * 100) : 0

  if (reviewLogs.length === 0) {
    return (
        <div className="space-y-8">
          <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  border: '2px solid #6366f1',
                  padding: '16px',
                  color: '#fff',
                  background: '#111827',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#1F2937',
                  },
                },
              }}
          />

          <Alert className="gradient-card border-primary/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No review data yet</AlertTitle>
            <AlertDescription>Start reviewing cards to see your statistics here.</AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="gradient-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cards.length}</div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
                variant="outline"
                onClick={() => setShowImportExport(true)}
                className="border-primary hover:bg-primary/10"
            >
              <SaveAll className="mr-2 h-4 w-4" /> Import/Export Cards
            </Button>
            <ImportExportDialog open={showImportExport} onOpenChange={setShowImportExport} />
          </div>
        </div>
    )
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(10, 0, 0, 0)
    return date
  }).reverse()

  const dailyReviewData = last7Days.map((date) => {
    const dayStr = date.toISOString().split("T")[0]
    const dayStats = dailyStats[dayStr] || { known: 0, unknown: 0 }

    return {
      name: date.toLocaleDateString("en-IN", { weekday: "short" }),
      known: dayStats.known,
      unknown: dayStats.unknown,
      total: dayStats.known + dayStats.unknown,
    }
  })

  const pieData = [
    { name: "Known", value: knownCount, color: "hsl(142, 76%, 36%)" },
    { name: "Unknown", value: totalReviews - knownCount, color: "hsl(346, 84%, 61%)" },
  ]

  return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gradient-card border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cards.length}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily">
          <TabsList className="grid w-full grid-cols-3 gradient-primary">
            <TabsTrigger value="daily" className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Daily Reviews
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Accuracy
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="pt-4">
            <Card className="gradient-card border-primary/20">
              <CardHeader>
                <CardTitle>Daily Review Count</CardTitle>
                <CardDescription>Number of cards reviewed over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart
                    data={dailyReviewData}
                    index="name"
                    categories={["known", "unknown"]}
                    colors={["#A855F7","#fe6e8b"]}
                    valueFormatter={(value) => `${value} cards`}
                    yAxisWidth={30}
                    height={350}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accuracy" className="pt-4">
            <Card className="gradient-card border-primary/20">
              <CardHeader>
                <CardTitle>Review Accuracy</CardTitle>
                <CardDescription>Ratio of "Know" vs "Don't Know" responses</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <PieChart
                    data={pieData}
                    index="name"
                    valueFormatter={(value) => `${value} reviews`}
                    category="value"
                    colors={["#A855F7","#fe6e8b"]}
                    className="h-80"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="pt-4">
            <Card className="gradient-card border-primary/20">
              <CardHeader>
                <CardTitle>Review Activity</CardTitle>
                <CardDescription>Calendar heatmap of your review activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewHeatmap logs={reviewLogs} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col items-center mt-8">
          <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
          <div className="w-full space-y-2">
            {reviewLogs
                .slice(-5)
                .reverse()
                .map((log) => {
                  const card = cards.find((c) => c.id === log.cardId)
                  if (!card) return null

                  return (
                      <div
                          key={log.id}
                          className="flex justify-between items-center p-3 border rounded-md gradient-card border-primary/20 hover:shadow-md transition-shadow"
                      >
                        <div className="truncate max-w-[70%]">
                          <span className="font-medium">{card.front}</span>
                        </div>
                        <div className="flex items-center gap-2">
                    <span className={log.known ? "text-green-500" : "text-red-500"}>
                      {log.known ? "Confident" : "Needs Work"}
                    </span>
                          <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                    </span>
                        </div>
                      </div>
                  )
                })}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
              variant="destructive"
              onClick={() => {
                const confirmed = window.confirm("Are you sure you want to reset all progress? This cannot be undone.")
                if (confirmed) {
                  resetProgress()
                  toast.success("Progress reset successfully!")
                }
              }}
              className="hover:bg-destructive/90 transition-colors"
          >
            Reset All Progress
          </Button>

          <Button
              variant="outline"
              onClick={() => setShowImportExport(true)}
              className="border-primary hover:bg-primary/10"
          >
            <SaveAll className="mr-2 h-4 w-4" />
            Import/Export Cards
          </Button>

          <ImportExportDialog open={showImportExport} onOpenChange={setShowImportExport} />
        </div>
      </div>
  )
}
