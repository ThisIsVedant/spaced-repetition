"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Card, ReviewLog, SM2Card } from "@/lib/types"
import { calculateNextReview, getInitialCards } from "@/lib/spaced-rep"
import { cardsToCSV } from "@/lib/import-export"
import { useToast } from "@/hooks/use-toast"

type SpacedRepContextType = {
  cards: SM2Card[]
  reviewLogs: ReviewLog[]
  dueCards: SM2Card[]
  currentCard: SM2Card | null
  reviewCard: (known: boolean) => void
  resetProgress: () => void
  addCard: (card: Card) => void
  removeCard: (id: string) => void
  importCards: (newCards: Card[]) => Promise<void>
  exportCards: (format: "json" | "csv") => string
  isImporting: boolean
  reviewedCount: number
  totalDueCount: number
  dailyStats: { [date: string]: { known: number; unknown: number } }
}

const SpacedRepContext = createContext<SpacedRepContextType | undefined>(undefined)

export function SpacedRepProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<SM2Card[]>([])
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>([])
  const [dueCards, setDueCards] = useState<SM2Card[]>([])
  const [currentCard, setCurrentCard] = useState<SM2Card | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [totalDueCount, setTotalDueCount] = useState(0)
  const [dailyStats, setDailyStats] = useState<{ [date: string]: { known: number; unknown: number } }>({})
  const { toast } = useToast()

  useEffect(() => {
    const storedCards = localStorage.getItem("spaceRep-cards")
    const storedLogs = localStorage.getItem("spaceRep-logs")
    const storedDailyStats = localStorage.getItem("spaceRep-dailyStats")

    if (storedCards) {
      setCards(JSON.parse(storedCards))
    } else {
      const initialCards = getInitialCards()
      setCards(initialCards)
    }

    if (storedLogs) {
      setReviewLogs(JSON.parse(storedLogs))
    }

    if (storedDailyStats) {
      setDailyStats(JSON.parse(storedDailyStats))
    }
  }, [])

  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem("spaceRep-cards", JSON.stringify(cards))
    }
    if (reviewLogs.length > 0) {
      localStorage.setItem("spaceRep-logs", JSON.stringify(reviewLogs))
    }
    if (Object.keys(dailyStats).length > 0) {
      localStorage.setItem("spaceRep-dailyStats", JSON.stringify(dailyStats))
    }
  }, [cards, reviewLogs, dailyStats])

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const due = cards.filter((card) => {
      const dueDate = new Date(card.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate <= today
    })

    setDueCards(due)
    setTotalDueCount(due.length)

    if (due.length > 0 && !currentCard) {
      setCurrentCard(due[0])
    }
  }, [cards, currentCard])

  useEffect(() => {
    if (dueCards.length > 0) {
      setReviewedCount(totalDueCount - dueCards.length + (currentCard ? 1 : 0))
    } else {
      setReviewedCount(totalDueCount)
    }
  }, [dueCards, totalDueCount, currentCard])

  const reviewCard = (known: boolean) => {
    if (!currentCard) return

    const now = new Date()
    const updatedCard = calculateNextReview(currentCard, known)

    // Update cards
    setCards((prevCards) => prevCards.map((card) => (card.id === currentCard.id ? updatedCard : card)))

    // Add review log
    const newLog: ReviewLog = {
      id: `log-${Date.now()}`,
      cardId: currentCard.id,
      date: now.toISOString(),
      known,
    }
    setReviewLogs((prev) => [...prev, newLog])

    const today = now.toISOString().split("T")[0]
    setDailyStats((prev) => {
      const todayStats = prev[today] || { known: 0, unknown: 0 }
      return {
        ...prev,
        [today]: {
          known: known ? todayStats.known + 1 : todayStats.known,
          unknown: !known ? todayStats.unknown + 1 : todayStats.unknown,
        },
      }
    })

    setCurrentCard((prev) => {
      const currentIndex = dueCards.findIndex((c) => c.id === prev?.id)
      if (currentIndex < dueCards.length - 1) {
        return dueCards[currentIndex + 1]
      }
      return null
    })
  }

  const resetProgress = () => {
    const now = new Date()

    const resetCards = cards.map((card) => ({
      ...card,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now.toISOString(),
    }))

    setReviewLogs([])

    setDailyStats({})

    setCards(resetCards)

    localStorage.removeItem("spaceRep-logs")
    localStorage.removeItem("spaceRep-dailyStats")
    localStorage.setItem("spaceRep-cards", JSON.stringify(resetCards))

    setReviewedCount(0)

    toast({
      title: "Progress Reset",
      description: "All progress has been reset successfully.",
      type: "success",
    })
  }

  const addCard = (card: Card) => {
    const newCard: SM2Card = {
      ...card,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: new Date().toISOString(),
    }

    setCards((prev) => [...prev, newCard])
  }

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id))
    setReviewLogs((prev) => prev.filter((log) => log.cardId !== id))
  }

  const importCards = async (newCards: Card[]): Promise<void> => {
    setIsImporting(true)

    try {
      // Simulate a delay to show the loader
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const cardsWithSM2Data: SM2Card[] = newCards.map((card) => ({
        ...card,
        id: card.id || `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: new Date().toISOString(),
      }))

      setCards((prev) => [...prev, ...cardsWithSM2Data])

      toast({
        title: "Import Successful",
        description: `${newCards.length} cards have been imported.`,
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing your cards.",
        type: "destructive",
      })
      throw error
    } finally {
      setIsImporting(false)
    }
  }

  const exportCards = (format: "json" | "csv") => {
    const exportData = cards.map(({ id, front, back }) => ({ id, front, back }))

    if (format === "json") {
      return JSON.stringify(exportData, null, 2)
    } else {
      return cardsToCSV(exportData)
    }
  }

  return (
    <SpacedRepContext.Provider
      value={{
        cards,
        reviewLogs,
        dueCards,
        currentCard,
        reviewCard,
        resetProgress,
        addCard,
        removeCard,
        importCards,
        exportCards,
        isImporting,
        reviewedCount,
        totalDueCount,
        dailyStats,
      }}
    >
      {children}
    </SpacedRepContext.Provider>
  )
}

export function useSpacedRep() {
  const context = useContext(SpacedRepContext)
  if (context === undefined) {
    throw new Error("useSpacedRep must be used within a SpacedRepProvider")
  }
  return context
}
