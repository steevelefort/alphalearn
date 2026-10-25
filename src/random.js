export function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

// Index au hasard entre 0 et length - 1, différent de excludedIndex (pour ne pas répéter la même phrase)
export function pickRandomIndexDifferentFrom(length, excludedIndex) {
  const allowedIndexes = [...Array(length).keys()].filter((index) => index !== excludedIndex)
  return pickRandomItem(allowedIndexes)
}

// Mélange de Fisher-Yates : chaque ordre a la même chance de sortir
export function shuffle(items) {
  const shuffledItems = [...items]
  for (let index = shuffledItems.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]]
  }
  return shuffledItems
}
