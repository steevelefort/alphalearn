import { putInFrenchQuotes } from './frenchQuotes'
import { LETTER_FONTS } from './letterFonts'
import { pickNonConfusableLetters } from './letters'
import { pickRandomIndexDifferentFrom, pickRandomItem } from './random'

export const LETTERS_PER_ROUND = 3

// Consignes de Bobi, lues par la synthèse vocale.
// `soundsDescription` dit ce que fait la lettre : « fait beu », ou « peut faire gueu ou jeu ».
const INSTRUCTION_TEMPLATES = [
  (soundsDescription) => `Trouve la lettre qui ${soundsDescription} !`,
  (soundsDescription) => `Sais-tu quelle lettre ${soundsDescription} ?`,
  (soundsDescription) => `Montre-moi la lettre qui ${soundsDescription}.`,
  (soundsDescription) => `Où se cache la lettre qui ${soundsDescription} ?`,
  (soundsDescription) => `Quelle lettre ${soundsDescription} ?`,
  (soundsDescription) => `Touche la lettre qui ${soundsDescription}.`,
  (soundsDescription) => `Aide-moi à trouver la lettre qui ${soundsDescription} !`,
  (soundsDescription) => `Écoute bien ! Quelle lettre ${soundsDescription} ?`,
  (soundsDescription) => `J'ai besoin de la lettre qui ${soundsDescription} !`,
  (soundsDescription) => `Peux-tu trouver la lettre qui ${soundsDescription} ?`,
]

// « a, b ou c »
function joinWithOr(items) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} ou ${items[items.length - 1]}`
}

// Les sons de la lettre, entre guillemets : « beu », ou « gueu » ou « jeu »
export function listLetterSounds(letter) {
  return joinWithOr(letter.sounds.map((letterSound) => putInFrenchQuotes(letterSound.pronunciation)))
}

// Ce que fait la lettre, à placer après « la lettre qui » :
// fait « beu » pour un seul son, peut faire « gueu » ou « jeu » pour plusieurs.
export function describeLetterSounds(letter) {
  const verb = letter.sounds.length === 1 ? 'fait' : 'peut faire'
  return `${verb} ${listLetterSounds(letter)}`
}

// Un tour de jeu : 3 lettres qui ne se confondent pas, celle à trouver, la consigne, et la police.
// La consigne change à chaque tour : jamais deux fois la même phrase d'affilée.
// Les polices des lettres se succèdent dans l'ordre (imprimerie, a fermé, cursive, imprimerie…).
export function createLetterRound(previousRound = null) {
  const letters = pickNonConfusableLetters(LETTERS_PER_ROUND)
  const targetLetter = pickRandomItem(letters)
  const instructionIndex = pickRandomIndexDifferentFrom(
    INSTRUCTION_TEMPLATES.length,
    previousRound ? previousRound.instructionIndex : null,
  )

  const letterFontIndex = previousRound ? (previousRound.letterFontIndex + 1) % LETTER_FONTS.length : 0

  return {
    id: previousRound ? previousRound.id + 1 : 1,
    letters,
    targetLetter,
    instructionIndex,
    letterFontIndex,
    letterFont: LETTER_FONTS[letterFontIndex],
    instructionText: INSTRUCTION_TEMPLATES[instructionIndex](describeLetterSounds(targetLetter)),
  }
}
