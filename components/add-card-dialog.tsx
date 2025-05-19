"use client"

import type React from "react"

import { useState } from "react"
import { useSpacedRep } from "@/components/spaced-rep-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast, {Toaster} from "react-hot-toast";

interface AddCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  const { addCard } = useSpacedRep()
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (front.trim() && back.trim()) {
      addCard({
        id: `card-${Date.now()}`,
        front: front.trim(),
        back: back.trim(),
      })

      setFront("")
      setBack("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
      <DialogContent className="sm:max-w-[425px] gradient-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text">
            Add New Flashcard
          </DialogTitle>
          <DialogDescription>Create a new flashcard for your study deck.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">Front (Question)</Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Enter the question or prompt"
                className="resize-none border-primary/20 focus-visible:ring-primary"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="back">Back (Answer)</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Enter the answer"
                className="resize-none border-primary/20 focus-visible:ring-primary"
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={() => toast.success("New Flashcard added!")} className="gradient-primary text-white hover:opacity-90 transition-opacity">
              Add Card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
