import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlashcardViewer } from "@/components/flashcard-viewer"
import { StatsDashboard } from "@/components/stats-dashboard"
import { TitleSwitcher } from "@/components/title-switcher"

export default function Home() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-center my-6">
        <TitleSwitcher />
      </div>
      <Tabs defaultValue="study" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 gradient-primary">
          <TabsTrigger value="study" className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white">
            Study
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white">
            Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="study" className="mt-0">
          <FlashcardViewer />
        </TabsContent>
        <TabsContent value="stats" className="mt-0">
          <StatsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
