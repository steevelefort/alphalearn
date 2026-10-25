// Trouve, dans un mot, les syllabes simples qui contiennent une lettre.
// - D'abord consonne + voyelle : « b » dans « bobo » donne « bo » ; « a » dans « papa » donne « pa » ;
//   « q » dans « qui » donne « qui ».
// - Sinon, la syllabe inverse voyelle + consonne : « é » dans « épi » donne « ép ».
//   Jamais avec m ou n (« am » se lit « an »), jamais avec le e (« ep » se lit « èp »),
//   et la consonne finale doit se prononcer (c, r, f, l : « hamac » oui, « petit » non).
//
// Le mot est d'abord découpé en graphèmes : une ou plusieurs lettres qui font un seul son.
// - « qu » (devant une voyelle) fait « k » : le u ne fait qu'aider le q.
// - « gu » (devant e, i, y) fait « g » dur : le u ne fait qu'aider le g.
// - « cu » (devant e, comme dans « cueillir ») fait « k » : le u ne fait qu'aider le c.
// - « ch » fait « ch » : ce n'est ni le son du c, ni celui du h.
// - « y » devant une voyelle (« yoyo ») se comporte comme une consonne.
// Le c et le g doux (« ci », « gi ») sont gardés : ces lettres font aussi « seu » et « jeu ».

const VOWELS = 'aeiouyéèêëâîïôûù'
const FRONT_VOWELS = 'eiyéèêëîï'

const GraphemeKind = Object.freeze({
  CONSONANT: 'consonant',
  VOWEL: 'vowel',
})

// Rôle de chaque morceau d'une syllabe, pour l'afficher en couleur
export const SyllablePartRole = Object.freeze({
  FOUND_LETTER: 'found-letter', // la lettre que l'enfant a trouvée
  HELPER_LETTER: 'helper-letter', // le u de « qu », « gu », « cu »
  ADDED_LETTER: 'added-letter', // la lettre ajoutée pour former la syllabe
})

function isVowel(character) {
  return character !== undefined && VOWELS.includes(character)
}

function isFrontVowel(character) {
  return character !== undefined && FRONT_VOWELS.includes(character)
}

// Graphème : { text, start, kind, mainLetter, helperText }
// mainLetter est la lettre dont le graphème porte le son (q pour « qu »), null pour « ch ».
function createGrapheme(text, start, kind, mainLetter, helperText = '') {
  return { text, start, kind, mainLetter, helperText }
}

function splitIntoGraphemes(lowercaseWord) {
  const graphemes = []
  let index = 0

  while (index < lowercaseWord.length) {
    const letter = lowercaseWord[index]
    const nextLetter = lowercaseWord[index + 1]
    const letterAfterNext = lowercaseWord[index + 2]

    const isQuBeforeVowel = letter === 'q' && nextLetter === 'u' && isVowel(letterAfterNext)
    const isHardGu = letter === 'g' && nextLetter === 'u' && isFrontVowel(letterAfterNext)
    const isCuBeforeE = letter === 'c' && nextLetter === 'u' && letterAfterNext === 'e'

    if (isQuBeforeVowel || isHardGu || isCuBeforeE) {
      graphemes.push(createGrapheme(letter + nextLetter, index, GraphemeKind.CONSONANT, letter, nextLetter))
      index += 2
    } else if (letter === 'c' && nextLetter === 'h') {
      graphemes.push(createGrapheme('ch', index, GraphemeKind.CONSONANT, null))
      index += 2
    } else if (letter === 'y' && isVowel(nextLetter)) {
      graphemes.push(createGrapheme('y', index, GraphemeKind.CONSONANT, 'y'))
      index += 1
    } else {
      const kind = isVowel(letter) ? GraphemeKind.VOWEL : GraphemeKind.CONSONANT
      graphemes.push(createGrapheme(letter, index, kind, letter))
      index += 1
    }
  }
  return graphemes
}

// Une voyelle se lit seule si elle ne fait pas partie d'un son composé :
// pas de voyelle nasale (on, an, in…), pas de « ou », « au », « ai », « oi »…, pas de e muet final.
function isVowelReadAlone(lowercaseWord, vowelIndex) {
  const vowel = lowercaseWord[vowelIndex]
  const nextLetter = lowercaseWord[vowelIndex + 1]
  const letterAfterNext = lowercaseWord[vowelIndex + 2]

  const isSilentFinalE = vowel === 'e' && vowelIndex === lowercaseWord.length - 1
  const isNasalVowel =
    (nextLetter === 'n' || nextLetter === 'm') && !isVowel(letterAfterNext) && letterAfterNext !== nextLetter
  const isCompoundVowel = 'aeo'.includes(vowel) && (nextLetter === 'u' || nextLetter === 'i')

  return !isSilentFinalE && !isNasalVowel && !isCompoundVowel
}

function isReadableVowel(lowercaseWord, grapheme) {
  return grapheme !== undefined && grapheme.kind === GraphemeKind.VOWEL && isVowelReadAlone(lowercaseWord, grapheme.start)
}

// La consonne ajoutée devant une voyelle doit être une seule lettre qui se prononce :
// ni « qu », ni « ch », ni le h muet.
function isSingleSoundingConsonant(grapheme) {
  return grapheme !== undefined && grapheme.kind === GraphemeKind.CONSONANT && grapheme.text.length === 1 && grapheme.text !== 'h'
}

