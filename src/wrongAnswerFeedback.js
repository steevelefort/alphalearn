import { describeLetterSounds, listLetterSounds } from './letterRound'
import { pickRandomIndexDifferentFrom } from './random'

// Ce que dit Bobi quand l'enfant touche une mauvaise lettre : le son de la lettre touchée
const WRONG_ANSWER_TEMPLATES = [
  // Virgule avant le son : une pause, pour que la voix ne le colle pas au mot d'avant
  (chosenLetter) => `Non, ça c'est, ${listLetterSounds(chosenLetter)} !`,
  (chosenLetter) => `Oups ! Celle-là ${describeLetterSounds(chosenLetter)}.`,
  (chosenLetter) => `Pas tout à fait : cette lettre ${describeLetterSounds(chosenLetter)}.`,
  (chosenLetter) => `Hmm, non. Celle-ci ${describeLetterSounds(chosenLetter)}.`,
  (chosenLetter) => `Ah non ! Celle-là ${describeLetterSounds(chosenLetter)}.`,
  (chosenLetter) => `Essaie encore ! Celle-là ${describeLetterSounds(chosenLetter)}.`,
]

// Jamais deux fois la même phrase d'affilée
export function createWrongAnswerFeedback(chosenLetter, previousTemplateIndex = null) {
  const templateIndex = pickRandomIndexDifferentFrom(WRONG_ANSWER_TEMPLATES.length, previousTemplateIndex)
  return { templateIndex, text: WRONG_ANSWER_TEMPLATES[templateIndex](chosenLetter) }
}
