import { createEmptyDrawCounts } from './balancedLetterDraw'

// Les compteurs du tirage équilibré sont gardés sur l'appareil, comme le prénom :
// d'une partie à l'autre, le jeu continue de proposer en priorité les lettres les moins sorties.
const DRAW_COUNTS_STORAGE_KEY = 'letterDrawCounts'

function isCountsByLetter(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.keys(value).every((symbol) => Number.isInteger(value[symbol]) && value[symbol] >= 0)
  )
}

// Données abîmées ou d'un ancien format : on repart de zéro plutôt que de planter
function isValidDrawCounts(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    isCountsByLetter(value.shownCounts) &&
    isCountsByLetter(value.targetCounts)
  )
}

// localStorage peut lever une exception (navigation privée sur les vieux Safari) :
// les compteurs ne sont alors simplement pas retenus.
export function readStoredDrawCounts() {
  try {
    const storedValue = JSON.parse(localStorage.getItem(DRAW_COUNTS_STORAGE_KEY))
    return isValidDrawCounts(storedValue) ? storedValue : createEmptyDrawCounts()
  } catch {
    return createEmptyDrawCounts()
  }
}

export function storeDrawCounts(drawCounts) {
  try {
    localStorage.setItem(DRAW_COUNTS_STORAGE_KEY, JSON.stringify(drawCounts))
  } catch {
    // Rien à faire : le tirage restera équilibré pendant la partie, mais pas d'une partie à l'autre
  }
}