// En fin de mot, seules c, r, f et l se prononcent en général (« hamac », « mur ») : la règle « CaReFuL »
const PRONOUNCED_FINAL_CONSONANTS = 'crfl'
// Consonnes qui ne peuvent pas fermer une syllabe inverse : m et n la rendent nasale, q a besoin de son u
const CONSONANTS_FORBIDDEN_AFTER_VOWEL = 'mnq'

function canCloseReversedSyllable(lowercaseWord, grapheme) {
  if (!isSingleSoundingConsonant(grapheme)) return false
  if (CONSONANTS_FORBIDDEN_AFTER_VOWEL.includes(grapheme.text)) return false
  const isLastLetter = grapheme.start === lowercaseWord.length - 1
  return !isLastLetter || PRONOUNCED_FINAL_CONSONANTS.includes(grapheme.text)
}

// Voyelle ouvrant une syllabe inverse : elle doit se lire seule, et ne pas être un e (« ec » se lit « èc »)
function canOpenReversedSyllable(lowercaseWord, grapheme) {
  return isReadableVowel(lowercaseWord, grapheme) && grapheme.text !== 'e'
}

function createConsonantFirstSyllable(consonant, vowel) {
  const parts = [{ text: consonant.mainLetter, role: SyllablePartRole.FOUND_LETTER }]
  if (consonant.helperText) parts.push({ text: consonant.helperText, role: SyllablePartRole.HELPER_LETTER })
  parts.push({ text: vowel.text, role: SyllablePartRole.ADDED_LETTER })
  return { text: consonant.text + vowel.text, start: consonant.start, parts }
}

function createVowelFoundSyllable(consonant, vowel) {
  return {
    text: consonant.text + vowel.text,
    start: consonant.start,
    parts: [
      { text: consonant.text, role: SyllablePartRole.ADDED_LETTER },
      { text: vowel.text, role: SyllablePartRole.FOUND_LETTER },
    ],
  }
}

function createReversedSyllable(vowel, consonant, foundLetterKind) {
  const isVowelFound = foundLetterKind === GraphemeKind.VOWEL
  return {
    text: vowel.text + consonant.text,
    start: vowel.start,
    parts: [
      { text: vowel.text, role: isVowelFound ? SyllablePartRole.FOUND_LETTER : SyllablePartRole.ADDED_LETTER },
      { text: consonant.text, role: isVowelFound ? SyllablePartRole.ADDED_LETTER : SyllablePartRole.FOUND_LETTER },
    ],
  }
}

// Syllabes inverses (voyelle + consonne) du mot qui contiennent la lettre
function findReversedSyllablesWithLetter(lowercaseWord, graphemes, letterSymbol) {
  const syllables = []
  graphemes.forEach((grapheme, index) => {
    const nextGrapheme = graphemes[index + 1]
    const isReversedSyllable =
      nextGrapheme !== undefined &&
      canOpenReversedSyllable(lowercaseWord, grapheme) &&
      canCloseReversedSyllable(lowercaseWord, nextGrapheme)
    if (!isReversedSyllable) return

    if (grapheme.text === letterSymbol) {
      syllables.push(createReversedSyllable(grapheme, nextGrapheme, GraphemeKind.VOWEL))
    } else if (nextGrapheme.text === letterSymbol) {
      syllables.push(createReversedSyllable(grapheme, nextGrapheme, GraphemeKind.CONSONANT))
    }
  })
  return syllables
}

// Les syllabes simples du mot qui contiennent la lettre, avec leur position :
// consonne + voyelle s'il y en a, sinon voyelle + consonne.
// Une syllabe : { text, start, parts: [{ text, role }] }
export function findSimpleSyllablesWithLetter(word, letterSymbol) {
  const lowercaseWord = word.toLowerCase()
  const graphemes = splitIntoGraphemes(lowercaseWord)
  const consonantVowelSyllables = findConsonantVowelSyllablesWithLetter(lowercaseWord, graphemes, letterSymbol)
  if (consonantVowelSyllables.length > 0) return consonantVowelSyllables
  return findReversedSyllablesWithLetter(lowercaseWord, graphemes, letterSymbol)
}

// Syllabes consonne + voyelle du mot qui contiennent la lettre
function findConsonantVowelSyllablesWithLetter(lowercaseWord, graphemes, letterSymbol) {
  const syllables = []

  graphemes.forEach((grapheme, index) => {
    const previousGrapheme = graphemes[index - 1]
    const nextGrapheme = graphemes[index + 1]

    const isFoundConsonant = grapheme.kind === GraphemeKind.CONSONANT && grapheme.mainLetter === letterSymbol
    if (isFoundConsonant && isReadableVowel(lowercaseWord, nextGrapheme)) {
      syllables.push(createConsonantFirstSyllable(grapheme, nextGrapheme))
    }

    const isFoundVowel = grapheme.kind === GraphemeKind.VOWEL && grapheme.text === letterSymbol
    if (isFoundVowel && isReadableVowel(lowercaseWord, grapheme) && isSingleSoundingConsonant(previousGrapheme)) {
      syllables.push(createVowelFoundSyllable(previousGrapheme, grapheme))
    }
  })
  return syllables
}
