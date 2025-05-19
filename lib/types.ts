export interface Card {
  id: string
  front: string
  back: string
}

export interface SM2Card extends Card {
  easeFactor: number
  interval: number
  repetitions: number
  dueDate: string
}

export interface ReviewLog {
  id: string
  cardId: string
  date: string
  known: boolean
}
