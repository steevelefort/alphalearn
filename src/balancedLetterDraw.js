import { areLettersConfusable, letters } from './letters'
import { pickRandomItem, shuffle } from './random'

// Tirage équilibré des lettres d'un tour, grâce à deux compteurs tenus d'un tour à l'autre :
// - shownCounts : combien de fois chaque lettre est apparue à l'écran
// - targetCounts : combien de fois chaque lettre a été la lettre à trouver
// On prend toujours en priorité les lettres les moins sorties (au hasard entre celles à égalité) :
// sur une partie, chaque lettre finit par être vue et demandée, sans qu'une lettre revienne sans cesse.

// Les lettres muettes (h) sont écartées : on ne peut pas faire entendre leur son
const AUDIBLE_LETTERS = letters.filter((letter) => letter.sounds.length > 0)

export function createEmptyDrawCounts() {
  return { shownCounts: {}, targetCounts: {} }
}

function getCount(counts, letter) {
  return counts[letter.symbol] || 0
}

function incrementCounts(counts, lettersToCount) {
  const updatedCounts = { ...counts }
  lettersToCount.forEach((letter) => {
    updatedCounts[letter.symbol] = getCount(counts, letter) + 1
  })
  return updatedCounts
}

// La lettre la moins sortie selon ce compteur (au hasard s'il y a des égalités)
function pickLeastCountedLetter(candidates, counts) {
  const lowestCount = Math.min(...candidates.map((letter) => getCount(counts, letter)))
  return pickRandomItem(candidates.filter((letter) => getCount(counts, letter) === lowestCount))
}

// Les lettres qui peuvent encore rejoindre l'écran sans se confondre avec celles déjà choisies
function findCompatibleLetters(chosenLetters) {
  return AUDIBLE_LETTERS.filter(
    (candidate) =>
      !chosenLetters.includes(candidate) &&
      !chosenLetters.some((chosenLetter) => areLettersConfusable(chosenLetter, candidate)),
  )
}

// Choisit la lettre à trouver (la moins demandée, jamais la même qu'au tour précédent),
// puis complète l'écran avec les lettres les moins vues qui ne se confondent pas avec elle.
// Les lettres sont rendues dans un ordre au hasard, pour que la bonne réponse change de place.
export function drawBalancedLetters(letterCount, drawCounts, previousTargetLetter = null) {
  const targetCandidates = AUDIBLE_LETTERS.filter((letter) => letter !== previousTargetLetter)
  const targetLetter = pickLeastCountedLetter(targetCandidates, drawCounts.targetCounts)

  const chosenLetters = [targetLetter]
  while (chosenLetters.length < letterCount) {
    const compatibleLetters = findCompatibleLetters(chosenLetters)
    if (compatibleLetters.length === 0) break
    chosenLetters.push(pickLeastCountedLetter(compatibleLetters, drawCounts.shownCounts))
  }

  return {
    targetLetter,
    letters: shuffle(chosenLetters),
    drawCounts: {
      shownCounts: incrementCounts(drawCounts.shownCounts, chosenLetters),
      targetCounts: incrementCounts(drawCounts.targetCounts, [targetLetter]),
    },
  }
}
