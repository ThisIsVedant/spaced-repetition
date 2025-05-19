"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpacedRep } from "@/components/spaced-rep-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Plus, SaveAll } from "lucide-react"
import { AddCardDialog } from "@/components/add-card-dialog"
import { ImportExportDialog } from "@/components/import-export-dialog"
import { ProgressBar } from "@/components/progress-bar"

export function FlashcardViewer() {
  const { currentCard, reviewCard, reviewedCount, totalDueCount } = useSpacedRep()
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  const handleReview = (known: boolean) => {
    reviewCard(known)
    setIsFlipped(false)
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="w-full max-w-md p-6 rounded-xl gradient-primary text-white mb-8 bounce-in">
          <h2 className="text-2xl font-bold mb-4">All Done! 🎉</h2>
          <p className="mb-4">You've completed all your reviews for today. Come back tomorrow or add new cards.</p>
          {totalDueCount > 0 && (
            <div className="mb-4">
              <ProgressBar value={reviewedCount} max={totalDueCount} showLabel />
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowAddCard(true)}
            className="gradient-primary text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Card
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportExport(true)}
            className="border-primary hover:bg-primary/10"
          >
            <SaveAll className="mr-2 h-4 w-4" /> Import/Export Cards
          </Button>
        </div>
        <AddCardDialog open={showAddCard} onOpenChange={setShowAddCard} />
        <ImportExportDialog open={showImportExport} onOpenChange={setShowImportExport} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">
            Cards remaining: {totalDueCount}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddCard(true)}
              className="border-primary hover:bg-primary/10"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Card
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportExport(true)}
              className="border-primary hover:bg-primary/10"
            >
              <SaveAll className="mr-2 h-4 w-4" /> Import/Export
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <ProgressBar value={reviewedCount} max={totalDueCount} />
        </div>

        <div className="perspective-1000 w-full h-64 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isFlipped ? "back" : "front"}
              className="w-full h-full relative preserve-3d cursor-pointer"
              initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={handleCardClick}
            >
              {!isFlipped ? (
                <Card className="absolute w-full h-full flex items-center justify-center p-6 shadow-lg border-2 border-primary/20 bg-card">
                  <CardContent className="p-0 w-full h-full flex items-center justify-center">
                    <div className="text-xl text-center font-medium">{currentCard.front}</div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="absolute w-full h-full flex items-center justify-center p-6 shadow-lg border-2 border-primary/20 bg-card">
                  <CardContent className="p-0 w-full h-full flex items-center justify-center">
                    <div className="text-xl text-center">{currentCard.back}</div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-40 border-red-500 hover:bg-red-500/10 text-red-500 transition-all"
            onClick={() => handleReview(false)}
            disabled={!isFlipped}
          >
            <XCircle className="mr-2 h-5 w-5" /> Don't Know
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-40 border-green-500 hover:bg-green-500/10 text-green-500 transition-all"
            onClick={() => handleReview(true)}
            disabled={!isFlipped}
          >
            <CheckCircle className="mr-2 h-5 w-5" /> Know
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-center mt-4">
        Click the card to flip it, then mark whether you knew the answer
      </div>

      <AddCardDialog open={showAddCard} onOpenChange={setShowAddCard} />
      <ImportExportDialog open={showImportExport} onOpenChange={setShowImportExport} />
    </div>
  )
}
