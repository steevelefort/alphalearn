import { describeLetterSounds } from './letterRound'
import { pickRandomIndexDifferentFrom, pickRandomItem, shuffle } from './random'
import { findSimpleSyllablesWithLetter, SyllablePartRole } from './syllables'

// Encouragements de Bobi, au début de la leçon (sans accord au masculin ou au féminin)
const ENCOURAGEMENTS = [
  'Bravo !',
  'Super !',
  'Félicitations !',
  'Génial !',
  'Bien joué !',
  'Excellent !',
  'Youpi, bravo !',
  'Formidable !',
  'Hourra !',
  'Quelle oreille !',
]

// Une fois sur trois environ, Bobi ajoute le prénom de l'enfant : « Bravo, Léo ! »
const FIRST_NAME_PROBABILITY = 1 / 3

function addFirstNameToEncouragement(encouragement, firstName) {
  return encouragement.replace(/ !$/, `, ${firstName} !`)
}

function createEncouragement(encouragementIndex, firstName) {
  const encouragement = ENCOURAGEMENTS[encouragementIndex]
  const shouldAddFirstName = firstName !== '' && Math.random() < FIRST_NAME_PROBABILITY
  return shouldAddFirstName ? addFirstNameToEncouragement(encouragement, firstName) : encouragement
}

function pickWordAndSyllable(letter) {
  for (const word of shuffle(letter.words)) {
    const syllables = findSimpleSyllablesWithLetter(word, letter.symbol)
    if (syllables.length === 0) continue

    const syllable = pickRandomItem(syllables)
    const syllableOccurrences = syllables.filter((candidate) => candidate.text === syllable.text)
    return { word, syllable, syllableOccurrences }
  }
  return { word: pickRandomItem(letter.words), syllable: null, syllableOccurrences: [] }
}

// La mini-leçon affichée après une bonne réponse : un encouragement, la lettre,
// une syllabe, et un mot qui la contient.
// Un mot est tiré au hasard parmi ceux de la lettre, puis une de ses syllabes.
// `syllable` vaut null si aucun mot ne donne de syllabe simple (le jeu affiche alors juste le mot).
// `syllableOccurrences` : toutes les positions de cette syllabe dans le mot, pour les colorer.
// L'encouragement n'est jamais le même que celui de la leçon précédente,
// et contient parfois le prénom de l'enfant.
export function createCorrectAnswerLesson(letter, { previousEncouragementIndex = null, firstName = '' } = {}) {
  const encouragementIndex = pickRandomIndexDifferentFrom(ENCOURAGEMENTS.length, previousEncouragementIndex)
  return {
    letter,
    encouragementIndex,
    encouragement: createEncouragement(encouragementIndex, firstName),
    ...pickWordAndSyllable(letter),
  }
}

// Nom de la lettre pour la synthèse vocale : en majuscule, elle est lue comme une lettre
// (« B » se lit « bé », « É » se lit « e accent aigu »).
function getSpokenLetterName(symbol) {
  return symbol.toUpperCase()
}

// On dit « la lettre « O » » plutôt que « un O » : la synthèse vocale ferait la liaison (« un-no »),
// ce qui fausse justement le son qu'on apprend à l'enfant. Pour la même raison, pas de pluriel
// (« les lettres U » donnerait « lettres-zu »). Les guillemets aident la voix à détacher la lettre.
function describeHowToBuildSyllable(syllable) {
  const foundPartIndex = syllable.parts.findIndex((part) => part.role === SyllablePartRole.FOUND_LETTER)
  const addedPartIndex = syllable.parts.findIndex((part) => part.role === SyllablePartRole.ADDED_LETTER)
  const helperPart = syllable.parts.find((part) => part.role === SyllablePartRole.HELPER_LETTER)
  const addedLetterName = getSpokenLetterName(syllable.parts[addedPartIndex].text)

  if (helperPart) {
    return `Avec la lettre « ${getSpokenLetterName(helperPart.text)} » et la lettre « ${addedLetterName} », ça fait ${syllable.text} !`
  }
  if (addedPartIndex < foundPartIndex) {
    return `Si tu mets la lettre « ${addedLetterName} » devant, ça fait ${syllable.text} !`
  }
  return `Si tu lui ajoutes la lettre « ${addedLetterName} », ça fait ${syllable.text} !`
}

// Les phrases de Bobi, dans l'ordre d'affichage : la lettre (précédée de l'encouragement), la syllabe, le mot.
// Sans syllabe, la phrase du milieu est sautée.
export function createLessonSentences(lesson) {
  const letterSentence = `${lesson.encouragement} Tu as trouvé le ${getSpokenLetterName(lesson.letter.symbol)} qui ${describeLetterSounds(lesson.letter)} !`
  const wordSentence = `Comme dans ${lesson.word} !`
  if (!lesson.syllable) return [letterSentence, wordSentence]
  return [letterSentence, describeHowToBuildSyllable(lesson.syllable), wordSentence]
}
