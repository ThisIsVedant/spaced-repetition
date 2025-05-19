import type { SM2Card } from "./types"

export function calculateNextReview(card: SM2Card, known: boolean): SM2Card {
  const now = new Date()
  let { easeFactor, interval, repetitions } = card

  if (known) {
    repetitions += 1

    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }

    easeFactor = Math.max(1.3, easeFactor + 0.1)
  } else {
    repetitions = 0
    interval = 0

    easeFactor = Math.max(1.3, easeFactor - 0.2)
  }

  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    dueDate: dueDate.toISOString(),
  }
}

export function getInitialCards(): SM2Card[] {
  const now = new Date().toISOString()

  return [
    {
      id: "card-1",
      front: "What is the capital of France?",
      back: "Paris",
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
    },
    {
      id: "card-2",
      front: "What is the capital of Japan?",
      back: "Tokyo",
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
    },
    {
      id: "card-3",
      front: "What is the capital of Italy?",
      back: "Rome",
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
    },
    {
      id: "card-4",
      front: "What is the capital of Spain?",
      back: "Madrid",
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
    },
    {
      id: "card-5",
      front: "What is the capital of Germany?",
      back: "Berlin",
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
    },
  ]
}
