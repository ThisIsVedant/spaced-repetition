import type { Card } from "./types"

export function parseCSV(csvString: string): Card[] {
  const lines = csvString.split(/\r?\n/)

  const headerLine = lines[0].toLowerCase()
  const headers = headerLine.split(",").map((h) => h.trim())

  const frontIndex = headers.indexOf("front")
  const backIndex = headers.indexOf("back")

  if (frontIndex === -1 || backIndex === -1) {
    throw new Error('CSV file must have "front" and "back" columns')
  }

  const cards: Card[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)

    if (values.length <= Math.max(frontIndex, backIndex)) {
      continue
    }

    cards.push({
      id: `card-import-${Date.now()}-${i}`,
      front: values[frontIndex].trim(),
      back: values[backIndex].trim(),
    })
  }

  return cards
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let currentValue = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        currentValue += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(currentValue)
      currentValue = ""
    } else {
      currentValue += char
    }
  }

  result.push(currentValue)

  return result
}

export function cardsToCSV(cards: Card[]): string {
  let csv = "front,back\n"

  for (const card of cards) {
    const front = escapeCsvValue(card.front)
    const back = escapeCsvValue(card.back)

    csv += `${front},${back}\n`
  }

  return csv
}

function escapeCsvValue(value: string): string {
  const needsQuotes = value.includes(",") || value.includes('"') || value.includes("\n")

  if (needsQuotes) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

export function validateImportedCards(cards: any[]): string | null {
  if (!Array.isArray(cards)) {
    return "Import failed: Data is not in the correct format."
  }

  if (cards.length === 0) {
    return "Import failed: No cards found in file."
  }

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    if (!card.front || !card.back) {
      return `Import failed: Card at position ${i + 1} is missing required front or back content.`
    }

    if (typeof card.front !== "string" || typeof card.back !== "string") {
      return `Import failed: Card at position ${i + 1} has invalid data types.`
    }
  }

  return null
}
